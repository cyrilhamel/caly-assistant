// Types pour le système d'agenda intelligent

export type EventType = 'appointment' | 'task' | 'activity' | 'recurring';

export type Priority = 'urgent' | 'normal' | 'low';

export type EventStatus = 
  | 'scheduled'    // Planifié automatiquement
  | 'validated'    // Confirmé par l'utilisateur comme faisable
  | 'postponed'    // Reporté par l'utilisateur
  | 'completed'    // Terminé
  | 'in-progress'; // En cours d'exécution

export type RecurrenceType = 
  | 'daily'        // Tous les jours
  | 'weekly'       // Chaque semaine
  | 'custom';      // Personnalisé (ex: lessive → étendre)

export interface TimeSlot {
  start: Date;
  end: Date;
}

export interface WorkSchedule {
  // Lundi, Mardi, Jeudi, Vendredi: 9h-11h30 et 13h-16h30
  // Mercredi: 9h30-11h30
  // Week-end (si canBeOnWeekend): 8h-11h30 et 13h-16h30
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Dimanche, 1 = Lundi, etc.
  slots: TimeSlot[];
}

export interface AgendaEvent {
  id: string;
  title: string;
  description?: string;
  type: EventType;
  
  // Timing
  date: Date;
  time: string; // Format "HH:mm"
  duration: number; // En minutes
  
  // Pour les tâches auto-placées
  isFixed: boolean; // true = RDV fixe, false = tâche à placer automatiquement
  priority: Priority;
  status: EventStatus;
  canBeOnWeekend: boolean;
  
  // Gestion de durée
  originalDuration: number; // Durée initiale prévue
  actualDuration?: number; // Durée réelle si prolongée
  
  // Récurrence
  isRecurring: boolean;
  recurrenceType?: RecurrenceType;
  recurrenceInterval?: number; // Ex: tous les 7 jours
  recurrenceEndDate?: Date;
  parentRecurringId?: string; // ID de la tâche récurrente parente
  stepIndex?: number; // Index de l'étape dans une tâche multi-étapes
  delayAfterPrevious?: number; // Délai en minutes après l'étape précédente
  
  // Source
  sourceType: 'kanban' | 'family' | 'empire' | 'admin' | 'manual' | 'google';
  sourceId?: string; // ID de la tâche source
  
  // Métadonnées
  createdAt: Date;
  updatedAt: Date;
}

// Configuration des horaires de travail
export const WORK_SCHEDULE: WorkSchedule[] = [
  // Dimanche (0)
  {
    dayOfWeek: 0,
    slots: [
      { start: new Date(2025, 0, 1, 8, 0), end: new Date(2025, 0, 1, 11, 30) },
      { start: new Date(2025, 0, 1, 13, 0), end: new Date(2025, 0, 1, 16, 30) },
    ],
  },
  // Lundi (1)
  {
    dayOfWeek: 1,
    slots: [
      { start: new Date(2025, 0, 1, 9, 0), end: new Date(2025, 0, 1, 11, 30) },
      { start: new Date(2025, 0, 1, 13, 0), end: new Date(2025, 0, 1, 16, 30) },
    ],
  },
  // Mardi (2)
  {
    dayOfWeek: 2,
    slots: [
      { start: new Date(2025, 0, 1, 9, 0), end: new Date(2025, 0, 1, 11, 30) },
      { start: new Date(2025, 0, 1, 13, 0), end: new Date(2025, 0, 1, 16, 30) },
    ],
  },
  // Mercredi (3)
  {
    dayOfWeek: 3,
    slots: [
      { start: new Date(2025, 0, 1, 9, 30), end: new Date(2025, 0, 1, 11, 30) },
    ],
  },
  // Jeudi (4)
  {
    dayOfWeek: 4,
    slots: [
      { start: new Date(2025, 0, 1, 9, 0), end: new Date(2025, 0, 1, 11, 30) },
      { start: new Date(2025, 0, 1, 13, 0), end: new Date(2025, 0, 1, 16, 30) },
    ],
  },
  // Vendredi (5)
  {
    dayOfWeek: 5,
    slots: [
      { start: new Date(2025, 0, 1, 9, 0), end: new Date(2025, 0, 1, 11, 30) },
      { start: new Date(2025, 0, 1, 13, 0), end: new Date(2025, 0, 1, 16, 30) },
    ],
  },
  // Samedi (6)
  {
    dayOfWeek: 6,
    slots: [
      { start: new Date(2025, 0, 1, 8, 0), end: new Date(2025, 0, 1, 11, 30) },
      { start: new Date(2025, 0, 1, 13, 0), end: new Date(2025, 0, 1, 16, 30) },
    ],
  },
];

// Durée de pause entre tâches de plus d'1h
export const BREAK_DURATION = 10; // minutes

// Configuration du placement automatique
export interface SchedulingConfig {
  workSchedule: WorkSchedule[];
  breakDuration: number;
  lookAheadDays: number; // Nombre de jours à regarder en avant pour placer les tâches
}

export const DEFAULT_SCHEDULING_CONFIG: SchedulingConfig = {
  workSchedule: WORK_SCHEDULE,
  breakDuration: BREAK_DURATION,
  lookAheadDays: 30, // Planifier sur 30 jours
};
