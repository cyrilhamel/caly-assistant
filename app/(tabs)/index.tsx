import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';

export default function Dashboard() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Bonjour Cyril ! 👋</Title>
        <Paragraph>Mercredi 29 Octobre 2025</Paragraph>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Title>⚡ Score Énergie</Title>
          <Text style={styles.energyScore}>67% 🟡</Text>
          <Paragraph>Modérée - Pensez à faire une pause</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>💪 Objectif Poids</Title>
          <Text style={styles.weightProgress}>-3.2kg / -25kg</Text>
          <Paragraph>Vous êtes sur la bonne voie !</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>👨‍👩‍👧‍👦 Aidant Familial</Title>
          <Text style={styles.careHours}>12h planifiées aujourd'hui</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>💼 Empire Digital</Title>
          <Text style={styles.alerts}>🔴 3 alertes Calytia</Text>
          <Paragraph>Vérification BDD recommandée</Paragraph>
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
  energyScore: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  weightProgress: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginVertical: 8,
  },
  careHours: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  alerts: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f44336',
    marginVertical: 8,
  },
});
