import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, ProgressBar, Portal, Dialog, TextInput, Chip } from 'react-native-paper';
import { colors, spacing } from '@/constants/theme';
import { useHealth } from '@/contexts/HealthContext';
import { usePedometer } from '@/hooks/usePedometer';
import { useState, useEffect } from 'react';

export default function Health() {
  const { health, completeWorkout, addWeightEntry, skipWorkout, getTodayProgram, completeExercise, updateSteps } = useHealth();
  const { isPedometerAvailable, currentSteps } = usePedometer();
  const [isWorkoutRunning, setIsWorkoutRunning] = useState(false);
  const [showWeightDialog, setShowWeightDialog] = useState(false);
  const [newWeight, setNewWeight] = useState(health.currentWeight.toString());
  const [showStepsDialog, setShowStepsDialog] = useState(false);
  const [newSteps, setNewSteps] = useState(health.steps.toString());

  // Synchroniser automatiquement les pas du podomètre
  useEffect(() => {
    if (isPedometerAvailable && currentSteps > 0) {
      // Ajouter les pas détectés depuis le lancement de l'app
      updateSteps(health.steps + currentSteps);
    }
  }, [currentSteps, isPedometerAvailable]);

  const startWeight = health.weightHistory.length > 0 ? health.weightHistory[0].weight : health.currentWeight;
  const weightProgress = (startWeight - health.currentWeight) / (startWeight - health.targetWeight);

  const todayProgram = getTodayProgram();
  const completedExercises = todayProgram.exercises.filter(e => e.completed).length;
  const totalExercises = todayProgram.exercises.length;
  
  const currentLevel = health.currentWeek >= 5 ? 'Avancé' : health.currentWeek >= 3 ? 'Intermédiaire' : 'Débutant';
  const nextLevelWeek = health.currentWeek < 3 ? 3 : health.currentWeek < 5 ? 5 : null;

  const handleStartWorkout = () => {
    if (completedExercises === totalExercises) {
      Alert.alert('Session terminée !', 'Tous les exercices sont déjà complétés. Bravo ! 🎉');
      return;
    }

    Alert.alert(
      'Démarrer la session',
      `Voulez-vous lancer "${todayProgram.title}" (${todayProgram.duration} min) ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Démarrer',
          onPress: () => {
            setIsWorkoutRunning(true);
            setTimeout(() => {
              completeWorkout();
              setIsWorkoutRunning(false);
              Alert.alert('Bravo ! 🎉', `Session "${todayProgram.title}" terminée ! +${todayProgram.duration} min d'activité`);
            }, 2000);
          },
        },
      ]
    );
  };

  const handleSkipWorkout = () => {
    Alert.alert(
      'Reporter la séance',
      'Vous n\'êtes pas disponible aujourd\'hui ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Reporter',
          onPress: () => {
            skipWorkout();
            Alert.alert('Séance reportée', 'Pas de souci ! On reprend demain 💪');
          },
        },
      ]
    );
  };

  const handleAddWeight = () => {
    const weight = parseFloat(newWeight);
    if (weight > 0 && weight < 200) {
      const oldWeight = health.currentWeight;
      addWeightEntry(weight);
      
      // Vérifier si un milestone a été atteint
      const achievedMilestone = health.milestones.find(m => !m.achieved && weight <= m.weight && oldWeight > m.weight);
      
      if (achievedMilestone) {
        Alert.alert('🎉 Objectif atteint !', `Félicitations ! Vous avez atteint les ${achievedMilestone.weight} kg !`);
      }
      
      setShowWeightDialog(false);
    }
  };

  const handleUpdateSteps = () => {
    const steps = parseInt(newSteps);
    if (steps >= 0 && steps <= 100000) {
      updateSteps(steps);
      setShowStepsDialog(false);
      Alert.alert('✅ Pas mis à jour', `${steps.toLocaleString()} pas enregistrés !`);
    }
  };

  const nextMilestone = health.milestones.find(m => !m.achieved);

  return (
    <>
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>💪 Coach Sportif</Title>
        <Paragraph>Objectif : -25kg avec programmes adaptés</Paragraph>
      </View>

      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Title style={styles.cardTitle}>📊 Progression Poids</Title>
          <Text style={styles.weightCurrent}>Actuel : {health.currentWeight} kg</Text>
          <Text style={styles.weightTarget}>Objectif final : {health.targetWeight} kg</Text>
          {nextMilestone && (
            <Text style={styles.nextMilestone}>Prochain palier : {nextMilestone.weight} kg</Text>
          )}
          <ProgressBar progress={weightProgress} color={colors.gold} style={styles.progressBar} />
          <Text style={styles.progressText}>
            -{(startWeight - health.currentWeight).toFixed(1)} kg / -{(startWeight - health.targetWeight).toFixed(1)} kg ({(weightProgress * 100).toFixed(1)}%)
          </Text>
          <Button 
            mode="outlined" 
            icon="scale"
            style={styles.weightButton}
            textColor={colors.gold}
            onPress={() => setShowWeightDialog(true)}
          >
            Enregistrer mon poids
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Title style={styles.cardTitle}>🎯 Objectifs Intermédiaires</Title>
          <View style={styles.milestones}>
            {health.milestones.map((milestone, index) => (
              <View key={index} style={styles.milestoneItem}>
                <Chip
                  icon={milestone.achieved ? "check-circle" : "target"}
                  style={milestone.achieved ? styles.achievedMilestone : styles.pendingMilestone}
                  textStyle={milestone.achieved ? { color: colors.black } : undefined}
                >
                  {milestone.weight} kg
                </Chip>
                {milestone.achieved && milestone.achievedDate && (
                  <Text style={styles.achievedDate}>
                    {new Date(milestone.achievedDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </Text>
                )}
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Title style={styles.cardTitle}>📈 Historique</Title>
          {health.weightHistory.slice(-5).reverse().map((entry, index) => (
            <View key={index} style={styles.historyEntry}>
              <Text style={styles.historyDate}>
                {new Date(entry.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
              </Text>
              <Text style={styles.historyWeight}>{entry.weight} kg</Text>
              {index < health.weightHistory.length - 1 && (
                <Text style={[
                  styles.historyDiff,
                  entry.weight < health.weightHistory[health.weightHistory.length - index - 2].weight 
                    ? styles.historyPositive 
                    : styles.historyNegative
                ]}>
                  {(entry.weight - health.weightHistory[health.weightHistory.length - index - 2].weight).toFixed(1)} kg
                </Text>
              )}
            </View>
          ))}
        </Card.Content>
      </Card>

      <Card style={styles.card} mode="contained">
        <Card.Content>
          <View style={styles.programHeader}>
            <View style={{ flex: 1 }}>
              <Title style={styles.cardTitle}>🏃 {todayProgram.title}</Title>
              <Text style={styles.programMeta}>
                ⏱️ {todayProgram.duration} min • 
                {todayProgram.weatherDependent && ' ☁️ Selon météo • '}
                🎯 {todayProgram.difficulty}
              </Text>
            </View>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>S{health.currentWeek}</Text>
              <Text style={styles.levelLabel}>{currentLevel}</Text>
            </View>
          </View>

          {nextLevelWeek && (
            <Text style={styles.progressionInfo}>
              📈 Passage au niveau suivant à la semaine {nextLevelWeek} !
            </Text>
          )}

          {todayProgram.equipment.length > 0 && (
            <View style={styles.equipment}>
              <Text style={styles.equipmentTitle}>Matériel : </Text>
              {todayProgram.equipment.map((item, index) => (
                <Chip key={index} compact style={styles.equipmentChip}>{item}</Chip>
              ))}
            </View>
          )}

          <ProgressBar 
            progress={totalExercises > 0 ? completedExercises / totalExercises : 0} 
            color={colors.gold} 
            style={styles.progressBar} 
          />
          <Text style={styles.progressText}>
            {completedExercises}/{totalExercises} exercices complétés
          </Text>
          
          <View style={styles.exerciseList}>
            {todayProgram.exercises.map((exercise, index) => (
              <View key={index} style={styles.exerciseItem}>
                <View style={styles.exerciseHeader}>
                  <Text style={[styles.exercise, exercise.completed && styles.exerciseCompleted]}>
                    {exercise.completed ? '✅' : '⏱️'} {exercise.name}
                  </Text>
                  {!exercise.completed && (
                    <Button
                      mode="text"
                      compact
                      textColor={colors.gold}
                      onPress={() => completeExercise(index)}
                    >
                      Fait
                    </Button>
                  )}
                </View>
                <Text style={styles.exerciseDetails}>
                  {exercise.duration && `${exercise.duration} min`}
                  {exercise.sets && ` • ${exercise.sets} séries`}
                  {exercise.reps && ` de ${exercise.reps} reps`}
                </Text>
                <Text style={styles.exerciseDescription}>{exercise.description}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.workoutButtons}>
            <Button 
              mode="contained" 
              icon={isWorkoutRunning ? "loading" : "play"}
              style={[styles.button, { flex: 1, marginRight: 8 }]}
              buttonColor={colors.gold}
              textColor={colors.black}
              onPress={handleStartWorkout}
              disabled={isWorkoutRunning}
            >
              {isWorkoutRunning ? 'En cours...' : 'Commencer'}
            </Button>
            <Button 
              mode="outlined" 
              icon="calendar-remove"
              style={{ flex: 1 }}
              textColor={colors.lightGray}
              onPress={handleSkipWorkout}
            >
              Reporter
            </Button>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Title style={styles.cardTitle}>🔥 Calories & Activité</Title>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{health.caloriesBurned.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Cal. brûlées</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{health.steps.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Pas</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{health.activeMinutes} min</Text>
              <Text style={styles.statLabel}>Actif</Text>
            </View>
          </View>
          <Button 
            mode="outlined" 
            icon="walk"
            style={styles.updateButton}
            textColor={colors.gold}
            onPress={() => setShowStepsDialog(true)}
          >
            {isPedometerAvailable ? '✅ Podomètre actif • Mettre à jour' : 'Mettre à jour mes pas'}
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Title style={styles.cardTitle}>📅 Historique Semaine</Title>
          <View style={styles.weekHistory}>
            {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day, index) => {
              const isToday = index === new Date().getDay();
              const isDone = health.weekHistory[index];
              return (
                <View key={day} style={[styles.dayCard, isToday && styles.todayCard]}>
                  <Text style={styles.day}>{day}</Text>
                  <Text style={styles.dayStatus}>
                    {isDone ? '✅' : isToday ? '⏳' : '-'}
                  </Text>
                </View>
              );
            })}
          </View>
          <Paragraph style={styles.streak}>
            {health.streak > 0 ? `🔥 Série de ${health.streak} jour${health.streak > 1 ? 's' : ''} !` : '💪 Commence ta série aujourd\'hui !'}
          </Paragraph>
        </Card.Content>
      </Card>
    </ScrollView>

    <Portal>
      <Dialog visible={showWeightDialog} onDismiss={() => setShowWeightDialog(false)} style={styles.dialog}>
        <Dialog.Title style={styles.dialogTitle}>Enregistrer mon poids</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Poids (kg)"
            value={newWeight}
            onChangeText={setNewWeight}
            keyboardType="decimal-pad"
            mode="outlined"
            style={styles.input}
            outlineColor={colors.mediumGray}
            activeOutlineColor={colors.gold}
            textColor={colors.white}
          />
          <Text style={styles.inputHint}>Dernier poids : {health.currentWeight} kg</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button textColor={colors.lightGray} onPress={() => setShowWeightDialog(false)}>
            Annuler
          </Button>
          <Button textColor={colors.gold} onPress={handleAddWeight}>
            Enregistrer
          </Button>
        </Dialog.Actions>
      </Dialog>

      <Dialog visible={showStepsDialog} onDismiss={() => setShowStepsDialog(false)} style={styles.dialog}>
        <Dialog.Title style={styles.dialogTitle}>Mes pas du jour</Dialog.Title>
        <Dialog.Content>
          {isPedometerAvailable ? (
            <Text style={styles.inputHint}>
              ✅ Podomètre détecté ! Les pas sont comptés pendant que l'app est ouverte.
              {'\n\n'}
              💡 Pour un suivi complet de la journée, consultez votre app de santé (Google Fit, Samsung Health, etc.) et saisissez le total :
            </Text>
          ) : (
            <Text style={styles.inputHint}>
              📱 Consultez votre app de santé (Google Fit, Samsung Health, etc.) pour récupérer votre nombre de pas du jour
            </Text>
          )}
          <TextInput
            label="Nombre de pas"
            value={newSteps}
            onChangeText={setNewSteps}
            keyboardType="number-pad"
            mode="outlined"
            style={styles.input}
            outlineColor={colors.mediumGray}
            activeOutlineColor={colors.gold}
            textColor={colors.white}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button textColor={colors.lightGray} onPress={() => setShowStepsDialog(false)}>
            Annuler
          </Button>
          <Button textColor={colors.gold} onPress={handleUpdateSteps}>
            Mettre à jour
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
    </>
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
  weightCurrent: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: spacing.sm,
    color: colors.white,
  },
  weightTarget: {
    fontSize: 16,
    color: colors.lightGray,
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginVertical: spacing.sm,
    backgroundColor: colors.mediumGray,
  },
  progressText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: colors.gold,
    marginTop: 4,
  },
  programHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  levelBadge: {
    backgroundColor: colors.gold,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 60,
  },
  levelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
  },
  levelLabel: {
    fontSize: 10,
    color: colors.black,
    marginTop: 2,
  },
  progressionInfo: {
    fontSize: 12,
    color: colors.gold,
    fontStyle: 'italic',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  programMeta: {
    fontSize: 12,
    color: colors.lightGray,
    marginTop: 4,
  },
  equipment: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  equipmentTitle: {
    fontSize: 12,
    color: colors.lightGray,
    marginRight: 8,
  },
  equipmentChip: {
    marginRight: 4,
    marginBottom: 4,
  },
  programTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: spacing.sm,
    color: colors.white,
  },
  exerciseList: {
    marginVertical: spacing.sm,
  },
  exerciseItem: {
    marginVertical: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.mediumGray,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exercise: {
    fontSize: 14,
    marginVertical: 2,
    color: colors.white,
    fontWeight: 'bold',
  },
  exerciseCompleted: {
    color: colors.lightGray,
    textDecorationLine: 'line-through',
  },
  exerciseDetails: {
    fontSize: 12,
    color: colors.gold,
    marginTop: 2,
  },
  exerciseDescription: {
    fontSize: 12,
    color: colors.lightGray,
    marginTop: 4,
    paddingLeft: spacing.sm,
  },
  workoutButtons: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },
  button: {
    marginTop: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.sm,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.gold,
  },
  statLabel: {
    fontSize: 12,
    color: colors.lightGray,
    marginTop: 4,
  },
  updateButton: {
    marginTop: spacing.md,
  },
  weekHistory: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  dayCard: {
    alignItems: 'center',
    padding: spacing.sm,
    backgroundColor: colors.mediumGray,
    borderRadius: 8,
    minWidth: 40,
  },
  todayCard: {
    backgroundColor: colors.gold + '40',
    borderWidth: 2,
    borderColor: colors.gold,
  },
  day: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.white,
  },
  dayStatus: {
    fontSize: 20,
    marginTop: 4,
  },
  streak: {
    textAlign: 'center',
    marginTop: spacing.sm,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.gold,
  },
  cardTitle: {
    color: colors.gold,
    fontSize: 18,
  },
  weightButton: {
    marginTop: spacing.md,
  },
  nextMilestone: {
    fontSize: 14,
    color: colors.gold,
    fontStyle: 'italic',
    marginTop: 4,
  },
  milestones: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: spacing.sm,
  },
  milestoneItem: {
    alignItems: 'center',
  },
  achievedMilestone: {
    backgroundColor: colors.gold,
  },
  pendingMilestone: {
    backgroundColor: colors.mediumGray,
  },
  achievedDate: {
    fontSize: 10,
    color: colors.lightGray,
    marginTop: 4,
  },
  historyEntry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.mediumGray,
  },
  historyDate: {
    fontSize: 14,
    color: colors.lightGray,
    flex: 1,
  },
  historyWeight: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
    flex: 1,
    textAlign: 'center',
  },
  historyDiff: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  historyPositive: {
    color: colors.success,
  },
  historyNegative: {
    color: colors.error,
  },
  dialog: {
    backgroundColor: colors.darkGray,
  },
  dialogTitle: {
    color: colors.gold,
  },
  input: {
    marginBottom: spacing.sm,
    backgroundColor: colors.almostBlack,
  },
  inputHint: {
    fontSize: 12,
    color: colors.lightGray,
    marginTop: spacing.sm,
  },
});
