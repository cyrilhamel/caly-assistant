import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, Chip } from 'react-native-paper';

export default function Empire() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>💼 Empire Digital</Title>
        <Paragraph>Monitoring clients & projets</Paragraph>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Title>🚨 Alertes en Temps Réel</Title>
          
          <View style={[styles.alert, styles.criticalAlert]}>
            <View style={styles.alertHeader}>
              <Text style={styles.alertIcon}>🔴</Text>
              <Text style={styles.alertTitle}>Calytia - BDD Critique</Text>
            </View>
            <Paragraph>3 erreurs de connexion détectées</Paragraph>
            <Paragraph style={styles.alertTime}>Il y a 15 minutes</Paragraph>
            <Button mode="contained" buttonColor="#f44336" style={styles.alertButton}>
              Vérifier maintenant
            </Button>
          </View>

          <View style={[styles.alert, styles.warningAlert]}>
            <View style={styles.alertHeader}>
              <Text style={styles.alertIcon}>🟡</Text>
              <Text style={styles.alertTitle}>Client #2 - Performance</Text>
            </View>
            <Paragraph>Temps de réponse élevé (2.3s)</Paragraph>
            <Paragraph style={styles.alertTime}>Il y a 1 heure</Paragraph>
            <Button mode="outlined" style={styles.alertButton}>
              Analyser
            </Button>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>📊 Vue d'ensemble Projets</Title>
          
          <View style={styles.project}>
            <View style={styles.projectHeader}>
              <Text style={styles.projectName}>🏢 Calytia</Text>
              <Chip icon="check-circle" textStyle={styles.statusOk}>Opérationnel</Chip>
            </View>
            <View style={styles.projectStats}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>99.2%</Text>
                <Text style={styles.statLabel}>Uptime</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statValue}>1.2s</Text>
                <Text style={styles.statLabel}>Réponse</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statValue}>3</Text>
                <Text style={styles.statLabel}>Alertes</Text>
              </View>
            </View>
          </View>

          <View style={styles.project}>
            <View style={styles.projectHeader}>
              <Text style={styles.projectName}>🌐 Client #2</Text>
              <Chip icon="alert" textStyle={styles.statusWarning}>Attention</Chip>
            </View>
            <View style={styles.projectStats}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>98.5%</Text>
                <Text style={styles.statLabel}>Uptime</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statValue}>2.3s</Text>
                <Text style={styles.statLabel}>Réponse</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statValue}>1</Text>
                <Text style={styles.statLabel}>Alertes</Text>
              </View>
            </View>
          </View>

          <View style={styles.project}>
            <View style={styles.projectHeader}>
              <Text style={styles.projectName}>💻 Client #3</Text>
              <Chip icon="check-circle" textStyle={styles.statusOk}>Opérationnel</Chip>
            </View>
            <View style={styles.projectStats}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>100%</Text>
                <Text style={styles.statLabel}>Uptime</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statValue}>0.8s</Text>
                <Text style={styles.statLabel}>Réponse</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statValue}>0</Text>
                <Text style={styles.statLabel}>Alertes</Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>📈 Performance 24h</Title>
          <View style={styles.performanceContainer}>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceLabel}>Requêtes totales</Text>
              <Text style={styles.performanceValue}>12,458</Text>
            </View>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceLabel}>Erreurs</Text>
              <Text style={[styles.performanceValue, styles.errorValue]}>23</Text>
            </View>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceLabel}>Taux d'erreur</Text>
              <Text style={styles.performanceValue}>0.18%</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>🔔 Notifications Configurées</Title>
          <View style={styles.notification}>
            <Text style={styles.notifTitle}>✅ Erreur BDD critique</Text>
            <Paragraph>Email + SMS immédiat</Paragraph>
          </View>
          <View style={styles.notification}>
            <Text style={styles.notifTitle}>✅ Performance dégradée</Text>
            <Paragraph>Notification push</Paragraph>
          </View>
          <View style={styles.notification}>
            <Text style={styles.notifTitle}>✅ Downtime détecté</Text>
            <Paragraph>Email + SMS + Appel</Paragraph>
          </View>
          <Button mode="outlined" icon="bell-plus" style={styles.addButton}>
            Configurer les alertes
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>📅 Tâches à venir</Title>
          <View style={styles.task}>
            <Text style={styles.taskTitle}>🔧 Maintenance serveur Calytia</Text>
            <Paragraph>Prévu : Samedi 2h00</Paragraph>
          </View>
          <View style={styles.task}>
            <Text style={styles.taskTitle}>📞 Call client #2</Text>
            <Paragraph>Vendredi 14h00 - Revue mensuelle</Paragraph>
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
  alert: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  criticalAlert: {
    backgroundColor: '#ffebee',
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  warningAlert: {
    backgroundColor: '#fff8e1',
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  alertTime: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4,
  },
  alertButton: {
    marginTop: 12,
  },
  project: {
    marginVertical: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  projectName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusOk: {
    color: '#4CAF50',
  },
  statusWarning: {
    color: '#FF9800',
  },
  projectStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6200EE',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  performanceContainer: {
    marginTop: 12,
  },
  performanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  performanceLabel: {
    fontSize: 14,
    color: '#666',
  },
  performanceValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorValue: {
    color: '#f44336',
  },
  notification: {
    marginVertical: 8,
    paddingLeft: 8,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  addButton: {
    marginTop: 12,
  },
  task: {
    marginVertical: 8,
    paddingLeft: 8,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
});
