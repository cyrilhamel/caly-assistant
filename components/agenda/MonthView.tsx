import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { AgendaEvent } from '@/types/agenda';
import { colors } from '@/constants/theme';

interface MonthViewProps {
  events: AgendaEvent[];
  year: number;
  month: number;
  onDayPress: (date: Date) => void;
}

export function MonthView({ events, year, month, onDayPress }: MonthViewProps) {
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  // Obtenir le premier et dernier jour du mois
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // Obtenir le jour de la semaine du premier jour (0 = dimanche)
  const startDayOfWeek = firstDay.getDay();
  
  // Nombre de jours dans le mois
  const daysInMonth = lastDay.getDate();

  // Générer les jours du calendrier
  const calendarDays: (Date | null)[] = [];
  
  // Ajouter les jours vides avant le début du mois
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Ajouter tous les jours du mois
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(year, month, day));
  }

  const getEventsForDay = (date: Date | null) => {
    if (!date) return [];
    
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const hasUrgentTask = (dayEvents: AgendaEvent[]) => {
    return dayEvents.some(e => e.priority === 'urgent' && !e.isFixed);
  };

  const hasFixedEvent = (dayEvents: AgendaEvent[]) => {
    return dayEvents.some(e => e.isFixed);
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.monthTitle}>{monthNames[month]} {year}</Text>
      
      {/* En-têtes des jours */}
      <View style={styles.weekRow}>
        {dayNames.map((day) => (
          <View key={day} style={styles.dayHeader}>
            <Text style={styles.dayHeaderText}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Grille des jours */}
      <View style={styles.grid}>
        {calendarDays.map((date, index) => {
          const dayEvents = getEventsForDay(date);
          const today = isToday(date);

          return (
            <TouchableOpacity
              key={index}
              style={styles.dayCell}
              onPress={() => date && onDayPress(date)}
              disabled={!date}
            >
              <Surface
                style={[
                  styles.daySurface,
                  !date && styles.emptyDay,
                  today && styles.todayCell,
                ]}
                elevation={date ? 1 : 0}
              >
                {date && (
                  <>
                    <Text style={[styles.dayNumber, today && styles.todayText]}>
                      {date.getDate()}
                    </Text>
                    
                    {/* Indicateurs d'événements */}
                    {dayEvents.length > 0 && (
                      <View style={styles.eventIndicators}>
                        {hasUrgentTask(dayEvents) && (
                          <View style={[styles.dot, styles.urgentDot]} />
                        )}
                        {hasFixedEvent(dayEvents) && (
                          <View style={[styles.dot, styles.fixedDot]} />
                        )}
                        {dayEvents.length > 2 && (
                          <Text style={styles.moreText}>+{dayEvents.length - 2}</Text>
                        )}
                      </View>
                    )}
                  </>
                )}
              </Surface>
            </TouchableOpacity>
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
  monthTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.gold,
    textAlign: 'center',
    marginVertical: 16,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  dayHeader: {
    flex: 1,
    alignItems: 'center',
  },
  dayHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.lightGray,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    padding: 2,
  },
  daySurface: {
    flex: 1,
    borderRadius: 8,
    padding: 4,
    backgroundColor: colors.darkGray,
    justifyContent: 'space-between',
  },
  emptyDay: {
    backgroundColor: 'transparent',
  },
  todayCell: {
    backgroundColor: colors.gold,
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  todayText: {
    color: colors.darkGray,
  },
  eventIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  urgentDot: {
    backgroundColor: colors.error,
  },
  fixedDot: {
    backgroundColor: colors.gold,
  },
  moreText: {
    fontSize: 10,
    color: colors.lightGray,
  },
});
