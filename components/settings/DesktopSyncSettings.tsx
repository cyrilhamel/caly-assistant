import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Card, Title, Paragraph, Button, TextInput } from 'react-native-paper';
import { loadDesktopConfig, saveDesktopConfig, pullTasks } from '@/services/desktopSync/DesktopSyncService';
import { useTasks } from '@/contexts/TaskContext';

export default function DesktopSyncSettings() {
  const { reloadDesktopConfig } = useTasks();
  const [address, setAddress] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    loadDesktopConfig().then((c) => {
      if (c) {
        setAddress(c.address);
        setToken(c.token);
      }
    });
  }, []);

  const save = async () => {
    const config = { address: address.trim(), token: token.trim() };
    try {
      await pullTasks(config);
    } catch {
      Alert.alert('Connexion impossible', "Vérifie l'adresse, le jeton, et que le PC et le téléphone sont sur le même Wi‑Fi.");
      return;
    }
    await saveDesktopConfig(config);
    reloadDesktopConfig();
    Alert.alert('Connecté', 'Les tâches sont maintenant synchronisées avec Caly Desktop.');
  };

  return (
    <Card style={{ margin: 16 }}>
      <Card.Content>
        <Title>Caly Desktop (Windows)</Title>
        <Paragraph>Adresse et jeton affichés dans le tableau de bord de l'application Windows.</Paragraph>
        <TextInput label="Adresse (ex: 192.168.1.20:47800)" value={address} onChangeText={setAddress} autoCapitalize="none" mode="outlined" style={{ marginTop: 8 }} />
        <TextInput label="Jeton" value={token} onChangeText={setToken} autoCapitalize="none" mode="outlined" style={{ marginTop: 8 }} />
        <Button mode="contained" onPress={save} style={{ marginTop: 12 }}>Connecter</Button>
      </Card.Content>
    </Card>
  );
}
