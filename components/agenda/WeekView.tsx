import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, Chip } from 'react-native-paper';
import { AgendaEvent } from '@/types/agenda';
import { colors } from '@/constants/theme';

interface WeekViewProps {
  events: AgendaEvent[];
  startDate: Date;
  onEventPress: (event: AgendaEvent) => void;
}

export function WeekView({ events, startDate, onEventPress }: WeekViewProps) {
  // Générer les 7 jours de la semaine
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    return date;
  });

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const getEventsForDay = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    }).sort((a, b) => {
      const [aHours, aMinutes] = a.time.split(':').map(Number);
      const [bHours, bMinutes] = b.time.split(':').map(Number);
      return (aHours * 60 + aMinutes) - (bHours * 60 + bMinutes);
    });
  };

  const getEventColor = (event: AgendaEvent) => {
    if (event.isFixed) return colors.gold;
    if (event.status === 'validated') return colors.success;
    if (event.priority === 'urgent') return colors.error;
    return colors.lightGray;
  };

  return (
    <ScrollView horizontal style={styles.container} showsHorizontalScrollIndicator={false}>
      <View style={styles.weekContainer}>
        {weekDays.map((date, index) => {
          const dayEvents = getEventsForDay(date);
          const isToday = 
            date.getDate() === new Date().getDate() &&
            date.getMonth() === new Date().getMonth() &&
            date.getFullYear() === new Date().getFullYear();

          return (
            <View key={index} style={styles.dayColumn}>
              <Surface
                style={[
                  styles.dayHeader,
                  isToday && styles.todayHeader
                ]}
                elevation={1}
              >
                <Text style={[styles.dayName, isToday && styles.todayText]}>
                  {dayNames[date.getDay()]}
                </Text>
                <Text style={[styles.dayNumber, isToday && styles.todayText]}>
                  {date.getDate()}
                </Text>
              </Surface>

              <ScrollView style={styles.eventsColumn}>
                {dayEvents.length === 0 ? (
                  <View style={styles.noEvents}>
                    <Text style={styles.noEventsText}>Aucun événement</Text>
                  </View>
                ) : (
                  dayEvents.map((event) => (
                    <Surface
                      key={event.id}
                      style={[
                        styles.eventCard,
                        { borderLeftColor: getEventColor(event) }
                      ]}
                      elevation={1}
                      onTouchEnd={() => onEventPress(event)}
                    >
                      <Text style={styles.eventTime}>{event.time}</Text>
                      <Text style={styles.eventTitle} numberOfLines={2}>
                        {event.title}
                      </Text>
                      <Text style={styles.eventDuration}>
                        {event.actualDuration || event.duration}min
                      </Text>
                    </Surface>
                  ))
                )}
              </ScrollView>
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
  weekContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  dayColumn: {
    width: 140,
    marginRight: 12,
  },
  dayHeader: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: colors.darkGray,
    marginBottom: 12,
  },
  todayHeader: {
    backgroundColor: colors.gold,
  },
  dayName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.lightGray,
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
  },
  todayText: {
    color: colors.darkGray,
  },
  eventsColumn: {
    flex: 1,
  },
  noEvents: {
    padding: 16,
    alignItems: 'center',
  },
  noEventsText: {
    fontSize: 12,
    color: colors.mediumGray,
    fontStyle: 'italic',
  },
  eventCard: {
    padding: 10,
    borderRadius: 6,
    backgroundColor: colors.darkGray,
    borderLeftWidth: 3,
    marginBottom: 8,
  },
  eventTime: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gold,
    marginBottom: 4,
  },
  eventTitle: {
    fontSize: 14,
    color: colors.white,
    marginBottom: 4,
  },
  eventDuration: {
    fontSize: 11,
    color: colors.mediumGray,
  },
});
