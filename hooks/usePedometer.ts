import { useEffect, useState } from 'react';
import { Pedometer } from 'expo-sensors';
import { Platform } from 'react-native';

export function usePedometer() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);
  const [currentSteps, setCurrentSteps] = useState(0);

  useEffect(() => {
    // Vérifier si le podomètre est disponible sur cet appareil
    const checkAvailability = async () => {
      const available = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(available);
    };

    checkAvailability();

    // S'abonner aux mises à jour en temps réel (fonctionne sur Android)
    let subscription: any;
    
    if (Platform.OS !== 'web') {
      subscription = Pedometer.watchStepCount(result => {
        // Incrémenter les pas depuis le début de la session
        setCurrentSteps(prev => prev + result.steps);
      });
    }

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return {
    isPedometerAvailable,
    currentSteps,
  };
}
