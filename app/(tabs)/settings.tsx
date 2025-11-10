import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Button, TextInput, Switch, Chip, Portal, Dialog, List } from 'react-native-paper';
import { colors, spacing } from '@/constants/theme';
import { useState, useEffect } from 'react';
import { monitoringService, externalMonitoringService, notificationService } from '@/services/monitoring';
import type { MonitoringConfig, NotificationConfig } from '@/services/monitoring';
import { useEmpire } from '@/contexts/EmpireContext';
import { SwipeableTabWrapper } from '@/components/common/SwipeableTabWrapper';
import GoogleCalendarSettings from '@/components/settings/GoogleCalendarSettings';

export default function Settings() {
  const { projects, isMonitoringActive, startMonitoring, stopMonitoring } = useEmpire();

  // États pour la configuration des projets
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [projectConfig, setProjectConfig] = useState<MonitoringConfig>({
    projectId: '',
    name: '',
    endpoints: [],
    checkInterval: 2 * 60 * 1000,
    thresholds: {
      responseTime: 1500,
      criticalResponseTime: 3000,
      errorRate: 5,
      uptimeWarning: 99,
    },
  });
  const [newEndpoint, setNewEndpoint] = useState('');

  // États pour les notifications
  const [notifConfig, setNotifConfig] = useState<NotificationConfig>({
    enablePush: true,
    enableSound: true,
    enableVibration: true,
    criticalAlertSound: 'default',
    warningAlertSound: 'default',
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00',
    },
  });

  // États pour UptimeRobot
  const [uptimeRobotEnabled, setUptimeRobotEnabled] = useState(false);
  const [uptimeRobotApiKey, setUptimeRobotApiKey] = useState('');
  const [showUptimeRobotDialog, setShowUptimeRobotDialog] = useState(false);

  // États pour Sentry
  const [sentryEnabled, setSentryEnabled] = useState(false);
  const [sentryApiKey, setSentryApiKey] = useState('');
  const [sentryOrganization, setSentryOrganization] = useState('');
  const [showSentryDialog, setShowSentryDialog] = useState(false);

  // États pour Webhooks
  const [webhookEnabled, setWebhookEnabled] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [showWebhookDialog, setShowWebhookDialog] = useState(false);

  useEffect(() => {
    // Charger la config des notifications
    const config = notificationService.getConfig();
    setNotifConfig(config);

    // Charger les providers externes
    const uptimeProvider = externalMonitoringService.getProviderConfig('uptimerobot');
    if (uptimeProvider) {
      setUptimeRobotEnabled(uptimeProvider.isEnabled);
      setUptimeRobotApiKey(uptimeProvider.apiKey || '');
    }

    const sentryProvider = externalMonitoringService.getProviderConfig('sentry');
    if (sentryProvider) {
      setSentryEnabled(sentryProvider.isEnabled);
    }

    const webhookProvider = externalMonitoringService.getProviderConfig('webhook');
    if (webhookProvider) {
      setWebhookEnabled(webhookProvider.isEnabled);
    }
  }, []);

  const handleSaveNotifications = () => {
    notificationService.updateConfig(notifConfig);
    Alert.alert('✅ Succès', 'Configuration des notifications enregistrée');
  };

  const handleTestNotification = async () => {
    await notificationService.sendTestNotification();
    Alert.alert('🧪 Test', 'Notification de test envoyée !');
  };

  const handleSaveUptimeRobot = async () => {
    externalMonitoringService.configureUptimeRobot({
      isEnabled: uptimeRobotEnabled,
      apiKey: uptimeRobotApiKey,
      monitors: projects.map(p => ({
        id: `monitor-${p.id}`,
        projectId: p.id,
        url: `https://example.com/${p.id}`,
      })),
    });

    if (uptimeRobotEnabled && uptimeRobotApiKey) {
      const result = await externalMonitoringService.testProvider('uptimerobot');
      Alert.alert(
        result.success ? '✅ Connexion réussie' : '❌ Échec',
        result.message
      );
    }

    setShowUptimeRobotDialog(false);
  };

  const handleSaveSentry = async () => {
    externalMonitoringService.configureSentry({
      isEnabled: sentryEnabled,
      apiKey: sentryApiKey,
      organization: sentryOrganization,
      projects: projects.map(p => ({
        slug: p.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        projectId: p.id,
      })),
    });

    if (sentryEnabled && sentryApiKey) {
      const result = await externalMonitoringService.testProvider('sentry');
      Alert.alert(
        result.success ? '✅ Connexion réussie' : '❌ Échec',
        result.message
      );
    }

    setShowSentryDialog(false);
  };

  const handleSaveWebhook = () => {
    externalMonitoringService.configureWebhooks({
      isEnabled: webhookEnabled,
      endpoints: projects.map(p => ({
        projectId: p.id,
        url: webhookUrl,
        headers: {
          'Content-Type': 'application/json',
        },
      })),
    });

    Alert.alert('✅ Succès', 'Configuration Webhook enregistrée');
    setShowWebhookDialog(false);
  };

  const handleToggleProvider = (provider: string, enabled: boolean) => {
    externalMonitoringService.toggleProvider(provider, enabled);
    Alert.alert('✅ Succès', `${provider} ${enabled ? 'activé' : 'désactivé'}`);
  };

  return (
    <SwipeableTabWrapper currentRoute="/(tabs)/settings">
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>⚙️ Paramètres</Title>
        <Paragraph>Configuration de l'application</Paragraph>
      </View>

      {/* Google Calendar Sync */}
      <GoogleCalendarSettings />

      {/* État du Monitoring */}
      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Title style={styles.cardTitle}>📊 Monitoring</Title>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Monitoring actif</Text>
              <Paragraph style={styles.settingDescription}>
                Surveillance en temps réel des projets
              </Paragraph>
            </View>
            <Switch
              value={isMonitoringActive}
              onValueChange={isMonitoringActive ? stopMonitoring : startMonitoring}
              color={colors.gold}
            />
          </View>

          {isMonitoringActive && (
            <View style={styles.projectsList}>
              <Text style={styles.subsectionTitle}>Projets surveillés :</Text>
              {projects.map(project => (
                <View key={project.id} style={styles.projectRow}>
                  <Chip
                    icon={project.status === 'operational' ? 'check-circle' : 'alert'}
                    style={styles.projectChip}
                  >
                    {project.name}
                  </Chip>
                  <Button
                    mode="text"
                    icon="pencil"
                    onPress={() => {
                      setSelectedProjectId(project.id);
                      // Charger la config existante
                      const config = monitoringService.getHealthHistory(project.id);
                      setShowProjectDialog(true);
                    }}
                    compact
                  >
                    Config
                  </Button>
                </View>
              ))}
              <Button
                mode="outlined"
                icon="plus"
                onPress={() => {
                  setSelectedProjectId(null);
                  setProjectConfig({
                    projectId: `${Date.now()}`,
                    name: '',
                    endpoints: [],
                    checkInterval: 2 * 60 * 1000,
                    thresholds: {
                      responseTime: 1500,
                      criticalResponseTime: 3000,
                      errorRate: 5,
                      uptimeWarning: 99,
                    },
                  });
                  setShowProjectDialog(true);
                }}
                style={styles.addProjectButton}
              >
                Ajouter un projet
              </Button>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Notifications */}
      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Title style={styles.cardTitle}>🔔 Notifications</Title>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Activer les notifications</Text>
            </View>
            <Switch
              value={notifConfig.enablePush}
              onValueChange={(value) => setNotifConfig({ ...notifConfig, enablePush: value })}
              color={colors.gold}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Son</Text>
            </View>
            <Switch
              value={notifConfig.enableSound}
              onValueChange={(value) => setNotifConfig({ ...notifConfig, enableSound: value })}
              color={colors.gold}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Vibration</Text>
            </View>
            <Switch
              value={notifConfig.enableVibration}
              onValueChange={(value) => setNotifConfig({ ...notifConfig, enableVibration: value })}
              color={colors.gold}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Heures silencieuses</Text>
              <Paragraph style={styles.settingDescription}>
                {notifConfig.quietHours.start} - {notifConfig.quietHours.end}
              </Paragraph>
            </View>
            <Switch
              value={notifConfig.quietHours.enabled}
              onValueChange={(value) => 
                setNotifConfig({ 
                  ...notifConfig, 
                  quietHours: { ...notifConfig.quietHours, enabled: value } 
                })
              }
              color={colors.gold}
            />
          </View>

          <View style={styles.buttonRow}>
            <Button mode="outlined" onPress={handleSaveNotifications} style={styles.button}>
              Enregistrer
            </Button>
            <Button mode="outlined" onPress={handleTestNotification} style={styles.button}>
              Tester
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Intégrations Externes */}
      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Title style={styles.cardTitle}>🔌 Intégrations Externes</Title>
          
          {/* UptimeRobot */}
          <List.Item
            title="UptimeRobot"
            description={uptimeRobotEnabled ? 'Actif' : 'Inactif'}
            left={props => <List.Icon {...props} icon="web" color={colors.gold} />}
            right={props => (
              <View style={styles.listItemRight}>
                <Switch
                  value={uptimeRobotEnabled}
                  onValueChange={(value) => {
                    setUptimeRobotEnabled(value);
                    handleToggleProvider('uptimerobot', value);
                  }}
                  color={colors.gold}
                />
              </View>
            )}
            onPress={() => setShowUptimeRobotDialog(true)}
            style={styles.listItem}
          />

          {/* Sentry */}
          <List.Item
            title="Sentry"
            description={sentryEnabled ? 'Actif' : 'Inactif'}
            left={props => <List.Icon {...props} icon="bug" color={colors.gold} />}
            right={props => (
              <View style={styles.listItemRight}>
                <Switch
                  value={sentryEnabled}
                  onValueChange={(value) => {
                    setSentryEnabled(value);
                    handleToggleProvider('sentry', value);
                  }}
                  color={colors.gold}
                />
              </View>
            )}
            onPress={() => setShowSentryDialog(true)}
            style={styles.listItem}
          />

          {/* Webhooks */}
          <List.Item
            title="Webhooks Personnalisés"
            description={webhookEnabled ? 'Actif' : 'Inactif'}
            left={props => <List.Icon {...props} icon="webhook" color={colors.gold} />}
            right={props => (
              <View style={styles.listItemRight}>
                <Switch
                  value={webhookEnabled}
                  onValueChange={(value) => {
                    setWebhookEnabled(value);
                    handleToggleProvider('webhook', value);
                  }}
                  color={colors.gold}
                />
              </View>
            )}
            onPress={() => setShowWebhookDialog(true)}
            style={styles.listItem}
          />
        </Card.Content>
      </Card>

      {/* Dialogs pour les configurations */}
      
      {/* Dialog Configuration Projet */}
      <Portal>
        <Dialog visible={showProjectDialog} onDismiss={() => setShowProjectDialog(false)} style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>
            {selectedProjectId ? 'Modifier le projet' : 'Nouveau projet'}
          </Dialog.Title>
          <Dialog.ScrollArea>
            <ScrollView>
              <Dialog.Content>
                <TextInput
                  label="Nom du projet"
                  value={projectConfig.name}
                  onChangeText={(text) => setProjectConfig({ ...projectConfig, name: text })}
                  mode="outlined"
                  style={styles.input}
                  outlineColor={colors.mediumGray}
                  activeOutlineColor={colors.gold}
                  textColor={colors.white}
                />

                <Text style={styles.inputLabel}>Endpoints à surveiller :</Text>
                {projectConfig.endpoints.map((endpoint, index) => (
                  <View key={index} style={styles.endpointRow}>
                    <Text style={styles.endpointText}>{endpoint}</Text>
                    <Button
                      mode="text"
                      icon="delete"
                      onPress={() => {
                        setProjectConfig({
                          ...projectConfig,
                          endpoints: projectConfig.endpoints.filter((_, i) => i !== index),
                        });
                      }}
                      compact
                    >
                      Supprimer
                    </Button>
                  </View>
                ))}

                <View style={styles.addEndpointRow}>
                  <TextInput
                    value={newEndpoint}
                    onChangeText={setNewEndpoint}
                    mode="outlined"
                    placeholder="https://mon-api.com/health"
                    style={styles.endpointInput}
                    outlineColor={colors.mediumGray}
                    activeOutlineColor={colors.gold}
                    textColor={colors.white}
                  />
                  <Button
                    mode="contained"
                    onPress={() => {
                      if (newEndpoint.trim()) {
                        setProjectConfig({
                          ...projectConfig,
                          endpoints: [...projectConfig.endpoints, newEndpoint.trim()],
                        });
                        setNewEndpoint('');
                      }
                    }}
                    buttonColor={colors.gold}
                    textColor={colors.almostBlack}
                  >
                    Ajouter
                  </Button>
                </View>

                <Text style={styles.sectionTitle}>Seuils d'alerte :</Text>

                <TextInput
                  label="Intervalle de vérification (minutes)"
                  value={(projectConfig.checkInterval / 60000).toString()}
                  onChangeText={(text) =>
                    setProjectConfig({
                      ...projectConfig,
                      checkInterval: parseInt(text) * 60000 || 60000,
                    })
                  }
                  mode="outlined"
                  keyboardType="numeric"
                  style={styles.input}
                  outlineColor={colors.mediumGray}
                  activeOutlineColor={colors.gold}
                  textColor={colors.white}
                />

                <TextInput
                  label="Temps de réponse Warning (ms)"
                  value={projectConfig.thresholds.responseTime.toString()}
                  onChangeText={(text) =>
                    setProjectConfig({
                      ...projectConfig,
                      thresholds: {
                        ...projectConfig.thresholds,
                        responseTime: parseInt(text) || 1500,
                      },
                    })
                  }
                  mode="outlined"
                  keyboardType="numeric"
                  style={styles.input}
                  outlineColor={colors.mediumGray}
                  activeOutlineColor={colors.gold}
                  textColor={colors.white}
                />

                <TextInput
                  label="Temps de réponse Critical (ms)"
                  value={projectConfig.thresholds.criticalResponseTime.toString()}
                  onChangeText={(text) =>
                    setProjectConfig({
                      ...projectConfig,
                      thresholds: {
                        ...projectConfig.thresholds,
                        criticalResponseTime: parseInt(text) || 3000,
                      },
                    })
                  }
                  mode="outlined"
                  keyboardType="numeric"
                  style={styles.input}
                  outlineColor={colors.mediumGray}
                  activeOutlineColor={colors.gold}
                  textColor={colors.white}
                />

                <TextInput
                  label="Uptime minimum (%)"
                  value={projectConfig.thresholds.uptimeWarning.toString()}
                  onChangeText={(text) =>
                    setProjectConfig({
                      ...projectConfig,
                      thresholds: {
                        ...projectConfig.thresholds,
                        uptimeWarning: parseFloat(text) || 99,
                      },
                    })
                  }
                  mode="outlined"
                  keyboardType="numeric"
                  style={styles.input}
                  outlineColor={colors.mediumGray}
                  activeOutlineColor={colors.gold}
                  textColor={colors.white}
                />
              </Dialog.Content>
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={() => setShowProjectDialog(false)} textColor={colors.lightGray}>
              Annuler
            </Button>
            <Button
              onPress={() => {
                if (projectConfig.name && projectConfig.endpoints.length > 0) {
                  monitoringService.registerProject(projectConfig);
                  Alert.alert('✅ Succès', 'Configuration du projet enregistrée');
                  setShowProjectDialog(false);
                } else {
                  Alert.alert('❌ Erreur', 'Veuillez remplir tous les champs');
                }
              }}
              textColor={colors.gold}
            >
              Enregistrer
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Dialog UptimeRobot */}
      <Portal>
        <Dialog visible={showUptimeRobotDialog} onDismiss={() => setShowUptimeRobotDialog(false)} style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>Configuration UptimeRobot</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="API Key"
              value={uptimeRobotApiKey}
              onChangeText={setUptimeRobotApiKey}
              mode="outlined"
              style={styles.input}
              outlineColor={colors.mediumGray}
              activeOutlineColor={colors.gold}
              textColor={colors.white}
              secureTextEntry
            />
            <Paragraph style={styles.helpText}>
              Obtenez votre API Key sur uptimerobot.com
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowUptimeRobotDialog(false)} textColor={colors.lightGray}>
              Annuler
            </Button>
            <Button onPress={handleSaveUptimeRobot} textColor={colors.gold}>
              Enregistrer
            </Button>
          </Dialog.Actions>
        </Dialog>

        {/* Dialog Sentry */}
        <Dialog visible={showSentryDialog} onDismiss={() => setShowSentryDialog(false)} style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>Configuration Sentry</Dialog.Title>
          <Dialog.ScrollArea>
            <ScrollView>
              <Dialog.Content>
                <TextInput
                  label="Auth Token"
                  value={sentryApiKey}
                  onChangeText={setSentryApiKey}
                  mode="outlined"
                  style={styles.input}
                  outlineColor={colors.mediumGray}
                  activeOutlineColor={colors.gold}
                  textColor={colors.white}
                  secureTextEntry
                />
                <TextInput
                  label="Organization"
                  value={sentryOrganization}
                  onChangeText={setSentryOrganization}
                  mode="outlined"
                  style={styles.input}
                  outlineColor={colors.mediumGray}
                  activeOutlineColor={colors.gold}
                  textColor={colors.white}
                />
                <Paragraph style={styles.helpText}>
                  Créez un Auth Token dans Settings {'>'} Developer Settings
                </Paragraph>
              </Dialog.Content>
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={() => setShowSentryDialog(false)} textColor={colors.lightGray}>
              Annuler
            </Button>
            <Button onPress={handleSaveSentry} textColor={colors.gold}>
              Enregistrer
            </Button>
          </Dialog.Actions>
        </Dialog>

        {/* Dialog Webhook */}
        <Dialog visible={showWebhookDialog} onDismiss={() => setShowWebhookDialog(false)} style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>Configuration Webhook</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="URL du Webhook"
              value={webhookUrl}
              onChangeText={setWebhookUrl}
              mode="outlined"
              style={styles.input}
              outlineColor={colors.mediumGray}
              activeOutlineColor={colors.gold}
              textColor={colors.white}
              placeholder="https://..."
            />
            <Paragraph style={styles.helpText}>
              Les alertes seront envoyées en POST à cette URL
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowWebhookDialog(false)} textColor={colors.lightGray}>
              Annuler
            </Button>
            <Button onPress={handleSaveWebhook} textColor={colors.gold}>
              Enregistrer
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
    </SwipeableTabWrapper>
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
  cardTitle: {
    color: colors.gold,
    fontSize: 18,
    marginBottom: spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: spacing.sm,
    paddingVertical: spacing.xs,
  },
  settingInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: colors.lightGray,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.lightGray,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  projectsList: {
    marginTop: spacing.sm,
  },
  projectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  projectChip: {
    flex: 1,
    marginRight: spacing.sm,
  },
  addProjectButton: {
    marginTop: spacing.sm,
    borderColor: colors.gold,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  button: {
    flex: 1,
    borderColor: colors.gold,
  },
  listItem: {
    backgroundColor: colors.mediumGray,
    marginVertical: spacing.xs,
    borderRadius: 8,
  },
  listItemRight: {
    justifyContent: 'center',
  },
  dialog: {
    backgroundColor: colors.darkGray,
  },
  dialogTitle: {
    color: colors.gold,
  },
  input: {
    marginBottom: spacing.sm,
    backgroundColor: colors.mediumGray,
  },
  helpText: {
    fontSize: 12,
    color: colors.lightGray,
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.gold,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  endpointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.mediumGray,
    borderRadius: 8,
    padding: spacing.sm,
    marginBottom: spacing.xs,
  },
  endpointText: {
    flex: 1,
    color: colors.white,
    fontSize: 13,
  },
  addEndpointRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  endpointInput: {
    flex: 1,
    backgroundColor: colors.mediumGray,
  },
});
