import { Alert } from '@/types/app';

/**
 * Service pour intégrer des systèmes de monitoring externes
 * Architecture modulaire permettant d'ajouter facilement de nouveaux providers
 */

export interface ExternalProvider {
  name: string;
  isEnabled: boolean;
  apiKey?: string;
  webhookUrl?: string;
}

export interface UptimeRobotConfig extends ExternalProvider {
  name: 'uptimerobot';
  monitors: {
    id: string;
    projectId: string;
    url: string;
  }[];
}

export interface SentryConfig extends ExternalProvider {
  name: 'sentry';
  dsn?: string;
  organization?: string;
  projects: {
    slug: string;
    projectId: string;
  }[];
}

export interface CustomWebhookConfig extends ExternalProvider {
  name: 'webhook';
  endpoints: {
    projectId: string;
    url: string;
    headers?: Record<string, string>;
  }[];
}

class ExternalMonitoringService {
  private providers: Map<string, ExternalProvider> = new Map();
  private pollingIntervals: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Configurer UptimeRobot
   */
  configureUptimeRobot(config: Omit<UptimeRobotConfig, 'name'>) {
    this.providers.set('uptimerobot', {
      name: 'uptimerobot',
      ...config,
    });

    if (config.isEnabled) {
      this.startUptimeRobotPolling();
    }
  }

  /**
   * Récupérer les données d'UptimeRobot
   */
  private async startUptimeRobotPolling() {
    const config = this.providers.get('uptimerobot') as UptimeRobotConfig | undefined;
    if (!config || !config.apiKey) return;

    // Polling toutes les 5 minutes
    const interval = setInterval(async () => {
      try {
        const response = await fetch('https://api.uptimerobot.com/v2/getMonitors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            api_key: config.apiKey,
            format: 'json',
            logs: 1,
          }),
        });

        const data = await response.json();
        // Traiter les données et générer des alertes si nécessaire
        this.processUptimeRobotData(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données UptimeRobot:', error);
      }
    }, 5 * 60 * 1000);

    this.pollingIntervals.set('uptimerobot', interval);
  }

  private processUptimeRobotData(data: any) {
    // Traiter les données UptimeRobot
    // Mapper les monitors aux projets
    // Générer des alertes si nécessaire
    console.log('Données UptimeRobot reçues:', data);
  }

  /**
   * Configurer Sentry
   */
  configureSentry(config: Omit<SentryConfig, 'name'>) {
    this.providers.set('sentry', {
      name: 'sentry',
      ...config,
    });

    if (config.isEnabled) {
      this.startSentryPolling();
    }
  }

  /**
   * Récupérer les erreurs de Sentry
   */
  private async startSentryPolling() {
    const config = this.providers.get('sentry') as SentryConfig | undefined;
    if (!config || !config.apiKey || !config.organization) return;

    // Polling toutes les 2 minutes pour les erreurs
    const interval = setInterval(async () => {
      for (const project of config.projects) {
        try {
          const response = await fetch(
            `https://sentry.io/api/0/projects/${config.organization}/${project.slug}/issues/`,
            {
              headers: {
                Authorization: `Bearer ${config.apiKey}`,
              },
            }
          );

          const issues = await response.json();
          this.processSentryIssues(project.projectId, issues);
        } catch (error) {
          console.error(`Erreur lors de la récupération des issues Sentry pour ${project.slug}:`, error);
        }
      }
    }, 2 * 60 * 1000);

    this.pollingIntervals.set('sentry', interval);
  }

  private processSentryIssues(projectId: string, issues: any[]) {
    // Filtrer les nouvelles erreurs ou erreurs non résolues
    // Générer des alertes
    console.log(`Issues Sentry pour projet ${projectId}:`, issues);
  }

  /**
   * Configurer des webhooks personnalisés
   */
  configureWebhooks(config: Omit<CustomWebhookConfig, 'name'>) {
    this.providers.set('webhook', {
      name: 'webhook',
      ...config,
    });
  }

  /**
   * Recevoir et traiter un webhook entrant
   */
  async handleWebhook(projectId: string, payload: any): Promise<Alert | null> {
    // Parser le payload et créer une alerte si nécessaire
    try {
      // Format générique de webhook
      const alert: Alert = {
        id: `webhook-${Date.now()}`,
        projectId,
        type: payload.severity === 'critical' ? 'critical' : 'warning',
        title: payload.title || 'Alerte Webhook',
        description: payload.message || JSON.stringify(payload),
        timestamp: new Date(payload.timestamp || Date.now()),
      };

      return alert;
    } catch (error) {
      console.error('Erreur lors du traitement du webhook:', error);
      return null;
    }
  }

  /**
   * Configurer une intégration personnalisée
   */
  configureCustomProvider(providerName: string, config: ExternalProvider) {
    this.providers.set(providerName, config);
  }

  /**
   * Obtenir la configuration d'un provider
   */
  getProviderConfig(providerName: string): ExternalProvider | undefined {
    return this.providers.get(providerName);
  }

  /**
   * Lister tous les providers configurés
   */
  listProviders(): ExternalProvider[] {
    return Array.from(this.providers.values());
  }

  /**
   * Activer/Désactiver un provider
   */
  toggleProvider(providerName: string, enabled: boolean) {
    const provider = this.providers.get(providerName);
    if (provider) {
      provider.isEnabled = enabled;

      if (!enabled) {
        // Arrêter le polling si désactivé
        const interval = this.pollingIntervals.get(providerName);
        if (interval) {
          clearInterval(interval);
          this.pollingIntervals.delete(providerName);
        }
      } else {
        // Redémarrer le polling si réactivé
        if (providerName === 'uptimerobot') {
          this.startUptimeRobotPolling();
        } else if (providerName === 'sentry') {
          this.startSentryPolling();
        }
      }
    }
  }

  /**
   * Tester la connexion à un provider
   */
  async testProvider(providerName: string): Promise<{ success: boolean; message: string }> {
    const provider = this.providers.get(providerName);
    if (!provider) {
      return { success: false, message: 'Provider non configuré' };
    }

    switch (providerName) {
      case 'uptimerobot':
        return this.testUptimeRobot(provider as UptimeRobotConfig);
      case 'sentry':
        return this.testSentry(provider as SentryConfig);
      default:
        return { success: false, message: 'Type de provider non supporté' };
    }
  }

  private async testUptimeRobot(config: UptimeRobotConfig): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch('https://api.uptimerobot.com/v2/getAccountDetails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: config.apiKey,
          format: 'json',
        }),
      });

      const data = await response.json();
      if (data.stat === 'ok') {
        return { success: true, message: 'Connexion UptimeRobot réussie' };
      } else {
        return { success: false, message: data.error?.message || 'Erreur inconnue' };
      }
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  private async testSentry(config: SentryConfig): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`https://sentry.io/api/0/`, {
        headers: { Authorization: `Bearer ${config.apiKey}` },
      });

      if (response.ok) {
        return { success: true, message: 'Connexion Sentry réussie' };
      } else {
        return { success: false, message: `Erreur ${response.status}` };
      }
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  /**
   * Nettoyer toutes les ressources
   */
  cleanup() {
    this.pollingIntervals.forEach(interval => clearInterval(interval));
    this.pollingIntervals.clear();
    this.providers.clear();
  }
}

export const externalMonitoringService = new ExternalMonitoringService();
