import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, ProgressBar } from 'react-native-paper';

export default function Health() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>💪 Coach Sportif</Title>
        <Paragraph>Objectif : -25kg avec programmes adaptés</Paragraph>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Title>📊 Progression Poids</Title>
          <Text style={styles.weightCurrent}>Actuel : 97.8 kg</Text>
          <Text style={styles.weightTarget}>Objectif : 75 kg</Text>
          <ProgressBar progress={0.128} color="#4CAF50" style={styles.progressBar} />
          <Text style={styles.progressText}>-3.2 kg / -25 kg (12.8%)</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>🏃 Programme du Jour</Title>
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

      <Card style={styles.card}>
        <Card.Content>
          <Title>🔥 Calories & Activité</Title>
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

      <Card style={styles.card}>
        <Card.Content>
          <Title>📅 Historique Semaine</Title>
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
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 16,
  },
  weightCurrent: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  weightTarget: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginVertical: 8,
  },
  progressText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 4,
  },
  programTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  exerciseList: {
    marginVertical: 12,
  },
  exercise: {
    fontSize: 14,
    marginVertical: 4,
    paddingLeft: 8,
  },
  button: {
    marginTop: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200EE',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  weekHistory: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  dayCard: {
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    minWidth: 40,
  },
  day: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  dayStatus: {
    fontSize: 20,
    marginTop: 4,
  },
  streak: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
