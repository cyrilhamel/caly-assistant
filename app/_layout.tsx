import { Slot } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { theme } from '@/constants/theme';
import { TaskProvider } from '@/contexts/TaskContext';
import { HealthProvider } from '@/contexts/HealthContext';
import { FamilyProvider } from '@/contexts/FamilyContext';
import { EmpireProvider } from '@/contexts/EmpireContext';
import { AgendaProvider } from '@/contexts/AgendaContext';
import { fr, registerTranslation } from 'react-native-paper-dates';

registerTranslation('fr', fr);

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <TaskProvider>
        <HealthProvider>
          <FamilyProvider>
            <EmpireProvider>
              <AgendaProvider>
                <Slot />
              </AgendaProvider>
            </EmpireProvider>
          </FamilyProvider>
        </HealthProvider>
      </TaskProvider>
    </PaperProvider>
  );
}
