// Couleurs principales de l'app
export const Colors = {
  primary: '#6200EE',
  secondary: '#03DAC6',
  background: '#f5f5f5',
  surface: '#ffffff',
  error: '#f44336',
  warning: '#ffc107',
  success: '#4CAF50',
  text: '#000000',
  textSecondary: '#666666',
};

// Statuts d'énergie
export const EnergyLevels = {
  LOW: 'low',
  MODERATE: 'moderate',
  HIGH: 'high',
} as const;

// Catégories de tâches
export const TaskCategories = {
  HEALTH: 'health',
  FAMILY: 'family',
  EMPIRE: 'empire',
  PERSONAL: 'personal',
} as const;

// Statuts de tâches
export const TaskStatus = {
  URGENT: 'urgent',
  IN_PROGRESS: 'in-progress',
  TODO: 'todo',
  DONE: 'done',
} as const;

// Icônes par catégorie
export const CategoryIcons = {
  health: 'heart-pulse',
  family: 'account-group',
  empire: 'domain',
  personal: 'account',
} as const;

// Objectif de poids
export const WeightGoal = {
  STARTING_WEIGHT: 101,
  TARGET_WEIGHT: 75,
  TOTAL_LOSS_GOAL: 25,
} as const;

// Objectif d'aide familiale
export const CaregivingHours = {
  WEEKLY_TARGET: 77,
  DAILY_AVERAGE: 11,
} as const;
