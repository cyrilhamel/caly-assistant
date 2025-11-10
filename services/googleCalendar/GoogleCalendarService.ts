// Service de synchronisation Google Calendar -> App (unidirectionnel)

import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { AgendaEvent } from '@/types/agenda';
import { saveData, loadData } from '@/utils/storage';

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_CLIENT_ID = 'VOTRE_CLIENT_ID.apps.googleusercontent.com'; // À configurer
const GOOGLE_CALENDAR_API = 'https://www.googleapis.com/calendar/v3';

interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  location?: string;
  status: string;
}

interface SyncConfig {
  enabled: boolean;
  lastSyncTime?: string;
  syncInterval: number; // en minutes
  selectedCalendarId?: string;
}

class GoogleCalendarService {
  private accessToken: string | null = null;
  private syncConfig: SyncConfig = {
    enabled: false,
    syncInterval: 30, // Sync toutes les 30 minutes par défaut
  };

  /**
   * Configuration de l'authentification Google
   */
  private getAuthConfig() {
    const discovery = {
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenEndpoint: 'https://oauth2.googleapis.com/token',
      revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
    };

    return {
      clientId: GOOGLE_CLIENT_ID,
      scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
      redirectUri: AuthSession.makeRedirectUri({
        scheme: 'caly-assistant',
      }),
      discovery,
    };
  }

  /**
   * Authentification avec Google
   * Note: L'authentification doit être initiée depuis un composant React
   */
  setAccessToken(token: string): void {
    this.accessToken = token;
    saveData('google_calendar_token', token);
  }

  /**
   * Charger le token sauvegardé
   */
  async loadToken(): Promise<boolean> {
    try {
      const token = await loadData<string>('google_calendar_token', '');
      if (token) {
        this.accessToken = token;
        return true;
      }
      return false;
    } catch (error) {
      console.error('[GoogleCalendar] Erreur de chargement du token:', error);
      return false;
    }
  }

  /**
   * Se déconnecter
   */
  async disconnect(): Promise<void> {
    this.accessToken = null;
    await saveData('google_calendar_token', null);
    this.syncConfig.enabled = false;
    await this.saveSyncConfig();
    console.log('[GoogleCalendar] Déconnexion réussie');
  }

  /**
   * Récupérer la liste des calendriers
   */
  async getCalendarList(): Promise<{ id: string; summary: string; primary?: boolean }[]> {
    if (!this.accessToken) {
      throw new Error('Non authentifié');
    }

    try {
      const response = await fetch(`${GOOGLE_CALENDAR_API}/users/me/calendarList`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Échec de récupération des calendriers');
      }

      const data = await response.json();
      return data.items.map((cal: any) => ({
        id: cal.id,
        summary: cal.summary,
        primary: cal.primary,
      }));
    } catch (error) {
      console.error('[GoogleCalendar] Erreur de récupération des calendriers:', error);
      throw error;
    }
  }

  /**
   * Récupérer les événements d'un calendrier
   */
  async getEvents(calendarId: string = 'primary', daysAhead: number = 30): Promise<GoogleCalendarEvent[]> {
    if (!this.accessToken) {
      throw new Error('Non authentifié');
    }

    try {
      const now = new Date();
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + daysAhead);

      const params = new URLSearchParams({
        timeMin: now.toISOString(),
        timeMax: futureDate.toISOString(),
        singleEvents: 'true',
        orderBy: 'startTime',
      });

      const response = await fetch(
        `${GOOGLE_CALENDAR_API}/calendars/${encodeURIComponent(calendarId)}/events?${params}`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Échec de récupération des événements');
      }

      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('[GoogleCalendar] Erreur de récupération des événements:', error);
      throw error;
    }
  }

  /**
   * Convertir un événement Google en AgendaEvent
   */
  private convertGoogleEventToAgendaEvent(googleEvent: GoogleCalendarEvent): AgendaEvent | null {
    try {
      // Ignorer les événements annulés
      if (googleEvent.status === 'cancelled') {
        return null;
      }

      // Gérer les événements "toute la journée"
      const isAllDay = !!googleEvent.start.date;
      let date: Date;
      let time: string;
      let duration: number;

      if (isAllDay) {
        date = new Date(googleEvent.start.date!);
        time = '09:00'; // Heure par défaut pour les événements toute la journée
        duration = 480; // 8 heures
      } else {
        const startDate = new Date(googleEvent.start.dateTime!);
        const endDate = new Date(googleEvent.end.dateTime!);
        
        date = startDate;
        time = `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}`;
        duration = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60)); // Durée en minutes
      }

      return {
        id: `google-${googleEvent.id}`,
        title: googleEvent.summary || 'Sans titre',
        description: googleEvent.description || 'Importé de Google Calendar',
        type: 'appointment',
        date,
        time,
        duration,
        isFixed: true, // Les événements Google sont fixes
        priority: 'normal',
        status: 'scheduled',
        canBeOnWeekend: true,
        originalDuration: duration,
        isRecurring: false,
        sourceType: 'google',
        sourceId: googleEvent.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      console.error('[GoogleCalendar] Erreur de conversion d\'événement:', error);
      return null;
    }
  }

  /**
   * Synchroniser les événements Google -> App
   */
  async syncEvents(): Promise<AgendaEvent[]> {
    if (!this.accessToken) {
      throw new Error('Non authentifié');
    }

    if (!this.syncConfig.enabled) {
      console.log('[GoogleCalendar] Synchronisation désactivée');
      return [];
    }

    try {
      console.log('[GoogleCalendar] Début de la synchronisation...');
      
      const calendarId = this.syncConfig.selectedCalendarId || 'primary';
      const googleEvents = await this.getEvents(calendarId);
      
      const agendaEvents: AgendaEvent[] = googleEvents
        .map(event => this.convertGoogleEventToAgendaEvent(event))
        .filter((event): event is AgendaEvent => event !== null);

      // Mettre à jour le timestamp de dernière sync
      this.syncConfig.lastSyncTime = new Date().toISOString();
      await this.saveSyncConfig();

      console.log(`[GoogleCalendar] ${agendaEvents.length} événements synchronisés`);
      return agendaEvents;
    } catch (error) {
      console.error('[GoogleCalendar] Erreur de synchronisation:', error);
      throw error;
    }
  }

  /**
   * Configuration de la synchronisation
   */
  async configureSyncConfig(config: Partial<SyncConfig>): Promise<void> {
    this.syncConfig = { ...this.syncConfig, ...config };
    await this.saveSyncConfig();
  }

  async getSyncConfig(): Promise<SyncConfig> {
    const saved = await loadData<SyncConfig>('google_calendar_sync_config', this.syncConfig);
    if (saved && saved.enabled !== undefined) {
      this.syncConfig = saved;
    }
    return this.syncConfig;
  }

  private async saveSyncConfig(): Promise<void> {
    await saveData('google_calendar_sync_config', this.syncConfig);
  }

  /**
   * Vérifier si authentifié
   */
  isAuthenticated(): boolean {
    return !!this.accessToken;
  }
}

export const googleCalendarService = new GoogleCalendarService();
