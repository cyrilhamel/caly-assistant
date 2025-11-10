import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Button, Chip, Portal, Dialog, TextInput, Switch } from 'react-native-paper';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import { colors, spacing } from '@/constants/theme';
import { useFamily } from '@/contexts/FamilyContext';
import { getDaysUntil, needsRefillAlert, needsPrescriptionAlert } from '@/contexts/FamilyContext';
import MenstrualTracking from '@/components/family/MenstrualTracking';
import { SwipeableTabWrapper } from '@/components/common/SwipeableTabWrapper';
import { useState } from 'react';

export default function Family() {
  const { appointments, medications, activities, adminDocuments, adminTasks, deleteAppointment, takeMedication, updateMedication, deleteActivity, addAppointment, addActivity, updateAdminDocument, addAdminTask, updateAdminTask, toggleAdminTask, deleteAdminTask } = useFamily();
  
  // États pour l'ajout de rendez-vous
  const [showAddAppointment, setShowAddAppointment] = useState(false);
  const [showAppDatePicker, setShowAppDatePicker] = useState(false);
  const [showAppTimePicker, setShowAppTimePicker] = useState(false);
  const [newAppTitle, setNewAppTitle] = useState('');
  const [newAppDescription, setNewAppDescription] = useState('');
  const [newAppDate, setNewAppDate] = useState<Date | undefined>(undefined);
  const [newAppTime, setNewAppTime] = useState('14:00');
  const [newAppLocation, setNewAppLocation] = useState('');
  const [newAppDuration, setNewAppDuration] = useState('');
  const [newAppPerson, setNewAppPerson] = useState<'Albine' | 'Anna' | 'Yoan' | 'Louis' | 'Tom' | 'Moi'>('Albine');
  const [newAppIsRecurring, setNewAppIsRecurring] = useState(false);
  const [showAppRecurrenceEndPicker, setShowAppRecurrenceEndPicker] = useState(false);
  const [newAppRecurrenceEndDate, setNewAppRecurrenceEndDate] = useState<Date | undefined>(undefined);

  // États pour l'ajout d'activité
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [showActDatePicker, setShowActDatePicker] = useState(false);
  const [showActTimePicker, setShowActTimePicker] = useState(false);
  const [newActTitle, setNewActTitle] = useState('');
  const [newActDescription, setNewActDescription] = useState('');
  const [newActDate, setNewActDate] = useState<Date | undefined>(undefined);
  const [newActTime, setNewActTime] = useState('14:00');
  const [newActDuration, setNewActDuration] = useState('');
  const [newActChild, setNewActChild] = useState('');
  const [newActIsRecurring, setNewActIsRecurring] = useState(false);
  const [showActRecurrenceEndPicker, setShowActRecurrenceEndPicker] = useState(false);
  const [newActRecurrenceEndDate, setNewActRecurrenceEndDate] = useState<Date | undefined>(undefined);

  // États pour la modification de médicament
  const [showEditMed, setShowEditMed] = useState(false);
  const [editingMedId, setEditingMedId] = useState<string | null>(null);
  const [showRefillDatePicker, setShowRefillDatePicker] = useState(false);
  const [showPrescriptionDatePicker, setShowPrescriptionDatePicker] = useState(false);
  const [editRefillDate, setEditRefillDate] = useState<Date | undefined>(undefined);
  const [editPrescriptionDate, setEditPrescriptionDate] = useState<Date | undefined>(undefined);

  // États pour la gestion administrative
  const [showEditAdminDate, setShowEditAdminDate] = useState(false);
  const [editingAdminPerson, setEditingAdminPerson] = useState<'Albine' | 'Louis' | 'Yoan' | 'Anna' | 'Tom' | null>(null);
  const [editingAdminField, setEditingAdminField] = useState<'aldEndDate' | 'mdphEndDate' | 'handiCardEndDate' | null>(null);
  const [showAdminDatePicker, setShowAdminDatePicker] = useState(false);
  const [editAdminDate, setEditAdminDate] = useState<Date | undefined>(undefined);
  const [showAddAdminTask, setShowAddAdminTask] = useState(false);
  const [newAdminTaskTitle, setNewAdminTaskTitle] = useState('');
  const [newAdminTaskDeadline, setNewAdminTaskDeadline] = useState<Date | undefined>(undefined);
  const [showAdminTaskDatePicker, setShowAdminTaskDatePicker] = useState(false);
  const [newAdminTaskDuration, setNewAdminTaskDuration] = useState('');
  const [showEditAdminTask, setShowEditAdminTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskField, setEditingTaskField] = useState<'deadline' | 'duration' | null>(null);
  const [editTaskDeadline, setEditTaskDeadline] = useState<Date | undefined>(undefined);
  const [showEditTaskDatePicker, setShowEditTaskDatePicker] = useState(false);
  const [editTaskDuration, setEditTaskDuration] = useState('');

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return 'Aujourd\'hui';
    if (date.toDateString() === tomorrow.toDateString()) return 'Demain';
    
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    return days[date.getDay()];
  };

  const handleDeleteAppointment = (id: string, title: string) => {
    Alert.alert(
      'Supprimer le rendez-vous',
      `Voulez-vous vraiment supprimer "${title}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: () => deleteAppointment(id) },
      ]
    );
  };

  const handleTakeMedication = (medId: string, medName: string, index: number) => {
    Alert.alert(
      'Médicament pris',
      `Confirmer la prise de ${medName} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Confirmer', onPress: () => takeMedication(medId, index) },
      ]
    );
  };

  const handleAddAppointment = () => {
    if (newAppTitle.trim() && newAppDate && newAppTime) {
      addAppointment({
        title: newAppTitle,
        description: newAppDescription,
        date: newAppDate,
        time: newAppTime,
        location: newAppLocation,
        duration: newAppDuration ? parseInt(newAppDuration) : undefined,
        person: newAppPerson,
        isRecurring: newAppIsRecurring,
        recurrenceEndDate: newAppIsRecurring ? newAppRecurrenceEndDate : undefined,
      });
      
      setNewAppTitle('');
      setNewAppDescription('');
      setNewAppDate(undefined);
      setNewAppTime('');
      setNewAppLocation('');
      setNewAppDuration('');
      setNewAppIsRecurring(false);
      setNewAppRecurrenceEndDate(undefined);
      setShowAddAppointment(false);
    }
  };

  const handleAddActivity = () => {
    if (newActTitle.trim() && newActDate && newActChild) {
      addActivity({
        title: newActTitle,
        description: newActDescription,
        date: newActDate,
        time: newActTime,
        duration: newActDuration ? parseInt(newActDuration) : undefined,
        child: newActChild,
        isRecurring: newActIsRecurring,
        recurrenceEndDate: newActIsRecurring ? newActRecurrenceEndDate : undefined,
      });
      
      setNewActTitle('');
      setNewActDescription('');
      setNewActDate(undefined);
      setNewActTime('');
      setNewActDuration('');
      setNewActChild('');
      setNewActIsRecurring(false);
      setNewActRecurrenceEndDate(undefined);
      setShowAddActivity(false);
    }
  };

  const handleEditMedication = (medId: string) => {
    const medication = medications.find(m => m.id === medId);
    if (medication) {
      setEditingMedId(medId);
      setEditRefillDate(medication.nextRefillDate);
      setEditPrescriptionDate(medication.prescriptionEndDate);
      setShowEditMed(true);
    }
  };

  const handleSaveMedication = () => {
    if (editingMedId && editRefillDate && editPrescriptionDate) {
      updateMedication(editingMedId, {
        nextRefillDate: editRefillDate,
        prescriptionEndDate: editPrescriptionDate,
      });
      setShowEditMed(false);
      setEditingMedId(null);
      setEditRefillDate(undefined);
      setEditPrescriptionDate(undefined);
    }
  };

  const handleEditAdminDate = (person: 'Albine' | 'Louis' | 'Yoan' | 'Anna' | 'Tom', field: 'aldEndDate' | 'mdphEndDate' | 'handiCardEndDate') => {
    const doc = adminDocuments.find(d => d.person === person);
    setEditingAdminPerson(person);
    setEditingAdminField(field);
    setEditAdminDate(doc?.[field]);
    setShowAdminDatePicker(true);
  };

  const handleSaveAdminDate = (date?: Date) => {
    const dateToSave = date || editAdminDate;
    if (editingAdminPerson && editingAdminField && dateToSave) {
      updateAdminDocument(editingAdminPerson, {
        [editingAdminField]: dateToSave,
      });
      setShowAdminDatePicker(false);
      setEditingAdminPerson(null);
      setEditingAdminField(null);
      setEditAdminDate(undefined);
    }
  };

  const handleAddAdminTask = () => {
    if (newAdminTaskTitle.trim() && newAdminTaskDeadline) {
      addAdminTask({
        title: newAdminTaskTitle,
        deadline: newAdminTaskDeadline,
        duration: newAdminTaskDuration ? parseInt(newAdminTaskDuration) : undefined,
        completed: false,
      });
      setNewAdminTaskTitle('');
      setNewAdminTaskDeadline(undefined);
      setNewAdminTaskDuration('');
      setShowAddAdminTask(false);
    }
  };

  const handleEditAdminTask = (taskId: string, field: 'deadline' | 'duration') => {
    const task = adminTasks.find(t => t.id === taskId);
    if (!task) return;
    
    setEditingTaskId(taskId);
    setEditingTaskField(field);
    
    if (field === 'deadline') {
      setEditTaskDeadline(task.deadline);
      setShowEditTaskDatePicker(true);
    } else {
      setEditTaskDuration(task.duration?.toString() || '');
      setShowEditAdminTask(true);
    }
  };

  const handleSaveAdminTaskEdit = () => {
    if (!editingTaskId) return;
    
    if (editingTaskField === 'deadline' && editTaskDeadline) {
      updateAdminTask(editingTaskId, { deadline: editTaskDeadline });
      setShowEditTaskDatePicker(false);
    } else if (editingTaskField === 'duration') {
      updateAdminTask(editingTaskId, { 
        duration: editTaskDuration ? parseInt(editTaskDuration) : undefined 
      });
      setShowEditAdminTask(false);
    }
    
    setEditingTaskId(null);
    setEditingTaskField(null);
    setEditTaskDeadline(undefined);
    setEditTaskDuration('');
  };

  // Filtrer uniquement les RDV d'aujourd'hui (sans les occurrences récurrentes)
  const todayAppointmentsCount = appointments.filter(apt => {
    const today = new Date().toDateString();
    return apt.date.toDateString() === today;
  }).length;

  // Calculer les heures hebdomadaires totales
  const calculateWeeklyHours = () => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay()); // Dimanche
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);
    
    let totalMinutes = 0;
    
    // Heures des rendez-vous cette semaine (uniquement ceux de base, les récurrents seront dans l'agenda)
    appointments.forEach(apt => {
      const aptDate = new Date(apt.date);
      if (aptDate >= weekStart && aptDate < weekEnd && apt.duration) {
        totalMinutes += apt.duration;
      }
    });
    
    // Heures des activités enfants cette semaine (uniquement celles de base)
    activities.forEach(act => {
      const actDate = new Date(act.date);
      if (actDate >= weekStart && actDate < weekEnd && act.duration) {
        totalMinutes += act.duration;
      }
    });
    
    // Heures des médicaments (estimé : 2min par prise)
    const dailyMedicationMinutes = medications.reduce((sum, med) => {
      return sum + (med.schedule.length * 2); // 2 minutes par prise
    }, 0);
    totalMinutes += dailyMedicationMinutes * 7; // Semaine complète
    
    // Heures des tâches administratives (basé sur durée ou estimé 30min)
    adminTasks.forEach(task => {
      if (!task.completed) {
        totalMinutes += task.duration || 30;
      }
    });
    
    return (totalMinutes / 60).toFixed(0); // Convertir en heures
  };

  const weeklyHours = calculateWeeklyHours();
  return (
    <SwipeableTabWrapper currentRoute="/(tabs)/family">
    <>
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>👨‍👩‍👧‍👦 Aidant Familial</Title>
        <Paragraph>77h/semaine - Planification famille</Paragraph>
      </View>

      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Title style={styles.cardTitle}>📊 Vue d'ensemble</Title>
          <View style={styles.overviewRow}>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewValue}>{todayAppointmentsCount}</Text>
              <Text style={styles.overviewLabel}>Aujourd'hui</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewValue}>{weeklyHours}h</Text>
              <Text style={styles.overviewLabel}>Cette semaine</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewValue}>{appointments.length}</Text>
              <Text style={styles.overviewLabel}>RDV prévus</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Title style={styles.cardTitle}>👨‍👩‍👧‍👦 Rendez-vous Familiaux</Title>
          
          {appointments.sort((a, b) => a.date.getTime() - b.date.getTime()).map((appointment, index) => (
            <View key={`${appointment.id}-${index}`} style={styles.appointment}>
              <View style={styles.appointmentTime}>
                <Text style={styles.time}>{appointment.time}</Text>
                <Text style={styles.date}>{formatDate(appointment.date)}</Text>
                {appointment.isRecurring && (
                  <Chip icon="repeat" compact style={styles.recurringChip}>
                    Hebdo
                  </Chip>
                )}
                {appointment.duration && (
                  <Chip icon="clock-outline" compact style={styles.durationChipSmall}>
                    {appointment.duration}min
                  </Chip>
                )}
              </View>
              <View style={styles.appointmentDetails}>
                <View style={styles.appointmentHeader}>
                  <Text style={styles.appointmentTitle}>{appointment.title}</Text>
                  <Button
                    mode="text"
                    textColor={colors.error}
                    onPress={() => handleDeleteAppointment(appointment.id, appointment.title)}
                  >
                    Supprimer
                  </Button>
                </View>
                <Paragraph style={styles.cardText}>{appointment.description}</Paragraph>
                <Chip icon="map-marker" compact style={styles.chip}>{appointment.location}</Chip>
              </View>
            </View>
          ))}

          <Button mode="outlined" icon="plus" style={styles.addButton} textColor={colors.gold} onPress={() => setShowAddAppointment(true)}>
            Ajouter un rendez-vous
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Title style={styles.cardTitle}>💊 Médicaments & Traitements</Title>
          
          {medications.map(medication => {
            const daysUntilRefill = getDaysUntil(medication.nextRefillDate);
            const daysUntilPrescription = getDaysUntil(medication.prescriptionEndDate);
            const refillAlert = needsRefillAlert(medication);
            const prescriptionAlert = needsPrescriptionAlert(medication);
            
            return (
            <View key={medication.id} style={styles.medication}>
              <View style={styles.medHeader}>
                <Text style={styles.medName}>{medication.name}</Text>
                <Text style={styles.medPerson}>👤 {medication.person}</Text>
              </View>
              <Paragraph style={styles.cardText}>{medication.schedule.join(' | ')}</Paragraph>
              
              {/* Alertes */}
              <View style={styles.alertsContainer}>
                {refillAlert && (
                  <View style={[styles.alertBadge, styles.alertWarning]}>
                    <Text style={styles.alertText}>
                      🔔 Réappro: {daysUntilRefill} jour{daysUntilRefill > 1 ? 's' : ''}
                    </Text>
                  </View>
                )}
                {prescriptionAlert && (
                  <View style={[styles.alertBadge, styles.alertDanger]}>
                    <Text style={styles.alertText}>
                      ⚠️ Ordonnance: {daysUntilPrescription} jour{daysUntilPrescription > 1 ? 's' : ''}
                    </Text>
                  </View>
                )}
              </View>

              {/* Dates */}
              <View style={styles.datesContainer}>
                <Text style={styles.dateInfo}>
                  📦 Réappro: {medication.nextRefillDate.toLocaleDateString('fr-FR')}
                </Text>
                <Text style={styles.dateInfo}>
                  📋 Ordonnance: {medication.prescriptionEndDate.toLocaleDateString('fr-FR')}
                </Text>
              </View>

              <View style={styles.medActions}>
                <Button
                  mode="outlined"
                  onPress={() => handleEditMedication(medication.id)}
                  style={styles.editButton}
                  textColor={colors.gold}
                >
                  ✏️ Modifier dates
                </Button>
              </View>

              <View style={styles.medStatus}>
                {medication.schedule.map((time, index) => (
                  <Chip
                    key={index}
                    icon={medication.taken[index] ? "check" : "clock"}
                    compact
                    textStyle={styles.chipText}
                    onPress={() => !medication.taken[index] && handleTakeMedication(medication.id, medication.name, index)}
                    disabled={medication.taken[index]}
                    style={medication.taken[index] ? { backgroundColor: colors.success + '40' } : undefined}
                  >
                    {time} {medication.taken[index] ? '✓' : ''}
                  </Chip>
                ))}
              </View>
            </View>
            );
          })}
        </Card.Content>
      </Card>

      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Title style={styles.cardTitle}>📅 Activités Enfants</Title>
          
          {activities.sort((a, b) => a.date.getTime() - b.date.getTime()).map((activity, index) => (
            <View key={`${activity.id}-${index}`} style={styles.activity}>
              <View style={styles.activityHeader}>
                <View style={styles.activityTitleRow}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  {activity.isRecurring && (
                    <Chip icon="repeat" compact style={styles.recurringChip}>
                      Hebdo
                    </Chip>
                  )}
                  {activity.duration && (
                    <Chip icon="clock-outline" compact style={styles.durationChipSmall}>
                      {activity.duration}min
                    </Chip>
                  )}
                </View>
                <Button
                  mode="text"
                  textColor={colors.error}
                  onPress={() => {
                    Alert.alert(
                      'Supprimer l\'activité',
                      `Voulez-vous vraiment supprimer "${activity.title}" ?`,
                      [
                        { text: 'Annuler', style: 'cancel' },
                        { text: 'Supprimer', style: 'destructive', onPress: () => deleteActivity(activity.id) },
                      ]
                    );
                  }}
                >
                  Supprimer
                </Button>
              </View>
              <Paragraph style={styles.cardText}>{activity.description}</Paragraph>
              {activity.time && <Paragraph style={styles.cardText}>🕐 {activity.time}</Paragraph>}
              <Paragraph style={styles.cardText}>👶 {activity.child}</Paragraph>
            </View>
          ))}

          <Button mode="outlined" icon="plus" style={styles.addButton} textColor={colors.gold} onPress={() => setShowAddActivity(true)}>
            Ajouter une activité
          </Button>
        </Card.Content>
      </Card>

      {/* Section Gestion Administrative */}
      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Title style={styles.cardTitle}>📋 Gestion Administrative</Title>
          
          {/* Tâches administratives */}
          <View style={styles.adminTasksSection}>
            <Text style={styles.sectionSubtitle}>Tâches à faire</Text>
            
            {adminTasks.map(task => (
              <View key={task.id} style={styles.adminTask}>
                <View style={styles.adminTaskHeader}>
                  <View style={styles.adminTaskChipContainer}>
                    <Chip
                      icon={task.completed ? "check-circle" : "circle-outline"}
                      selected={task.completed}
                      onPress={() => toggleAdminTask(task.id)}
                      textStyle={task.completed ? styles.checkedText : undefined}
                      style={task.completed ? styles.checkedChip : undefined}
                    >
                      {task.title}
                    </Chip>
                  </View>
                  <Button
                    mode="text"
                    textColor={colors.error}
                    onPress={() => {
                      Alert.alert(
                        'Supprimer la tâche',
                        `Voulez-vous vraiment supprimer "${task.title}" ?`,
                        [
                          { text: 'Annuler', style: 'cancel' },
                          { text: 'Supprimer', style: 'destructive', onPress: () => deleteAdminTask(task.id) },
                        ]
                      );
                    }}
                    compact
                  >
                    Supprimer
                  </Button>
                </View>
                <View style={styles.adminTaskDetails}>
                  <TouchableOpacity onPress={() => handleEditAdminTask(task.id, 'deadline')}>
                    <Text style={styles.adminTaskInfo}>
                      📅 {task.deadline.toLocaleDateString('fr-FR')}
                    </Text>
                  </TouchableOpacity>
                  {task.duration && (
                    <TouchableOpacity onPress={() => handleEditAdminTask(task.id, 'duration')}>
                      <Text style={styles.adminTaskInfo}>⏱️ {task.duration}min</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}

            <Button 
              mode="outlined" 
              icon="plus" 
              style={styles.addButton} 
              textColor={colors.gold} 
              onPress={() => setShowAddAdminTask(true)}
            >
              Ajouter une tâche
            </Button>
          </View>

          {/* Tableau des documents administratifs */}
          <View style={styles.adminTable}>
            <Text style={styles.sectionSubtitle}>Documents administratifs</Text>
            <View style={styles.adminTableHeader}>
              <Text style={[styles.adminHeaderCell, styles.adminNameCell]}>Personne</Text>
              <Text style={styles.adminHeaderCell}>ALD</Text>
              <Text style={styles.adminHeaderCell}>MDPH</Text>
              <Text style={styles.adminHeaderCell}>Carte Handi</Text>
            </View>
            
            {adminDocuments.map(doc => (
              <View key={doc.person} style={styles.adminTableRow}>
                <Text style={[styles.adminCell, styles.adminNameCell, styles.adminPersonName]}>{doc.person}</Text>
                <TouchableOpacity 
                  style={styles.adminCell}
                  onPress={() => handleEditAdminDate(doc.person, 'aldEndDate')}
                >
                  <Text style={styles.adminDateText}>
                    {doc.aldEndDate ? doc.aldEndDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' }) : '-'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.adminCell}
                  onPress={() => handleEditAdminDate(doc.person, 'mdphEndDate')}
                >
                  <Text style={styles.adminDateText}>
                    {doc.mdphEndDate ? doc.mdphEndDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' }) : '-'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.adminCell}
                  onPress={() => handleEditAdminDate(doc.person, 'handiCardEndDate')}
                >
                  <Text style={styles.adminDateText}>
                    {doc.handiCardEndDate ? doc.handiCardEndDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' }) : '-'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* Section Suivi Menstruel */}
      <MenstrualTracking />
    </ScrollView>

    {/* Dialog Ajout Rendez-vous */}
    <Portal>
      <Dialog visible={showAddAppointment} onDismiss={() => setShowAddAppointment(false)} style={styles.dialog}>
        <Dialog.Title style={styles.dialogTitle}>Nouveau Rendez-vous</Dialog.Title>
        <Dialog.ScrollArea>
          <ScrollView>
            <Dialog.Content>
              <TextInput
                label="Titre"
                value={newAppTitle}
                onChangeText={setNewAppTitle}
                mode="outlined"
                style={styles.inputDialog}
                outlineColor={colors.mediumGray}
                activeOutlineColor={colors.gold}
                textColor={colors.white}
              />
              <TextInput
                label="Description"
                value={newAppDescription}
                onChangeText={setNewAppDescription}
                mode="outlined"
                multiline
                numberOfLines={2}
                style={styles.inputDialog}
                outlineColor={colors.mediumGray}
                activeOutlineColor={colors.gold}
                textColor={colors.white}
              />
              
              <Text style={styles.inputLabel}>Date</Text>
              <TouchableOpacity 
                style={styles.dateButton} 
                onPress={() => setShowAppDatePicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  {newAppDate ? newAppDate.toLocaleDateString('fr-FR') : 'Sélectionner une date'}
                </Text>
              </TouchableOpacity>

              <Text style={styles.inputLabel}>Heure</Text>
              <TouchableOpacity 
                style={styles.dateButton} 
                onPress={() => setShowAppTimePicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  {newAppTime}
                </Text>
              </TouchableOpacity>

              <TextInput
                label="Lieu"
                value={newAppLocation}
                onChangeText={setNewAppLocation}
                mode="outlined"
                style={styles.inputDialog}
                outlineColor={colors.mediumGray}
                activeOutlineColor={colors.gold}
                textColor={colors.white}
              />
              <TextInput
                label="Durée (minutes)"
                value={newAppDuration}
                onChangeText={setNewAppDuration}
                mode="outlined"
                keyboardType="numeric"
                placeholder="60"
                style={styles.inputDialog}
                outlineColor={colors.mediumGray}
                activeOutlineColor={colors.gold}
                textColor={colors.white}
              />
              <Text style={styles.statusLabel}>Personne :</Text>
              <View style={styles.statusChips}>
                <Chip selected={newAppPerson === 'Albine'} onPress={() => setNewAppPerson('Albine')}>Albine</Chip>
                <Chip selected={newAppPerson === 'Anna'} onPress={() => setNewAppPerson('Anna')}>Anna</Chip>
                <Chip selected={newAppPerson === 'Yoan'} onPress={() => setNewAppPerson('Yoan')}>Yoan</Chip>
                <Chip selected={newAppPerson === 'Louis'} onPress={() => setNewAppPerson('Louis')}>Louis</Chip>
                <Chip selected={newAppPerson === 'Tom'} onPress={() => setNewAppPerson('Tom')}>Tom</Chip>
                <Chip selected={newAppPerson === 'Moi'} onPress={() => setNewAppPerson('Moi')}>Moi</Chip>
              </View>

              <View style={styles.recurringContainer}>
                <View style={styles.recurringRow}>
                  <Text style={styles.recurringLabel}>Rendez-vous hebdomadaire</Text>
                  <Switch
                    value={newAppIsRecurring}
                    onValueChange={setNewAppIsRecurring}
                    color={colors.gold}
                  />
                </View>
                {newAppIsRecurring && (
                  <>
                    <Text style={styles.inputLabel}>Jusqu'au (optionnel)</Text>
                    <TouchableOpacity 
                      style={styles.dateButton} 
                      onPress={() => setShowAppRecurrenceEndPicker(true)}
                    >
                      <Text style={styles.dateButtonText}>
                        {newAppRecurrenceEndDate ? newAppRecurrenceEndDate.toLocaleDateString('fr-FR') : 'Pas de date de fin'}
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </Dialog.Content>
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button textColor={colors.lightGray} onPress={() => setShowAddAppointment(false)}>Annuler</Button>
          <Button textColor={colors.gold} onPress={handleAddAppointment}>Ajouter</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>

    {/* Dialog Ajout Activité */}
    <Portal>
      <Dialog visible={showAddActivity} onDismiss={() => setShowAddActivity(false)} style={styles.dialog}>
        <Dialog.Title style={styles.dialogTitle}>Nouvelle Activité</Dialog.Title>
        <Dialog.ScrollArea>
          <ScrollView>
            <Dialog.Content>
              <TextInput
                label="Titre"
                value={newActTitle}
                onChangeText={setNewActTitle}
                mode="outlined"
                style={styles.inputDialog}
                outlineColor={colors.mediumGray}
                activeOutlineColor={colors.gold}
                textColor={colors.white}
              />
              <TextInput
                label="Description"
                value={newActDescription}
                onChangeText={setNewActDescription}
                mode="outlined"
                multiline
                numberOfLines={2}
                style={styles.inputDialog}
                outlineColor={colors.mediumGray}
                activeOutlineColor={colors.gold}
                textColor={colors.white}
              />
              
              <Text style={styles.inputLabel}>Date</Text>
              <TouchableOpacity 
                style={styles.dateButton} 
                onPress={() => setShowActDatePicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  {newActDate ? newActDate.toLocaleDateString('fr-FR') : 'Sélectionner une date'}
                </Text>
              </TouchableOpacity>

              <Text style={styles.inputLabel}>Heure (optionnel)</Text>
              <TouchableOpacity 
                style={styles.dateButton} 
                onPress={() => setShowActTimePicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  {newActTime}
                </Text>
              </TouchableOpacity>

              <TextInput
                label="Durée (minutes)"
                value={newActDuration}
                onChangeText={setNewActDuration}
                mode="outlined"
                keyboardType="numeric"
                placeholder="90"
                style={styles.inputDialog}
                outlineColor={colors.mediumGray}
                activeOutlineColor={colors.gold}
                textColor={colors.white}
              />
              <TextInput
                label="Enfant"
                value={newActChild}
                onChangeText={setNewActChild}
                mode="outlined"
                placeholder="Enfant 1"
                style={styles.inputDialog}
                outlineColor={colors.mediumGray}
                activeOutlineColor={colors.gold}
                textColor={colors.white}
              />

              <View style={styles.recurringContainer}>
                <View style={styles.recurringRow}>
                  <Text style={styles.recurringLabel}>Activité hebdomadaire</Text>
                  <Switch
                    value={newActIsRecurring}
                    onValueChange={setNewActIsRecurring}
                    color={colors.gold}
                  />
                </View>
                {newActIsRecurring && (
                  <>
                    <Text style={styles.inputLabel}>Jusqu'au (optionnel)</Text>
                    <TouchableOpacity 
                      style={styles.dateButton} 
                      onPress={() => setShowActRecurrenceEndPicker(true)}
                    >
                      <Text style={styles.dateButtonText}>
                        {newActRecurrenceEndDate ? newActRecurrenceEndDate.toLocaleDateString('fr-FR') : 'Pas de date de fin'}
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </Dialog.Content>
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button textColor={colors.lightGray} onPress={() => setShowAddActivity(false)}>Annuler</Button>
          <Button textColor={colors.gold} onPress={handleAddActivity}>Ajouter</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>

    {/* DatePicker pour Rendez-vous */}
    <DatePickerModal
      locale="fr"
      mode="single"
      visible={showAppDatePicker}
      onDismiss={() => setShowAppDatePicker(false)}
      date={newAppDate}
      onConfirm={(params) => {
        setShowAppDatePicker(false);
        setNewAppDate(params.date);
      }}
      label="Sélectionner une date"
    />

    {/* TimePicker pour Rendez-vous */}
    <TimePickerModal
      locale="fr"
      visible={showAppTimePicker}
      onDismiss={() => setShowAppTimePicker(false)}
      onConfirm={({ hours, minutes }) => {
        setShowAppTimePicker(false);
        setNewAppTime(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
      }}
      hours={parseInt(newAppTime.split(':')[0])}
      minutes={parseInt(newAppTime.split(':')[1])}
      label="Sélectionner une heure"
    />

    {/* DatePicker pour Activité */}
    <DatePickerModal
      locale="fr"
      mode="single"
      visible={showActDatePicker}
      onDismiss={() => setShowActDatePicker(false)}
      date={newActDate}
      onConfirm={(params) => {
        setShowActDatePicker(false);
        setNewActDate(params.date);
      }}
      label="Sélectionner une date"
    />

    {/* TimePicker pour Activité */}
    <TimePickerModal
      locale="fr"
      visible={showActTimePicker}
      onDismiss={() => setShowActTimePicker(false)}
      onConfirm={({ hours, minutes }) => {
        setShowActTimePicker(false);
        setNewActTime(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
      }}
      hours={parseInt(newActTime.split(':')[0])}
      minutes={parseInt(newActTime.split(':')[1])}
      label="Sélectionner une heure"
    />

    {/* DatePicker pour Date de fin de récurrence Rendez-vous */}
    <DatePickerModal
      locale="fr"
      mode="single"
      visible={showAppRecurrenceEndPicker}
      onDismiss={() => setShowAppRecurrenceEndPicker(false)}
      date={newAppRecurrenceEndDate}
      onConfirm={(params) => {
        setShowAppRecurrenceEndPicker(false);
        setNewAppRecurrenceEndDate(params.date);
      }}
      label="Date de fin de récurrence"
    />

    {/* DatePicker pour Date de fin de récurrence Activité */}
    <DatePickerModal
      locale="fr"
      mode="single"
      visible={showActRecurrenceEndPicker}
      onDismiss={() => setShowActRecurrenceEndPicker(false)}
      date={newActRecurrenceEndDate}
      onConfirm={(params) => {
        setShowActRecurrenceEndPicker(false);
        setNewActRecurrenceEndDate(params.date);
      }}
      label="Date de fin de récurrence"
    />

    {/* Dialog pour modifier les dates de médicament */}
    <Portal>
      <Dialog visible={showEditMed} onDismiss={() => setShowEditMed(false)}>
        <Dialog.Title>Modifier les dates</Dialog.Title>
        <Dialog.Content>
          <View style={{ gap: 16 }}>
            <View>
              <Text style={{ color: colors.white, marginBottom: 8 }}>Date de réapprovisionnement</Text>
              <TouchableOpacity
                onPress={() => setShowRefillDatePicker(true)}
                style={styles.dateButton}
              >
                <Text style={styles.dateButtonText}>
                  {editRefillDate ? editRefillDate.toLocaleDateString('fr-FR') : 'Sélectionner'}
                </Text>
              </TouchableOpacity>
            </View>

            <View>
              <Text style={{ color: colors.white, marginBottom: 8 }}>Date de fin d'ordonnance</Text>
              <TouchableOpacity
                onPress={() => setShowPrescriptionDatePicker(true)}
                style={styles.dateButton}
              >
                <Text style={styles.dateButtonText}>
                  {editPrescriptionDate ? editPrescriptionDate.toLocaleDateString('fr-FR') : 'Sélectionner'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setShowEditMed(false)}>Annuler</Button>
          <Button onPress={handleSaveMedication} textColor={colors.gold}>Enregistrer</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>

    {/* DatePicker pour date de réapprovisionnement */}
    <DatePickerModal
      locale="fr"
      mode="single"
      visible={showRefillDatePicker}
      onDismiss={() => setShowRefillDatePicker(false)}
      date={editRefillDate}
      onConfirm={(params) => {
        setShowRefillDatePicker(false);
        setEditRefillDate(params.date);
      }}
      label="Date de réapprovisionnement"
    />

    {/* DatePicker pour date de fin d'ordonnance */}
    <DatePickerModal
      locale="fr"
      mode="single"
      visible={showPrescriptionDatePicker}
      onDismiss={() => setShowPrescriptionDatePicker(false)}
      date={editPrescriptionDate}
      onConfirm={(params) => {
        setShowPrescriptionDatePicker(false);
        setEditPrescriptionDate(params.date);
      }}
      label="Date de fin d'ordonnance"
    />

    {/* DatePicker pour dates administratives */}
    <DatePickerModal
      locale="fr"
      mode="single"
      visible={showAdminDatePicker}
      onDismiss={() => setShowAdminDatePicker(false)}
      date={editAdminDate}
      onConfirm={(params) => {
        handleSaveAdminDate(params.date);
      }}
      label="Modifier la date"
    />

    {/* Dialog pour ajouter une tâche administrative */}
    <Portal>
      <Dialog visible={showAddAdminTask} onDismiss={() => setShowAddAdminTask(false)} style={styles.dialog}>
        <Dialog.Title style={styles.dialogTitle}>Nouvelle tâche administrative</Dialog.Title>
        <Dialog.ScrollArea>
          <ScrollView>
            <Dialog.Content>
              <TextInput
                label="Titre de la tâche"
                value={newAdminTaskTitle}
                onChangeText={setNewAdminTaskTitle}
                style={styles.inputDialog}
                mode="outlined"
                outlineColor={colors.mediumGray}
                activeOutlineColor={colors.gold}
                textColor={colors.white}
              />
              
              <Text style={styles.inputLabel}>Date butoir</Text>
              <TouchableOpacity
                onPress={() => setShowAdminTaskDatePicker(true)}
                style={styles.dateButton}
              >
                <Text style={styles.dateButtonText}>
                  {newAdminTaskDeadline ? newAdminTaskDeadline.toLocaleDateString('fr-FR') : 'Sélectionner une date'}
                </Text>
              </TouchableOpacity>
              
              <TextInput
                label="Durée estimée (minutes)"
                value={newAdminTaskDuration}
                onChangeText={setNewAdminTaskDuration}
                keyboardType="numeric"
                style={styles.inputDialog}
                mode="outlined"
                outlineColor={colors.mediumGray}
                activeOutlineColor={colors.gold}
                textColor={colors.white}
                placeholder="60"
              />
            </Dialog.Content>
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button onPress={() => setShowAddAdminTask(false)} textColor={colors.lightGray}>Annuler</Button>
          <Button onPress={handleAddAdminTask} textColor={colors.gold}>Ajouter</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>

    {/* DatePicker pour date butoir tâche admin */}
    <DatePickerModal
      locale="fr"
      mode="single"
      visible={showAdminTaskDatePicker}
      onDismiss={() => setShowAdminTaskDatePicker(false)}
      date={newAdminTaskDeadline}
      onConfirm={(params) => {
        setShowAdminTaskDatePicker(false);
        setNewAdminTaskDeadline(params.date);
      }}
      label="Date butoir"
    />

    {/* DatePicker pour modifier deadline tâche admin */}
    <DatePickerModal
      locale="fr"
      mode="single"
      visible={showEditTaskDatePicker}
      onDismiss={() => setShowEditTaskDatePicker(false)}
      date={editTaskDeadline}
      onConfirm={(params) => {
        setEditTaskDeadline(params.date);
        handleSaveAdminTaskEdit();
      }}
      label="Modifier la date butoir"
    />

    {/* Dialog pour modifier durée tâche admin */}
    <Portal>
      <Dialog visible={showEditAdminTask} onDismiss={() => setShowEditAdminTask(false)} style={styles.dialog}>
        <Dialog.Title style={styles.dialogTitle}>Modifier la durée</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Durée estimée (minutes)"
            value={editTaskDuration}
            onChangeText={setEditTaskDuration}
            keyboardType="numeric"
            style={styles.inputDialog}
            mode="outlined"
            outlineColor={colors.mediumGray}
            activeOutlineColor={colors.gold}
            textColor={colors.white}
            placeholder="60"
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setShowEditAdminTask(false)} textColor={colors.lightGray}>Annuler</Button>
          <Button onPress={handleSaveAdminTaskEdit} textColor={colors.gold}>Enregistrer</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  </>
  </SwipeableTabWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.almostBlack,
    padding: spacing.md,
  },
  header: {
    marginBottom: spacing.lg,
    paddingTop: spacing.sm,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.gold,
  },
  card: {
    marginBottom: spacing.md,
    backgroundColor: colors.darkGray,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  overviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.sm,
  },
  overviewItem: {
    alignItems: 'center',
  },
  overviewValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.gold,
  },
  overviewLabel: {
    fontSize: 12,
    color: colors.lightGray,
    marginTop: 4,
  },
  appointment: {
    flexDirection: 'row',
    marginVertical: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.mediumGray,
  },
  appointmentTime: {
    marginRight: spacing.md,
    alignItems: 'center',
    minWidth: 60,
  },
  time: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.gold,
  },
  date: {
    fontSize: 12,
    color: colors.lightGray,
  },
  appointmentDetails: {
    flex: 1,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: colors.white,
    flex: 1,
  },
  chip: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
  },
  recurringChip: {
    backgroundColor: colors.gold + '20',
    marginTop: 2,
  },
  addButton: {
    marginTop: spacing.sm,
  },
  medication: {
    marginVertical: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.mediumGray,
  },
  medHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  medName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
  medPerson: {
    fontSize: 14,
    color: colors.gold,
    fontWeight: '600',
  },
  alertsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: spacing.sm,
    flexWrap: 'wrap',
  },
  alertBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  alertWarning: {
    backgroundColor: '#FFA500' + '30',
    borderWidth: 1,
    borderColor: '#FFA500',
  },
  alertDanger: {
    backgroundColor: colors.error + '30',
    borderWidth: 1,
    borderColor: colors.error,
  },
  alertText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '600',
  },
  datesContainer: {
    marginVertical: spacing.xs,
  },
  dateInfo: {
    fontSize: 13,
    color: colors.lightGray,
    marginVertical: 2,
  },
  medActions: {
    marginVertical: spacing.sm,
  },
  editButton: {
    borderColor: colors.gold,
  },
  medStatus: {
    flexDirection: 'row',
    gap: 8,
    marginTop: spacing.sm,
  },
  activity: {
    marginVertical: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.mediumGray,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: colors.white,
  },
  mealPlan: {
    marginTop: spacing.sm,
  },
  meal: {
    fontSize: 14,
    marginVertical: 6,
    paddingLeft: spacing.sm,
    color: colors.lightGray,
  },
  cardTitle: {
    color: colors.gold,
    fontSize: 18,
  },
  cardText: {
    color: colors.lightGray,
  },
  chipText: {
    fontSize: 12,
  },
  addItemForm: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: spacing.md,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: colors.mediumGray,
    color: colors.white,
    padding: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  categoryButton: {
    minWidth: 100,
  },
  categorySection: {
    marginVertical: spacing.sm,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.gold,
    marginBottom: spacing.xs,
  },
  shoppingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  checkedText: {
    textDecorationLine: 'line-through',
    color: colors.lightGray,
  },
  uncheckedText: {
    color: colors.white,
  },
  checkedChip: {
    backgroundColor: colors.success + '40',
  },
  clearButton: {
    marginTop: spacing.md,
  },
  durationChipSmall: {
    backgroundColor: colors.gold + '30',
    marginTop: 4,
  },
  activityTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  dialog: {
    backgroundColor: colors.darkGray,
  },
  dialogTitle: {
    color: colors.gold,
  },
  inputDialog: {
    marginBottom: spacing.md,
    backgroundColor: colors.almostBlack,
  },
  statusLabel: {
    color: colors.white,
    fontSize: 16,
    marginBottom: spacing.sm,
  },
  statusChips: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  inputLabel: {
    color: colors.white,
    fontSize: 14,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  dateButton: {
    backgroundColor: colors.mediumGray,
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gold,
    marginBottom: spacing.md,
  },
  dateButtonText: {
    color: colors.white,
    fontSize: 16,
  },
  adminTable: {
    marginVertical: spacing.md,
  },
  adminTableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.mediumGray + '40',
    padding: spacing.sm,
    borderRadius: 4,
  },
  adminTableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.mediumGray,
    paddingVertical: spacing.sm,
  },
  adminHeaderCell: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.gold,
    textAlign: 'center',
  },
  adminCell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  adminNameCell: {
    flex: 1.2,
    textAlign: 'left',
  },
  adminPersonName: {
    color: colors.white,
    fontWeight: '600',
  },
  adminDateText: {
    color: colors.white,
    fontSize: 12,
  },
  adminTasksSection: {
    marginTop: spacing.lg,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gold,
    marginBottom: spacing.sm,
  },
  adminTask: {
    marginVertical: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.mediumGray,
  },
  adminTaskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  adminTaskChipContainer: {
    flex: 1,
  },
  adminTaskDetails: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  adminTaskInfo: {
    color: colors.lightGray,
    fontSize: 13,
  },
  recurringContainer: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.mediumGray + '40',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gold + '40',
  },
  recurringRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  recurringLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
