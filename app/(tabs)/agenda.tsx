import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, SegmentedButtons, FAB, Dialog, Portal, Button, TextInput, Chip, IconButton } from 'react-native-paper';
import { useAgenda } from '@/contexts/AgendaContext';
import { DayView } from '@/components/agenda/DayView';
import { WeekView } from '@/components/agenda/WeekView';
import { MonthView } from '@/components/agenda/MonthView';
import { RecurringTaskDialog } from '@/components/agenda/RecurringTaskDialog';
import { AgendaEvent, RecurringTaskTemplate } from '@/types/agenda';
import { colors } from '@/constants/theme';

type ViewMode = 'day' | 'week' | 'month';

export default function AgendaScreen() {
  const {
    events,
    getEventsForDay,
    getEventsForWeek,
    getEventsForMonth,
    validateTask,
    postponeTask,
    extendTask,
    addRecurringTask,
  } = useAgenda();

  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<AgendaEvent | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showExtendDialog, setShowExtendDialog] = useState(false);
  const [showRecurringDialog, setShowRecurringDialog] = useState(false);
  const [additionalMinutes, setAdditionalMinutes] = useState('30');

  const handlePreviousPeriod = () => {
    const newDate = new Date(selectedDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setSelectedDate(newDate);
  };

  const handleNextPeriod = () => {
    const newDate = new Date(selectedDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedDate(newDate);
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const handleEventPress = (event: AgendaEvent) => {
    setSelectedEvent(event);
    setShowEventDialog(true);
  };

  const handleDayPress = (date: Date) => {
    setSelectedDate(date);
    setViewMode('day');
  };

  const handleValidateTask = () => {
    if (selectedEvent) {
      validateTask(selectedEvent.id);
      setShowEventDialog(false);
    }
  };

  const handlePostponeTask = () => {
    if (selectedEvent) {
      postponeTask(selectedEvent.id);
      setShowEventDialog(false);
    }
  };

  const handleExtendTask = () => {
    if (selectedEvent) {
      const minutes = parseInt(additionalMinutes) || 0;
      extendTask(selectedEvent.id, minutes);
      setShowExtendDialog(false);
      setShowEventDialog(false);
    }
  };

  const handleAddRecurringTask = (
    template: RecurringTaskTemplate,
    startDate: Date,
    endDate: Date,
    customDuration?: number
  ) => {
    // Si durée personnalisée (ex: Balade loulou), modifier le template
    if (customDuration && template.steps[0]) {
      const modifiedTemplate = {
        ...template,
        steps: template.steps.map(step => ({
          ...step,
          duration: customDuration,
        })),
      };
      addRecurringTask(modifiedTemplate, startDate, endDate);
    } else {
      addRecurringTask(template, startDate, endDate);
    }
  };

  const getDateTitle = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    if (viewMode === 'day') {
      return selectedDate.toLocaleDateString('fr-FR', options);
    } else if (viewMode === 'week') {
      const endDate = new Date(selectedDate);
      endDate.setDate(endDate.getDate() + 6);
      return `${selectedDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} - ${endDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`;
    } else {
      return selectedDate.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
    }
  };

  const getCurrentEvents = () => {
    if (viewMode === 'day') {
      return getEventsForDay(selectedDate);
    } else if (viewMode === 'week') {
      return getEventsForWeek(selectedDate);
    } else {
      return getEventsForMonth(selectedDate.getFullYear(), selectedDate.getMonth());
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>📅 Agenda Intelligent</Text>
        
        <View style={styles.controls}>
          <IconButton
            icon="chevron-left"
            iconColor={colors.gold}
            size={24}
            onPress={handlePreviousPeriod}
          />
          <Button mode="text" onPress={handleToday} textColor={colors.gold}>
            Aujourd'hui
          </Button>
          <IconButton
            icon="chevron-right"
            iconColor={colors.gold}
            size={24}
            onPress={handleNextPeriod}
          />
        </View>

        <Text style={styles.dateTitle}>{getDateTitle()}</Text>

        <SegmentedButtons
          value={viewMode}
          onValueChange={(value) => setViewMode(value as ViewMode)}
          buttons={[
            { value: 'day', label: 'Jour', icon: 'calendar-today' },
            { value: 'week', label: 'Semaine', icon: 'calendar-week' },
            { value: 'month', label: 'Mois', icon: 'calendar-month' },
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      <View style={styles.content}>
        {viewMode === 'day' && (
          <DayView
            events={getCurrentEvents()}
            date={selectedDate}
            onEventPress={handleEventPress}
          />
        )}
        {viewMode === 'week' && (
          <WeekView
            events={getCurrentEvents()}
            startDate={selectedDate}
            onEventPress={handleEventPress}
          />
        )}
        {viewMode === 'month' && (
          <MonthView
            events={getCurrentEvents()}
            year={selectedDate.getFullYear()}
            month={selectedDate.getMonth()}
            onDayPress={handleDayPress}
          />
        )}
      </View>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setShowRecurringDialog(true)}
        color={colors.darkGray}
      />

      {/* Dialog détails événement */}
      <Portal>
        <Dialog visible={showEventDialog} onDismiss={() => setShowEventDialog(false)}>
          <Dialog.Title>{selectedEvent?.title}</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.eventDetail}>🕐 {selectedEvent?.time}</Text>
            <Text style={styles.eventDetail}>⏱️ {selectedEvent?.actualDuration || selectedEvent?.duration} minutes</Text>
            {selectedEvent?.description && (
              <Text style={styles.eventDetail}>📝 {selectedEvent.description}</Text>
            )}
            
            <View style={styles.chipContainer}>
              {selectedEvent?.isFixed && (
                <Chip icon="pin" mode="flat" style={styles.fixedChip}>Fixe</Chip>
              )}
              {selectedEvent?.priority === 'urgent' && (
                <Chip icon="fire" mode="flat" style={styles.urgentChip}>Urgent</Chip>
              )}
              {selectedEvent?.status === 'validated' && (
                <Chip icon="check" mode="flat" style={styles.validatedChip}>Validé</Chip>
              )}
            </View>
          </Dialog.Content>
          
          {selectedEvent && !selectedEvent.isFixed && selectedEvent.status !== 'completed' && (
            <Dialog.Actions>
              <Button onPress={() => setShowEventDialog(false)}>Fermer</Button>
              <Button onPress={handlePostponeTask} textColor={colors.warning}>Reporter</Button>
              <Button onPress={() => { setShowExtendDialog(true); setShowEventDialog(false); }}>
                Prolonger
              </Button>
              {selectedEvent.status !== 'validated' && (
                <Button onPress={handleValidateTask} textColor={colors.success}>
                  ✓ Faisable
                </Button>
              )}
            </Dialog.Actions>
          )}
        </Dialog>

        {/* Dialog prolonger tâche */}
        <Dialog visible={showExtendDialog} onDismiss={() => setShowExtendDialog(false)}>
          <Dialog.Title>Prolonger la tâche</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.extendText}>
              La tâche prend plus de temps que prévu ?
            </Text>
            <TextInput
              label="Minutes supplémentaires"
              value={additionalMinutes}
              onChangeText={setAdditionalMinutes}
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowExtendDialog(false)}>Annuler</Button>
            <Button onPress={handleExtendTask} textColor={colors.gold}>Valider</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Dialog tâches récurrentes */}
      <RecurringTaskDialog
        visible={showRecurringDialog}
        onDismiss={() => setShowRecurringDialog(false)}
        onConfirm={handleAddRecurringTask}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.almostBlack,
  },
  header: {
    padding: 16,
    backgroundColor: colors.darkGray,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.gold,
    marginBottom: 16,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateTitle: {
    fontSize: 16,
    color: colors.white,
    textAlign: 'center',
    marginBottom: 16,
    textTransform: 'capitalize',
  },
  segmentedButtons: {
    marginTop: 8,
  },
  content: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: colors.gold,
  },
  eventDetail: {
    fontSize: 16,
    color: colors.white,
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  fixedChip: {
    backgroundColor: colors.gold + '30',
  },
  urgentChip: {
    backgroundColor: colors.error + '30',
  },
  validatedChip: {
    backgroundColor: colors.success + '30',
  },
  extendText: {
    fontSize: 16,
    color: colors.white,
    marginBottom: 16,
  },
  input: {
    marginBottom: 8,
  },
});
