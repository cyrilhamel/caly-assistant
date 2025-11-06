import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';

interface SwipeableTabWrapperProps {
  children: ReactNode;
  currentRoute: string;
}

const tabRoutes = {
  '/': '/(tabs)/agenda',
  '/(tabs)': '/(tabs)/agenda',
  '/(tabs)/agenda': { prev: '/(tabs)', next: '/(tabs)/kanban' },
  '/(tabs)/kanban': { prev: '/(tabs)/agenda', next: '/(tabs)/health' },
  '/(tabs)/health': { prev: '/(tabs)/kanban', next: '/(tabs)/family' },
  '/(tabs)/family': { prev: '/(tabs)/health', next: '/(tabs)/empire' },
  '/(tabs)/empire': { prev: '/(tabs)/family', next: '/(tabs)/settings' },
  '/(tabs)/settings': { prev: '/(tabs)/empire', next: null },
};

export function SwipeableTabWrapper({ children, currentRoute }: SwipeableTabWrapperProps) {
  const router = useRouter();

  const gesture = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .onEnd((event) => {
      const threshold = 80; // Seuil de détection du swipe
      const navigation = tabRoutes[currentRoute as keyof typeof tabRoutes];

      if (typeof navigation === 'object') {
        if (event.translationX > threshold && navigation.prev) {
          // Swipe vers la droite → page précédente
          router.push(navigation.prev as any);
        } else if (event.translationX < -threshold && navigation.next) {
          // Swipe vers la gauche → page suivante
          router.push(navigation.next as any);
        }
      } else if (typeof navigation === 'string') {
        // Pour la page d'accueil
        if (event.translationX < -threshold) {
          router.push(navigation as any);
        }
      }
    });

  return (
    <GestureDetector gesture={gesture}>
      <View style={styles.container}>
        {children}
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
