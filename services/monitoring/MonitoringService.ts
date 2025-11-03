import { Alert, Project } from '@/types/app';

export interface MonitoringConfig {
  projectId: string;
  name: string;
  endpoints: string[];
  checkInterval: number; // en millisecondes
  thresholds: {
    responseTime: number; // ms - au-delà = warning
    criticalResponseTime: number; // ms - au-delà = critical
    errorRate: number; // % - au-delà = critical
    uptimeWarning: number; // % - en dessous = warning
  };
}

export interface HealthCheckResult {
  projectId: string;
  endpoint: string;
  isUp: boolean;
  responseTime: number;
  statusCode?: number;
  error?: string;
  timestamp: Date;
}

class MonitoringService {
  private configs: Map<string, MonitoringConfig> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private healthHistory: Map<string, HealthCheckResult[]> = new Map();
  private alertCallbacks: ((alert: Alert) => void)[] = [];
  private projectUpdateCallbacks: ((project: Project) => void)[] = [];

  /**
   * Enregistrer une configuration de monitoring pour un projet
   */
  registerProject(config: MonitoringConfig) {
    this.configs.set(config.projectId, config);
    this.healthHistory.set(config.projectId, []);
  }

  /**
   * Démarrer le monitoring pour un projet
   */
  startMonitoring(projectId: string) {
    const config = this.configs.get(projectId);
    if (!config) {
      console.error(`Pas de config pour le projet ${projectId}`);
      return;
    }

    // Arrêter le monitoring existant s'il y en a un
    this.stopMonitoring(projectId);

    // Vérification immédiate
    this.checkProjectHealth(projectId);

    // Vérifications périodiques
    const interval = setInterval(() => {
      this.checkProjectHealth(projectId);
    }, config.checkInterval);

    this.intervals.set(projectId, interval);
  }

  /**
   * Arrêter le monitoring pour un projet
   */
  stopMonitoring(projectId: string) {
    const interval = this.intervals.get(projectId);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(projectId);
    }
  }

  /**
   * Vérifier la santé d'un projet
   */
  private async checkProjectHealth(projectId: string) {
    const config = this.configs.get(projectId);
    if (!config) return;

    const results: HealthCheckResult[] = [];

    for (const endpoint of config.endpoints) {
      const result = await this.checkEndpoint(projectId, endpoint);
      results.push(result);
      
      // Ajouter à l'historique
      const history = this.healthHistory.get(projectId) || [];
      history.push(result);
      
      // Garder seulement les 100 derniers résultats
      if (history.length > 100) {
        history.shift();
      }
      this.healthHistory.set(projectId, history);
    }

    // Analyser les résultats et générer des alertes
    this.analyzeResults(projectId, results);
    
    // Mettre à jour les métriques du projet
    this.updateProjectMetrics(projectId);
  }

  /**
   * Vérifier un endpoint spécifique
   */
  private async checkEndpoint(projectId: string, endpoint: string): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // Timeout 10s

      const response = await fetch(endpoint, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'User-Agent': 'Caly-Monitor/1.0',
        },
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;

      return {
        projectId,
        endpoint,
        isUp: response.ok,
        responseTime,
        statusCode: response.status,
        timestamp: new Date(),
      };
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      
      return {
        projectId,
        endpoint,
        isUp: false,
        responseTime,
        error: error.message || 'Erreur de connexion',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Analyser les résultats et générer des alertes
   */
  private analyzeResults(projectId: string, results: HealthCheckResult[]) {
    const config = this.configs.get(projectId);
    if (!config) return;

    for (const result of results) {
      // Alerte si service down
      if (!result.isUp) {
        this.triggerAlert({
          id: `${projectId}-down-${Date.now()}`,
          projectId,
          type: 'critical',
          title: `${config.name} - Service Indisponible`,
          description: `Erreur: ${result.error || 'Service inaccessible'}`,
          timestamp: new Date(),
        });
      }
      // Alerte si temps de réponse critique
      else if (result.responseTime > config.thresholds.criticalResponseTime) {
        this.triggerAlert({
          id: `${projectId}-slow-${Date.now()}`,
          projectId,
          type: 'critical',
          title: `${config.name} - Performance Critique`,
          description: `Temps de réponse: ${result.responseTime}ms (seuil: ${config.thresholds.criticalResponseTime}ms)`,
          timestamp: new Date(),
        });
      }
      // Warning si temps de réponse élevé
      else if (result.responseTime > config.thresholds.responseTime) {
        this.triggerAlert({
          id: `${projectId}-perf-${Date.now()}`,
          projectId,
          type: 'warning',
          title: `${config.name} - Performance Dégradée`,
          description: `Temps de réponse: ${result.responseTime}ms (seuil: ${config.thresholds.responseTime}ms)`,
          timestamp: new Date(),
        });
      }
    }
  }

  /**
   * Calculer les métriques d'un projet
   */
  private updateProjectMetrics(projectId: string) {
    const history = this.healthHistory.get(projectId) || [];
    if (history.length === 0) return;

    // Calculer l'uptime (sur les 100 dernières vérifications)
    const upChecks = history.filter(h => h.isUp).length;
    const uptime = (upChecks / history.length) * 100;

    // Calculer le temps de réponse moyen
    const validResponseTimes = history.filter(h => h.isUp).map(h => h.responseTime);
    const avgResponseTime = validResponseTimes.length > 0
      ? validResponseTimes.reduce((a, b) => a + b, 0) / validResponseTimes.length / 1000
      : 0;

    // Compter les alertes actives
    const recentErrors = history.slice(-10).filter(h => !h.isUp).length;

    // Déterminer le statut
    const config = this.configs.get(projectId);
    let status: 'operational' | 'warning' | 'critical' = 'operational';
    
    if (config) {
      if (uptime < config.thresholds.uptimeWarning || recentErrors > 3) {
        status = 'critical';
      } else if (avgResponseTime * 1000 > config.thresholds.responseTime || recentErrors > 0) {
        status = 'warning';
      }
    }

    const project: Project = {
      id: projectId,
      name: config?.name || projectId,
      status,
      uptime: parseFloat(uptime.toFixed(1)),
      responseTime: parseFloat(avgResponseTime.toFixed(2)),
      alerts: recentErrors,
    };

    // Notifier les callbacks
    this.projectUpdateCallbacks.forEach(callback => callback(project));
  }

  /**
   * Déclencher une alerte
   */
  private triggerAlert(alert: Alert) {
    this.alertCallbacks.forEach(callback => callback(alert));
  }

  /**
   * S'abonner aux alertes
   */
  onAlert(callback: (alert: Alert) => void) {
    this.alertCallbacks.push(callback);
  }

  /**
   * S'abonner aux mises à jour de projets
   */
  onProjectUpdate(callback: (project: Project) => void) {
    this.projectUpdateCallbacks.push(callback);
  }

  /**
   * Obtenir l'historique de santé d'un projet
   */
  getHealthHistory(projectId: string): HealthCheckResult[] {
    return this.healthHistory.get(projectId) || [];
  }

  /**
   * Obtenir les statistiques d'un projet
   */
  getProjectStats(projectId: string) {
    const history = this.healthHistory.get(projectId) || [];
    if (history.length === 0) return null;

    const last24h = history.filter(h => {
      const hoursDiff = (Date.now() - h.timestamp.getTime()) / (1000 * 60 * 60);
      return hoursDiff <= 24;
    });

    const upChecks = last24h.filter(h => h.isUp).length;
    const downChecks = last24h.filter(h => !h.isUp).length;
    const avgResponseTime = last24h
      .filter(h => h.isUp)
      .reduce((sum, h) => sum + h.responseTime, 0) / (upChecks || 1);

    return {
      totalChecks: last24h.length,
      upChecks,
      downChecks,
      uptimePercentage: (upChecks / last24h.length) * 100,
      avgResponseTime: avgResponseTime / 1000, // en secondes
    };
  }

  /**
   * Nettoyer toutes les ressources
   */
  cleanup() {
    this.intervals.forEach((interval, projectId) => {
      this.stopMonitoring(projectId);
    });
    this.configs.clear();
    this.healthHistory.clear();
    this.alertCallbacks = [];
    this.projectUpdateCallbacks = [];
  }
}

export const monitoringService = new MonitoringService();
