import { Slot } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { theme } from '@/constants/theme';
import { TaskProvider } from '@/contexts/TaskContext';
import { HealthProvider } from '@/contexts/HealthContext';
import { FamilyProvider } from '@/contexts/FamilyContext';
import { EmpireProvider } from '@/contexts/EmpireContext';
import { AgendaProvider } from '@/contexts/AgendaContext';
import { GoogleCalendarProvider } from '@/contexts/GoogleCalendarContext';
import { fr, registerTranslation } from 'react-native-paper-dates';

registerTranslation('fr', fr);

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <TaskProvider>
          <HealthProvider>
            <FamilyProvider>
              <EmpireProvider>
                <GoogleCalendarProvider>
                  <AgendaProvider>
                    <Slot />
                  </AgendaProvider>
                </GoogleCalendarProvider>
              </EmpireProvider>
            </FamilyProvider>
          </HealthProvider>
        </TaskProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
