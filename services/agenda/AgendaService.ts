// Service de planification automatique intelligente

import {
  AgendaEvent,
  TimeSlot,
  WorkSchedule,
  SchedulingConfig,
  DEFAULT_SCHEDULING_CONFIG,
  Priority,
} from '@/types/agenda';

class AgendaService {
  private config: SchedulingConfig = DEFAULT_SCHEDULING_CONFIG;

  /**
   * Trouve tous les créneaux disponibles pour un jour donné
   */
  private getAvailableSlotsForDay(
    date: Date,
    existingEvents: AgendaEvent[],
    canBeOnWeekend: boolean
  ): TimeSlot[] {
    const dayOfWeek = date.getDay();
    
    // Si week-end et la tâche ne peut pas être le week-end, retourner vide
    if ((dayOfWeek === 0 || dayOfWeek === 6) && !canBeOnWeekend) {
      return [];
    }

    // Trouver les horaires de travail pour ce jour
    const workSchedule = this.config.workSchedule.find(
      (ws) => ws.dayOfWeek === dayOfWeek
    );

    if (!workSchedule) {
      return [];
    }

    // Convertir les slots template en vrais créneaux pour cette date
    const daySlots: TimeSlot[] = workSchedule.slots.map((slot) => ({
      start: new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        slot.start.getHours(),
        slot.start.getMinutes()
      ),
      end: new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        slot.end.getHours(),
        slot.end.getMinutes()
      ),
    }));

    // Filtrer les événements de ce jour
    const dayEvents = existingEvents.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });

    // Retirer les créneaux occupés par les événements existants
    const availableSlots: TimeSlot[] = [];

    for (const slot of daySlots) {
      let currentStart = new Date(slot.start);
      const slotEnd = new Date(slot.end);

      // Trier les événements du jour par heure de début
      const sortedEvents = dayEvents
        .map((event) => {
          const [hours, minutes] = event.time.split(':').map(Number);
          const eventStart = new Date(event.date);
          eventStart.setHours(hours, minutes, 0, 0);
          
          const eventEnd = new Date(eventStart);
          eventEnd.setMinutes(eventEnd.getMinutes() + (event.actualDuration || event.duration));
          
          // Ajouter pause si >1h
          if ((event.actualDuration || event.duration) > 60) {
            eventEnd.setMinutes(eventEnd.getMinutes() + this.config.breakDuration);
          }

          return { start: eventStart, end: eventEnd };
        })
        .sort((a, b) => a.start.getTime() - b.start.getTime());

      for (const event of sortedEvents) {
        // Si l'événement commence après le début du créneau actuel
        if (event.start > currentStart && event.start < slotEnd) {
          // Il y a un créneau disponible avant cet événement
          if (event.start.getTime() - currentStart.getTime() > 0) {
            availableSlots.push({
              start: new Date(currentStart),
              end: new Date(event.start),
            });
          }
          // Le nouveau début est après la fin de cet événement
          currentStart = new Date(event.end);
        } else if (event.start <= currentStart && event.end > currentStart) {
          // L'événement chevauche le début actuel
          currentStart = new Date(event.end);
        }
      }

      // Ajouter le créneau restant s'il y en a un
      if (currentStart < slotEnd) {
        availableSlots.push({
          start: new Date(currentStart),
          end: new Date(slotEnd),
        });
      }
    }

    return availableSlots;
  }

  /**
   * Calcule la durée d'un créneau en minutes
   */
  private getSlotDuration(slot: TimeSlot): number {
    return (slot.end.getTime() - slot.start.getTime()) / (1000 * 60);
  }

  /**
   * Trouve le premier créneau disponible pour une tâche
   */
  findNextAvailableSlot(
    task: Omit<AgendaEvent, 'date' | 'time'>,
    existingEvents: AgendaEvent[],
    startDate: Date = new Date()
  ): { date: Date; time: string } | null {
    const taskDuration = task.duration + (task.duration > 60 ? this.config.breakDuration : 0);

    // Chercher dans les X prochains jours
    for (let i = 0; i < this.config.lookAheadDays; i++) {
      const checkDate = new Date(startDate);
      checkDate.setDate(checkDate.getDate() + i);
      checkDate.setHours(0, 0, 0, 0);

      const availableSlots = this.getAvailableSlotsForDay(
        checkDate,
        existingEvents,
        task.canBeOnWeekend
      );

      // Trouver un créneau assez grand
      for (const slot of availableSlots) {
        const slotDuration = this.getSlotDuration(slot);
        
        if (slotDuration >= taskDuration) {
          // Créneau trouvé !
          const time = `${slot.start.getHours().toString().padStart(2, '0')}:${slot.start.getMinutes().toString().padStart(2, '0')}`;
          return { date: slot.start, time };
        }
      }
    }

    return null; // Aucun créneau trouvé
  }

  /**
   * Place automatiquement toutes les tâches non fixées
   */
  autoScheduleTasks(
    events: AgendaEvent[],
    startDate: Date = new Date()
  ): AgendaEvent[] {
    // Séparer les événements fixes et les tâches
    const fixedEvents = events.filter((e) => e.isFixed || e.status === 'validated');
    const tasksToSchedule = events.filter(
      (e) => !e.isFixed && e.status !== 'validated' && e.status !== 'completed'
    );

    // Trier les tâches par priorité (urgent > normal > low)
    const priorityOrder: Record<Priority, number> = {
      urgent: 1,
      normal: 2,
      low: 3,
    };

    tasksToSchedule.sort((a, b) => {
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Si même priorité, trier par date de création
      return a.createdAt.getTime() - b.createdAt.getTime();
    });

    const scheduledEvents = [...fixedEvents];

    // Placer chaque tâche
    for (const task of tasksToSchedule) {
      const slot = this.findNextAvailableSlot(task, scheduledEvents, startDate);
      
      if (slot) {
        const scheduledTask: AgendaEvent = {
          ...task,
          date: slot.date,
          time: slot.time,
          status: 'scheduled',
          updatedAt: new Date(),
        };
        scheduledEvents.push(scheduledTask);
      } else {
        // Impossible de placer la tâche
        console.warn(`Impossible de placer la tâche: ${task.title}`);
      }
    }

    return scheduledEvents;
  }

  /**
   * Réorganise tout le planning après un changement
   * (ajout tâche urgente, prolongation, report, etc.)
   */
  reorganizeSchedule(
    events: AgendaEvent[],
    changedEventId?: string
  ): AgendaEvent[] {
    const now = new Date();
    
    // Si une tâche urgente vient d'être ajoutée, démarrer la réorganisation à partir d'aujourd'hui
    let reorganizeFrom = now;
    
    if (changedEventId) {
      const changedEvent = events.find((e) => e.id === changedEventId);
      if (changedEvent && changedEvent.priority === 'urgent') {
        reorganizeFrom = now; // Réorganiser immédiatement
      } else if (changedEvent) {
        reorganizeFrom = new Date(changedEvent.date);
      }
    }

    // Garder tous les événements passés et validés intacts
    const pastAndValidatedEvents = events.filter((e) => {
      const eventDate = new Date(e.date);
      return (
        eventDate < reorganizeFrom ||
        e.status === 'validated' ||
        e.status === 'completed' ||
        e.isFixed
      );
    });

    // Réorganiser le reste
    const eventsToReorganize = events.filter((e) => {
      const eventDate = new Date(e.date);
      return (
        eventDate >= reorganizeFrom &&
        e.status !== 'validated' &&
        e.status !== 'completed' &&
        !e.isFixed
      );
    });

    return this.autoScheduleTasks(
      [...pastAndValidatedEvents, ...eventsToReorganize],
      reorganizeFrom
    );
  }

  /**
   * Prolonge une tâche en cours et réorganise le reste
   */
  extendTask(
    taskId: string,
    additionalMinutes: number,
    allEvents: AgendaEvent[]
  ): AgendaEvent[] {
    const updatedEvents = allEvents.map((event) => {
      if (event.id === taskId) {
        return {
          ...event,
          actualDuration: (event.actualDuration || event.duration) + additionalMinutes,
          status: 'in-progress' as const,
          updatedAt: new Date(),
        };
      }
      return event;
    });

    return this.reorganizeSchedule(updatedEvents, taskId);
  }

  /**
   * Marque une tâche comme faisable (validée)
   */
  validateTask(taskId: string, events: AgendaEvent[]): AgendaEvent[] {
    return events.map((event) => {
      if (event.id === taskId) {
        return {
          ...event,
          status: 'validated' as const,
          updatedAt: new Date(),
        };
      }
      return event;
    });
  }

  /**
   * Reporte une tâche au prochain créneau disponible
   */
  postponeTask(taskId: string, allEvents: AgendaEvent[]): AgendaEvent[] {
    const taskToPostpone = allEvents.find((e) => e.id === taskId);
    
    if (!taskToPostpone) return allEvents;

    // Marquer comme reportée
    const eventsWithoutTask = allEvents.map((event) => {
      if (event.id === taskId) {
        return {
          ...event,
          status: 'postponed' as const,
          updatedAt: new Date(),
        };
      }
      return event;
    });

    // Chercher à partir du lendemain
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.reorganizeSchedule(eventsWithoutTask);
  }

  /**
   * Génère les occurrences d'une tâche récurrente
   */
  generateRecurringOccurrences(
    template: AgendaEvent,
    startDate: Date,
    endDate: Date
  ): AgendaEvent[] {
    if (!template.isRecurring || !template.recurrenceType || !template.recurrenceInterval) {
      return [];
    }

    const occurrences: AgendaEvent[] = [];
    let currentDate = new Date(startDate);
    const finalEndDate = template.recurrenceEndDate || endDate;

    let occurrenceCount = 0;

    while (currentDate <= finalEndDate) {
      occurrenceCount++;
      
      const occurrence: AgendaEvent = {
        ...template,
        id: `${template.id}-occurrence-${occurrenceCount}`,
        date: new Date(currentDate),
        parentRecurringId: template.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      occurrences.push(occurrence);

      // Incrémenter selon l'intervalle
      if (template.recurrenceType === 'daily') {
        currentDate.setDate(currentDate.getDate() + template.recurrenceInterval);
      } else if (template.recurrenceType === 'weekly') {
        currentDate.setDate(currentDate.getDate() + template.recurrenceInterval * 7);
      }
    }

    return occurrences;
  }
}

export const agendaService = new AgendaService();
