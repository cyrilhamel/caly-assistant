import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Card, Title, Paragraph, Chip, FAB, IconButton, Portal, Dialog, Button, TextInput, Menu } from 'react-native-paper';
import { colors, spacing } from '@/constants/theme';
import { useTasks } from '@/contexts/TaskContext';
import { useFamily } from '@/contexts/FamilyContext';
import { useState } from 'react';
import type { ShoppingCategory } from '@/types/app';
import { SwipeableTabWrapper } from '@/components/common/SwipeableTabWrapper';

export default function Kanban() {
  const { tasks, moveTask, deleteTask, addTask } = useTasks();
  const { shoppingList, addShoppingItem, toggleShoppingItem, deleteShoppingItem, clearShoppingList } = useFamily();
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ShoppingCategory>('Sec');
  const [newTaskDuration, setNewTaskDuration] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState<'urgent' | 'in-progress' | 'todo' | 'done'>('todo');

  const categories: ShoppingCategory[] = ['Sec', 'Légumes', 'Frais', 'Viandes', 'Surgelé'];

  const urgentTasks = tasks.filter(t => t.status === 'urgent');
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  const todoTasks = tasks.filter(t => t.status === 'todo');
  const doneTasks = tasks.filter(t => t.status === 'done');

  const handleMoveTask = (taskId: string, newStatus: 'urgent' | 'in-progress' | 'todo' | 'done') => {
    moveTask(taskId, newStatus);
  };

  const handleDeleteTask = (taskId: string, taskTitle: string) => {
    Alert.alert(
      'Supprimer la tâche',
      `Êtes-vous sûr de vouloir supprimer "${taskTitle}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: () => deleteTask(taskId) },
      ]
    );
  };

  const handleAddShoppingItem = () => {
    if (newItemName.trim()) {
      addShoppingItem(newItemName.trim(), selectedCategory);
      setNewItemName('');
    }
  };

  const handleClearShoppingList = () => {
    const uncheckedCount = shoppingList.filter(item => !item.checked).length;
    Alert.alert(
      'Terminer les courses',
      uncheckedCount > 0 
        ? `${uncheckedCount} produit(s) non acheté(s) seront gardés pour la prochaine liste.`
        : 'Supprimer tous les produits ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Confirmer', onPress: () => clearShoppingList() },
      ]
    );
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask({
        title: newTaskTitle,
        description: newTaskDescription,
        status: newTaskStatus,
        category: 'other',
        tags: [],
        duration: newTaskDuration ? parseInt(newTaskDuration) : undefined,
      });
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskDuration('');
      setNewTaskStatus('todo');
      setShowAddTask(false);
    }
  };

  const renderTask = (task: typeof tasks[0]) => (
    <Card key={task.id} style={[styles.card, task.status === 'urgent' && styles.urgentCard]} mode="contained">
      <Card.Content>
        <View style={styles.taskHeader}>
          <View style={styles.taskTitleRow}>
            <Text style={styles.taskTitle}>{task.title}</Text>
            {task.duration && (
              <Chip icon="clock-outline" compact style={styles.durationChip}>
                {task.duration}min
              </Chip>
            )}
          </View>
          <IconButton
            icon="delete"
            size={20}
            iconColor={colors.error}
            onPress={() => handleDeleteTask(task.id, task.title)}
          />
        </View>
        <Paragraph style={styles.cardText}>{task.description}</Paragraph>
        <View style={styles.chipContainer}>
          {task.tags.map((tag, index) => (
            <Chip key={index} compact>{tag}</Chip>
          ))}
        </View>
        <View style={styles.actionButtons}>
          {task.status !== 'urgent' && (
            <Chip icon="alert" compact onPress={() => handleMoveTask(task.id, 'urgent')}>
              Urgent
            </Chip>
          )}
          {task.status !== 'in-progress' && (
            <Chip icon="play" compact onPress={() => handleMoveTask(task.id, 'in-progress')}>
              En cours
            </Chip>
          )}
          {task.status !== 'done' && (
            <Chip icon="check" compact onPress={() => handleMoveTask(task.id, 'done')}>
              Terminé
            </Chip>
          )}
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <SwipeableTabWrapper currentRoute="/(tabs)/kanban">
    <>
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>📋 Planification</Title>
        <Paragraph>Vue Kanban / Agenda synchronisé</Paragraph>
      </View>

      <View style={styles.section}>
        <Title style={styles.sectionTitle}>🔴 Urgent</Title>
        {urgentTasks.map(renderTask)}
      </View>

      <View style={styles.section}>
        <Title style={styles.sectionTitle}>🟡 En cours</Title>
        {inProgressTasks.map(renderTask)}
      </View>

      <View style={styles.section}>
        <Title style={styles.sectionTitle}>🟢 À faire</Title>
        {todoTasks.map(renderTask)}
      </View>

      <View style={styles.section}>
        <Title style={styles.sectionTitle}>✅ Terminé</Title>
        {doneTasks.map(renderTask)}
      </View>

      {/* Liste de Courses */}
      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Title style={styles.cardTitle}>🛒 Liste de Courses</Title>
          
          {/* Formulaire d'ajout */}
          <View style={styles.addItemForm}>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.shoppingInput}
                placeholder="Produit à ajouter..."
                placeholderTextColor={colors.lightGray}
                value={newItemName}
                onChangeText={setNewItemName}
              />
              <Menu
                visible={categoryMenuVisible}
                onDismiss={() => setCategoryMenuVisible(false)}
                anchor={
                  <Button 
                    mode="outlined" 
                    onPress={() => setCategoryMenuVisible(true)}
                    textColor={colors.gold}
                    style={styles.categoryButton}
                  >
                    {selectedCategory}
                  </Button>
                }
              >
                {categories.map(cat => (
                  <Menu.Item 
                    key={cat}
                    onPress={() => {
                      setSelectedCategory(cat);
                      setCategoryMenuVisible(false);
                    }} 
                    title={cat} 
                  />
                ))}
              </Menu>
            </View>
            <Button 
              mode="contained" 
              onPress={handleAddShoppingItem}
              buttonColor={colors.gold}
              textColor={colors.almostBlack}
              icon="plus"
              style={styles.addShoppingButton}
            >
              Ajouter
            </Button>
          </View>

          {/* Liste par catégorie */}
          {categories.map(category => {
            const items = shoppingList.filter(item => item.category === category);
            if (items.length === 0) return null;
            
            return (
              <View key={category} style={styles.categorySection}>
                <Text style={styles.categoryTitle}>{category}</Text>
                {items.map(item => (
                  <View key={item.id} style={styles.shoppingItem}>
                    <Chip
                      icon={item.checked ? "check-circle" : "circle-outline"}
                      selected={item.checked}
                      onPress={() => toggleShoppingItem(item.id)}
                      textStyle={item.checked ? styles.checkedText : styles.uncheckedText}
                      style={item.checked ? styles.checkedChip : undefined}
                    >
                      {item.name}
                    </Chip>
                    <Button
                      mode="text"
                      textColor={colors.error}
                      onPress={() => deleteShoppingItem(item.id)}
                    >
                      ✕
                    </Button>
                  </View>
                ))}
              </View>
            );
          })}

          {shoppingList.length > 0 && (
            <Button 
              mode="contained" 
              onPress={handleClearShoppingList}
              buttonColor={colors.success}
              textColor={colors.white}
              icon="check-all"
              style={styles.clearButton}
            >
              Terminer les courses
            </Button>
          )}
        </Card.Content>
      </Card>
    </ScrollView>

    <FAB
      icon="plus"
      style={styles.fab}
      color={colors.almostBlack}
      onPress={() => setShowAddTask(true)}
    />

    <Portal>
      <Dialog visible={showAddTask} onDismiss={() => setShowAddTask(false)} style={styles.dialog}>
        <Dialog.Title style={styles.dialogTitle}>Nouvelle tâche</Dialog.Title>
        <Dialog.ScrollArea>
          <ScrollView>
            <Dialog.Content>
              <TextInput
                label="Titre"
                value={newTaskTitle}
                onChangeText={setNewTaskTitle}
                mode="outlined"
                style={styles.input}
                outlineColor={colors.mediumGray}
                activeOutlineColor={colors.gold}
                textColor={colors.white}
              />
              <TextInput
                label="Description"
                value={newTaskDescription}
                onChangeText={setNewTaskDescription}
                mode="outlined"
                multiline
                numberOfLines={3}
                style={styles.input}
                outlineColor={colors.mediumGray}
                activeOutlineColor={colors.gold}
                textColor={colors.white}
              />
              <TextInput
                label="Durée (minutes)"
                value={newTaskDuration}
                onChangeText={setNewTaskDuration}
                mode="outlined"
                keyboardType="numeric"
                placeholder="Ex: 30"
                style={styles.input}
                outlineColor={colors.mediumGray}
                activeOutlineColor={colors.gold}
                textColor={colors.white}
              />
              <Text style={styles.statusLabel}>Statut :</Text>
              <View style={styles.statusChips}>
                <Chip 
                  selected={newTaskStatus === 'urgent'} 
                  onPress={() => setNewTaskStatus('urgent')}
                  style={newTaskStatus === 'urgent' ? styles.selectedChip : undefined}
                >
                  🔴 Urgent
                </Chip>
                <Chip 
                  selected={newTaskStatus === 'in-progress'} 
                  onPress={() => setNewTaskStatus('in-progress')}
                  style={newTaskStatus === 'in-progress' ? styles.selectedChip : undefined}
                >
                  🟡 En cours
                </Chip>
                <Chip 
                  selected={newTaskStatus === 'todo'} 
                  onPress={() => setNewTaskStatus('todo')}
                  style={newTaskStatus === 'todo' ? styles.selectedChip : undefined}
                >
                  🟢 À faire
                </Chip>
              </View>
            </Dialog.Content>
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button textColor={colors.lightGray} onPress={() => setShowAddTask(false)}>
            Annuler
          </Button>
          <Button textColor={colors.gold} onPress={handleAddTask}>
            Ajouter
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
    </>
    </SwipeableTabWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.almostBlack,
    padding: spacing.md,
  },
  header: {
    marginBottom: spacing.lg,
    paddingTop: spacing.sm,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.gold,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    color: colors.gold,
  },
  card: {
    marginBottom: spacing.sm,
    backgroundColor: colors.darkGray,
    borderWidth: 1,
    borderColor: colors.mediumGray,
  },
  urgentCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
    borderColor: colors.gold,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: colors.white,
  },
  chipContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: spacing.sm,
  },
  cardText: {
    color: colors.lightGray,
  },
  cardTitle: {
    color: colors.gold,
    fontSize: 18,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskTitleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  durationChip: {
    backgroundColor: colors.gold + '30',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: spacing.sm,
    flexWrap: 'wrap',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.gold,
  },
  dialog: {
    backgroundColor: colors.darkGray,
  },
  dialogTitle: {
    color: colors.gold,
  },
  input: {
    marginBottom: spacing.md,
    backgroundColor: colors.almostBlack,
  },
  statusLabel: {
    color: colors.white,
    fontSize: 16,
    marginBottom: spacing.sm,
  },
  statusChips: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  selectedChip: {
    backgroundColor: colors.gold + '40',
  },
  addItemForm: {
    marginBottom: spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  shoppingInput: {
    flex: 1,
    backgroundColor: colors.almostBlack,
  },
  addShoppingButton: {
    width: '100%',
  },
  categoryButton: {
    minWidth: 100,
  },
  categorySection: {
    marginVertical: spacing.sm,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.gold,
    marginBottom: spacing.xs,
  },
  shoppingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  checkedText: {
    textDecorationLine: 'line-through',
    color: colors.lightGray,
  },
  uncheckedText: {
    color: colors.white,
  },
  checkedChip: {
    backgroundColor: colors.success + '40',
  },
  clearButton: {
    marginTop: spacing.md,
  },
});
