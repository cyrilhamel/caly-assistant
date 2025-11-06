import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { colors, spacing, typography } from '@/constants/theme';
import { useHealth } from '@/contexts/HealthContext';
import { useTasks } from '@/contexts/TaskContext';
import { useFamily } from '@/contexts/FamilyContext';
import { useEmpire } from '@/contexts/EmpireContext';
import { useAgenda } from '@/contexts/AgendaContext';
import { SleepDialog } from '@/components/common/SleepDialog';
import { SwipeableTabWrapper } from '@/components/common/SwipeableTabWrapper';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function Dashboard() {
  const { health, updateSleepHours, needsSleepInput, calculateEnergyScore } = useHealth();
  const { tasks } = useTasks();
  const { appointments } = useFamily();
  const { alerts } = useEmpire();
  const { events } = useAgenda();
  const router = useRouter();
  
  const [showSleepDialog, setShowSleepDialog] = useState(false);
  const [sleepDialogShownToday, setSleepDialogShownToday] = useState(false);

  // Vérifier au montage si on doit demander le sommeil (une seule fois par jour)
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    
    if (needsSleepInput() && !sleepDialogShownToday) {
      // Attendre 1 seconde pour laisser l'app se charger
      setTimeout(() => {
        setShowSleepDialog(true);
        setSleepDialogShownToday(true);
      }, 1000);
    }
  }, [needsSleepInput, sleepDialogShownToday]);

  // Recalculer le score d'énergie quand les données changent
  useEffect(() => {
    // Compter les tâches urgentes dans l'agenda aujourd'hui
    const today = new Date();
    const urgentTasksToday = events.filter(e => {
      const eventDate = new Date(e.date);
      return (
        eventDate.toDateString() === today.toDateString() &&
        e.priority === 'urgent' &&
        e.status !== 'completed'
      );
    }).length;

    // Le score sera recalculé dans le contexte avec les nouvelles données
    // (déjà fait automatiquement via updateSleepHours)
  }, [events, appointments, alerts, health.steps, health.workoutProgram]);

  const handleSleepConfirm = (hours: number) => {
    updateSleepHours(hours);
    setShowSleepDialog(false);
    // Ne pas réinitialiser sleepDialogShownToday ici pour éviter de réafficher la popup
  };

  // Calculer la progression du poids depuis le premier historique
  const startWeight = health.weightHistory.length > 0 ? health.weightHistory[0].weight : health.currentWeight;
  const weightLost = startWeight - health.currentWeight;
  const totalToLose = startWeight - health.targetWeight;
  const weightProgress = totalToLose > 0 ? (weightLost / totalToLose) * 100 : 0;

  const todayAppointments = appointments.filter(apt => {
    const today = new Date().toDateString();
    return apt.date.toDateString() === today;
  }).length;

  const criticalAlerts = alerts.filter(a => a.type === 'critical').length;
  
  // Calculer le jour et la date actuels
  const today = new Date();
  const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const currentDay = dayNames[today.getDay()];
  const currentDate = `${currentDay} ${today.getDate()} ${monthNames[today.getMonth()]} ${today.getFullYear()}`;
  
  return (
    <SwipeableTabWrapper currentRoute="/(tabs)">
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Bonjour Cyril ! 👋</Text>
          <Text style={styles.subtitle}>{currentDate}</Text>
        </View>

      <Card style={styles.card} mode="contained">
        <TouchableOpacity onPress={() => router.push('/(tabs)/health')}>
          <Card.Content>
            <Title style={styles.cardTitle}>⚡ Score Énergie</Title>
            <Text style={styles.energyScore}>{health.energyScore}% {health.energyScore >= 70 ? '🟢' : health.energyScore >= 50 ? '🟡' : '🔴'}</Text>
            <Paragraph style={styles.cardText}>
              {health.energyScore >= 70 ? 'Excellent - Continuez !' : health.energyScore >= 50 ? 'Modérée - Pensez à faire une pause' : 'Faible - Repos recommandé'}
            </Paragraph>
            <Paragraph style={styles.sleepInfo}>
              💤 Sommeil : {health.sleepHours}h
            </Paragraph>
            <TouchableOpacity onPress={(e) => { e.stopPropagation(); setShowSleepDialog(true); }}>
              <Text style={styles.updateLink}>Modifier le sommeil</Text>
            </TouchableOpacity>
          </Card.Content>
        </TouchableOpacity>
      </Card>

      <Card style={styles.card} mode="contained">
        <TouchableOpacity onPress={() => router.push('/(tabs)/health')}>
          <Card.Content>
            <Title style={styles.cardTitle}>💪 Objectif Poids</Title>
            <Text style={styles.weightProgress}>
              {health.currentWeight} kg → {health.targetWeight} kg
            </Text>
            <Paragraph style={styles.cardText}>
              -{weightLost.toFixed(1)} kg / -{totalToLose.toFixed(0)} kg ({weightProgress.toFixed(1)}%)
            </Paragraph>
            <Paragraph style={styles.cardText}>
              {weightProgress > 50 ? '🎉 Plus que la moitié !' : weightProgress > 0 ? '💪 Vous êtes sur la bonne voie !' : '🚀 C\'est parti !'}
            </Paragraph>
          </Card.Content>
        </TouchableOpacity>
      </Card>

      <Card style={styles.card} mode="contained">
        <TouchableOpacity onPress={() => router.push('/(tabs)/health')}>
          <Card.Content>
            <Title style={styles.cardTitle}>🏃 Activité du Jour</Title>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{health.steps.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Pas</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{health.caloriesBurned}</Text>
                <Text style={styles.statLabel}>Cal</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{health.activeMinutes}</Text>
                <Text style={styles.statLabel}>Min</Text>
              </View>
            </View>
            <Paragraph style={styles.cardText}>
              Série : {health.streak > 0 ? `🔥 ${health.streak} jour${health.streak > 1 ? 's' : ''}` : 'Commencez aujourd\'hui !'}
            </Paragraph>
          </Card.Content>
        </TouchableOpacity>
      </Card>

      <Card style={styles.card} mode="contained">
        <TouchableOpacity onPress={() => router.push('/(tabs)/family')}>
          <Card.Content>
            <Title style={styles.cardTitle}>👨‍👩‍👧‍👦 Aidant Familial</Title>
            <Text style={styles.careHours}>{todayAppointments > 0 ? `${todayAppointments} RDV aujourd'hui` : 'Aucun RDV prévu'}</Text>
            <Paragraph style={styles.cardText}>77h/semaine planifiées</Paragraph>
          </Card.Content>
        </TouchableOpacity>
      </Card>

      <Card style={styles.card} mode="contained">
        <TouchableOpacity onPress={() => router.push('/(tabs)/empire')}>
          <Card.Content>
            <Title style={styles.cardTitle}>🏰 Empire Digital</Title>
            <Text style={styles.alerts}>
              {criticalAlerts > 0 ? `🔴 ${criticalAlerts} alertes critiques` : alerts.length > 0 ? `🟡 ${alerts.length} alertes` : '🟢 Tout va bien'}
            </Text>
            <Paragraph style={styles.cardText}>
              {criticalAlerts > 0 ? 'Action immédiate requise' : alerts.length > 0 ? 'À surveiller' : 'Systèmes opérationnels'}
            </Paragraph>
          </Card.Content>
        </TouchableOpacity>
      </Card>

      <SleepDialog
        visible={showSleepDialog}
        onDismiss={() => setShowSleepDialog(false)}
        onConfirm={handleSleepConfirm}
      />
    </ScrollView>
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
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.gold,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: colors.lightGray,
  },
  card: {
    marginBottom: spacing.md,
    backgroundColor: colors.darkGray,
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: 12,
  },
  cardTitle: {
    color: colors.gold,
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardText: {
    color: colors.lightGray,
  },
  energyScore: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.white,
    marginVertical: spacing.sm,
  },
  sleepInfo: {
    color: colors.mediumGray,
    fontSize: 14,
    marginTop: 8,
  },
  updateLink: {
    color: colors.gold,
    fontSize: 14,
    marginTop: 8,
    textDecorationLine: 'underline',
  },
  weightProgress: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.gold,
    marginVertical: spacing.sm,
  },
  careHours: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginVertical: spacing.sm,
  },
  alerts: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.error,
    marginVertical: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: spacing.sm,
  },
  statItem: {
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
});
