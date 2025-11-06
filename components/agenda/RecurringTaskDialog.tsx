import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Dialog,
  Portal,
  Button,
  Text,
  Card,
  TextInput,
  Chip,
  SegmentedButtons,
  IconButton,
} from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import { RecurringTaskTemplate, RECURRING_TEMPLATES } from '@/types/agenda';
import { colors } from '@/constants/theme';

interface RecurringTaskDialogProps {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: (template: RecurringTaskTemplate, startDate: Date, endDate: Date, customDuration?: number) => void;
}

export function RecurringTaskDialog({ visible, onDismiss, onConfirm }: RecurringTaskDialogProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<RecurringTaskTemplate | null>(null);
  const [customDuration, setCustomDuration] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date;
  });
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const handleConfirm = () => {
    if (selectedTemplate) {
      const duration = selectedTemplate.id === 'balade-louis' 
        ? parseInt(customDuration) || selectedTemplate.steps[0].duration
        : undefined;
      console.log('[RecurringDialog] Durée choisie:', duration, 'min');
      onConfirm(selectedTemplate, startDate, endDate, duration);
      onDismiss();
      setSelectedTemplate(null);
      setCustomDuration('');
    }
  };

  const handleTemplateSelect = (template: RecurringTaskTemplate) => {
    setSelectedTemplate(template);
    // Si c'est la balade avec Louis, mettre la durée par défaut du template
    if (template.id === 'balade-louis' && template.steps[0]) {
      setCustomDuration(template.steps[0].duration.toString());
    }
  };

  return (
    <>
      <Portal>
        <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
          <Dialog.ScrollArea>
            <ScrollView>
              <Dialog.Title style={styles.dialogTitle}>
                🔁 Ajouter tâche récurrente
              </Dialog.Title>
              
              <Dialog.Content>
                <Text style={styles.sectionTitle}>Choisir un modèle :</Text>
                
                {RECURRING_TEMPLATES.map((template) => (
                  <Card
                    key={template.id}
                    style={[
                      styles.templateCard,
                      selectedTemplate?.id === template.id && styles.selectedCard,
                    ]}
                    onPress={() => handleTemplateSelect(template)}
                  >
                    <Card.Content>
                      <Text style={styles.templateName}>{template.name}</Text>
                      <Text style={styles.templateDescription}>{template.description}</Text>
                      
                      <View style={styles.stepsContainer}>
                        {template.steps.map((step, index) => (
                          <View key={step.id} style={styles.stepRow}>
                            <Text style={styles.stepNumber}>{index + 1}.</Text>
                            <View style={styles.stepInfo}>
                              <Text style={styles.stepTitle}>{step.title}</Text>
                              <View style={styles.stepMeta}>
                                <Text style={styles.durationText}>
                                  ⏱️ {step.duration} min
                                </Text>
                                {step.delayAfterPrevious > 0 && (
                                  <Text style={styles.delayText}>
                                    • {step.delayAfterPrevious}min après
                                  </Text>
                                )}
                              </View>
                            </View>
                          </View>
                        ))}
                      </View>
                    </Card.Content>
                  </Card>
                ))}

                {selectedTemplate && selectedTemplate.id === 'balade-louis' && (
                  <View style={styles.customSection}>
                    <Text style={styles.sectionTitle}>Durée de la balade :</Text>
                    <TextInput
                      label="Minutes"
                      value={customDuration}
                      onChangeText={setCustomDuration}
                      keyboardType="numeric"
                      mode="outlined"
                      style={styles.input}
                      placeholder="Ex: 120 pour 2 heures"
                    />
                    <Text style={styles.helpText}>
                      💡 Indiquez la durée souhaitée en minutes (ex: 120 pour 2h)
                    </Text>
                  </View>
                )}

                {selectedTemplate && (
                  <>
                    <Text style={styles.sectionTitle}>Période de récurrence :</Text>
                    
                    <View style={styles.dateRow}>
                      <View style={styles.dateField}>
                        <Text style={styles.dateLabel}>Début :</Text>
                        <Button
                          mode="outlined"
                          onPress={() => setShowStartDatePicker(true)}
                          icon="calendar"
                        >
                          {startDate.toLocaleDateString('fr-FR')}
                        </Button>
                      </View>
                      
                      <View style={styles.dateField}>
                        <Text style={styles.dateLabel}>Fin :</Text>
                        <Button
                          mode="outlined"
                          onPress={() => setShowEndDatePicker(true)}
                          icon="calendar"
                        >
                          {endDate.toLocaleDateString('fr-FR')}
                        </Button>
                      </View>
                    </View>

                    <Text style={styles.helpText}>
                      💡 Les tâches seront ajoutées chaque semaine et placées automatiquement
                      dans les créneaux disponibles.
                    </Text>
                  </>
                )}
              </Dialog.Content>
            </ScrollView>
          </Dialog.ScrollArea>

          <Dialog.Actions>
            <Button onPress={onDismiss}>Annuler</Button>
            <Button
              onPress={handleConfirm}
              disabled={!selectedTemplate}
              textColor={colors.gold}
            >
              Ajouter
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* DatePickers */}
      <DatePickerModal
        locale="fr"
        mode="single"
        visible={showStartDatePicker}
        onDismiss={() => setShowStartDatePicker(false)}
        date={startDate}
        onConfirm={(params) => {
          setStartDate(params.date as Date);
          setShowStartDatePicker(false);
        }}
        label="Date de début"
      />

      <DatePickerModal
        locale="fr"
        mode="single"
        visible={showEndDatePicker}
        onDismiss={() => setShowEndDatePicker(false)}
        date={endDate}
        onConfirm={(params) => {
          setEndDate(params.date as Date);
          setShowEndDatePicker(false);
        }}
        label="Date de fin"
      />
    </>
  );
}

const styles = StyleSheet.create({
  dialog: {
    maxHeight: '80%',
  },
  dialogTitle: {
    color: colors.gold,
    fontSize: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
    marginTop: 16,
    marginBottom: 12,
  },
  templateCard: {
    marginBottom: 12,
    backgroundColor: colors.darkGray,
  },
  selectedCard: {
    borderColor: colors.gold,
    borderWidth: 2,
  },
  templateName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  templateDescription: {
    fontSize: 14,
    color: colors.lightGray,
    marginBottom: 12,
  },
  stepsContainer: {
    gap: 8,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumber: {
    fontSize: 14,
    color: colors.gold,
    fontWeight: 'bold',
    marginRight: 8,
    marginTop: 2,
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    color: colors.white,
    marginBottom: 4,
  },
  stepMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  durationText: {
    fontSize: 13,
    color: colors.gold,
    fontWeight: '600',
  },
  durationChip: {
    height: 24,
  },
  delayText: {
    fontSize: 12,
    color: colors.mediumGray,
    fontStyle: 'italic',
  },
  customSection: {
    marginTop: 16,
  },
  input: {
    marginBottom: 12,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  dateField: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 14,
    color: colors.lightGray,
    marginBottom: 8,
  },
  helpText: {
    fontSize: 13,
    color: colors.mediumGray,
    fontStyle: 'italic',
    marginTop: 12,
    padding: 12,
    backgroundColor: colors.almostBlack,
    borderRadius: 8,
  },
});
