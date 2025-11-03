import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Appointment, Medication, Activity, ShoppingItem, ShoppingCategory, AdminDocument, AdminTask } from '@/types/app';

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

export function FamilyProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [medications, setMedications] = useState<Medication[]>(initialMedications);
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>(initialShoppingList);
  const [adminDocuments, setAdminDocuments] = useState<AdminDocument[]>(initialAdminDocuments);
  const [adminTasks, setAdminTasks] = useState<AdminTask[]>(initialAdminTasks);

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

  return (
    <FamilyContext.Provider value={{ 
      appointments, 
      medications, 
      activities,
      shoppingList,
      adminDocuments,
      adminTasks,
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
