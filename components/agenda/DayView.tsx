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
  // Horaires de travail (9h-16h30 avec pause déjeuner)
  const hours = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.timeline}>
        {hours.map((hour) => {
          // Trouver les événements pour cette heure
          const hourEvents = events.filter((event) => {
            const [eventHour, eventMinute] = event.time.split(':').map(Number);
            const [currentHour, currentMinute] = hour.split(':').map(Number);
            
            const eventMinutes = eventHour * 60 + eventMinute;
            const currentMinutes = currentHour * 60 + currentMinute;
            
            return eventMinutes === currentMinutes;
          });

          return (
            <View key={hour} style={styles.timeSlot}>
              <Text style={styles.timeLabel}>{hour}</Text>
              <View style={styles.eventContainer}>
                {hourEvents.length === 0 ? (
                  <View style={styles.emptySlot} />
                ) : (
                  hourEvents.map((event) => (
                    <Surface
                      key={event.id}
                      style={[
                        styles.eventCard,
                        { borderLeftColor: getEventColor(event) }
                      ]}
                      elevation={2}
                      onTouchEnd={() => onEventPress(event)}
                    >
                      <View style={styles.eventHeader}>
                        <Text style={styles.eventIcon}>{getEventIcon(event)}</Text>
                        <Text style={styles.eventTitle} numberOfLines={1}>
                          {event.title}
                        </Text>
                        <Chip
                          mode="outlined"
                          compact
                          style={styles.durationChip}
                          textStyle={styles.durationText}
                        >
                          {event.actualDuration || event.duration}min
                        </Chip>
                      </View>
                      {event.description && (
                        <Text style={styles.eventDescription} numberOfLines={2}>
                          {event.description}
                        </Text>
                      )}
                      <View style={styles.eventFooter}>
                        {event.isFixed && (
                          <Chip compact mode="flat" style={styles.fixedChip}>
                            Fixe
                          </Chip>
                        )}
                        {!event.isFixed && event.status === 'scheduled' && (
                          <Chip compact mode="flat" style={styles.scheduledChip}>
                            Auto-planifié
                          </Chip>
                        )}
                      </View>
                    </Surface>
                  ))
                )}
              </View>
            </View>
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
  },
  timeSlot: {
    flexDirection: 'row',
    marginBottom: 8,
    minHeight: 60,
  },
  timeLabel: {
    width: 60,
    fontSize: 14,
    color: colors.mediumGray,
    fontWeight: '500',
  },
  eventContainer: {
    flex: 1,
    marginLeft: 8,
  },
  emptySlot: {
    height: 1,
    backgroundColor: colors.lightGray,
    marginTop: 8,
  },
  eventCard: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.darkGray,
    borderLeftWidth: 4,
    marginBottom: 8,
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
  durationChip: {
    height: 24,
    backgroundColor: colors.mediumGray,
  },
  durationText: {
    fontSize: 12,
    color: colors.white,
  },
  eventDescription: {
    fontSize: 14,
    color: colors.lightGray,
    marginBottom: 8,
  },
  eventFooter: {
    flexDirection: 'row',
    gap: 8,
  },
  fixedChip: {
    height: 24,
    backgroundColor: colors.gold + '20',
  },
  scheduledChip: {
    height: 24,
    backgroundColor: colors.lightGray + '20',
  },
});
