import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, Chip } from 'react-native-paper';
import { AgendaEvent } from '@/types/agenda';
import { colors } from '@/constants/theme';

interface DayViewProps {
  events: AgendaEvent[];
  date: Date;
  onEventPress: (event: AgendaEvent) => void;
}

export function DayView({ events, date, onEventPress }: DayViewProps) {
  // Horaires affichés : 6h - 23h (horaires de travail 9h-16h30 pour auto-planification)
  const startHour = 6;
  const endHour = 23;
  const slotHeight = 60; // Hauteur pour 30 minutes

  const getEventColor = (event: AgendaEvent) => {
    if (event.isFixed) return colors.gold;
    if (event.status === 'validated') return colors.success;
    if (event.status === 'postponed') return colors.error;
    if (event.priority === 'urgent') return colors.error;
    return colors.lightGray;
  };

  const getEventIcon = (event: AgendaEvent) => {
    if (event.isFixed) return '📌';
    if (event.status === 'completed') return '✅';
    if (event.status === 'validated') return '👍';
    if (event.status === 'in-progress') return '⏱️';
    if (event.priority === 'urgent') return '🔥';
    return '📋';
  };

  // Calcule la position Y en pixels depuis 9h
  const getEventPosition = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = (hours - startHour) * 60 + minutes;
    return (totalMinutes / 30) * slotHeight;
  };

  // Calcule la hauteur en pixels basée sur la durée
  const getEventHeight = (duration: number): number => {
    return (duration / 30) * slotHeight;
  };

  // Génère les lignes d'heures
  const renderTimeGrid = () => {
    const lines = [];
    for (let hour = startHour; hour < endHour; hour++) {
      // Sauter 12h (pause déjeuner)
      if (hour === 12) continue;
      
      lines.push(
        <View key={`${hour}:00`} style={[styles.timeLine, { top: getEventPosition(`${hour}:00`) }]}>
          <Text style={styles.timeLabel}>{`${hour.toString().padStart(2, '0')}:00`}</Text>
        </View>
      );
      lines.push(
        <View key={`${hour}:30`} style={[styles.timeLine, { top: getEventPosition(`${hour}:30`) }]}>
          <Text style={styles.timeLabelSmall}>{`${hour.toString().padStart(2, '0')}:30`}</Text>
        </View>
      );
    }
    return lines;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.timeline}>
        {renderTimeGrid()}
        
        {/* Événements en position absolue */}
        {events.map((event) => {
          const top = getEventPosition(event.time);
          const height = getEventHeight(event.actualDuration || event.duration);
          
          return (
            <Surface
              key={event.id}
              style={[
                styles.eventCard,
                {
                  top,
                  height: Math.max(height, 50), // Minimum 50px
                  borderLeftColor: getEventColor(event),
                }
              ]}
              elevation={2}
              onTouchEnd={() => onEventPress(event)}
            >
              <View style={styles.eventHeader}>
                <Text style={styles.eventIcon}>{getEventIcon(event)}</Text>
                <Text style={styles.eventTitle} numberOfLines={1}>
                  {event.title}
                </Text>
              </View>
              {event.description && height > 80 && (
                <Text style={styles.eventDescription} numberOfLines={2}>
                  {event.description}
                </Text>
              )}
              <View style={styles.eventFooter}>
                <Text style={styles.chipText}>
                  ⏱️ {event.actualDuration || event.duration}min
                </Text>
                {event.stepIndex !== undefined && event.stepIndex > 0 && (
                  <Text style={styles.chipText}>🔗 Étape {event.stepIndex + 1}</Text>
                )}
                {event.isFixed && (
                  <Text style={styles.chipText}>📌 Fixe</Text>
                )}
                {!event.isFixed && event.status === 'scheduled' && (
                  <Text style={styles.chipText}>🤖 Auto</Text>
                )}
              </View>
            </Surface>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.almostBlack,
  },
  timeline: {
    padding: 16,
    position: 'relative',
    minHeight: 2040, // Hauteur pour 6h-23h (17 heures × 2 slots × 60px)
    paddingLeft: 70,
  },
  timeLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.lightGray + '30',
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeLabel: {
    position: 'absolute',
    left: 16,
    fontSize: 14,
    color: colors.mediumGray,
    fontWeight: '500',
    width: 50,
    backgroundColor: colors.almostBlack,
  },
  timeLabelSmall: {
    position: 'absolute',
    left: 16,
    fontSize: 12,
    color: colors.lightGray,
    width: 50,
    backgroundColor: colors.almostBlack,
  },
  eventCard: {
    position: 'absolute',
    left: 70,
    right: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.darkGray,
    borderLeftWidth: 4,
    justifyContent: 'space-between',
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  eventTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  eventDescription: {
    fontSize: 14,
    color: colors.lightGray,
    marginBottom: 8,
  },
  eventFooter: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 4,
  },
  chipText: {
    fontSize: 12,
    color: colors.lightGray,
    fontWeight: '500',
  },
});
