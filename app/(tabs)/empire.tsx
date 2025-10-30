import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, Chip } from 'react-native-paper';
import { colors, spacing } from '@/constants/theme';

export default function Empire() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>💼 Empire Digital</Title>
        <Paragraph>Monitoring clients & projets</Paragraph>
      </View>

      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Title style={styles.cardTitle}>🚨 Alertes en Temps Réel</Title>
          
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

      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Title style={styles.cardTitle}>📊 Vue d'ensemble Projets</Title>
          
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

      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Title style={styles.cardTitle}>📈 Performance 24h</Title>
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

      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Title style={styles.cardTitle}>🔔 Notifications Configurées</Title>
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

      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Title style={styles.cardTitle}>📅 Tâches à venir</Title>
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
  alert: {
    padding: spacing.sm,
    borderRadius: 8,
    marginVertical: spacing.sm,
    backgroundColor: colors.mediumGray,
  },
  criticalAlert: {
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  warningAlert: {
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  alertIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
  alertTime: {
    fontSize: 12,
    color: colors.lightGray,
    fontStyle: 'italic',
    marginTop: 4,
  },
  alertButton: {
    marginTop: spacing.sm,
  },
  project: {
    marginVertical: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.mediumGray,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  projectName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
  statusOk: {
    color: colors.success,
  },
  statusWarning: {
    color: colors.warning,
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
    color: colors.gold,
  },
  statLabel: {
    fontSize: 12,
    color: colors.lightGray,
    marginTop: 4,
  },
  performanceContainer: {
    marginTop: spacing.sm,
  },
  performanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.mediumGray,
  },
  performanceLabel: {
    fontSize: 14,
    color: colors.lightGray,
  },
  performanceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
  errorValue: {
    color: colors.error,
  },
  notification: {
    marginVertical: spacing.sm,
    paddingLeft: spacing.sm,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
    color: colors.white,
  },
  addButton: {
    marginTop: spacing.sm,
  },
  task: {
    marginVertical: spacing.sm,
    paddingLeft: spacing.sm,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
    color: colors.white,
  },
  cardTitle: {
    color: colors.gold,
    fontSize: 18,
  },
});
