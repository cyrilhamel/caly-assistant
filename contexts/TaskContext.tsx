import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { DesktopSyncConfig, loadDesktopConfig, pullTasks, pushTasks } from '@/services/desktopSync/DesktopSyncService';
import { Task } from '@/types/app';
import { saveData, loadData } from '@/utils/storage';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, newStatus: Task['status']) => void;
  reloadDesktopConfig: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Rendez-vous médecin - 14h',
    description: 'Consultation femme',
    category: 'family',
    status: 'urgent',
    tags: ['Aujourd\'hui', 'Famille'],
  },
  {
    id: '2',
    title: 'Vérif BDD Calytia',
    description: '3 alertes clients en attente',
    category: 'empire',
    status: 'urgent',
    tags: ['Urgent', 'Empire'],
  },
  {
    id: '3',
    title: 'Session sport 15min',
    description: 'Exercices cardio adaptés',
    category: 'health',
    status: 'in-progress',
    tags: ['Santé'],
  },
  {
    id: '4',
    title: 'Préparation repas enfants',
    description: 'Dîner 19h',
    category: 'family',
    status: 'todo',
    tags: ['Famille'],
  },
  {
    id: '5',
    title: 'Suivi projet client #2',
    description: 'Revue hebdomadaire',
    category: 'empire',
    status: 'todo',
    tags: ['Empire'],
  },
  {
    id: '6',
    title: 'Pesée matinale',
    description: '-0.2kg cette semaine 🎉',
    category: 'health',
    status: 'done',
    tags: ['Fait'],
  },
];

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isLoaded, setIsLoaded] = useState(false);
  const [configVersion, setConfigVersion] = useState(0);
  const syncConfig = useRef<DesktopSyncConfig | null>(null);
  const lastRev = useRef(-1);
  const lastSyncedJson = useRef('');
  const tasksRef = useRef(tasks);
  tasksRef.current = tasks;

  // Charger les données au démarrage
  useEffect(() => {
    const loadTasks = async () => {
      const savedTasks = await loadData('tasks', initialTasks);
      setTasks(savedTasks);
      setIsLoaded(true);
    };
    loadTasks();
  }, []);

  // Sauvegarder automatiquement quand les données changent
  useEffect(() => {
    if (isLoaded) {
      saveData('tasks', tasks);
    }
  }, [tasks, isLoaded]);

  const reloadDesktopConfig = () => {
    loadDesktopConfig().then((c) => {
      syncConfig.current = c;
      lastRev.current = -1;
      lastSyncedJson.current = '';
      setConfigVersion((v) => v + 1);
    });
  };

  useEffect(reloadDesktopConfig, []);

  // Pousse les changements locaux vers Caly Desktop
  useEffect(() => {
    const config = syncConfig.current;
    const json = JSON.stringify(tasks);
    if (!isLoaded || !config || json === lastSyncedJson.current) return;
    const timer = setTimeout(() => {
      pushTasks(config, tasks)
        .then((rev) => {
          lastRev.current = rev;
          lastSyncedJson.current = json;
        })
        .catch(() => {});
    }, 800);
    return () => clearTimeout(timer);
  }, [tasks, isLoaded, configVersion]);

  // Récupère les changements faits sur le PC
  useEffect(() => {
    const config = syncConfig.current;
    if (!isLoaded || !config) return;
    const poll = async () => {
      try {
        const remote = await pullTasks(config);
        if (remote.rev === lastRev.current || remote.rev === 0) return;
        const json = JSON.stringify(remote.tasks);
        lastRev.current = remote.rev;
        lastSyncedJson.current = json;
        if (json !== JSON.stringify(tasksRef.current)) setTasks(remote.tasks);
      } catch {}
    };
    poll();
    const id = setInterval(poll, 5000);
    return () => clearInterval(id);
  }, [isLoaded, configVersion]);

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const moveTask = (id: string, newStatus: Task['status']) => {
    updateTask(id, { status: newStatus });
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, moveTask, reloadDesktopConfig }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
