import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Chip } from 'react-native-paper';

export default function Kanban() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>📋 Planification</Title>
        <Paragraph>Vue Kanban / Agenda synchronisé</Paragraph>
      </View>

      <View style={styles.section}>
        <Title style={styles.sectionTitle}>🔴 Urgent</Title>
        <Card style={[styles.card, styles.urgentCard]}>
          <Card.Content>
            <Text style={styles.taskTitle}>Rendez-vous médecin - 14h</Text>
            <Paragraph>Consultation femme</Paragraph>
            <View style={styles.chipContainer}>
              <Chip icon="calendar" compact>Aujourd'hui</Chip>
              <Chip icon="account-group" compact>Famille</Chip>
            </View>
          </Card.Content>
        </Card>
        <Card style={[styles.card, styles.urgentCard]}>
          <Card.Content>
            <Text style={styles.taskTitle}>Vérif BDD Calytia</Text>
            <Paragraph>3 alertes clients en attente</Paragraph>
            <View style={styles.chipContainer}>
              <Chip icon="alert" compact>Urgent</Chip>
              <Chip icon="domain" compact>Empire</Chip>
            </View>
          </Card.Content>
        </Card>
      </View>

      <View style={styles.section}>
        <Title style={styles.sectionTitle}>🟡 En cours</Title>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.taskTitle}>Session sport 15min</Text>
            <Paragraph>Exercices cardio adaptés</Paragraph>
            <View style={styles.chipContainer}>
              <Chip icon="heart-pulse" compact>Santé</Chip>
            </View>
          </Card.Content>
        </Card>
      </View>

      <View style={styles.section}>
        <Title style={styles.sectionTitle}>🟢 À faire</Title>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.taskTitle}>Préparation repas enfants</Text>
            <Paragraph>Dîner 19h</Paragraph>
            <View style={styles.chipContainer}>
              <Chip icon="food" compact>Famille</Chip>
            </View>
          </Card.Content>
        </Card>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.taskTitle}>Suivi projet client #2</Text>
            <Paragraph>Revue hebdomadaire</Paragraph>
            <View style={styles.chipContainer}>
              <Chip icon="briefcase" compact>Empire</Chip>
            </View>
          </Card.Content>
        </Card>
      </View>

      <View style={styles.section}>
        <Title style={styles.sectionTitle}>✅ Terminé</Title>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.taskTitle}>Pesée matinale</Text>
            <Paragraph>-0.2kg cette semaine 🎉</Paragraph>
            <View style={styles.chipContainer}>
              <Chip icon="check" compact>Fait</Chip>
            </View>
          </Card.Content>
        </Card>
      </View>
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  card: {
    marginBottom: 12,
  },
  urgentCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  chipContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
});
