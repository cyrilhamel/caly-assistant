import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, Chip } from 'react-native-paper';
import { colors, spacing } from '@/constants/theme';

export default function Family() {
  return (
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
              <Text style={styles.overviewValue}>12h</Text>
              <Text style={styles.overviewLabel}>Aujourd'hui</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewValue}>77h</Text>
              <Text style={styles.overviewLabel}>Cette semaine</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewValue}>3</Text>
              <Text style={styles.overviewLabel}>RDV prévus</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Title style={styles.cardTitle}>🏥 Rendez-vous Médicaux</Title>
          
          <View style={styles.appointment}>
            <View style={styles.appointmentTime}>
              <Text style={styles.time}>14:00</Text>
              <Text style={styles.date}>Aujourd'hui</Text>
            </View>
            <View style={styles.appointmentDetails}>
              <Text style={styles.appointmentTitle}>Dr. Martin - Médecin généraliste</Text>
              <Paragraph>Consultation femme</Paragraph>
              <Chip icon="map-marker" compact style={styles.chip}>15 rue de la Paix</Chip>
            </View>
          </View>

          <View style={styles.appointment}>
            <View style={styles.appointmentTime}>
              <Text style={styles.time}>10:30</Text>
              <Text style={styles.date}>Jeudi</Text>
            </View>
            <View style={styles.appointmentDetails}>
              <Text style={styles.appointmentTitle}>Pédiatre - Dr. Dubois</Text>
              <Paragraph>Suivi enfant 1</Paragraph>
              <Chip icon="map-marker" compact style={styles.chip}>Cabinet médical centre</Chip>
            </View>
          </View>

          <Button mode="outlined" icon="plus" style={styles.addButton}>
            Ajouter un rendez-vous
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Title style={styles.cardTitle}>💊 Médicaments & Traitements</Title>
          
          <View style={styles.medication}>
            <Text style={styles.medName}>Traitement femme</Text>
            <Paragraph>Matin - 8h | Soir - 20h</Paragraph>
            <View style={styles.medStatus}>
              <Chip icon="check" compact textStyle={styles.chipText}>Matin ✓</Chip>
              <Chip icon="clock" compact textStyle={styles.chipText}>Soir à venir</Chip>
            </View>
          </View>

          <View style={styles.medication}>
            <Text style={styles.medName}>Vitamines enfants</Text>
            <Paragraph>Matin - Pendant petit déjeuner</Paragraph>
            <View style={styles.medStatus}>
              <Chip icon="check" compact textStyle={styles.chipText}>Fait ✓</Chip>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Title style={styles.cardTitle}>📅 Activités Enfants</Title>
          
          <View style={styles.activity}>
            <Text style={styles.activityTitle}>🎨 Atelier créatif</Text>
            <Paragraph>Mercredi 15h30 - 17h00</Paragraph>
            <Paragraph>Enfant 2</Paragraph>
          </View>

          <View style={styles.activity}>
            <Text style={styles.activityTitle}>⚽ Sport</Text>
            <Paragraph>Samedi 10h00 - 11h30</Paragraph>
            <Paragraph>Enfant 1</Paragraph>
          </View>

          <Button mode="outlined" icon="plus" style={styles.addButton}>
            Ajouter une activité
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Title style={styles.cardTitle}>🍽️ Repas Planifiés</Title>
          <View style={styles.mealPlan}>
            <Text style={styles.meal}>Déjeuner : Pâtes bolognaise</Text>
            <Text style={styles.meal}>Goûter : Fruits + gâteau</Text>
            <Text style={styles.meal}>Dîner : Poulet + légumes</Text>
          </View>
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
  appointmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: colors.white,
  },
  chip: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
  },
  chipText: {
    fontSize: 12,
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
  medName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: colors.white,
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
});
