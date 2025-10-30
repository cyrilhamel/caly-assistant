import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Chip } from 'react-native-paper';
import { colors, spacing } from '@/constants/theme';

export default function Kanban() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>📋 Planification</Title>
        <Paragraph>Vue Kanban / Agenda synchronisé</Paragraph>
      </View>

      <View style={styles.section}>
        <Title style={styles.sectionTitle}>🔴 Urgent</Title>
        <Card style={[styles.card, styles.urgentCard]} mode="contained">
          <Card.Content>
            <Text style={styles.taskTitle}>Rendez-vous médecin - 14h</Text>
            <Paragraph style={styles.cardText}>Consultation femme</Paragraph>
            <View style={styles.chipContainer}>
              <Chip icon="calendar" compact>Aujourd'hui</Chip>
              <Chip icon="account-group" compact>Famille</Chip>
            </View>
          </Card.Content>
        </Card>
        <Card style={[styles.card, styles.urgentCard]} mode="contained">
          <Card.Content>
            <Text style={styles.taskTitle}>Vérif BDD Calytia</Text>
            <Paragraph style={styles.cardText}>3 alertes clients en attente</Paragraph>
            <View style={styles.chipContainer}>
              <Chip icon="alert" compact>Urgent</Chip>
              <Chip icon="domain" compact>Empire</Chip>
            </View>
          </Card.Content>
        </Card>
      </View>

      <View style={styles.section}>
        <Title style={styles.sectionTitle}>🟡 En cours</Title>
        <Card style={styles.card} mode="contained">
          <Card.Content>
            <Text style={styles.taskTitle}>Session sport 15min</Text>
            <Paragraph style={styles.cardText}>Exercices cardio adaptés</Paragraph>
            <View style={styles.chipContainer}>
              <Chip icon="heart-pulse" compact>Santé</Chip>
            </View>
          </Card.Content>
        </Card>
      </View>

      <View style={styles.section}>
        <Title style={styles.sectionTitle}>🟢 À faire</Title>
        <Card style={styles.card} mode="contained">
          <Card.Content>
            <Text style={styles.taskTitle}>Préparation repas enfants</Text>
            <Paragraph style={styles.cardText}>Dîner 19h</Paragraph>
            <View style={styles.chipContainer}>
              <Chip icon="food" compact>Famille</Chip>
            </View>
          </Card.Content>
        </Card>
        <Card style={styles.card} mode="contained">
          <Card.Content>
            <Text style={styles.taskTitle}>Suivi projet client #2</Text>
            <Paragraph style={styles.cardText}>Revue hebdomadaire</Paragraph>
            <View style={styles.chipContainer}>
              <Chip icon="briefcase" compact>Empire</Chip>
            </View>
          </Card.Content>
        </Card>
      </View>

      <View style={styles.section}>
        <Title style={styles.sectionTitle}>✅ Terminé</Title>
        <Card style={styles.card} mode="contained">
          <Card.Content>
            <Text style={styles.taskTitle}>Pesée matinale</Text>
            <Paragraph style={styles.cardText}>-0.2kg cette semaine 🎉</Paragraph>
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
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    color: colors.gold,
  },
  card: {
    marginBottom: spacing.sm,
    backgroundColor: colors.darkGray,
    borderWidth: 1,
    borderColor: colors.mediumGray,
  },
  urgentCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
    borderColor: colors.gold,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: colors.white,
  },
  chipContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: spacing.sm,
  },
  cardText: {
    color: colors.lightGray,
  },
  cardTitle: {
    color: colors.gold,
    fontSize: 18,
  },
});
