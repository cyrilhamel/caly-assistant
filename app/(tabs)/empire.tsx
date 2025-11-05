import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, Chip, FAB, Portal, Dialog, TextInput } from 'react-native-paper';
import { colors, spacing } from '@/constants/theme';
import { useEmpire } from '@/contexts/EmpireContext';
import { useState } from 'react';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import { fr, registerTranslation } from 'react-native-paper-dates';
import { useRouter } from 'expo-router';

registerTranslation('fr', fr);

export default function Empire() {
  const router = useRouter();
  const { 
    projects, 
    alerts, 
    empireTasks, 
    notificationRules,
    resolveAlert, 
    dismissAlert, 
    addEmpireTask, 
    updateEmpireTask, 
    deleteEmpireTask,
    startMonitoring, 
    stopMonitoring, 
    isMonitoringActive 
  } = useEmpire();
  
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    date: new Date(),
    time: '14:00',
    duration: 60,
  });
  
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);

  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 60) return `Il y a ${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long',
      day: 'numeric', 
      month: 'long' 
    });
  };

  const openAddDialog = () => {
    setEditingTask(null);
    setTaskForm({
      title: '',
      description: '',
      date: new Date(),
      time: '14:00',
      duration: 60,
    });
    setDialogVisible(true);
  };

  const openEditDialog = (taskId: string) => {
    const task = empireTasks.find(t => t.id === taskId);
    if (task) {
      setEditingTask(taskId);
      setTaskForm({
        title: task.title,
        description: task.description,
        date: task.date,
        time: task.time,
        duration: task.duration || 60,
      });
      setDialogVisible(true);
    }
  };

  const handleSaveTask = () => {
    if (!taskForm.title.trim()) {
      return;
    }

    if (editingTask) {
      updateEmpireTask(editingTask, taskForm);
    } else {
      addEmpireTask(taskForm);
    }
    
    setDialogVisible(false);
  };

  const handleDeleteTask = (taskId: string) => {
    const task = empireTasks.find(t => t.id === taskId);
    Alert.alert(
      'Supprimer la tâche',
      `Voulez-vous vraiment supprimer "${task?.title}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: () => deleteEmpireTask(taskId) },
      ]
    );
  };

  const calculate24hPerformance = () => {
    const now = Date.now();
    const twentyFourHoursAgo = now - (24 * 60 * 60 * 1000);
    
    // Compter les alertes des dernières 24h
    const recentAlerts = alerts.filter(alert => 
      alert.timestamp.getTime() >= twentyFourHoursAgo
    );
    
    // Estimer les requêtes basées sur l'uptime moyen et le nombre de projets
    // Formule : (nombre de projets × checks par projet par heure × 24h) + estimation trafic utilisateurs
    const activeProjects = projects.length;
    const checksPerHour = 20; // Estimation moyenne de vérifications/heure par projet
    const baseRequests = activeProjects * checksPerHour * 24;
    
    // Ajouter une estimation de trafic utilisateur basée sur le status des projets
    const userTrafficMultiplier = projects.reduce((sum, p) => {
      // Projets opérationnels = plus de trafic
      return sum + (p.status === 'operational' ? 1.5 : 0.8);
    }, 0);
    
    const estimatedTotalRequests = Math.floor(baseRequests * userTrafficMultiplier);
    
    // Compter les erreurs : alertes critiques = 5 erreurs, warnings = 2 erreurs
    const criticalErrors = recentAlerts.filter(a => a.type === 'critical').length * 5;
    const warningErrors = recentAlerts.filter(a => a.type === 'warning').length * 2;
    const totalErrors = criticalErrors + warningErrors;
    
    // Calculer le taux d'erreur
    const errorRate = estimatedTotalRequests > 0 
      ? ((totalErrors / estimatedTotalRequests) * 100).toFixed(2)
      : '0.00';
    
    return {
      totalRequests: estimatedTotalRequests.toLocaleString('fr-FR'),
      errors: totalErrors,
      errorRate: `${errorRate}%`,
    };
  };

  const performance24h = calculate24hPerformance();

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return '📧';
      case 'sms': return '💬';
      case 'push': return '🔔';
      case 'call': return '📞';
      default: return '🔔';
    }
  };

  const getChannelLabel = (channel: string) => {
    switch (channel) {
      case 'email': return 'Email';
      case 'sms': return 'SMS';
      case 'push': return 'Push';
      case 'call': return 'Appel';
      default: return channel;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>💼 Empire Digital</Title>
        <Paragraph>Monitoring clients & projets</Paragraph>
        
        <View style={styles.monitoringControls}>
          <Button
            mode={isMonitoringActive ? 'contained' : 'outlined'}
            icon={isMonitoringActive ? 'pause' : 'play'}
            onPress={isMonitoringActive ? stopMonitoring : startMonitoring}
            buttonColor={isMonitoringActive ? colors.success : colors.gold}
            textColor={isMonitoringActive ? colors.white : colors.gold}
            style={styles.monitoringButton}
          >
            {isMonitoringActive ? 'Monitoring Actif' : 'Démarrer Monitoring'}
          </Button>
          <Button
            mode="text"
            icon="cog"
            onPress={() => router.push('/settings')}
            textColor={colors.gold}
            compact
          >
            Config
          </Button>
          {isMonitoringActive && (
            <Chip icon="check-circle" selectedColor={colors.success} style={styles.statusChip}>
              En ligne
            </Chip>
          )}
        </View>
      </View>

      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Title style={styles.cardTitle}>🚨 Alertes en Temps Réel</Title>
          
          {alerts.length === 0 ? (
            <Paragraph style={styles.cardText}>✅ Aucune alerte - Tout fonctionne parfaitement !</Paragraph>
          ) : (
            alerts.map(alert => (
              <View key={alert.id} style={[styles.alert, alert.type === 'critical' ? styles.criticalAlert : styles.warningAlert]}>
                <View style={styles.alertHeader}>
                  <Text style={styles.alertIcon}>{alert.type === 'critical' ? '�' : '�🟡'}</Text>
                  <Text style={styles.alertTitle}>{alert.title}</Text>
                </View>
                <Paragraph style={styles.cardText}>{alert.description}</Paragraph>
                <Paragraph style={styles.alertTime}>{formatTimeAgo(alert.timestamp)}</Paragraph>
                <View style={styles.alertActions}>
                  <Button 
                    mode="contained" 
                    buttonColor={alert.type === 'critical' ? colors.error : colors.warning}
                    style={styles.alertButton}
                    onPress={() => resolveAlert(alert.id)}
                  >
                    Résoudre
                  </Button>
                  <Button 
                    mode="outlined" 
                    style={styles.alertButton}
                    onPress={() => dismissAlert(alert.id)}
                  >
                    Ignorer
                  </Button>
                </View>
              </View>
            ))
          )}
        </Card.Content>
      </Card>

      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Title style={styles.cardTitle}>📊 Vue d'ensemble Projets</Title>
          
          {projects.map(project => (
            <View key={project.id} style={styles.project}>
              <View style={styles.projectHeader}>
                <Text style={styles.projectName}>{project.name}</Text>
                <Chip 
                  icon={project.status === 'operational' ? 'check-circle' : 'alert'} 
                  textStyle={project.status === 'operational' ? styles.statusOk : styles.statusWarning}
                >
                  {project.status === 'operational' ? 'Opérationnel' : 'Attention'}
                </Chip>
              </View>
              <View style={styles.projectStats}>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{project.uptime}%</Text>
                  <Text style={styles.statLabel}>Uptime</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{project.responseTime}s</Text>
                  <Text style={styles.statLabel}>Réponse</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={[styles.statValue, project.alerts > 0 && { color: colors.error }]}>
                    {project.alerts}
                  </Text>
                  <Text style={styles.statLabel}>Alertes</Text>
                </View>
              </View>
            </View>
          ))}
        </Card.Content>
      </Card>

      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Title style={styles.cardTitle}>📈 Performance 24h</Title>
          <View style={styles.performanceContainer}>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceLabel}>Requêtes totales</Text>
              <Text style={styles.performanceValue}>{performance24h.totalRequests}</Text>
            </View>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceLabel}>Erreurs</Text>
              <Text style={[styles.performanceValue, styles.errorValue]}>{performance24h.errors}</Text>
            </View>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceLabel}>Taux d'erreur</Text>
              <Text style={styles.performanceValue}>{performance24h.errorRate}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Title style={styles.cardTitle}>🔔 Notifications Configurées</Title>
          
          {notificationRules.length === 0 ? (
            <Paragraph style={styles.cardText}>Aucune règle de notification configurée</Paragraph>
          ) : (
            notificationRules.map(rule => (
              <View key={rule.id} style={styles.notification}>
                <View style={styles.notificationHeader}>
                  <View style={styles.notificationTitleContainer}>
                    <Text style={styles.notifTitle}>
                      {rule.enabled ? '✅' : '⏸️'} {rule.title}
                    </Text>
                  </View>
                </View>
                <Paragraph style={styles.notifDescription}>{rule.description}</Paragraph>
                <View style={styles.notificationChannels}>
                  {rule.channels.map((channel, idx) => (
                    <Chip 
                      key={idx} 
                      icon={() => <Text>{getChannelIcon(channel)}</Text>}
                      style={styles.channelChip}
                      textStyle={styles.channelText}
                    >
                      {getChannelLabel(channel)}
                    </Chip>
                  ))}
                </View>
              </View>
            ))
          )}
          
          <Button 
            mode="outlined" 
            icon="bell-plus" 
            style={styles.addButton}
            onPress={() => router.push('/settings')}
          >
            Ajouter une règle
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Title style={styles.cardTitle}>📅 Tâches à venir</Title>
          
          {empireTasks.length === 0 ? (
            <Paragraph style={styles.cardText}>Aucune tâche planifiée</Paragraph>
          ) : (
            empireTasks.map(task => (
              <View key={task.id} style={styles.empireTask}>
                <View style={styles.empireTaskHeader}>
                  <View style={styles.empireTaskTitleContainer}>
                    <Text style={styles.taskTitle}>{task.title}</Text>
                  </View>
                  <Button
                    mode="text"
                    textColor={colors.error}
                    onPress={() => handleDeleteTask(task.id)}
                    compact
                  >
                    Supprimer
                  </Button>
                </View>
                <Paragraph style={styles.cardText}>
                  {formatDate(task.date)} - {task.time}
                  {task.duration && ` (${task.duration} min)`}
                </Paragraph>
                {task.description && (
                  <Paragraph style={styles.taskDescription}>{task.description}</Paragraph>
                )}
                <Button
                  mode="outlined"
                  icon="pencil"
                  style={styles.editButton}
                  onPress={() => openEditDialog(task.id)}
                  compact
                >
                  Modifier
                </Button>
              </View>
            ))
          )}
          
          <Button 
            mode="contained" 
            icon="plus" 
            style={styles.addTaskButton}
            buttonColor={colors.gold}
            textColor={colors.almostBlack}
            onPress={openAddDialog}
          >
            Ajouter une tâche
          </Button>
        </Card.Content>
      </Card>

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)} style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>
            {editingTask ? 'Modifier la tâche' : 'Nouvelle tâche'}
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Titre"
              value={taskForm.title}
              onChangeText={(text) => setTaskForm({ ...taskForm, title: text })}
              style={styles.input}
              mode="outlined"
              outlineColor={colors.gold}
              activeOutlineColor={colors.gold}
              textColor={colors.white}
            />
            
            <TextInput
              label="Description"
              value={taskForm.description}
              onChangeText={(text) => setTaskForm({ ...taskForm, description: text })}
              style={styles.input}
              mode="outlined"
              outlineColor={colors.gold}
              activeOutlineColor={colors.gold}
              textColor={colors.white}
              multiline
              numberOfLines={3}
            />

            <Button
              mode="outlined"
              onPress={() => setDatePickerVisible(true)}
              style={styles.dateButton}
              icon="calendar"
            >
              {formatDate(taskForm.date)}
            </Button>

            <Button
              mode="outlined"
              onPress={() => setTimePickerVisible(true)}
              style={styles.dateButton}
              icon="clock"
            >
              {taskForm.time}
            </Button>

            <TextInput
              label="Durée (minutes)"
              value={taskForm.duration.toString()}
              onChangeText={(text) => setTaskForm({ ...taskForm, duration: parseInt(text) || 0 })}
              style={styles.input}
              mode="outlined"
              outlineColor={colors.gold}
              activeOutlineColor={colors.gold}
              textColor={colors.white}
              keyboardType="numeric"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)} textColor={colors.lightGray}>
              Annuler
            </Button>
            <Button onPress={handleSaveTask} textColor={colors.gold}>
              {editingTask ? 'Modifier' : 'Ajouter'}
            </Button>
          </Dialog.Actions>
        </Dialog>

        <DatePickerModal
          locale="fr"
          mode="single"
          visible={datePickerVisible}
          onDismiss={() => setDatePickerVisible(false)}
          date={taskForm.date}
          onConfirm={({ date }) => {
            setDatePickerVisible(false);
            if (date) {
              setTaskForm({ ...taskForm, date });
            }
          }}
        />

        <TimePickerModal
          locale="fr"
          visible={timePickerVisible}
          onDismiss={() => setTimePickerVisible(false)}
          onConfirm={({ hours, minutes }) => {
            setTimePickerVisible(false);
            setTaskForm({ 
              ...taskForm, 
              time: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}` 
            });
          }}
          hours={parseInt(taskForm.time.split(':')[0])}
          minutes={parseInt(taskForm.time.split(':')[1])}
        />
      </Portal>
    </ScrollView>
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
  monitoringControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  monitoringButton: {
    flex: 1,
  },
  statusChip: {
    backgroundColor: colors.mediumGray,
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
  alert: {
    padding: spacing.sm,
    borderRadius: 8,
    marginVertical: spacing.sm,
    backgroundColor: colors.mediumGray,
  },
  criticalAlert: {
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  warningAlert: {
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  alertIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
  alertTime: {
    fontSize: 12,
    color: colors.lightGray,
    fontStyle: 'italic',
    marginTop: 4,
  },
  alertButton: {
    marginTop: spacing.sm,
    marginRight: spacing.sm,
  },
  alertActions: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  project: {
    marginVertical: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.mediumGray,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  projectName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
  statusOk: {
    color: colors.success,
  },
  statusWarning: {
    color: colors.warning,
  },
  projectStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.gold,
  },
  statLabel: {
    fontSize: 12,
    color: colors.lightGray,
    marginTop: 4,
  },
  performanceContainer: {
    marginTop: spacing.sm,
  },
  performanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.mediumGray,
  },
  performanceLabel: {
    fontSize: 14,
    color: colors.lightGray,
  },
  performanceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
  errorValue: {
    color: colors.error,
  },
  notification: {
    marginVertical: spacing.sm,
    paddingLeft: spacing.sm,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  notificationTitleContainer: {
    flex: 1,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
    color: colors.white,
  },
  notifDescription: {
    color: colors.lightGray,
    fontSize: 13,
    marginBottom: spacing.sm,
  },
  notificationChannels: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  channelChip: {
    backgroundColor: colors.mediumGray,
    marginRight: spacing.xs,
  },
  channelText: {
    fontSize: 12,
    color: colors.white,
  },
  addButton: {
    marginTop: spacing.sm,
  },
  empireTask: {
    marginVertical: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.mediumGray,
    borderRadius: 8,
  },
  empireTaskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
    gap: spacing.sm,
  },
  empireTaskTitleContainer: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
    color: colors.white,
  },
  taskDescription: {
    color: colors.lightGray,
    fontSize: 13,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  editButton: {
    marginTop: spacing.sm,
  },
  addTaskButton: {
    marginTop: spacing.md,
  },
  dialog: {
    backgroundColor: colors.darkGray,
  },
  dialogTitle: {
    color: colors.gold,
  },
  input: {
    marginBottom: spacing.sm,
    backgroundColor: colors.mediumGray,
  },
  dateButton: {
    marginBottom: spacing.sm,
    borderColor: colors.gold,
  },
  cardTitle: {
    color: colors.gold,
    fontSize: 18,
  },
  cardText: {
    color: colors.lightGray,
  },
});
