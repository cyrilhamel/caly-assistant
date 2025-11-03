import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Task } from '@/types/app';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, newStatus: Task['status']) => void;
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
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, moveTask }}>
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
