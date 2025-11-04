import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Dialog, Portal, Button, Text, TextInput } from 'react-native-paper';
import { colors } from '@/constants/theme';

interface SleepDialogProps {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: (hours: number) => void;
}

export function SleepDialog({ visible, onDismiss, onConfirm }: SleepDialogProps) {
  const [hours, setHours] = useState('7');

  const handleConfirm = () => {
    const hoursNum = parseFloat(hours) || 7;
    onConfirm(Math.min(12, Math.max(0, hoursNum))); // Entre 0 et 12h
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title style={styles.title}>☀️ Bonjour !</Dialog.Title>
        <Dialog.Content>
          <Text style={styles.question}>
            Combien d'heures avez-vous dormi cette nuit ?
          </Text>
          <TextInput
            label="Heures de sommeil"
            value={hours}
            onChangeText={setHours}
            keyboardType="decimal-pad"
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: colors.gold } }}
          />
          <Text style={styles.hint}>
            Recommandation : 7-9 heures pour une énergie optimale
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss} textColor={colors.lightGray}>
            Plus tard
          </Button>
          <Button onPress={handleConfirm} textColor={colors.gold}>
            Valider
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.gold,
    fontSize: 24,
    fontWeight: 'bold',
  },
  question: {
    fontSize: 16,
    color: colors.white,
    marginBottom: 16,
  },
  input: {
    backgroundColor: colors.darkGray,
    marginBottom: 8,
  },
  hint: {
    fontSize: 12,
    color: colors.mediumGray,
    fontStyle: 'italic',
  },
});
