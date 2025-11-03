import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project, Alert, EmpireTask } from '@/types/app';
import { monitoringService, notificationService } from '@/services/monitoring';
import type { MonitoringConfig } from '@/services/monitoring';

interface EmpireContextType {
  projects: Project[];
  alerts: Alert[];
  empireTasks: EmpireTask[];
  dismissAlert: (id: string) => void;
  resolveAlert: (id: string) => void;
  addEmpireTask: (task: Omit<EmpireTask, 'id'>) => void;
  updateEmpireTask: (id: string, updates: Partial<Omit<EmpireTask, 'id'>>) => void;
  deleteEmpireTask: (id: string) => void;
  startMonitoring: () => void;
  stopMonitoring: () => void;
  isMonitoringActive: boolean;
}

const EmpireContext = createContext<EmpireContextType | undefined>(undefined);

const initialProjects: Project[] = [
  {
    id: '1',
    name: '🏢 Calytia',
    status: 'warning',
    uptime: 99.2,
    responseTime: 1.2,
    alerts: 3,
  },
  {
    id: '2',
    name: '🌐 Client #2',
    status: 'warning',
    uptime: 98.5,
    responseTime: 2.3,
    alerts: 1,
  },
  {
    id: '3',
    name: '💻 Client #3',
    status: 'operational',
    uptime: 100,
    responseTime: 0.8,
    alerts: 0,
  },
];

const initialAlerts: Alert[] = [
  {
    id: '1',
    projectId: '1',
    type: 'critical',
    title: 'Calytia - BDD Critique',
    description: '3 erreurs de connexion détectées',
    timestamp: new Date(Date.now() - 15 * 60000),
  },
  {
    id: '2',
    projectId: '2',
    type: 'warning',
    title: 'Client #2 - Performance',
    description: 'Temps de réponse élevé (2.3s)',
    timestamp: new Date(Date.now() - 60 * 60000),
  },
];

const initialEmpireTasks: EmpireTask[] = [
  {
    id: '1',
    title: '🔧 Maintenance serveur Calytia',
    description: 'Mise à jour système et vérification sécurité',
    date: new Date(2025, 10, 8), // 8 novembre 2025
    time: '02:00',
    duration: 120,
  },
  {
    id: '2',
    title: '📞 Call client #2',
    description: 'Revue mensuelle',
    date: new Date(2025, 10, 7), // 7 novembre 2025
    time: '14:00',
    duration: 60,
  },
];

export function EmpireProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [empireTasks, setEmpireTasks] = useState<EmpireTask[]>(initialEmpireTasks);
  const [isMonitoringActive, setIsMonitoringActive] = useState(false);

  // Initialiser le service de notifications
  useEffect(() => {
    notificationService.initialize();

    // Nettoyer à la fermeture
    return () => {
      monitoringService.cleanup();
    };
  }, []);

  // Configurer les projets de monitoring
  // TEMPORAIREMENT DÉSACTIVÉ pour permettre le chargement de l'app
  useEffect(() => {
    return; // Retour immédiat - pas d'initialisation auto
    // Configuration pour Calytia
    const calytiaConfig: MonitoringConfig = {
      projectId: '1',
      name: '🏢 Calytia',
      endpoints: [
        'https://calytia.com', // Remplacer par vos vraies URLs
        'https://api.calytia.com/health',
      ],
      checkInterval: 2 * 60 * 1000, // 2 minutes
      thresholds: {
        responseTime: 1500, // 1.5s
        criticalResponseTime: 3000, // 3s
        errorRate: 5, // 5%
        uptimeWarning: 99, // 99%
      },
    };

    // Configuration pour Client #2
    const client2Config: MonitoringConfig = {
      projectId: '2',
      name: '🌐 Client #2',
      endpoints: ['https://example.com'], // Remplacer par l'URL réelle
      checkInterval: 3 * 60 * 1000, // 3 minutes
      thresholds: {
        responseTime: 2000,
        criticalResponseTime: 5000,
        errorRate: 10,
        uptimeWarning: 98,
      },
    };

    // Configuration pour Client #3
    const client3Config: MonitoringConfig = {
      projectId: '3',
      name: '💻 Client #3',
      endpoints: ['https://example.org'], // Remplacer par l'URL réelle
      checkInterval: 5 * 60 * 1000, // 5 minutes
      thresholds: {
        responseTime: 1000,
        criticalResponseTime: 2500,
        errorRate: 5,
        uptimeWarning: 99.5,
      },
    };

    // Enregistrer les configurations
    monitoringService.registerProject(calytiaConfig);
    monitoringService.registerProject(client2Config);
    monitoringService.registerProject(client3Config);

    // S'abonner aux alertes
    monitoringService.onAlert((alert) => {
      setAlerts((prev) => {
        // Éviter les doublons
        const exists = prev.some(a => a.id === alert.id);
        if (!exists) {
          // Envoyer une notification push
          notificationService.sendAlertNotification(alert);
          return [alert, ...prev];
        }
        return prev;
      });
    });

    // S'abonner aux mises à jour de projets
    monitoringService.onProjectUpdate((updatedProject) => {
      setProjects((prev) =>
        prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))
      );
    });
  }, []);

  const startMonitoring = () => {
    if (!isMonitoringActive) {
      monitoringService.startMonitoring('1');
      monitoringService.startMonitoring('2');
      monitoringService.startMonitoring('3');
      setIsMonitoringActive(true);
    }
  };

  const stopMonitoring = () => {
    if (isMonitoringActive) {
      monitoringService.stopMonitoring('1');
      monitoringService.stopMonitoring('2');
      monitoringService.stopMonitoring('3');
      setIsMonitoringActive(false);
    }
  };

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    
    // Mettre à jour le nombre d'alertes du projet
    const alert = alerts.find(a => a.id === id);
    if (alert) {
      setProjects(projects.map(project => {
        if (project.id === alert.projectId) {
          return { ...project, alerts: Math.max(0, project.alerts - 1) };
        }
        return project;
      }));
    }
  };

  const resolveAlert = (id: string) => {
    dismissAlert(id);
  };

  const addEmpireTask = (task: Omit<EmpireTask, 'id'>) => {
    const newTask: EmpireTask = {
      ...task,
      id: Date.now().toString(),
    };
    setEmpireTasks([...empireTasks, newTask]);
  };

  const updateEmpireTask = (id: string, updates: Partial<Omit<EmpireTask, 'id'>>) => {
    setEmpireTasks(empireTasks.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const deleteEmpireTask = (id: string) => {
    setEmpireTasks(empireTasks.filter(task => task.id !== id));
  };

  return (
    <EmpireContext.Provider value={{ 
      projects, 
      alerts, 
      empireTasks,
      dismissAlert, 
      resolveAlert,
      addEmpireTask,
      updateEmpireTask,
      deleteEmpireTask,
      startMonitoring,
      stopMonitoring,
      isMonitoringActive,
    }}>
      {children}
    </EmpireContext.Provider>
  );
}

export function useEmpire() {
  const context = useContext(EmpireContext);
  if (context === undefined) {
    throw new Error('useEmpire must be used within an EmpireProvider');
  }
  return context;
}
