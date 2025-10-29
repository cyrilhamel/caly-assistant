/**
 * Formate une date en format français lisible
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

/**
 * Formate une heure en format HH:MM
 */
export const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Calcule le pourcentage de progression
 */
export const calculateProgress = (current: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((current / total) * 100);
};

/**
 * Détermine le niveau d'énergie basé sur un score
 */
export const getEnergyLevel = (score: number): 'low' | 'moderate' | 'high' => {
  if (score < 40) return 'low';
  if (score < 70) return 'moderate';
  return 'high';
};

/**
 * Retourne un emoji en fonction du niveau d'énergie
 */
export const getEnergyEmoji = (level: 'low' | 'moderate' | 'high'): string => {
  const emojis = {
    low: '🔴',
    moderate: '🟡',
    high: '🟢',
  };
  return emojis[level];
};

/**
 * Retourne un message de suggestion basé sur l'énergie
 */
export const getEnergySuggestion = (level: 'low' | 'moderate' | 'high'): string => {
  const suggestions = {
    low: 'Prenez une pause ! Votre énergie est faible.',
    moderate: 'Modérée - Pensez à faire une pause bientôt.',
    high: 'Excellente énergie ! Vous êtes au top !',
  };
  return suggestions[level];
};

/**
 * Formate un nombre en chaîne avec séparateurs
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('fr-FR').format(num);
};

/**
 * Calcule le nombre de jours entre deux dates
 */
export const daysBetween = (date1: Date, date2: Date): number => {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
};

/**
 * Vérifie si une date est aujourd'hui
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};
