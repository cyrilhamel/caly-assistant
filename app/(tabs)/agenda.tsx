import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, SegmentedButtons, FAB, Dialog, Portal, Button, TextInput, Chip, IconButton, Menu } from 'react-native-paper';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import { useAgenda } from '@/contexts/AgendaContext';
import { DayView } from '@/components/agenda/DayView';
import { WeekView } from '@/components/agenda/WeekView';
import { MonthView } from '@/components/agenda/MonthView';
import { RecurringTaskDialog } from '@/components/agenda/RecurringTaskDialog';
import { SwipeableTabWrapper } from '@/components/common/SwipeableTabWrapper';
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
    addRestBlock,
    deleteEvent,
  } = useAgenda();

  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<AgendaEvent | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showExtendDialog, setShowExtendDialog] = useState(false);
  const [showRecurringDialog, setShowRecurringDialog] = useState(false);
  const [showRestDialog, setShowRestDialog] = useState(false);
  const [additionalMinutes, setAdditionalMinutes] = useState('30');
  const [menuVisible, setMenuVisible] = useState(false);
  
  // États pour le bloc repos
  const [restDate, setRestDate] = useState(new Date());
  const [restStartTime, setRestStartTime] = useState({ hours: 14, minutes: 0 });
  const [restEndTime, setRestEndTime] = useState({ hours: 15, minutes: 0 });
  const [restTitle, setRestTitle] = useState('Repos');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

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
      setSelectedEvent(null); // Reset pour forcer le refresh
      setShowEventDialog(false);
    }
  };

  const handlePostponeTask = () => {
    if (selectedEvent) {
      postponeTask(selectedEvent.id);
      setSelectedEvent(null); // Reset pour forcer le refresh
      setShowEventDialog(false);
    }
  };

  const handleExtendTask = () => {
    if (selectedEvent) {
      const minutes = parseInt(additionalMinutes) || 0;
      extendTask(selectedEvent.id, minutes);
      setSelectedEvent(null); // Reset pour forcer le refresh
      setShowExtendDialog(false);
      setShowEventDialog(false);
    }
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      Alert.alert(
        'Supprimer',
        `Voulez-vous vraiment supprimer "${selectedEvent.title}" ?`,
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Supprimer',
            style: 'destructive',
            onPress: () => {
              deleteEvent(selectedEvent.id);
              setSelectedEvent(null);
              setShowEventDialog(false);
            },
          },
        ]
      );
    }
  };

  const handleAddRecurringTask = (
    template: RecurringTaskTemplate,
    startDate: Date,
    endDate: Date,
    customDuration?: number
  ) => {
    console.log('[Agenda] handleAddRecurringTask - customDuration reçue:', customDuration);
    // Si durée personnalisée (ex: Balade Louis), modifier UNIQUEMENT le premier step
    if (customDuration && template.steps[0]) {
      const modifiedTemplate = {
        ...template,
        steps: template.steps.map((step, index) => 
          index === 0 
            ? { ...step, duration: customDuration }
            : step
        ),
      };
      console.log('[Agenda] Template modifié:', modifiedTemplate.steps[0].duration, 'min pour', modifiedTemplate.steps[0].title);
      addRecurringTask(modifiedTemplate, startDate, endDate);
    } else {
      console.log('[Agenda] Template non modifié, durée par défaut:', template.steps[0]?.duration, 'min');
      addRecurringTask(template, startDate, endDate);
    }
  };

  const handleAddRestBlock = () => {
    // Calculer la durée en minutes
    const startMinutes = restStartTime.hours * 60 + restStartTime.minutes;
    const endMinutes = restEndTime.hours * 60 + restEndTime.minutes;
    const duration = endMinutes - startMinutes;

    if (duration <= 0) {
      Alert.alert('Erreur', 'L\'heure de fin doit être après l\'heure de début');
      return;
    }

    const restEvent: Omit<AgendaEvent, 'id' | 'createdAt' | 'updatedAt'> = {
      title: restTitle || 'Repos',
      description: 'Bloc de repos - Ne peut pas être déplacé',
      type: 'appointment',
      date: restDate,
      time: `${restStartTime.hours.toString().padStart(2, '0')}:${restStartTime.minutes.toString().padStart(2, '0')}`,
      duration,
      isFixed: true,
      priority: 'normal',
      status: 'validated',
      canBeOnWeekend: true,
      originalDuration: duration,
      isRecurring: false,
      sourceType: 'manual',
    };

    addRestBlock(restEvent);
    setShowRestDialog(false);
    setMenuVisible(false);
    
    // Réinitialiser les valeurs
    setRestTitle('Repos');
    setRestDate(new Date());
    setRestStartTime({ hours: 14, minutes: 0 });
    setRestEndTime({ hours: 15, minutes: 0 });
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
    <SwipeableTabWrapper currentRoute="/(tabs)/agenda">
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
            onDayPress={handleDayPress}
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

      {/* Menu FAB pour choisir entre tâche récurrente ou repos */}
      <FAB.Group
        open={menuVisible}
        visible
        icon={menuVisible ? 'close' : 'plus'}
        actions={[
          {
            icon: 'refresh',
            label: 'Tâche récurrente',
            onPress: () => {
              setMenuVisible(false);
              setShowRecurringDialog(true);
            },
            color: colors.darkGray,
            style: { backgroundColor: colors.gold },
          },
          {
            icon: 'sleep',
            label: 'Bloc repos',
            onPress: () => {
              setMenuVisible(false);
              setShowRestDialog(true);
            },
            color: colors.darkGray,
            style: { backgroundColor: colors.gold },
          },
        ]}
        onStateChange={({ open }) => setMenuVisible(open)}
        fabStyle={styles.fab}
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
          
          <Dialog.Actions>
            {/* Bouton supprimer à gauche */}
            {selectedEvent && !selectedEvent.isFixed && (
              <Button 
                onPress={handleDeleteEvent} 
                textColor={colors.error}
                style={styles.deleteButton}
              >
                🗑️ Supprimer
              </Button>
            )}
            
            {/* Autres boutons à droite */}
            {selectedEvent && !selectedEvent.isFixed && selectedEvent.status !== 'completed' && (
              <>
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
              </>
            )}
            
            {/* Si événement fixe, juste fermer */}
            {selectedEvent && (selectedEvent.isFixed || selectedEvent.status === 'completed') && (
              <Button onPress={() => setShowEventDialog(false)}>Fermer</Button>
            )}
          </Dialog.Actions>
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

      {/* Dialog bloc repos */}
      <Portal>
        <Dialog visible={showRestDialog} onDismiss={() => setShowRestDialog(false)}>
          <Dialog.Title style={{ color: colors.gold }}>😴 Créer un bloc repos</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Nom du repos"
              value={restTitle}
              onChangeText={setRestTitle}
              mode="outlined"
              style={styles.input}
              placeholder="Ex: Sieste, Pause déjeuner"
            />

            <Text style={{ color: colors.white, marginTop: 16, marginBottom: 8 }}>Date :</Text>
            <Button
              mode="outlined"
              onPress={() => setShowDatePicker(true)}
              icon="calendar"
            >
              {restDate.toLocaleDateString('fr-FR')}
            </Button>

            <Text style={{ color: colors.white, marginTop: 16, marginBottom: 8 }}>Heure de début :</Text>
            <Button
              mode="outlined"
              onPress={() => setShowStartTimePicker(true)}
              icon="clock"
            >
              {`${restStartTime.hours.toString().padStart(2, '0')}:${restStartTime.minutes.toString().padStart(2, '0')}`}
            </Button>

            <Text style={{ color: colors.white, marginTop: 16, marginBottom: 8 }}>Heure de fin :</Text>
            <Button
              mode="outlined"
              onPress={() => setShowEndTimePicker(true)}
              icon="clock"
            >
              {`${restEndTime.hours.toString().padStart(2, '0')}:${restEndTime.minutes.toString().padStart(2, '0')}`}
            </Button>

            <Text style={{ color: colors.mediumGray, fontSize: 12, marginTop: 12, fontStyle: 'italic' }}>
              💡 Ce créneau sera bloqué et aucune tâche ne pourra y être placée automatiquement.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowRestDialog(false)}>Annuler</Button>
            <Button onPress={handleAddRestBlock} textColor={colors.gold}>Créer</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* DatePicker pour le repos */}
      <DatePickerModal
        locale="fr"
        mode="single"
        visible={showDatePicker}
        onDismiss={() => setShowDatePicker(false)}
        date={restDate}
        onConfirm={(params) => {
          setRestDate(params.date as Date);
          setShowDatePicker(false);
        }}
        label="Date du repos"
      />

      {/* TimePickers pour le repos */}
      <TimePickerModal
        locale="fr"
        visible={showStartTimePicker}
        onDismiss={() => setShowStartTimePicker(false)}
        onConfirm={(params) => {
          setRestStartTime({ hours: params.hours, minutes: params.minutes });
          setShowStartTimePicker(false);
        }}
        hours={restStartTime.hours}
        minutes={restStartTime.minutes}
        label="Heure de début"
      />

      <TimePickerModal
        locale="fr"
        visible={showEndTimePicker}
        onDismiss={() => setShowEndTimePicker(false)}
        onConfirm={(params) => {
          setRestEndTime({ hours: params.hours, minutes: params.minutes });
          setShowEndTimePicker(false);
        }}
        hours={restEndTime.hours}
        minutes={restEndTime.minutes}
        label="Heure de fin"
      />
    </SafeAreaView>
    </SwipeableTabWrapper>
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
  deleteButton: {
    marginRight: 'auto',
  },
});
