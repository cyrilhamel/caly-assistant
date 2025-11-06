import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appointment, Medication, Activity, ShoppingItem, ShoppingCategory, AdminDocument, AdminTask } from '@/types/app';
import { MenstrualCycle } from '@/types';
import { saveData, loadData } from '@/utils/storage';

// Fonctions utilitaires pour les alertes médicaments
export const getDaysUntil = (date: Date): number => {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const needsRefillAlert = (medication: Medication): boolean => {
  return getDaysUntil(medication.nextRefillDate) <= 25;
};

export const needsPrescriptionAlert = (medication: Medication): boolean => {
  return getDaysUntil(medication.prescriptionEndDate) <= 30;
};

interface FamilyContextType {
  appointments: Appointment[];
  medications: Medication[];
  activities: Activity[];
  shoppingList: ShoppingItem[];
  adminDocuments: AdminDocument[];
  adminTasks: AdminTask[];
  menstrualCycles: MenstrualCycle[];
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  takeMedication: (medicationId: string, index: number) => void;
  updateMedication: (id: string, updates: Partial<Medication>) => void;
  addActivity: (activity: Omit<Activity, 'id'>) => void;
  deleteActivity: (id: string) => void;
  addShoppingItem: (name: string, category: ShoppingCategory) => void;
  toggleShoppingItem: (id: string) => void;
  deleteShoppingItem: (id: string) => void;
  clearShoppingList: () => void;
  updateAdminDocument: (person: AdminDocument['person'], updates: Partial<Omit<AdminDocument, 'person'>>) => void;
  addAdminTask: (task: Omit<AdminTask, 'id'>) => void;
  updateAdminTask: (id: string, updates: Partial<AdminTask>) => void;
  toggleAdminTask: (id: string) => void;
  deleteAdminTask: (id: string) => void;
  addMenstrualCycle: (cycle: Omit<MenstrualCycle, 'id'>) => void;
  updateMenstrualCycle: (id: string, updates: Partial<MenstrualCycle>) => void;
  deleteMenstrualCycle: (id: string) => void;
  getNextPredictedDate: () => Date | null;
  getAverageCycleLength: () => number | null;
  getAllAppointments: () => Appointment[];
  getAllActivities: () => Activity[];
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

const initialAppointments: Appointment[] = [
  {
    id: '1',
    title: 'Dr. Martin - Médecin généraliste',
    description: 'Consultation Albine',
    date: new Date(),
    time: '14:00',
    location: '15 rue de la Paix',
    person: 'Albine',
  },
  {
    id: '2',
    title: 'Pédiatre - Dr. Dubois',
    description: 'Suivi Anna',
    date: new Date(Date.now() + 86400000),
    time: '10:30',
    location: 'Cabinet médical centre',
    person: 'Anna',
  },
];

const initialMedications: Medication[] = [
  {
    id: '1',
    name: 'Traitement Albine',
    person: 'Albine',
    schedule: ['8h', '20h'],
    taken: [false, false],
    nextRefillDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // Dans 20 jours
    prescriptionEndDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // Dans 25 jours
  },
  {
    id: '2',
    name: 'Traitement Louis',
    person: 'Louis',
    schedule: ['Matin'],
    taken: [false],
    nextRefillDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Dans 30 jours
    prescriptionEndDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // Dans 60 jours
  },
];

const initialActivities: Activity[] = [
  {
    id: '1',
    title: '🎨 Atelier créatif',
    description: 'Mercredi 15h30 - 17h00',
    date: new Date(),
    child: 'Enfant 2',
  },
  {
    id: '2',
    title: '⚽ Sport',
    description: 'Samedi 10h00 - 11h30',
    date: new Date(Date.now() + 3 * 86400000),
    child: 'Enfant 1',
  },
];

const initialShoppingList: ShoppingItem[] = [
  { id: '1', name: 'Pâtes', category: 'Sec', checked: false },
  { id: '2', name: 'Riz', category: 'Sec', checked: false },
  { id: '3', name: 'Tomates', category: 'Légumes', checked: false },
  { id: '4', name: 'Lait', category: 'Frais', checked: false },
  { id: '5', name: 'Poulet', category: 'Viandes', checked: false },
];

const initialAdminDocuments: AdminDocument[] = [
  { person: 'Albine', aldEndDate: new Date(2026, 5, 15), mdphEndDate: new Date(2026, 8, 30), handiCardEndDate: new Date(2027, 2, 10) },
  { person: 'Louis', aldEndDate: new Date(2026, 3, 20), mdphEndDate: new Date(2025, 11, 15), handiCardEndDate: new Date(2026, 6, 5) },
  { person: 'Yoan', mdphEndDate: new Date(2026, 4, 10) },
  { person: 'Anna' },
  { person: 'Tom' },
];

const initialAdminTasks: AdminTask[] = [
  { id: '1', title: 'Renouveler dossier MDPH Louis', deadline: new Date(2025, 10, 15), duration: 120, completed: false },
  { id: '2', title: 'Demander certificat médical Albine', deadline: new Date(2026, 4, 1), duration: 30, completed: false },
];

const initialMenstrualCycles: MenstrualCycle[] = [];

export function FamilyProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [medications, setMedications] = useState<Medication[]>(initialMedications);
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>(initialShoppingList);
  const [adminDocuments, setAdminDocuments] = useState<AdminDocument[]>(initialAdminDocuments);
  const [adminTasks, setAdminTasks] = useState<AdminTask[]>(initialAdminTasks);
  const [menstrualCycles, setMenstrualCycles] = useState<MenstrualCycle[]>(initialMenstrualCycles);
  const [isLoaded, setIsLoaded] = useState(false);

  // Charger les données au démarrage
  useEffect(() => {
    const loadAllData = async () => {
      const [
        savedAppointments,
        savedMedications,
        savedActivities,
        savedShoppingList,
        savedAdminDocuments,
        savedAdminTasks,
        savedMenstrualCycles
      ] = await Promise.all([
        loadData('family_appointments', initialAppointments),
        loadData('family_medications', initialMedications),
        loadData('family_activities', initialActivities),
        loadData('family_shopping', initialShoppingList),
        loadData('family_admin_docs', initialAdminDocuments),
        loadData('family_admin_tasks', initialAdminTasks),
        loadData('family_menstrual_cycles', initialMenstrualCycles)
      ]);

      setAppointments(savedAppointments);
      setMedications(savedMedications);
      setActivities(savedActivities);
      setShoppingList(savedShoppingList);
      setAdminDocuments(savedAdminDocuments);
      setAdminTasks(savedAdminTasks);
      setMenstrualCycles(savedMenstrualCycles);
      setIsLoaded(true);
    };

    loadAllData();
  }, []);

  // Sauvegarder automatiquement quand les données changent
  useEffect(() => {
    if (isLoaded) {
      saveData('family_appointments', appointments);
    }
  }, [appointments, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      saveData('family_medications', medications);
    }
  }, [medications, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      saveData('family_activities', activities);
    }
  }, [activities, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      saveData('family_shopping', shoppingList);
    }
  }, [shoppingList, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      saveData('family_admin_docs', adminDocuments);
    }
  }, [adminDocuments, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      saveData('family_admin_tasks', adminTasks);
    }
  }, [adminTasks, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      saveData('family_menstrual_cycles', menstrualCycles);
    }
  }, [menstrualCycles, isLoaded]);

  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString(),
    };
    setAppointments([...appointments, newAppointment]);
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments(appointments.map(apt => 
      apt.id === id ? { ...apt, ...updates } : apt
    ));
  };

  const deleteAppointment = (id: string) => {
    setAppointments(appointments.filter(apt => apt.id !== id));
  };

  const takeMedication = (medicationId: string, index: number) => {
    setMedications(medications.map(med => {
      if (med.id === medicationId) {
        const newTaken = [...med.taken];
        newTaken[index] = true;
        return { ...med, taken: newTaken };
      }
      return med;
    }));
  };

  const updateMedication = (id: string, updates: Partial<Medication>) => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, ...updates } : med
    ));
  };

  const addActivity = (activity: Omit<Activity, 'id'>) => {
    const newActivity: Activity = {
      ...activity,
      id: Date.now().toString(),
    };
    setActivities([...activities, newActivity]);
  };

  const deleteActivity = (id: string) => {
    setActivities(activities.filter(act => act.id !== id));
  };

  const addShoppingItem = (name: string, category: ShoppingCategory) => {
    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name,
      category,
      checked: false,
    };
    setShoppingList([...shoppingList, newItem]);
  };

  const toggleShoppingItem = (id: string) => {
    setShoppingList(shoppingList.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const deleteShoppingItem = (id: string) => {
    setShoppingList(shoppingList.filter(item => item.id !== id));
  };

  const clearShoppingList = () => {
    // Garder uniquement les items non cochés pour la prochaine liste
    const uncheckedItems = shoppingList.filter(item => !item.checked);
    setShoppingList(uncheckedItems);
  };

  const updateAdminDocument = (person: AdminDocument['person'], updates: Partial<Omit<AdminDocument, 'person'>>) => {
    setAdminDocuments(adminDocuments.map(doc => 
      doc.person === person ? { ...doc, ...updates } : doc
    ));
  };

  const addAdminTask = (task: Omit<AdminTask, 'id'>) => {
    const newTask: AdminTask = {
      ...task,
      id: Date.now().toString(),
    };
    setAdminTasks([...adminTasks, newTask]);
  };

  const updateAdminTask = (id: string, updates: Partial<AdminTask>) => {
    setAdminTasks(adminTasks.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const toggleAdminTask = (id: string) => {
    setAdminTasks(adminTasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteAdminTask = (id: string) => {
    setAdminTasks(adminTasks.filter(task => task.id !== id));
  };

  // Fonctions pour le suivi menstruel
  const addMenstrualCycle = (cycle: Omit<MenstrualCycle, 'id'>) => {
    const newCycle: MenstrualCycle = {
      ...cycle,
      id: Date.now().toString(),
    };
    setMenstrualCycles([...menstrualCycles, newCycle]);
  };

  const updateMenstrualCycle = (id: string, updates: Partial<MenstrualCycle>) => {
    setMenstrualCycles(menstrualCycles.map(cycle => 
      cycle.id === id ? { ...cycle, ...updates } : cycle
    ));
  };

  const deleteMenstrualCycle = (id: string) => {
    setMenstrualCycles(menstrualCycles.filter(cycle => cycle.id !== id));
  };

  // Calculer la date prévue des prochaines règles
  const getNextPredictedDate = (): Date | null => {
    if (menstrualCycles.length < 2) return null;

    // Trier les cycles par date de début (plus récent en premier)
    const sortedCycles = [...menstrualCycles]
      .filter(cycle => cycle.endDate !== null)
      .sort((a, b) => b.startDate.getTime() - a.startDate.getTime());

    if (sortedCycles.length < 2) return null;

    // Calculer la durée moyenne des cycles (basé sur les 3 derniers cycles maximum)
    const recentCycles = sortedCycles.slice(0, 3);
    let totalDays = 0;
    
    for (let i = 0; i < recentCycles.length - 1; i++) {
      const daysBetween = Math.round(
        (recentCycles[i].startDate.getTime() - recentCycles[i + 1].startDate.getTime()) / 
        (1000 * 60 * 60 * 24)
      );
      totalDays += daysBetween;
    }

    const averageCycleLength = Math.round(totalDays / (recentCycles.length - 1));

    // Ajouter la durée moyenne au dernier cycle pour prédire les prochaines
    const lastCycle = sortedCycles[0];
    const predictedDate = new Date(lastCycle.startDate);
    predictedDate.setDate(predictedDate.getDate() + averageCycleLength);

    return predictedDate;
  };

  // Calculer la durée moyenne des cycles
  const getAverageCycleLength = (): number | null => {
    if (menstrualCycles.length < 2) return null;

    const sortedCycles = [...menstrualCycles]
      .filter(cycle => cycle.endDate !== null)
      .sort((a, b) => b.startDate.getTime() - a.startDate.getTime());

    if (sortedCycles.length < 2) return null;

    let totalDays = 0;
    const cyclesToConsider = Math.min(sortedCycles.length - 1, 3);

    for (let i = 0; i < cyclesToConsider; i++) {
      const daysBetween = Math.round(
        (sortedCycles[i].startDate.getTime() - sortedCycles[i + 1].startDate.getTime()) / 
        (1000 * 60 * 60 * 24)
      );
      totalDays += daysBetween;
    }

    return Math.round(totalDays / cyclesToConsider);
  };

  // Fonction pour générer les occurrences d'un rendez-vous/activité récurrente
  const generateRecurringOccurrences = <T extends { id: string; date: Date; isRecurring?: boolean; recurrenceEndDate?: Date }>(
    item: T,
    maxWeeks: number = 12 // Par défaut, générer 12 semaines à l'avance
  ): T[] => {
    if (!item.isRecurring) {
      return [item];
    }

    const occurrences: T[] = [item];
    const endDate = item.recurrenceEndDate || new Date(Date.now() + maxWeeks * 7 * 24 * 60 * 60 * 1000);
    
    let currentDate = new Date(item.date);
    currentDate.setDate(currentDate.getDate() + 7); // Une semaine après

    let counter = 1;
    while (currentDate <= endDate) {
      const occurrence: T = {
        ...item,
        id: `${item.id}-occurrence-${counter}`, // ID unique pour chaque occurrence
        date: new Date(currentDate),
      };
      occurrences.push(occurrence);
      currentDate.setDate(currentDate.getDate() + 7);
      counter++;
      
      // Sécurité : max 52 occurrences (1 an)
      if (counter >= 52) break;
    }

    return occurrences;
  };

  // Fonction pour obtenir tous les rendez-vous incluant les récurrents
  const getAllAppointments = (): Appointment[] => {
    const allAppointments: Appointment[] = [];
    
    appointments.forEach(apt => {
      const occurrences = generateRecurringOccurrences(apt);
      allAppointments.push(...occurrences);
    });

    return allAppointments;
  };

  // Fonction pour obtenir toutes les activités incluant les récurrentes
  const getAllActivities = (): Activity[] => {
    const allActivities: Activity[] = [];
    
    activities.forEach(act => {
      const occurrences = generateRecurringOccurrences(act);
      allActivities.push(...occurrences);
    });

    return allActivities;
  };

  return (
    <FamilyContext.Provider value={{ 
      appointments, 
      medications, 
      activities,
      shoppingList,
      adminDocuments,
      adminTasks,
      menstrualCycles,
      addAppointment, 
      updateAppointment, 
      deleteAppointment,
      takeMedication,
      updateMedication,
      addActivity,
      deleteActivity,
      addShoppingItem,
      toggleShoppingItem,
      deleteShoppingItem,
      clearShoppingList,
      updateAdminDocument,
      addAdminTask,
      updateAdminTask,
      toggleAdminTask,
      deleteAdminTask,
      addMenstrualCycle,
      updateMenstrualCycle,
      deleteMenstrualCycle,
      getNextPredictedDate,
      getAverageCycleLength,
      getAllAppointments,
      getAllActivities,
    }}>
      {children}
    </FamilyContext.Provider>
  );
}

export function useFamily() {
  const context = useContext(FamilyContext);
  if (context === undefined) {
    throw new Error('useFamily must be used within a FamilyProvider');
  }
  return context;
}
