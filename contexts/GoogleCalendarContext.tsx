import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { googleCalendarService } from '@/services/googleCalendar/GoogleCalendarService';
import { AgendaEvent } from '@/types/agenda';

interface GoogleCalendarContextType {
  isAuthenticated: boolean;
  isSyncing: boolean;
  lastSyncTime: string | null;
  syncEnabled: boolean;
  googleEvents: AgendaEvent[];
  
  // Actions
  setAuthToken: (token: string) => void;
  disconnect: () => Promise<void>;
  syncNow: () => Promise<void>;
  toggleSync: (enabled: boolean) => Promise<void>;
  selectCalendar: (calendarId: string) => Promise<void>;
  getAvailableCalendars: () => Promise<{ id: string; summary: string; primary?: boolean }[]>;
}

const GoogleCalendarContext = createContext<GoogleCalendarContextType | undefined>(undefined);

export function GoogleCalendarProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [syncEnabled, setSyncEnabled] = useState(false);
  const [googleEvents, setGoogleEvents] = useState<AgendaEvent[]>([]);

  // Charger l'état initial
  useEffect(() => {
    loadInitialState();
  }, []);

  // Synchronisation automatique périodique
  useEffect(() => {
    if (!syncEnabled || !isAuthenticated) return;

    const interval = setInterval(() => {
      syncNow();
    }, 30 * 60 * 1000); // Toutes les 30 minutes

    return () => clearInterval(interval);
  }, [syncEnabled, isAuthenticated]);

  const loadInitialState = async () => {
    try {
      const hasToken = await googleCalendarService.loadToken();
      setIsAuthenticated(hasToken);

      const config = await googleCalendarService.getSyncConfig();
      setSyncEnabled(config.enabled);
      setLastSyncTime(config.lastSyncTime || null);

      // Sync initial si activé
      if (hasToken && config.enabled) {
        await syncNow();
      }
    } catch (error) {
      console.error('[GoogleCalendarContext] Erreur de chargement:', error);
    }
  };

  const setAuthToken = (token: string) => {
    googleCalendarService.setAccessToken(token);
    setIsAuthenticated(true);
  };

  const disconnect = async (): Promise<void> => {
    try {
      await googleCalendarService.disconnect();
      setIsAuthenticated(false);
      setSyncEnabled(false);
      setGoogleEvents([]);
      setLastSyncTime(null);
    } catch (error) {
      console.error('[GoogleCalendarContext] Erreur de déconnexion:', error);
    }
  };

  const syncNow = async (): Promise<void> => {
    if (isSyncing) {
      console.log('[GoogleCalendarContext] Synchronisation déjà en cours');
      return;
    }

    try {
      setIsSyncing(true);
      const events = await googleCalendarService.syncEvents();
      setGoogleEvents(events);
      setLastSyncTime(new Date().toISOString());
      console.log(`[GoogleCalendarContext] ${events.length} événements synchronisés`);
    } catch (error) {
      console.error('[GoogleCalendarContext] Erreur de synchronisation:', error);
      throw error;
    } finally {
      setIsSyncing(false);
    }
  };

  const toggleSync = async (enabled: boolean): Promise<void> => {
    try {
      await googleCalendarService.configureSyncConfig({ enabled });
      setSyncEnabled(enabled);

      if (enabled && isAuthenticated) {
        await syncNow();
      }
    } catch (error) {
      console.error('[GoogleCalendarContext] Erreur de configuration:', error);
      throw error;
    }
  };

  const selectCalendar = async (calendarId: string): Promise<void> => {
    try {
      await googleCalendarService.configureSyncConfig({ selectedCalendarId: calendarId });
      
      if (syncEnabled) {
        await syncNow();
      }
    } catch (error) {
      console.error('[GoogleCalendarContext] Erreur de sélection de calendrier:', error);
      throw error;
    }
  };

  const getAvailableCalendars = async () => {
    try {
      return await googleCalendarService.getCalendarList();
    } catch (error) {
      console.error('[GoogleCalendarContext] Erreur de récupération des calendriers:', error);
      return [];
    }
  };

  const value: GoogleCalendarContextType = {
    isAuthenticated,
    isSyncing,
    lastSyncTime,
    syncEnabled,
    googleEvents,
    setAuthToken,
    disconnect,
    syncNow,
    toggleSync,
    selectCalendar,
    getAvailableCalendars,
  };

  return (
    <GoogleCalendarContext.Provider value={value}>
      {children}
    </GoogleCalendarContext.Provider>
  );
}

export function useGoogleCalendar() {
  const context = useContext(GoogleCalendarContext);
  if (context === undefined) {
    throw new Error('useGoogleCalendar must be used within a GoogleCalendarProvider');
  }
  return context;
}
