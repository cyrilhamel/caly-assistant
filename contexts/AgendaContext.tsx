import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AgendaEvent, RecurringTaskTemplate, RECURRING_TEMPLATES } from '@/types/agenda';
import { Task } from '@/types/app';
import { agendaService } from '@/services/agenda/AgendaService';
import { useTasks } from './TaskContext';
import { useFamily } from './FamilyContext';
import { useEmpire } from './EmpireContext';
import { saveData, loadData } from '@/utils/storage';

interface AgendaContextType {
  events: AgendaEvent[];
  addEvent: (event: Omit<AgendaEvent, 'id' | 'createdAt' | 'updatedAt'>) => void;
  addRestBlock: (event: Omit<AgendaEvent, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEvent: (id: string, updates: Partial<AgendaEvent>) => void;
  deleteEvent: (id: string) => void;
  
  // Actions sur les tâches
  validateTask: (taskId: string) => void;
  postponeTask: (taskId: string) => void;
  extendTask: (taskId: string, additionalMinutes: number) => void;
  markAsCompleted: (taskId: string) => void;
  
  // Tâches récurrentes
  addRecurringTask: (template: RecurringTaskTemplate, startDate: Date, endDate: Date) => void;
  recurringTemplates: RecurringTaskTemplate[];
  
  // Obtenir les événements d'un jour
  getEventsForDay: (date: Date) => AgendaEvent[];
  getEventsForWeek: (startDate: Date) => AgendaEvent[];
  getEventsForMonth: (year: number, month: number) => AgendaEvent[];
  
  // Réorganisation
  triggerReorganization: () => void;
}

const AgendaContext = createContext<AgendaContextType | undefined>(undefined);

// Données initiales pour démo
const initialEvents: AgendaEvent[] = [
  {
    id: '1',
    title: '📅 RDV Dentiste',
    description: 'Contrôle annuel',
    type: 'appointment',
    date: new Date(2025, 10, 5, 14, 0), // 5 novembre 2025, 14h
    time: '14:00',
    duration: 60,
    isFixed: true,
    priority: 'normal',
    status: 'scheduled',
    canBeOnWeekend: false,
    originalDuration: 60,
    isRecurring: false,
    sourceType: 'family',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export function AgendaProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<AgendaEvent[]>(initialEvents);
  const [recurringTemplates] = useState<RecurringTaskTemplate[]>(RECURRING_TEMPLATES);
  const [isLoaded, setIsLoaded] = useState(false);

  // Charger les événements sauvegardés au démarrage
  useEffect(() => {
    const loadEvents = async () => {
      const savedEvents = await loadData('agenda_events', initialEvents);
      setEvents(savedEvents);
      setIsLoaded(true);
    };
    loadEvents();
  }, []);

  // Sauvegarder automatiquement les événements
  useEffect(() => {
    if (isLoaded) {
      saveData('agenda_events', events);
    }
  }, [events, isLoaded]);

  // Récupérer les sources externes
  const { tasks, deleteTask: deleteTaskFromTasks } = useTasks();
  const { appointments, activities, adminTasks, deleteAppointment, deleteActivity, getAllAppointments, getAllActivities } = useFamily();
  const { empireTasks: empireTasksFromEmpire } = useEmpire();

  // Synchroniser les sources externes avec l'agenda
  useEffect(() => {
    const externalEvents: AgendaEvent[] = [];

    // 1. RDV Famille (fixes) - avec occurrences récurrentes générées
    getAllAppointments().forEach((appointment) => {
      externalEvents.push({
        id: `appointment-${appointment.id}`,
        title: appointment.title,
        description: appointment.description,
        type: 'appointment',
        date: appointment.date,
        time: appointment.time,
        duration: appointment.duration || 60,
        isFixed: true, // RDV fixe
        priority: 'normal',
        status: 'scheduled',
        canBeOnWeekend: true,
        originalDuration: appointment.duration || 60,
        isRecurring: false,
        sourceType: 'family',
        sourceId: appointment.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    // 2. Activités enfants (fixes) - avec occurrences récurrentes générées
    getAllActivities().forEach((activity) => {
      externalEvents.push({
        id: `activity-${activity.id}`,
        title: activity.title,
        description: `${activity.child} - ${activity.description}`,
        type: 'activity',
        date: activity.date,
        time: activity.time || '14:00',
        duration: activity.duration || 60,
        isFixed: true, // Activité fixe
        priority: 'normal',
        status: 'scheduled',
        canBeOnWeekend: true,
        originalDuration: activity.duration || 60,
        isRecurring: false,
        sourceType: 'family',
        sourceId: activity.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    // 3. Tâches Empire (auto-placées avec durée)
    empireTasksFromEmpire.forEach((task) => {
      externalEvents.push({
        id: `empire-${task.id}`,
        title: task.title,
        description: task.description,
        type: 'task',
        date: task.date,
        time: task.time,
        duration: task.duration || 60,
        isFixed: false, // Peut être réorganisé
        priority: 'normal',
        status: 'scheduled',
        canBeOnWeekend: false,
        originalDuration: task.duration || 60,
        isRecurring: false,
        sourceType: 'empire',
        sourceId: task.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    // 4. Tâches Admin (auto-placées)
    adminTasks.forEach((task) => {
      if (!task.completed) {
        externalEvents.push({
          id: `admin-${task.id}`,
          title: task.title,
          description: `Échéance: ${task.deadline.toLocaleDateString('fr-FR')}`,
          type: 'task',
          date: new Date(), // Pas de date fixe
          time: '09:00',
          duration: task.duration || 30,
          isFixed: false,
          priority: 'normal',
          status: 'scheduled',
          canBeOnWeekend: false,
          originalDuration: task.duration || 30,
          isRecurring: false,
          sourceType: 'admin',
          sourceId: task.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    });

    // 5. Tâches Kanban (auto-placées par priorité)
    tasks.forEach((task: Task) => {
      let priority: 'urgent' | 'normal' | 'low' = 'normal';
      if (task.status === 'urgent') priority = 'urgent';
      else if (task.status === 'todo') priority = 'low';

      externalEvents.push({
        id: `kanban-${task.id}`,
        title: task.title,
        description: task.description,
        type: 'task',
        date: new Date(),
        time: '09:00',
        duration: task.duration || 45,
        isFixed: false,
        priority,
        status: 'scheduled',
        canBeOnWeekend: task.category === 'health', // Santé peut être le week-end
        originalDuration: task.duration || 45,
        isRecurring: false,
        sourceType: 'kanban',
        sourceId: task.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    // Fusionner avec les événements manuels existants
    const manualEvents = events.filter(e => e.sourceType === 'manual');
    const allEvents = [...manualEvents, ...externalEvents];

    // Auto-planifier
    const scheduled = agendaService.autoScheduleTasks(allEvents);
    setEvents(scheduled);
  }, [tasks, appointments, activities, empireTasksFromEmpire, adminTasks]);

  // Auto-planification au chargement et après chaque changement
  useEffect(() => {
    const scheduledEvents = agendaService.autoScheduleTasks(events);
    if (JSON.stringify(scheduledEvents) !== JSON.stringify(events)) {
      setEvents(scheduledEvents);
    }
  }, []); // Seulement au montage initial

  const addEvent = (eventData: Omit<AgendaEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEvent: AgendaEvent = {
      ...eventData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedEvents = [...events, newEvent];
    
    // Si c'est une tâche avec priorité urgente, réorganiser immédiatement
    if (!newEvent.isFixed && newEvent.priority === 'urgent') {
      const reorganized = agendaService.reorganizeSchedule(updatedEvents, newEvent.id);
      setEvents(reorganized);
    } else if (!newEvent.isFixed) {
      // Sinon, auto-planifier normalement
      const scheduled = agendaService.autoScheduleTasks(updatedEvents);
      setEvents(scheduled);
    } else {
      // Événement fixe, pas de réorganisation
      setEvents(updatedEvents);
    }
  };

  const addRestBlock = (eventData: Omit<AgendaEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEvent: AgendaEvent = {
      ...eventData,
      id: `rest-${Date.now()}`,
      isFixed: true, // Toujours fixé
      status: 'validated', // Toujours validé pour être respecté
      type: 'appointment',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedEvents = [...events, newEvent];
    // Réorganiser les tâches autour de ce nouveau bloc
    const reorganized = agendaService.reorganizeSchedule(updatedEvents);
    setEvents(reorganized);
    console.log('[AgendaContext] Bloc repos ajouté:', newEvent.title, 'de', newEvent.time, 'durée', newEvent.duration, 'min');
  };

  const updateEvent = (id: string, updates: Partial<AgendaEvent>) => {
    const updatedEvents = events.map((event) =>
      event.id === id
        ? { ...event, ...updates, updatedAt: new Date() }
        : event
    );
    
    // Réorganiser si c'est une tâche non fixe
    const updatedEvent = updatedEvents.find(e => e.id === id);
    if (updatedEvent && !updatedEvent.isFixed) {
      const reorganized = agendaService.reorganizeSchedule(updatedEvents, id);
      setEvents(reorganized);
    } else {
      setEvents(updatedEvents);
    }
  };

  const deleteEvent = (id: string) => {
    // Trouver l'événement à supprimer
    const eventToDelete = events.find(event => event.id === id);
    
    if (eventToDelete) {
      // Supprimer aussi dans la source d'origine
      if (eventToDelete.sourceType === 'family' && eventToDelete.sourceId) {
        if (eventToDelete.type === 'appointment') {
          deleteAppointment(eventToDelete.sourceId);
        } else if (eventToDelete.type === 'activity') {
          deleteActivity(eventToDelete.sourceId);
        }
      } else if (eventToDelete.sourceType === 'kanban' && eventToDelete.sourceId) {
        deleteTaskFromTasks(eventToDelete.sourceId);
      }
    }
    
    const updatedEvents = events.filter((event) => event.id !== id);
    
    // Réorganiser après suppression
    const reorganized = agendaService.reorganizeSchedule(updatedEvents);
    setEvents(reorganized);
  };

  const validateTask = (taskId: string) => {
    const validated = agendaService.validateTask(taskId, events);
    setEvents(validated);
  };

  const postponeTask = (taskId: string) => {
    const postponed = agendaService.postponeTask(taskId, events);
    setEvents(postponed);
  };

  const extendTask = (taskId: string, additionalMinutes: number) => {
    const extended = agendaService.extendTask(taskId, additionalMinutes, events);
    setEvents(extended);
  };

  const markAsCompleted = (taskId: string) => {
    const updatedEvents = events.map((event) =>
      event.id === taskId
        ? { ...event, status: 'completed' as const, updatedAt: new Date() }
        : event
    );
    setEvents(updatedEvents);
  };

  const addRecurringTask = (
    template: RecurringTaskTemplate,
    startDate: Date,
    endDate: Date
  ) => {
    const occurrences: AgendaEvent[] = [];
    let currentDate = new Date(startDate);
    let occurrenceIndex = 0; // Compteur pour rendre les IDs uniques

    // Générer les occurrences (une par semaine)
    while (currentDate <= endDate) {
      // Créer les événements pour chaque étape de cette occurrence
      for (let stepIndex = 0; stepIndex < template.steps.length; stepIndex++) {
        const step = template.steps[stepIndex];

        const occurrence: AgendaEvent = {
          id: `${template.id}-${step.id}-${currentDate.getTime()}-${occurrenceIndex}-${stepIndex}`,
          title: step.title,
          description: template.description,
          type: 'recurring',
          date: new Date(currentDate), // Date de base, sera ajustée avec le délai
          time: '00:00', // Sera défini par l'auto-planification
          duration: step.duration,
          isFixed: false, // Les tâches récurrentes peuvent être déplacées dans leur semaine
          priority: step.priority,
          status: 'scheduled',
          canBeOnWeekend: step.canBeOnWeekend,
          originalDuration: step.duration,
          isRecurring: true,
          recurrenceType: 'weekly',
          recurrenceInterval: 7,
          recurrenceEndDate: endDate,
          parentRecurringId: template.id,
          stepIndex, // Ajouter l'index de l'étape
          delayAfterPrevious: step.delayAfterPrevious, // Stocker le délai
          sourceType: 'manual',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        console.log(`[AgendaContext] Création occurrence "${step.title}" - Durée: ${step.duration}min - Date: ${currentDate.toLocaleDateString()}`);
        occurrences.push(occurrence);
      }

      // Passer à la semaine suivante
      currentDate.setDate(currentDate.getDate() + 7);
      occurrenceIndex++; // Incrémenter le compteur
    }

    // Trier les occurrences par date puis par stepIndex pour maintenir l'ordre
    occurrences.sort((a, b) => {
      const dateDiff = a.date.getTime() - b.date.getTime();
      if (dateDiff !== 0) return dateDiff;
      return (a.stepIndex || 0) - (b.stepIndex || 0);
    });

    const updatedEvents = [...events, ...occurrences];
    const scheduled = agendaService.autoScheduleTasks(updatedEvents);
    setEvents(scheduled);
  };

  const getEventsForDay = (date: Date): AgendaEvent[] => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    }).sort((a, b) => {
      // Trier par heure
      const [aHours, aMinutes] = a.time.split(':').map(Number);
      const [bHours, bMinutes] = b.time.split(':').map(Number);
      const aTime = aHours * 60 + aMinutes;
      const bTime = bHours * 60 + bMinutes;
      return aTime - bTime;
    });
  };

  const getEventsForWeek = (startDate: Date): AgendaEvent[] => {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);

    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate >= startDate && eventDate < endDate;
    });
  };

  const getEventsForMonth = (year: number, month: number): AgendaEvent[] => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getFullYear() === year &&
        eventDate.getMonth() === month
      );
    });
  };

  const triggerReorganization = () => {
    const reorganized = agendaService.reorganizeSchedule(events);
    setEvents(reorganized);
  };

  const value: AgendaContextType = {
    events,
    addEvent,
    addRestBlock,
    updateEvent,
    deleteEvent,
    validateTask,
    postponeTask,
    extendTask,
    markAsCompleted,
    addRecurringTask,
    recurringTemplates,
    getEventsForDay,
    getEventsForWeek,
    getEventsForMonth,
    triggerReorganization,
  };

  return <AgendaContext.Provider value={value}>{children}</AgendaContext.Provider>;
}

export function useAgenda() {
  const context = useContext(AgendaContext);
  if (context === undefined) {
    throw new Error('useAgenda must be used within an AgendaProvider');
  }
  return context;
}
