import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Card, Title, Paragraph, Button, Switch, List, Text, Chip } from 'react-native-paper';
import { useGoogleCalendar } from '@/contexts/GoogleCalendarContext';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { colors, spacing } from '@/constants/theme';

export default function GoogleCalendarSettings() {
  const {
    isAuthenticated,
    isSyncing,
    lastSyncTime,
    syncEnabled,
    googleEvents,
    setAuthToken,
    disconnect,
    syncNow,
    toggleSync,
    selectCalendar,
    getAvailableCalendars,
  } = useGoogleCalendar();

  const { authenticate: performGoogleAuth } = useGoogleAuth();

  const [calendars, setCalendars] = useState<{ id: string; summary: string; primary?: boolean }[]>([]);
  const [selectedCalendarId, setSelectedCalendarId] = useState<string>('primary');
  const [loadingCalendars, setLoadingCalendars] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadCalendars();
    }
  }, [isAuthenticated]);

  const loadCalendars = async () => {
    try {
      setLoadingCalendars(true);
      const cals = await getAvailableCalendars();
      setCalendars(cals);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les calendriers');
    } finally {
      setLoadingCalendars(false);
    }
  };

  const handleAuthenticate = async () => {
    try {
      const token = await performGoogleAuth();
      if (token) {
        setAuthToken(token);
        Alert.alert('✅ Succès', 'Connexion à Google Calendar réussie !');
      } else {
        Alert.alert(
          '❌ Configuration requise', 
          'Pour utiliser Google Calendar, vous devez :\n\n' +
          '1. Aller sur console.cloud.google.com\n' +
          '2. Créer un projet Google Cloud\n' +
          '3. Activer l\'API Google Calendar\n' +
          '4. Créer des identifiants OAuth 2.0 (Application Web)\n' +
          '5. Configurer le CLIENT_ID dans hooks/useGoogleAuth.ts\n' +
          '6. Ajouter l\'URI de redirection dans Google Cloud Console\n\n' +
          'Consultez les logs pour voir l\'URI de redirection à configurer.'
        );
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Une erreur est survenue';
      Alert.alert(
        '❌ Erreur de connexion', 
        `Erreur: ${errorMessage}\n\n` +
        'Vérifiez :\n' +
        '• Le CLIENT_ID est bien configuré\n' +
        '• L\'URI de redirection est ajoutée dans Google Cloud Console\n' +
        '• L\'API Google Calendar est activée'
      );
    }
  };

  const handleDisconnect = async () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter de Google Calendar ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnecter',
          style: 'destructive',
          onPress: async () => {
            await disconnect();
            Alert.alert('✅ Déconnecté', 'Vous avez été déconnecté de Google Calendar');
          },
        },
      ]
    );
  };

  const handleToggleSync = async (enabled: boolean) => {
    try {
      await toggleSync(enabled);
      if (enabled) {
        Alert.alert('✅ Activé', 'La synchronisation automatique est activée');
      }
    } catch (error) {
      Alert.alert('❌ Erreur', 'Impossible de modifier la synchronisation');
    }
  };

  const handleSyncNow = async () => {
    try {
      await syncNow();
      Alert.alert('✅ Succès', `${googleEvents.length} événements synchronisés`);
    } catch (error) {
      Alert.alert('❌ Erreur', 'La synchronisation a échoué');
    }
  };

  const handleSelectCalendar = async (calendarId: string) => {
    try {
      setSelectedCalendarId(calendarId);
      await selectCalendar(calendarId);
      Alert.alert('✅ Succès', 'Calendrier sélectionné');
    } catch (error) {
      Alert.alert('❌ Erreur', 'Impossible de sélectionner ce calendrier');
    }
  };

  const formatLastSync = () => {
    if (!lastSyncTime) return 'Jamais synchronisé';
    const date = new Date(lastSyncTime);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diffMinutes < 1) return 'À l\'instant';
    if (diffMinutes < 60) return `Il y a ${diffMinutes} min`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <Card style={styles.card} mode="contained">
      <Card.Content>
        <Title style={styles.title}>📅 Google Calendar</Title>
        <Paragraph style={styles.description}>
          Synchronisation unidirectionnelle : Google → Application
        </Paragraph>

        {!isAuthenticated ? (
          <View style={styles.section}>
            <Paragraph style={styles.infoText}>
              Connectez-vous pour importer automatiquement vos événements Google Calendar dans l'agenda.
            </Paragraph>
            <Button
              mode="contained"
              icon="google"
              onPress={handleAuthenticate}
              style={styles.button}
              buttonColor={colors.gold}
              textColor={colors.darkGray}
            >
              Se connecter avec Google
            </Button>
          </View>
        ) : (
          <View style={styles.section}>
            <View style={styles.statusRow}>
              <Chip icon="check-circle" style={styles.connectedChip} textStyle={styles.chipText}>
                Connecté
              </Chip>
              <Text style={styles.eventCount}>{googleEvents.length} événements</Text>
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Synchronisation automatique</Text>
                <Text style={styles.settingDescription}>
                  Importe automatiquement les événements toutes les 30 min
                </Text>
              </View>
              <Switch
                value={syncEnabled}
                onValueChange={handleToggleSync}
                color={colors.gold}
              />
            </View>

            <View style={styles.syncRow}>
              <View>
                <Text style={styles.syncLabel}>Dernière synchronisation</Text>
                <Text style={styles.syncTime}>{formatLastSync()}</Text>
              </View>
              <Button
                mode="outlined"
                icon={isSyncing ? undefined : "refresh"}
                onPress={handleSyncNow}
                disabled={isSyncing}
                textColor={colors.gold}
                style={styles.syncButton}
              >
                {isSyncing ? <ActivityIndicator size="small" color={colors.gold} /> : 'Synchroniser'}
              </Button>
            </View>

            {calendars.length > 0 && (
              <View style={styles.calendarSection}>
                <Text style={styles.sectionTitle}>Calendrier à synchroniser :</Text>
                {calendars.map((cal) => (
                  <List.Item
                    key={cal.id}
                    title={cal.summary}
                    description={cal.primary ? 'Calendrier principal' : ''}
                    left={props => <List.Icon {...props} icon="calendar" color={colors.gold} />}
                    right={() => (
                      selectedCalendarId === cal.id ? (
                        <Chip icon="check" style={styles.selectedChip}>Sélectionné</Chip>
                      ) : null
                    )}
                    onPress={() => handleSelectCalendar(cal.id)}
                    style={styles.calendarItem}
                    titleStyle={styles.calendarTitle}
                  />
                ))}
              </View>
            )}

            <Button
              mode="text"
              icon="logout"
              onPress={handleDisconnect}
              textColor={colors.error}
              style={styles.disconnectButton}
            >
              Déconnecter
            </Button>
          </View>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
    backgroundColor: colors.darkGray,
  },
  title: {
    color: colors.gold,
    fontSize: 20,
    marginBottom: spacing.sm,
  },
  description: {
    color: colors.mediumGray,
    fontSize: 14,
    marginBottom: spacing.md,
  },
  section: {
    marginTop: spacing.md,
  },
  infoText: {
    color: colors.white,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  button: {
    marginTop: spacing.sm,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  connectedChip: {
    backgroundColor: colors.success + '30',
  },
  chipText: {
    color: colors.success,
  },
  eventCount: {
    color: colors.white,
    fontSize: 14,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.almostBlack,
  },
  settingText: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingLabel: {
    color: colors.white,
    fontSize: 16,
    marginBottom: 4,
  },
  settingDescription: {
    color: colors.mediumGray,
    fontSize: 13,
  },
  syncRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.almostBlack,
  },
  syncLabel: {
    color: colors.mediumGray,
    fontSize: 13,
  },
  syncTime: {
    color: colors.white,
    fontSize: 14,
    marginTop: 4,
  },
  syncButton: {
    borderColor: colors.gold,
  },
  calendarSection: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  calendarItem: {
    backgroundColor: colors.almostBlack,
    marginBottom: spacing.xs,
    borderRadius: 8,
  },
  calendarTitle: {
    color: colors.white,
  },
  selectedChip: {
    backgroundColor: colors.gold + '30',
  },
  disconnectButton: {
    marginTop: spacing.md,
  },
});
