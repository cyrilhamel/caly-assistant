import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { colors, spacing, typography } from '@/constants/theme';

export default function Dashboard() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bonjour Cyril ! 👋</Text>
        <Text style={styles.subtitle}>Mercredi 30 Octobre 2025</Text>
      </View>

      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Title style={styles.cardTitle}>⚡ Score Énergie</Title>
          <Text style={styles.energyScore}>67% 🟡</Text>
          <Paragraph style={styles.cardText}>Modérée - Pensez à faire une pause</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Title style={styles.cardTitle}>💪 Objectif Poids</Title>
          <Text style={styles.weightProgress}>-3.2kg / -25kg</Text>
          <Paragraph style={styles.cardText}>Vous êtes sur la bonne voie !</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Title style={styles.cardTitle}>👨‍👩‍👧‍👦 Aidant Familial</Title>
          <Text style={styles.careHours}>12h planifiées aujourd'hui</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Title style={styles.cardTitle}>💼 Empire Digital</Title>
          <Text style={styles.alerts}>🔴 3 alertes Calytia</Text>
          <Paragraph style={styles.cardText}>Vérification BDD recommandée</Paragraph>
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
});
