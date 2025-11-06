import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFamily } from '@/contexts/FamilyContext';
import { MenstrualCycle } from '@/types';
import { colors, spacing } from '@/constants/theme';

export default function MenstrualTracking() {
  const { 
    menstrualCycles, 
    addMenstrualCycle, 
    updateMenstrualCycle, 
    deleteMenstrualCycle,
    getNextPredictedDate,
    getAverageCycleLength
  } = useFamily();

  const [showAddForm, setShowAddForm] = useState(false);

  // Trouver le cycle en cours (qui n'a pas de date de fin)
  const currentCycle = menstrualCycles.find(cycle => cycle.endDate === null);

  // Trier les cycles terminés par date (plus récent en premier)
  const completedCycles = menstrualCycles
    .filter(cycle => cycle.endDate !== null)
    .sort((a, b) => b.startDate.getTime() - a.startDate.getTime());

  const nextPredictedDate = getNextPredictedDate();
  const averageCycleLength = getAverageCycleLength();

  const handleStartCycle = () => {
    if (currentCycle) {
      Alert.alert('Attention', 'Un cycle est déjà en cours. Terminez-le avant d\'en commencer un nouveau.');
      return;
    }

    addMenstrualCycle({
      startDate: new Date(),
      endDate: null,
      notes: ''
    });
  };

  const handleEndCycle = () => {
    if (!currentCycle) return;

    updateMenstrualCycle(currentCycle.id, {
      endDate: new Date()
    });

    Alert.alert('Terminé', 'Le cycle a été enregistré avec succès.');
  };

  const handleDeleteCycle = (id: string) => {
    Alert.alert(
      'Supprimer',
      'Êtes-vous sûr de vouloir supprimer ce cycle ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: () => deleteMenstrualCycle(id)
        }
      ]
    );
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  };

  const getCycleDuration = (startDate: Date, endDate: Date | null) => {
    if (!endDate) return null;
    const days = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getDaysUntilNext = () => {
    if (!nextPredictedDate) return null;
    const today = new Date();
    const days = Math.round((nextPredictedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const daysUntilNext = getDaysUntilNext();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="water" size={24} color={colors.gold} />
        <Text style={styles.title}>Suivi Menstruel - Anna</Text>
      </View>

      {/* Cycle en cours */}
      {currentCycle && (
        <View style={styles.currentCycleCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>🩸 Cycle en cours</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>En cours</Text>
            </View>
          </View>
          <Text style={styles.cycleInfo}>
            Début: {formatDate(currentCycle.startDate)}
          </Text>
          <Text style={styles.cycleInfo}>
            Durée actuelle: {Math.round((new Date().getTime() - currentCycle.startDate.getTime()) / (1000 * 60 * 60 * 24))} jours
          </Text>
          <TouchableOpacity style={styles.endButton} onPress={handleEndCycle}>
            <Text style={styles.endButtonText}>Terminer le cycle</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Prédiction */}
      {!currentCycle && completedCycles.length >= 2 && nextPredictedDate && (
        <View style={styles.predictionCard}>
          <Text style={styles.predictionTitle}>📅 Prochaines règles prévues</Text>
          <Text style={styles.predictionDate}>{formatDate(nextPredictedDate)}</Text>
          {daysUntilNext !== null && (
            <Text style={styles.predictionDays}>
              {daysUntilNext > 0 
                ? `Dans ${daysUntilNext} jour${daysUntilNext > 1 ? 's' : ''}`
                : daysUntilNext === 0 
                  ? 'Aujourd\'hui'
                  : `Il y a ${Math.abs(daysUntilNext)} jour${Math.abs(daysUntilNext) > 1 ? 's' : ''}`
              }
            </Text>
          )}
          {averageCycleLength && (
            <Text style={styles.averageInfo}>
              Durée moyenne du cycle: {averageCycleLength} jours
            </Text>
          )}
        </View>
      )}

      {/* Bouton pour démarrer un nouveau cycle */}
      {!currentCycle && (
        <TouchableOpacity style={styles.startButton} onPress={handleStartCycle}>
          <Ionicons name="add-circle" size={24} color={colors.almostBlack} />
          <Text style={styles.startButtonText}>Déclarer mes règles</Text>
        </TouchableOpacity>
      )}

      {/* Message si pas assez de données */}
      {!currentCycle && completedCycles.length < 2 && completedCycles.length > 0 && (
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color={colors.gold} />
          <Text style={styles.infoText}>
            Enregistrez au moins 2 cycles complets pour obtenir une prédiction.
          </Text>
        </View>
      )}

      {/* Message si aucune donnée */}
      {completedCycles.length === 0 && !currentCycle && (
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color={colors.gold} />
          <Text style={styles.infoText}>
            Commencez à enregistrer les cycles menstruels d'Anna pour suivre et prédire les prochaines règles.
          </Text>
        </View>
      )}

      {/* Historique */}
      {completedCycles.length > 0 && (
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>📊 Historique</Text>
          <ScrollView style={styles.historyList}>
            {completedCycles.map((cycle) => {
              const duration = getCycleDuration(cycle.startDate, cycle.endDate);
              return (
                <View key={cycle.id} style={styles.historyItem}>
                  <View style={styles.historyItemContent}>
                    <Text style={styles.historyDate}>
                      {formatDate(cycle.startDate)} → {cycle.endDate && formatDate(cycle.endDate)}
                    </Text>
                    <Text style={styles.historyDuration}>
                      {duration} jour{duration && duration > 1 ? 's' : ''}
                    </Text>
                    {cycle.notes && (
                      <Text style={styles.historyNotes}>{cycle.notes}</Text>
                    )}
                  </View>
                  <TouchableOpacity 
                    onPress={() => handleDeleteCycle(cycle.id)}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="trash-outline" size={20} color={colors.error} />
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.darkGray,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: spacing.sm,
    color: colors.gold,
  },
  currentCycleCard: {
    backgroundColor: colors.mediumGray,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.gold + '40',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.gold,
  },
  badge: {
    backgroundColor: colors.gold,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: colors.almostBlack,
    fontSize: 12,
    fontWeight: 'bold',
  },
  cycleInfo: {
    fontSize: 14,
    color: colors.white,
    marginBottom: 4,
  },
  endButton: {
    backgroundColor: colors.gold,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  endButtonText: {
    color: colors.almostBlack,
    fontWeight: 'bold',
    fontSize: 14,
  },
  predictionCard: {
    backgroundColor: colors.mediumGray,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gold + '60',
  },
  predictionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.gold,
    marginBottom: spacing.sm,
  },
  predictionDate: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  predictionDays: {
    fontSize: 14,
    color: colors.lightGray,
    marginBottom: spacing.sm,
  },
  averageInfo: {
    fontSize: 12,
    color: colors.lightGray,
    fontStyle: 'italic',
  },
  startButton: {
    backgroundColor: colors.gold,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  startButtonText: {
    color: colors.almostBlack,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: spacing.sm,
  },
  infoCard: {
    backgroundColor: colors.mediumGray,
    padding: spacing.sm,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.gold + '30',
  },
  infoText: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: 14,
    color: colors.lightGray,
  },
  historySection: {
    marginTop: spacing.sm,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.gold,
    marginBottom: spacing.sm,
  },
  historyList: {
    maxHeight: 300,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.mediumGray,
    padding: spacing.sm,
    borderRadius: 8,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.mediumGray,
  },
  historyItemContent: {
    flex: 1,
  },
  historyDate: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 4,
  },
  historyDuration: {
    fontSize: 13,
    color: colors.lightGray,
  },
  historyNotes: {
    fontSize: 12,
    color: colors.lightGray,
    fontStyle: 'italic',
    marginTop: 4,
  },
  deleteButton: {
    padding: spacing.sm,
  },
});
