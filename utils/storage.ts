import AsyncStorage from '@react-native-async-storage/async-storage';

// Helper pour sauvegarder des données
export const saveData = async <T>(key: string, data: T): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error(`Erreur lors de la sauvegarde de ${key}:`, e);
  }
};

// Helper pour charger des données
export const loadData = async <T>(key: string, defaultValue: T): Promise<T> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    if (jsonValue != null) {
      return JSON.parse(jsonValue, (key, value) => {
        // Reconvertir les dates
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
          return new Date(value);
        }
        return value;
      });
    }
    return defaultValue;
  } catch (e) {
    console.error(`Erreur lors du chargement de ${key}:`, e);
    return defaultValue;
  }
};

// Helper pour supprimer des données
export const clearData = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error(`Erreur lors de la suppression de ${key}:`, e);
  }
};
