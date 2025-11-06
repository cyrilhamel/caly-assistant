export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'urgent' | 'in-progress' | 'todo' | 'done';
  category: 'health' | 'family' | 'empire' | 'personal';
  dueDate?: Date;
  priority: 'high' | 'medium' | 'low';
  googleCalendarId?: string;
}

export interface HealthMetrics {
  currentWeight: number;
  targetWeight: number;
  weightLost: number;
  caloriesBurned: number;
  steps: number;
  activeMinutes: number;
  streak: number;
}

export interface WorkoutSession {
  id: string;
  date: Date;
  duration: number; // minutes
  type: 'cardio' | 'strength' | 'flexibility';
  exercises: Exercise[];
  completed: boolean;
}

export interface Exercise {
  name: string;
  duration: number; // minutes
  completed: boolean;
}

export interface Appointment {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  person: string; // femme, enfant1, enfant2, etc.
  type: 'medical' | 'activity' | 'other';
  googleCalendarId?: string;
}

export interface Medication {
  id: string;
  name: string;
  person: string;
  schedule: MedicationSchedule[];
  completed: boolean[];
}

export interface MedicationSchedule {
  time: string;
  dosage: string;
}

export interface ClientAlert {
  id: string;
  clientName: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  resolved: boolean;
}

export interface ClientProject {
  id: string;
  name: string;
  status: 'operational' | 'warning' | 'down';
  uptime: number;
  responseTime: number;
  alertCount: number;
}

export interface EnergyScore {
  score: number; // 0-100
  level: 'low' | 'moderate' | 'high';
  suggestion: string;
}

export interface MenstrualCycle {
  id: string;
  startDate: Date;
  endDate: Date | null; // null si en cours
  notes?: string;
}
