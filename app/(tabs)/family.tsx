import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, Chip } from 'react-native-paper';

export default function Family() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>👨‍👩‍👧‍👦 Aidant Familial</Title>
        <Paragraph>77h/semaine - Planification famille</Paragraph>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Title>📊 Vue d'ensemble</Title>
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

      <Card style={styles.card}>
        <Card.Content>
          <Title>🏥 Rendez-vous Médicaux</Title>
          
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

      <Card style={styles.card}>
        <Card.Content>
          <Title>💊 Médicaments & Traitements</Title>
          
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

      <Card style={styles.card}>
        <Card.Content>
          <Title>📅 Activités Enfants</Title>
          
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

      <Card style={styles.card}>
        <Card.Content>
          <Title>🍽️ Repas Planifiés</Title>
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
  overviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  overviewItem: {
    alignItems: 'center',
  },
  overviewValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6200EE',
  },
  overviewLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  appointment: {
    flexDirection: 'row',
    marginVertical: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  appointmentTime: {
    marginRight: 16,
    alignItems: 'center',
    minWidth: 60,
  },
  time: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6200EE',
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  appointmentDetails: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  chip: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  chipText: {
    fontSize: 12,
  },
  addButton: {
    marginTop: 12,
  },
  medication: {
    marginVertical: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  medName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  medStatus: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  activity: {
    marginVertical: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  mealPlan: {
    marginTop: 12,
  },
  meal: {
    fontSize: 14,
    marginVertical: 6,
    paddingLeft: 8,
  },
});
