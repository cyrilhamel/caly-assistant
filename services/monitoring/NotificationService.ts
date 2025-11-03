import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Alert } from '@/types/app';

// Configuration des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationConfig {
  enablePush: boolean;
  enableSound: boolean;
  enableVibration: boolean;
  criticalAlertSound: string;
  warningAlertSound: string;
  quietHours: {
    enabled: boolean;
    start: string; // Format "HH:mm"
    end: string;
  };
}

class NotificationService {
  private config: NotificationConfig = {
    enablePush: true,
    enableSound: true,
    enableVibration: true,
    criticalAlertSound: 'default',
    warningAlertSound: 'default',
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00',
    },
  };

  private expoPushToken: string | null = null;

  /**
   * Initialiser le service de notifications
   */
  async initialize() {
    // Demander les permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Permission de notification refusée');
      return false;
    }

    // Obtenir le token Expo Push (désactivé en mode développement Expo Go)
    // Pour utiliser les notifications push, créez un build de développement
    // Voir: https://docs.expo.dev/develop/development-builds/introduction/
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      try {
        // En mode Expo Go, on skip le token push
        console.log('⚠️ Mode développement: Les notifications locales fonctionnent, mais pas les push distants');
        console.log('ℹ️ Pour tester les push: créez un build de développement avec "eas build --profile development"');
      } catch (error) {
        console.error('Erreur lors de l\'obtention du token:', error);
      }
    }

    // Configurer le canal pour Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('critical-alerts', {
        name: 'Alertes Critiques',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        sound: 'default',
        enableVibrate: true,
        showBadge: true,
      });

      await Notifications.setNotificationChannelAsync('warning-alerts', {
        name: 'Alertes Avertissement',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250],
        sound: 'default',
        enableVibrate: true,
        showBadge: true,
      });
    }

    return true;
  }

  /**
   * Envoyer une notification pour une alerte
   */
  async sendAlertNotification(alert: Alert) {
    if (!this.config.enablePush) return;

    // Vérifier les heures silencieuses
    if (this.isQuietHours()) {
      console.log('Heures silencieuses actives, notification non envoyée');
      return;
    }

    const notification = this.buildNotificationContent(alert);
    
    try {
      await Notifications.scheduleNotificationAsync({
        content: notification,
        trigger: null, // Envoi immédiat
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification:', error);
    }
  }

  /**
   * Construire le contenu de la notification
   */
  private buildNotificationContent(alert: Alert): Notifications.NotificationContentInput {
    const isCritical = alert.type === 'critical';

    return {
      title: isCritical ? '🔴 ' + alert.title : '🟡 ' + alert.title,
      body: alert.description,
      data: {
        alertId: alert.id,
        projectId: alert.projectId,
        type: alert.type,
      },
      sound: this.config.enableSound ? 'default' : undefined,
      priority: isCritical 
        ? Notifications.AndroidNotificationPriority.MAX 
        : Notifications.AndroidNotificationPriority.HIGH,
      vibrate: this.config.enableVibration ? [0, 250, 250, 250] : undefined,
      badge: 1,
      categoryIdentifier: isCritical ? 'critical-alerts' : 'warning-alerts',
    };
  }

  /**
   * Vérifier si on est dans les heures silencieuses
   */
  private isQuietHours(): boolean {
    if (!this.config.quietHours.enabled) return false;

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const { start, end } = this.config.quietHours;

    // Si les heures traversent minuit (ex: 22:00 - 08:00)
    if (start > end) {
      return currentTime >= start || currentTime < end;
    } else {
      return currentTime >= start && currentTime < end;
    }
  }

  /**
   * Envoyer une notification de test
   */
  async sendTestNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🧪 Notification de test',
        body: 'Le système de notifications fonctionne correctement !',
        data: { test: true },
      },
      trigger: null,
    });
  }

  /**
   * Annuler toutes les notifications
   */
  async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  /**
   * Obtenir le nombre de notifications en attente
   */
  async getPendingNotificationsCount(): Promise<number> {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    return notifications.length;
  }

  /**
   * Mettre à jour la configuration
   */
  updateConfig(newConfig: Partial<NotificationConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Obtenir la configuration actuelle
   */
  getConfig(): NotificationConfig {
    return { ...this.config };
  }

  /**
   * Obtenir le token Expo Push
   */
  getExpoPushToken(): string | null {
    return this.expoPushToken;
  }

  /**
   * Gérer la réception d'une notification (quand l'app est au premier plan)
   */
  addNotificationReceivedListener(
    callback: (notification: Notifications.Notification) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(callback);
  }

  /**
   * Gérer le clic sur une notification
   */
  addNotificationResponseReceivedListener(
    callback: (response: Notifications.NotificationResponse) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }
}

export const notificationService = new NotificationService();
