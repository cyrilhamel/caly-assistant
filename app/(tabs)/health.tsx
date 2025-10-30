import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, ProgressBar } from 'react-native-paper';
import { colors, spacing } from '@/constants/theme';

export default function Health() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>💪 Coach Sportif</Title>
        <Paragraph>Objectif : -25kg avec programmes adaptés</Paragraph>
      </View>

      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Title style={styles.cardTitle}>📊 Progression Poids</Title>
          <Text style={styles.weightCurrent}>Actuel : 97.8 kg</Text>
          <Text style={styles.weightTarget}>Objectif : 75 kg</Text>
          <ProgressBar progress={0.128} color="#4CAF50" style={styles.progressBar} />
          <Text style={styles.progressText}>-3.2 kg / -25 kg (12.8%)</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Title style={styles.cardTitle}>🏃 Programme du Jour</Title>
          <Paragraph style={styles.programTitle}>Session Cardio Léger - 15 min</Paragraph>
          
          <View style={styles.exerciseList}>
            <Text style={styles.exercise}>✓ Échauffement - 3 min</Text>
            <Text style={styles.exercise}>• Marche rapide - 5 min</Text>
            <Text style={styles.exercise}>• Exercices bras - 4 min</Text>
            <Text style={styles.exercise}>• Étirements - 3 min</Text>
          </View>
          
          <Button 
            mode="contained" 
            icon="play" 
            style={styles.button}
            buttonColor="#6200EE"
          >
            Démarrer la session
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Title style={styles.cardTitle}>🔥 Calories & Activité</Title>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>1,850</Text>
              <Text style={styles.statLabel}>Cal. brûlées</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>4,200</Text>
              <Text style={styles.statLabel}>Pas</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>35 min</Text>
              <Text style={styles.statLabel}>Actif</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Title style={styles.cardTitle}>📅 Historique Semaine</Title>
          <View style={styles.weekHistory}>
            <View style={styles.dayCard}>
              <Text style={styles.day}>Lun</Text>
              <Text style={styles.dayStatus}>✅</Text>
            </View>
            <View style={styles.dayCard}>
              <Text style={styles.day}>Mar</Text>
              <Text style={styles.dayStatus}>✅</Text>
            </View>
            <View style={styles.dayCard}>
              <Text style={styles.day}>Mer</Text>
              <Text style={styles.dayStatus}>⏳</Text>
            </View>
            <View style={styles.dayCard}>
              <Text style={styles.day}>Jeu</Text>
              <Text style={styles.dayStatus}>-</Text>
            </View>
            <View style={styles.dayCard}>
              <Text style={styles.day}>Ven</Text>
              <Text style={styles.dayStatus}>-</Text>
            </View>
            <View style={styles.dayCard}>
              <Text style={styles.day}>Sam</Text>
              <Text style={styles.dayStatus}>-</Text>
            </View>
            <View style={styles.dayCard}>
              <Text style={styles.day}>Dim</Text>
              <Text style={styles.dayStatus}>-</Text>
            </View>
          </View>
          <Paragraph style={styles.streak}>🔥 Série de 2 jours !</Paragraph>
        </Card.Content>
      </Card>
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
  programTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: spacing.sm,
    color: colors.white,
  },
  exerciseList: {
    marginVertical: spacing.sm,
  },
  exercise: {
    fontSize: 14,
    marginVertical: 4,
    paddingLeft: spacing.sm,
    color: colors.lightGray,
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
});
