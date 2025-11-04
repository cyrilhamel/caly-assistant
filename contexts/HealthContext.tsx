import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { HealthData, WeightEntry, WorkoutProgram } from '@/types/app';

interface HealthContextType {
  health: HealthData;
  updateWeight: (weight: number) => void;
  updateEnergyScore: (score: number) => void;
  updateDailyStats: (calories: number, steps: number, minutes: number) => void;
  completeWorkout: () => void;
  addWeightEntry: (weight: number) => void;
  skipWorkout: () => void;
  getTodayProgram: () => WorkoutProgram;
  completeExercise: (exerciseIndex: number) => void;
  updateSteps: (steps: number) => void;
  updateSleepHours: (hours: number) => void;
  needsSleepInput: () => boolean;
  calculateEnergyScore: () => number;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

// Base de programmes d'entraînement
const workoutPrograms: { [key: string]: WorkoutProgram } = {
  // Semaine 1-2 : Programme débutant
  lundi_debutant: {
    id: 'lundi_debutant',
    title: 'Cardio Léger + Renforcement Haut du Corps',
    duration: 60,
    difficulty: 'débutant',
    type: 'mixte',
    equipment: ['Vélo d\'appartement', 'Sangles TRX'],
    exercises: [
      { name: 'Échauffement articulaire', duration: 5, description: 'Rotations épaules, bras, poignets, nuque', completed: false },
      { name: 'Vélo d\'appartement - Phase 1', duration: 15, description: 'Rythme modéré, résistance faible, échauffement cardio', completed: false },
      { name: 'Sangles TRX - Tirage horizontal', sets: 3, reps: '10-12', duration: 8, description: 'Corps incliné 45°, tirer vers la poitrine', completed: false },
      { name: 'Sangles TRX - Pompes assistées', sets: 3, reps: '8-10', duration: 8, description: 'Mains dans les sangles, corps incliné', completed: false },
      { name: 'Sangles TRX - Biceps curl', sets: 3, reps: '10', duration: 6, description: 'Corps incliné, flexion des bras', completed: false },
      { name: 'Vélo d\'appartement - Phase 2', duration: 10, description: 'Récupération active, rythme tranquille', completed: false },
      { name: 'Sangles TRX - Y-fly (épaules)', sets: 2, reps: '12', duration: 6, description: 'Bras en Y, renforcement épaules', completed: false },
      { name: 'Étirements haut du corps', duration: 12, description: 'Épaules, bras, dos, pectoraux, nuque', completed: false },
    ],
  },
  mardi_debutant: {
    id: 'mardi_debutant',
    title: 'Cardio Actif + Mobilité',
    duration: 60,
    difficulty: 'débutant',
    type: 'cardio',
    equipment: ['Corde à sauter'],
    weatherDependent: true,
    exercises: [
      { name: 'Marche dynamique extérieure', duration: 25, description: 'Si beau temps : marche rapide en extérieur, varier le rythme', completed: false },
      { name: 'Alternative - Vélo d\'appartement', duration: 25, description: 'Si mauvais temps : vélo rythme modéré', completed: false },
      { name: 'Corde à sauter - Intervalles', duration: 15, description: '45 sec actif / 45 sec repos, répéter 10 fois', completed: false },
      { name: 'Mobilité hanches et chevilles', duration: 8, description: 'Rotations, flexions, extensions', completed: false },
      { name: 'Étirements complets', duration: 12, description: 'Corps entier en douceur, respiration profonde', completed: false },
    ],
  },
  mercredi_debutant: {
    id: 'mercredi_debutant',
    title: 'Cardio + Renforcement Bas du Corps',
    duration: 60,
    difficulty: 'débutant',
    type: 'mixte',
    equipment: ['Corde à sauter', 'Sangles TRX', 'Vélo d\'appartement'],
    exercises: [
      { name: 'Échauffement mobilité', duration: 5, description: 'Chevilles, genoux, hanches', completed: false },
      { name: 'Corde à sauter - Échauffement', duration: 8, description: '30 sec actif / 30 sec repos x8', completed: false },
      { name: 'Sangles TRX - Squat assisté', sets: 4, reps: '12-15', duration: 10, description: 'Aide avec les sangles, descente contrôlée', completed: false },
      { name: 'Sangles TRX - Fentes alternées', sets: 3, reps: '10 par jambe', duration: 10, description: 'Équilibre avec les sangles', completed: false },
      { name: 'Vélo d\'appartement - Intervalles', duration: 15, description: '2 min modéré / 1 min intense, répéter 5 fois', completed: false },
      { name: 'Sangles TRX - Leg curl', sets: 3, reps: '10-12', duration: 8, description: 'Allongé, pieds dans les sangles, flexion jambes', completed: false },
      { name: 'Étirements bas du corps', duration: 14, description: 'Quadriceps, ischio-jambiers, mollets, fessiers', completed: false },
    ],
  },
  jeudi_debutant: {
    id: 'jeudi_debutant',
    title: 'Récupération Active Longue',
    duration: 60,
    difficulty: 'débutant',
    type: 'récupération',
    equipment: [],
    weatherDependent: true,
    exercises: [
      { name: 'Marche tranquille extérieure', duration: 40, description: 'Rythme très léger, profiter de l\'air, déconnexion mentale', completed: false },
      { name: 'Alternative - Vélo très léger', duration: 40, description: 'Si mauvais temps : vélo résistance minimale', completed: false },
      { name: 'Auto-massage', duration: 10, description: 'Mollets, cuisses, dos avec les mains', completed: false },
      { name: 'Étirements doux', duration: 10, description: 'Tout le corps sans forcer', completed: false },
    ],
  },
  vendredi_debutant: {
    id: 'vendredi_debutant',
    title: 'Full Body Complet',
    duration: 65,
    difficulty: 'débutant',
    type: 'renforcement',
    equipment: ['Sangles TRX', 'Vélo d\'appartement'],
    exercises: [
      { name: 'Échauffement général', duration: 7, description: 'Mobilité complète + cardio léger', completed: false },
      { name: 'Sangles TRX - Pompes inclinées', sets: 3, reps: '10', duration: 7, description: 'Pectoraux et triceps', completed: false },
      { name: 'Sangles TRX - Squat', sets: 3, reps: '12-15', duration: 8, description: 'Jambes complètes', completed: false },
      { name: 'Sangles TRX - Rowing', sets: 3, reps: '10-12', duration: 8, description: 'Dos et biceps', completed: false },
      { name: 'Sangles TRX - Fentes', sets: 3, reps: '10 par jambe', duration: 10, description: 'Jambes alternées', completed: false },
      { name: 'Vélo d\'appartement - Cardio modéré', duration: 12, description: 'Maintenir rythme constant', completed: false },
      { name: 'Sangles TRX - Planche assistée', sets: 3, reps: '20-30 sec', duration: 5, description: 'Gainage avec sangles', completed: false },
      { name: 'Étirements complets', duration: 18, description: 'Corps entier, insister sur zones travaillées', completed: false },
    ],
  },
  samedi_debutant: {
    id: 'samedi_debutant',
    title: 'Cardio Longue Distance',
    duration: 75,
    difficulty: 'débutant',
    type: 'cardio',
    equipment: ['Vélo d\'appartement'],
    weatherDependent: true,
    exercises: [
      { name: 'Échauffement', duration: 5, description: 'Mobilité générale', completed: false },
      { name: 'Option 1: Sortie vélo extérieur', duration: 60, description: 'Balade vélo tranquille, découvrir les environs', completed: false },
      { name: 'Option 2: Vélo d\'appartement longue durée', duration: 50, description: 'Résistance modérée, rythme constant, musique/podcast', completed: false },
      { name: 'Marche de récupération', duration: 10, description: 'Retour au calme progressif', completed: false },
      { name: 'Étirements jambes', duration: 10, description: 'Focus quadriceps, mollets, dos', completed: false },
    ],
  },
  dimanche_debutant: {
    id: 'dimanche_debutant',
    title: 'Repos Complet',
    duration: 0,
    difficulty: 'débutant',
    type: 'récupération',
    equipment: [],
    exercises: [
      { name: 'Repos total', duration: 0, description: 'Récupération complète du corps et de l\'esprit. Profite de cette journée pour bien te reposer et attaquer la semaine prochaine en pleine forme ! 💪', completed: false },
    ],
  },
  
  // Semaine 3-4 : Programme intermédiaire (intensité +30%)
  lundi_intermediaire: {
    id: 'lundi_intermediaire',
    title: 'Cardio Intense + Force Haut du Corps',
    duration: 65,
    difficulty: 'intermédiaire',
    type: 'mixte',
    equipment: ['Vélo d\'appartement', 'Sangles TRX'],
    exercises: [
      { name: 'Échauffement articulaire', duration: 5, description: 'Rotations épaules, bras, poignets, nuque', completed: false },
      { name: 'Vélo d\'appartement - Intervalles', duration: 18, description: '3 min modéré / 2 min intense, répéter 3 fois', completed: false },
      { name: 'Sangles TRX - Tirage horizontal', sets: 4, reps: '12-15', duration: 10, description: 'Corps plus incliné, amplitude complète', completed: false },
      { name: 'Sangles TRX - Pompes déclinées', sets: 4, reps: '10-12', duration: 10, description: 'Pieds surélevés sur support', completed: false },
      { name: 'Sangles TRX - Biceps curl', sets: 3, reps: '12-15', duration: 7, description: 'Corps très incliné, contrôle descente', completed: false },
      { name: 'Sangles TRX - Triceps extension', sets: 3, reps: '10-12', duration: 7, description: 'Extension au-dessus de la tête', completed: false },
      { name: 'Vélo d\'appartement - Sprint', duration: 5, description: 'Résistance élevée, effort maximal', completed: false },
      { name: 'Étirements haut du corps', duration: 13, description: 'Épaules, bras, dos, pectoraux, nuque en profondeur', completed: false },
    ],
  },
  
  mardi_intermediaire: {
    id: 'mardi_intermediaire',
    title: 'Cardio HIIT + Mobilité',
    duration: 65,
    difficulty: 'intermédiaire',
    type: 'cardio',
    equipment: ['Corde à sauter', 'Vélo d\'appartement'],
    weatherDependent: true,
    exercises: [
      { name: 'Marche/Course alternée extérieure', duration: 30, description: '5 min marche rapide / 2 min course légère, répéter 5 fois', completed: false },
      { name: 'Alternative - Vélo intervalles', duration: 30, description: '4 min modéré / 1 min intense, répéter 6 fois', completed: false },
      { name: 'Corde à sauter - HIIT', duration: 15, description: '40 sec sprint / 20 sec repos, répéter 15 fois', completed: false },
      { name: 'Mobilité dynamique complète', duration: 10, description: 'Tous les groupes articulaires, mouvements amples', completed: false },
      { name: 'Étirements profonds', duration: 10, description: 'Corps entier, tenir chaque position 45 sec', completed: false },
    ],
  },
  
  mercredi_intermediaire: {
    id: 'mercredi_intermediaire',
    title: 'Cardio + Force Bas du Corps',
    duration: 65,
    difficulty: 'intermédiaire',
    type: 'mixte',
    equipment: ['Corde à sauter', 'Sangles TRX', 'Vélo d\'appartement'],
    exercises: [
      { name: 'Échauffement mobilité', duration: 5, description: 'Chevilles, genoux, hanches', completed: false },
      { name: 'Corde à sauter - Échauffement intense', duration: 10, description: '40 sec actif / 20 sec repos x10', completed: false },
      { name: 'Sangles TRX - Squat sauté', sets: 4, reps: '10-12', duration: 12, description: 'Squat avec petit saut en montée', completed: false },
      { name: 'Sangles TRX - Fentes bulgares', sets: 4, reps: '12 par jambe', duration: 12, description: 'Pied arrière surélevé', completed: false },
      { name: 'Vélo d\'appartement - Intervalles puissance', duration: 15, description: '1 min intense / 1 min modéré x15', completed: false },
      { name: 'Sangles TRX - Pistol squat assisté', sets: 3, reps: '6-8 par jambe', duration: 10, description: 'Squat sur une jambe avec aide', completed: false },
      { name: 'Étirements bas du corps', duration: 11, description: 'Focus quadriceps, ischio, fessiers, mollets', completed: false },
    ],
  },
  
  jeudi_intermediaire: {
    id: 'jeudi_intermediaire',
    title: 'Cardio Modéré + Récupération',
    duration: 60,
    difficulty: 'intermédiaire',
    type: 'récupération',
    equipment: ['Vélo d\'appartement'],
    weatherDependent: true,
    exercises: [
      { name: 'Marche rapide extérieure', duration: 35, description: 'Rythme soutenu mais confortable, profiter de l\'air', completed: false },
      { name: 'Alternative - Vélo modéré', duration: 35, description: 'Résistance moyenne, rythme constant', completed: false },
      { name: 'Auto-massage ciblé', duration: 12, description: 'Rouleau ou mains sur zones tendues', completed: false },
      { name: 'Étirements régénératifs', duration: 13, description: 'Tout le corps en douceur, respiration', completed: false },
    ],
  },
  
  vendredi_intermediaire: {
    id: 'vendredi_intermediaire',
    title: 'Full Body Force + Cardio',
    duration: 70,
    difficulty: 'intermédiaire',
    type: 'renforcement',
    equipment: ['Sangles TRX', 'Vélo d\'appartement', 'Corde à sauter'],
    exercises: [
      { name: 'Échauffement dynamique', duration: 8, description: 'Mobilité + cardio léger', completed: false },
      { name: 'Sangles TRX - Pompes archer', sets: 4, reps: '8-10 par côté', duration: 10, description: 'Pompe avec déplacement latéral', completed: false },
      { name: 'Sangles TRX - Squat pistol', sets: 4, reps: '8 par jambe', duration: 12, description: 'Squat une jambe avec aide', completed: false },
      { name: 'Corde à sauter - Intervalles', duration: 10, description: '45 sec / 15 sec x10', completed: false },
      { name: 'Sangles TRX - Rowing inversé', sets: 4, reps: '12-15', duration: 10, description: 'Corps horizontal, tirer fort', completed: false },
      { name: 'Sangles TRX - Fentes sautées', sets: 3, reps: '10 par jambe', duration: 10, description: 'Changement de jambe en sautant', completed: false },
      { name: 'Vélo d\'appartement - Finish', duration: 8, description: 'Effort maximal, videz tout !', completed: false },
      { name: 'Étirements complets', duration: 12, description: 'Corps entier, récupération profonde', completed: false },
    ],
  },
  
  samedi_intermediaire: {
    id: 'samedi_intermediaire',
    title: 'Cardio Longue Endurance',
    duration: 80,
    difficulty: 'intermédiaire',
    type: 'cardio',
    equipment: ['Vélo d\'appartement'],
    weatherDependent: true,
    exercises: [
      { name: 'Échauffement', duration: 5, description: 'Mobilité générale', completed: false },
      { name: 'Option 1: Sortie vélo extérieur active', duration: 65, description: 'Rythme soutenu, varier les parcours avec dénivelé', completed: false },
      { name: 'Option 2: Vélo d\'appartement endurance', duration: 60, description: 'Résistance modérée/élevée, maintenir effort constant', completed: false },
      { name: 'Marche de récupération', duration: 10, description: 'Retour au calme progressif', completed: false },
      { name: 'Étirements jambes complets', duration: 10, description: 'Tous les muscles des jambes + dos', completed: false },
    ],
  },
  
  dimanche_intermediaire: {
    id: 'dimanche_intermediaire',
    title: 'Repos Actif Léger',
    duration: 30,
    difficulty: 'intermédiaire',
    type: 'récupération',
    equipment: [],
    weatherDependent: true,
    exercises: [
      { name: 'Marche digestive', duration: 20, description: 'Balade tranquille pour activer la circulation', completed: false },
      { name: 'Yoga/Stretching doux', duration: 10, description: 'Mouvements fluides, respiration, préparation semaine suivante', completed: false },
    ],
  },
  
  // Semaine 5+ : Programme avancé (intensité +50% vs débutant)
  lundi_avance: {
    id: 'lundi_avance',
    title: 'Force Maximale Haut du Corps',
    duration: 70,
    difficulty: 'avancé',
    type: 'renforcement',
    equipment: ['Vélo d\'appartement', 'Sangles TRX'],
    exercises: [
      { name: 'Échauffement complet', duration: 7, description: 'Mobilité articulaire + activation musculaire', completed: false },
      { name: 'Vélo d\'appartement - HIIT', duration: 15, description: '1 min sprint / 1 min récup x7', completed: false },
      { name: 'Sangles TRX - Pompes diamant', sets: 5, reps: '12-15', duration: 12, description: 'Mains proches, focus triceps', completed: false },
      { name: 'Sangles TRX - Tirage à une main', sets: 4, reps: '10 par côté', duration: 12, description: 'Unilatéral, force brute', completed: false },
      { name: 'Sangles TRX - Pike push-up', sets: 4, reps: '10-12', duration: 10, description: 'Position V inversé, épaules', completed: false },
      { name: 'Sangles TRX - Curl 21s', sets: 3, reps: '21', duration: 10, description: '7 reps bas/7 reps haut/7 complètes', completed: false },
      { name: 'Gainage dynamique', duration: 6, description: 'Planche + variations latérales', completed: false },
      { name: 'Étirements profonds', duration: 8, description: 'Haut du corps, tenir 60 sec par position', completed: false },
    ],
  },
  
  mardi_avance: {
    id: 'mardi_avance',
    title: 'HIIT Cardio Explosif',
    duration: 70,
    difficulty: 'avancé',
    type: 'cardio',
    equipment: ['Corde à sauter', 'Vélo d\'appartement'],
    weatherDependent: true,
    exercises: [
      { name: 'Course/Marche alternée', duration: 25, description: '3 min course / 2 min marche x5', completed: false },
      { name: 'Alternative - Vélo sprint', duration: 25, description: '3 min effort max / 2 min récup x5', completed: false },
      { name: 'Corde à sauter - Tabata', duration: 20, description: '20 sec max / 10 sec repos x24 (8 min)', completed: false },
      { name: 'Burpees sans sangles', sets: 4, reps: '10', duration: 10, description: 'Explosivité maximale', completed: false },
      { name: 'Mobilité explosive', duration: 8, description: 'Mouvements dynamiques amples', completed: false },
      { name: 'Étirements actifs', duration: 7, description: 'Stretching avec contractions', completed: false },
    ],
  },
  
  mercredi_avance: {
    id: 'mercredi_avance',
    title: 'Puissance Bas du Corps',
    duration: 70,
    difficulty: 'avancé',
    type: 'renforcement',
    equipment: ['Corde à sauter', 'Sangles TRX', 'Vélo d\'appartement'],
    exercises: [
      { name: 'Échauffement dynamique', duration: 7, description: 'Mobilité + activation jambes', completed: false },
      { name: 'Corde à sauter - Sprints', duration: 12, description: '30 sec max / 30 sec repos x12', completed: false },
      { name: 'Sangles TRX - Squat sauté explosif', sets: 5, reps: '12-15', duration: 15, description: 'Saut haut avec réception contrôlée', completed: false },
      { name: 'Sangles TRX - Pistol squat complet', sets: 4, reps: '10 par jambe', duration: 14, description: 'Squat une jambe, peu d\'aide', completed: false },
      { name: 'Vélo d\'appartement - Sprints courts', duration: 12, description: '20 sec max / 40 sec récup x12', completed: false },
      { name: 'Sangles TRX - Fentes sautées', sets: 4, reps: '12 par jambe', duration: 12, description: 'Changement explosif', completed: false },
      { name: 'Étirements jambes profonds', duration: 8, description: 'Toutes les chaînes musculaires', completed: false },
    ],
  },
  
  jeudi_avance: {
    id: 'jeudi_avance',
    title: 'Endurance Active',
    duration: 65,
    difficulty: 'avancé',
    type: 'cardio',
    equipment: ['Vélo d\'appartement'],
    weatherDependent: true,
    exercises: [
      { name: 'Course continue extérieure', duration: 40, description: 'Rythme soutenu, chercher à progresser', completed: false },
      { name: 'Alternative - Vélo soutenu', duration: 40, description: 'Résistance élevée, effort constant', completed: false },
      { name: 'Circuit mobilité', duration: 12, description: 'Tous les groupes articulaires', completed: false },
      { name: 'Étirements de récupération', duration: 13, description: 'Focus zones sollicitées', completed: false },
    ],
  },
  
  vendredi_avance: {
    id: 'vendredi_avance',
    title: 'Full Body Haute Intensité',
    duration: 75,
    difficulty: 'avancé',
    type: 'mixte',
    equipment: ['Sangles TRX', 'Corde à sauter', 'Vélo d\'appartement'],
    exercises: [
      { name: 'Échauffement intensif', duration: 8, description: 'Préparer corps à haute intensité', completed: false },
      { name: 'Circuit 1: TRX + Cardio', duration: 20, description: 'Pompes/Squats/Rowing/Corde en rotation 4x', completed: false },
      { name: 'Vélo d\'appartement - Tempo', duration: 10, description: 'Rythme élevé constant', completed: false },
      { name: 'Circuit 2: Force explosive', duration: 18, description: 'Fentes sautées/Pompes claquées/Pistol squat 4x', completed: false },
      { name: 'Corde à sauter - Finish', duration: 8, description: 'Videz tout ce qui reste !', completed: false },
      { name: 'Gainage intensif', duration: 6, description: 'Planche variations 6x1min', completed: false },
      { name: 'Étirements complets', duration: 15, description: 'Récupération profonde de tout le corps', completed: false },
    ],
  },
  
  samedi_avance: {
    id: 'samedi_avance',
    title: 'Endurance Longue Performance',
    duration: 90,
    difficulty: 'avancé',
    type: 'cardio',
    equipment: ['Vélo d\'appartement'],
    weatherDependent: true,
    exercises: [
      { name: 'Échauffement progressif', duration: 8, description: 'Montée en intensité graduelle', completed: false },
      { name: 'Option 1: Sortie vélo performance', duration: 75, description: 'Chercher la vitesse, défis personnels', completed: false },
      { name: 'Option 2: Vélo endurance intense', duration: 70, description: 'Résistance élevée, tenir l\'effort', completed: false },
      { name: 'Récupération active', duration: 7, description: 'Retour progressif au calme', completed: false },
      { name: 'Étirements + auto-massage', duration: 15, description: 'Récupération complète muscles sollicités', completed: false },
    ],
  },
  
  dimanche_avance: {
    id: 'dimanche_avance',
    title: 'Récupération Active Complète',
    duration: 45,
    difficulty: 'avancé',
    type: 'récupération',
    equipment: [],
    weatherDependent: true,
    exercises: [
      { name: 'Marche/Balade active', duration: 30, description: 'Rythme tranquille, profiter, déconnecter', completed: false },
      { name: 'Yoga flow', duration: 15, description: 'Enchaînements fluides, respiration, préparation mentale semaine', completed: false },
    ],
  },
};

const initialHealth: HealthData = {
  currentWeight: 110,
  targetWeight: 85,
  energyScore: 67,
  caloriesBurned: 0,
  steps: 0,
  activeMinutes: 0,
  weekHistory: [false, false, false, false, false, false, false], // Dim, Lun, Mar, Mer, Jeu, Ven, Sam
  streak: 0,
  weightHistory: [
    { date: new Date('2025-10-23'), weight: 112 },
    { date: new Date('2025-10-26'), weight: 111.2 },
    { date: new Date('2025-10-30'), weight: 110 },
  ],
  milestones: [
    { weight: 105, achieved: false },
    { weight: 100, achieved: false },
    { weight: 95, achieved: false },
    { weight: 90, achieved: false },
    { weight: 85, achieved: false },
  ],
  workoutProgram: workoutPrograms.jeudi_debutant, // Jeudi 30 octobre
  currentWeek: 1,
  lastUpdatedDate: new Date().toISOString().split('T')[0], // Format YYYY-MM-DD
  sleepHours: 7, // Valeur par défaut
  lastSleepUpdate: '', // Pas encore saisi aujourd'hui
};

export function HealthProvider({ children }: { children: ReactNode }) {
  const [health, setHealth] = useState<HealthData>(initialHealth);

  // Fonction helper pour calculer le score (définie avant l'useEffect)
  const calculateEnergyScoreHelper = (
    healthData: HealthData,
    urgentTasksCount: number = 0,
    familyAppointmentsToday: number = 0,
    criticalAlertsCount: number = 0
  ): number => {
    let score = 50; // Base

    // Facteur sommeil (0-25 points)
    if (healthData.sleepHours >= 8) {
      score += 25;
    } else if (healthData.sleepHours >= 7) {
      score += 20;
    } else if (healthData.sleepHours >= 6) {
      score += 10;
    } else if (healthData.sleepHours < 5) {
      score -= 10;
    }

    // Facteur activité physique (0-20 points)
    const workoutCompleted = healthData.workoutProgram.exercises.every(ex => ex.completed);
    if (workoutCompleted) {
      score += 20;
    } else {
      const completedCount = healthData.workoutProgram.exercises.filter(ex => ex.completed).length;
      const totalCount = healthData.workoutProgram.exercises.length;
      score += Math.floor((completedCount / totalCount) * 20);
    }

    // Facteur pas quotidiens (0-15 points)
    if (healthData.steps >= 10000) {
      score += 15;
    } else if (healthData.steps >= 7500) {
      score += 10;
    } else if (healthData.steps >= 5000) {
      score += 5;
    } else if (healthData.steps < 3000) {
      score -= 5;
    }

    // Facteur série active (0-10 points)
    if (healthData.streak >= 7) {
      score += 10;
    } else if (healthData.streak >= 4) {
      score += 7;
    } else if (healthData.streak >= 2) {
      score += 4;
    }

    // Facteurs négatifs externes
    score -= Math.min(15, familyAppointmentsToday * 3);
    score -= Math.min(10, urgentTasksCount * 2);
    score -= Math.min(10, criticalAlertsCount * 5);

    return Math.max(0, Math.min(100, Math.round(score)));
  };

  // Recalculer automatiquement le score d'énergie quand certaines valeurs changent
  useEffect(() => {
    const newScore = calculateEnergyScoreHelper(health);
    if (newScore !== health.energyScore) {
      setHealth(prev => ({ ...prev, energyScore: newScore }));
    }
  }, [health.sleepHours, health.steps, health.streak, JSON.stringify(health.workoutProgram.exercises.map(e => e.completed))]);

  // Fonction pour obtenir la date actuelle au format YYYY-MM-DD
  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Fonction pour détecter et gérer le changement de jour
  const checkAndHandleDayChange = () => {
    const today = getCurrentDate();
    
    if (health.lastUpdatedDate !== today) {
      console.log(`📅 Changement de jour détecté : ${health.lastUpdatedDate} → ${today}`);
      
      // Calculer si on change de semaine (dimanche → lundi)
      const yesterday = new Date(health.lastUpdatedDate);
      const todayDate = new Date(today);
      const isNewWeek = yesterday.getDay() === 6 && todayDate.getDay() === 0; // Samedi → Dimanche
      
      // Charger le nouveau programme du jour
      const newProgram = getTodayProgram();
      
      setHealth(prev => ({
        ...prev,
        // Réinitialiser les stats quotidiennes
        caloriesBurned: 0,
        steps: 0,
        activeMinutes: 0,
        // Charger le nouveau programme
        workoutProgram: newProgram,
        // Mettre à jour la date
        lastUpdatedDate: today,
        // Si nouvelle semaine, réinitialiser l'historique
        weekHistory: isNewWeek ? [false, false, false, false, false, false, false] : prev.weekHistory,
        // Si nouvelle semaine, incrémenter le numéro de semaine
        currentWeek: isNewWeek ? prev.currentWeek + 1 : prev.currentWeek,
      }));
    }
  };

  // Vérifier le changement de jour au montage et toutes les minutes
  useEffect(() => {
    checkAndHandleDayChange();
    
    // Vérifier toutes les minutes si on a changé de jour
    const interval = setInterval(checkAndHandleDayChange, 60000); // 60 secondes
    
    return () => clearInterval(interval);
  }, [health.lastUpdatedDate]);

  const updateWeight = (weight: number) => {
    setHealth({ ...health, currentWeight: weight });
  };

  const updateEnergyScore = (score: number) => {
    setHealth({ ...health, energyScore: score });
  };

  const updateDailyStats = (calories: number, steps: number, minutes: number) => {
    setHealth({
      ...health,
      caloriesBurned: calories,
      steps: steps,
      activeMinutes: minutes,
    });
  };

  const completeWorkout = () => {
    const newHistory = [...health.weekHistory];
    const dayIndex = new Date().getDay();
    newHistory[dayIndex] = true;
    
    // Calculer le nouveau streak
    const newStreak = calculateStreak(newHistory);
    
    // Marquer tous les exercices comme complétés
    const completedProgram = { ...health.workoutProgram };
    completedProgram.exercises = completedProgram.exercises.map(ex => ({ ...ex, completed: true }));
    
    // Calculer les calories brûlées (environ 8 cal/min)
    const caloriesFromWorkout = health.workoutProgram.duration * 8;
    
    setHealth({
      ...health,
      weekHistory: newHistory,
      streak: newStreak,
      activeMinutes: health.activeMinutes + health.workoutProgram.duration,
      caloriesBurned: health.caloriesBurned + caloriesFromWorkout,
      workoutProgram: completedProgram,
    });
  };

  const addWeightEntry = (weight: number) => {
    const newEntry: WeightEntry = {
      date: new Date(),
      weight: weight,
    };

    // Mettre à jour l'historique
    const newWeightHistory = [...health.weightHistory, newEntry];

    // Vérifier les milestones atteints
    const newMilestones = health.milestones.map(milestone => {
      if (!milestone.achieved && weight <= milestone.weight) {
        return { ...milestone, achieved: true, achievedDate: new Date() };
      }
      return milestone;
    });

    setHealth({
      ...health,
      currentWeight: weight,
      weightHistory: newWeightHistory,
      milestones: newMilestones,
    });
  };

  const getTodayProgram = (): WorkoutProgram => {
    const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    const today = days[new Date().getDay()];
    
    // Progression automatique toutes les 2 semaines
    let level = 'debutant';
    if (health.currentWeek >= 5) {
      level = 'avance';
    } else if (health.currentWeek >= 3) {
      level = 'intermediaire';
    }
    
    const programKey = `${today}_${level}`;
    
    return workoutPrograms[programKey] || health.workoutProgram;
  };

  const completeExercise = (exerciseIndex: number) => {
    const updatedProgram = { ...health.workoutProgram };
    updatedProgram.exercises[exerciseIndex].completed = true;
    
    // Calculer les calories pour cet exercice
    const exercise = updatedProgram.exercises[exerciseIndex];
    const exerciseCalories = exercise.duration * 8;
    
    setHealth({
      ...health,
      workoutProgram: updatedProgram,
      activeMinutes: health.activeMinutes + exercise.duration,
      caloriesBurned: health.caloriesBurned + exerciseCalories,
    });
  };

  const skipWorkout = () => {
    // Passer au programme suivant sans compter la séance
    const nextProgram = getTodayProgram();
    setHealth({
      ...health,
      workoutProgram: nextProgram,
    });
  };

  const calculateStreak = (history: boolean[]): number => {
    const today = new Date().getDay();
    let streak = 0;
    
    // Compter depuis aujourd'hui vers le passé
    for (let i = today; i >= 0; i--) {
      if (history[i]) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const updateSteps = (steps: number) => {
    setHealth({
      ...health,
      steps: steps,
    });
  };

  const updateSleepHours = (hours: number) => {
    const today = new Date().toISOString().split('T')[0];
    const updatedHealth = {
      ...health,
      sleepHours: hours,
      lastSleepUpdate: today,
    };
    setHealth(updatedHealth);
    
    // Recalculer automatiquement le score d'énergie
    const newScore = calculateEnergyScoreHelper(updatedHealth);
    setTimeout(() => {
      setHealth(prev => ({ ...prev, energyScore: newScore }));
    }, 100);
  };

  const needsSleepInput = (): boolean => {
    const today = new Date().toISOString().split('T')[0];
    return health.lastSleepUpdate !== today;
  };

  const calculateEnergyScore = (): number => {
    return calculateEnergyScoreHelper(health);
  };

  return (
    <HealthContext.Provider value={{ 
      health, 
      updateWeight, 
      updateEnergyScore, 
      updateDailyStats, 
      completeWorkout, 
      addWeightEntry,
      skipWorkout,
      getTodayProgram,
      completeExercise,
      updateSteps,
      updateSleepHours,
      needsSleepInput,
      calculateEnergyScore,
    }}>
      {children}
    </HealthContext.Provider>
  );
}

export function useHealth() {
  const context = useContext(HealthContext);
  if (context === undefined) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
}
