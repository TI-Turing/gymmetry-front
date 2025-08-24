import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';

type DailyExerciseItem = {
  id?: string;
  exerciseId?: string;
  dailyExerciseId?: string;
  exerciseName?: string;
  name?: string;
  isCompleted?: boolean;
  isInProgress?: boolean;
  description?: string;
  instructions?: string;
  order?: number;
  position?: number;
  targetSets?: number;
  sets?: number;
  targetReps?: number;
  reps?: number;
  recommendedWeight?: number;
  weight?: number;
  restTime?: number; // seconds
  estimatedDuration?: number; // seconds
  currentSets?: number;
  muscleGroup?: string;
  targetMuscle?: string;
  difficulty?: 'hard' | 'medium' | 'easy' | string;
  equipment?: string;
  requiredEquipment?: string;
  estimatedCalories?: number;
  calories?: number;
  startTime?: string | number | Date;
  endTime?: string | number | Date;
  exerciseType?: 'cardio' | 'strength' | 'flexibility' | 'endurance' | string;
  previousRecord?: { weight?: number; reps?: number; time?: string };
  tips?: string[];
  notes?: string;
};

const DailyExerciseList = React.memo(() => {
  const servicePlaceholder = useCallback(() => Promise.resolve([]), []);
  const loadDailyExercises: () => Promise<DailyExerciseItem[]> =
    useCallback(async () => {
      try {
        // Placeholder for actual service call
        const result = (await servicePlaceholder()) as unknown;
        const items = Array.isArray(result)
          ? (result as DailyExerciseItem[])
          : [];
        return items;
      } catch (_error) {
        return [];
      }
    }, [servicePlaceholder]);

  const renderDailyExerciseItem = useCallback(
    ({ item }: { item: DailyExerciseItem }) => (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {item.exerciseName || item.name || 'Ejercicio del día'}
          </Text>
          <Text
            style={[
              styles.statusText,
              {
                backgroundColor: item.isCompleted
                  ? '#4caf50'
                  : item.isInProgress
                    ? '#ffa726'
                    : '#ff6b6b',
              },
            ]}
          >
            {item.isCompleted
              ? 'Completado'
              : item.isInProgress
                ? 'En curso'
                : 'Pendiente'}
          </Text>
        </View>

        <Text style={styles.description}>
          {item.description || item.instructions || 'Ejercicio diario'}
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Orden en rutina:</Text>
          <Text style={styles.value}>#{item.order || item.position || 1}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Series objetivo:</Text>
          <Text style={styles.value}>
            {item.targetSets || item.sets || '0'} series
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Repeticiones:</Text>
          <Text style={styles.value}>
            {item.targetReps || item.reps || '0'} por serie
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Peso recomendado:</Text>
          <Text style={styles.value}>
            {item.recommendedWeight || item.weight || '0'} kg
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Descanso entre series:</Text>
          <Text style={styles.value}>
            {item.restTime
              ? `${Math.floor(item.restTime / 60)}:${String(
                  item.restTime % 60
                ).padStart(2, '0')}`
              : 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Duración estimada:</Text>
          <Text style={styles.value}>
            {item.estimatedDuration
              ? `${Math.floor(item.estimatedDuration / 60)}:${String(
                  item.estimatedDuration % 60
                ).padStart(2, '0')}`
              : 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Progreso actual:</Text>
          <Text
            style={[
              styles.value,
              {
                color:
                  item.currentSets === item.targetSets ? '#4caf50' : '#ffa726',
              },
            ]}
          >
            {item.currentSets || '0'} / {item.targetSets || '0'} series
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Grupo muscular:</Text>
          <Text style={styles.value}>
            {item.muscleGroup || item.targetMuscle || 'General'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Dificultad:</Text>
          <Text
            style={[
              styles.value,
              {
                color:
                  item.difficulty === 'hard'
                    ? '#ff6b6b'
                    : item.difficulty === 'medium'
                      ? '#ffa726'
                      : '#4caf50',
              },
            ]}
          >
            {item.difficulty === 'hard'
              ? '🔴 Difícil'
              : item.difficulty === 'medium'
                ? '🟡 Medio'
                : '🟢 Fácil'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Equipo necesario:</Text>
          <Text style={styles.value}>
            {item.equipment || item.requiredEquipment || 'Peso libre'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Calorías estimadas:</Text>
          <Text style={styles.value}>
            {item.estimatedCalories || item.calories || '0'} kcal
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Tiempo inicio:</Text>
          <Text style={styles.value}>
            {item.startTime
              ? new Date(item.startTime).toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'No iniciado'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Tiempo fin:</Text>
          <Text style={styles.value}>
            {item.endTime
              ? new Date(item.endTime).toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'No finalizado'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Tipo de ejercicio:</Text>
          <Text style={styles.value}>
            {item.exerciseType === 'cardio'
              ? '🏃 Cardiovascular'
              : item.exerciseType === 'strength'
                ? '🏋️ Fuerza'
                : item.exerciseType === 'flexibility'
                  ? '🤸 Flexibilidad'
                  : item.exerciseType === 'endurance'
                    ? '⏱️ Resistencia'
                    : '💪 General'}
          </Text>
        </View>

        {item.previousRecord && (
          <View style={styles.recordSection}>
            <Text style={styles.recordLabel}>📈 Récord anterior:</Text>
            <Text style={styles.recordText}>
              {item.previousRecord.weight
                ? `Peso: ${item.previousRecord.weight} kg`
                : ''}
              {item.previousRecord.reps
                ? ` • Reps: ${item.previousRecord.reps}`
                : ''}
              {item.previousRecord.time
                ? ` • Tiempo: ${item.previousRecord.time}`
                : ''}
            </Text>
          </View>
        )}

        {item.tips && Array.isArray(item.tips) && (
          <View style={styles.tipsSection}>
            <Text style={styles.tipsLabel}>💡 Consejos de técnica:</Text>
            <View style={styles.tipsList}>
              {item.tips.slice(0, 2).map((tip: string, index: number) => (
                <Text key={index} style={styles.tip}>
                  • {tip}
                </Text>
              ))}
              {item.tips.length > 2 && (
                <Text style={styles.moreTips}>
                  +{item.tips.length - 2} consejos más...
                </Text>
              )}
            </View>
          </View>
        )}

        {item.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>Notas personales:</Text>
            <Text style={styles.notesText}>📝 {item.notes}</Text>
          </View>
        )}
      </View>
    ),
    []
  );

  const keyExtractor = useCallback(
    (item: DailyExerciseItem) =>
      item.id ||
      item.exerciseId ||
      item.dailyExerciseId ||
      String(Math.random()),
    []
  );

  return (
    <EntityList
      title="Ejercicios del Día"
      loadFunction={loadDailyExercises}
      renderItem={renderDailyExerciseItem}
      keyExtractor={keyExtractor}
      emptyTitle="No hay ejercicios"
      emptyMessage="No se encontraron ejercicios para hoy"
      loadingMessage="Cargando ejercicios del día..."
    />
  );
});
const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.background,
    padding: SPACING.md,
    marginVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: Colors.light.text,
    flex: 1,
    marginRight: SPACING.sm,
  },
  statusText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    color: Colors.light.background,
  },
  description: {
    fontSize: FONT_SIZES.md,
    color: Colors.light.tabIconDefault,
    marginBottom: SPACING.sm,
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginVertical: SPACING.xs,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault,
    fontWeight: '500',
    minWidth: 150,
  },
  value: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    flex: 1,
  },
  recordSection: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.tabIconDefault + '20',
    backgroundColor: '#e8f5e8',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  recordLabel: {
    fontSize: FONT_SIZES.sm,
    color: '#2e7d32',
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  recordText: {
    fontSize: FONT_SIZES.sm,
    color: '#2e7d32',
    fontWeight: '500',
  },
  tipsSection: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.tabIconDefault + '20',
    backgroundColor: '#f3e5f5',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  tipsLabel: {
    fontSize: FONT_SIZES.sm,
    color: '#7b1fa2',
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  tipsList: {
    gap: SPACING.xs,
  },
  tip: {
    fontSize: FONT_SIZES.sm,
    color: '#7b1fa2',
    lineHeight: 18,
  },
  moreTips: {
    fontSize: FONT_SIZES.sm,
    color: '#7b1fa2',
    fontStyle: 'italic',
  },
  notesSection: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.tabIconDefault + '20',
  },
  notesLabel: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  notesText: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    fontStyle: 'italic',
    lineHeight: 18,
  },
});

DailyExerciseList.displayName = 'DailyExerciseList';

export default DailyExerciseList;
