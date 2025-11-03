// Types pour l'application

export interface Task {
  id: string;
  title: string;
  description: string;
  category: 'health' | 'family' | 'empire' | 'other';
  status: 'urgent' | 'in-progress' | 'todo' | 'done';
  dueDate?: Date;
  duration?: number; // durée en minutes
  tags: string[];
}

export interface HealthData {
  currentWeight: number;
  targetWeight: number;
  energyScore: number;
  caloriesBurned: number;
  steps: number;
  activeMinutes: number;
  weekHistory: boolean[];
  streak: number;
  weightHistory: WeightEntry[];
  milestones: Milestone[];
  workoutProgram: WorkoutProgram;
  currentWeek: number;
  lastUpdatedDate: string; // Format YYYY-MM-DD
}

export interface WeightEntry {
  date: Date;
  weight: number;
}

export interface Milestone {
  weight: number;
  achieved: boolean;
  achievedDate?: Date;
}

export interface WorkoutProgram {
  id: string;
  title: string;
  duration: number; // en minutes
  exercises: Exercise[];
  equipment: string[];
  difficulty: 'débutant' | 'intermédiaire' | 'avancé';
  type: 'cardio' | 'renforcement' | 'mixte' | 'récupération';
  weatherDependent?: boolean;
}

export interface Exercise {
  name: string;
  duration: number; // en minutes
  sets?: number;
  reps?: string;
  description: string;
  completed: boolean;
}

export interface Appointment {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  duration?: number; // durée en minutes
  person: 'Albine' | 'Anna' | 'Yoan' | 'Louis' | 'Tom' | 'Moi';
}

export interface Medication {
  id: string;
  name: string;
  person: 'Albine' | 'Louis';
  schedule: string[];
  taken: boolean[];
  nextRefillDate: Date; // Date du prochain réapprovisionnement
  prescriptionEndDate: Date; // Date de fin de l'ordonnance
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  date: Date;
  time?: string;
  duration?: number; // durée en minutes
  child: string;
}

export type ShoppingCategory = 'Sec' | 'Légumes' | 'Frais' | 'Viandes' | 'Surgelé';

export interface ShoppingItem {
  id: string;
  name: string;
  category: ShoppingCategory;
  checked: boolean;
}

export interface AdminDocument {
  person: 'Albine' | 'Louis' | 'Yoan' | 'Anna' | 'Tom';
  aldEndDate?: Date; // Date de fin d'ALD (Affection Longue Durée)
  mdphEndDate?: Date; // Date de fin du dossier MDPH
  handiCardEndDate?: Date; // Date de fin de carte handicap
}

export interface AdminTask {
  id: string;
  title: string;
  deadline: Date;
  duration?: number; // durée estimée en minutes
  completed: boolean;
}

export interface Project {
  id: string;
  name: string;
  status: 'operational' | 'warning' | 'critical';
  uptime: number;
  responseTime: number;
  alerts: number;
}

export interface Alert {
  id: string;
  projectId: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: Date;
}

export interface EmpireTask {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  duration?: number; // durée en minutes
}
