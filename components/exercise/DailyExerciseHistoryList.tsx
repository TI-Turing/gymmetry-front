import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';

const DailyExerciseHistoryList = React.memo(() => {
  const servicePlaceholder = useCallback(() => Promise.resolve([]), []);
  const loadDailyExerciseHistory = useCallback(async () => {
    try {
      // Placeholder for actual service call

      const result = await servicePlaceholder();

      return result || [];
    } catch (_error) {return [];
  }
  }, []);

  const renderDailyExerciseHistoryItem = useCallback(
    ({ item }: { item: any }) => (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {item.exerciseName || item.name || 'Ejercicio'}
          </Text>
          <Text style={styles.statusText}>
            {item.isCompleted
              ? 'Completado'
              : item.isInProgress
                ? 'En progreso'
                : 'Pendiente'}
          </Text>
        </View>

        <Text style={styles.description}>
          {item.description || item.muscleGroup || 'Ejercicio del día'}
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Fecha:</Text>
          <Text style={styles.value}>
            {item.date
              ? new Date(item.date).toLocaleDateString('es-ES')
              : 'Hoy'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Series:</Text>
          <Text style={styles.value}>
            {item.completedSets || '0'} / {item.totalSets || '0'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Repeticiones:</Text>
          <Text style={styles.value}>
            {item.averageReps || item.reps || '0'} por serie
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Peso:</Text>
          <Text style={styles.value}>
            {item.weight || item.maxWeight || '0'} kg
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Tiempo descanso:</Text>
          <Text style={styles.value}>
            {item.restTime
              ? `${Math.floor(item.restTime / 60)}:${String(
                  item.restTime % 60
                ).padStart(2, '0')}`
              : 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Duración:</Text>
          <Text style={styles.value}>
            {item.duration
              ? `${Math.floor(item.duration / 60)}:${String(
                  item.duration % 60
                ).padStart(2, '0')}`
              : 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Calorías:</Text>
          <Text style={styles.value}>
            {item.caloriesBurned || item.calories || '0'} kcal
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
                      : '#4caf50'
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
          <Text style={styles.label}>Grupo muscular:</Text>
          <Text style={styles.value}>
            {item.muscleGroup || item.targetMuscle || 'General'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Equipo usado:</Text>
          <Text style={styles.value}>
            {item.equipment || item.machine || 'Peso libre'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Técnica:</Text>
          <Text
            style={[
              styles.value,
              {
                color:
                  item.technique === 'excellent'
                    ? '#4caf50'
                    : item.technique === 'good'
                      ? '#8bc34a'
                      : item.technique === 'average'
                        ? '#ffa726'
                        : '#ff6b6b'
  },
            ]}
          >
            {item.technique === 'excellent'
              ? '⭐ Excelente'
              : item.technique === 'good'
                ? '👍 Buena'
                : item.technique === 'average'
                  ? '👌 Regular'
                  : '👎 Mejorable'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Tiempo inicio:</Text>
          <Text style={styles.value}>
            {item.startTime
              ? new Date(item.startTime).toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Tiempo fin:</Text>
          <Text style={styles.value}>
            {item.endTime
              ? new Date(item.endTime).toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit'
})
              : 'No finalizado'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Progreso:</Text>
          <Text style={styles.value}>
            {item.progress
              ? `${item.progress}% completado`
              : item.isCompleted
                ? '100% completado'
                : '0% completado'}
          </Text>
        </View>

        {item.personalRecord && (
          <View style={styles.recordSection}>
            <Text style={styles.recordLabel}>🏆 Récord personal:</Text>
            <Text style={styles.recordText}>
              {item.personalRecord.type === 'weight'
                ? `Peso máximo: ${item.personalRecord.value} kg`
                : item.personalRecord.type === 'reps'
                  ? `Más repeticiones: ${item.personalRecord.value}`
                  : `Mejor tiempo: ${item.personalRecord.value}`}
            </Text>
          </View>
        )}

        {item.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>Observaciones:</Text>
            <Text style={styles.notesText}>💭 {item.notes}</Text>
          </View>
        )}
      </View>
    ),
    []
  );

  const keyExtractor = useCallback(
    (item: any) =>
      item.id ||
      item.exerciseHistoryId ||
      item.exerciseId ||
      String(Math.random()),
    []
  );

  return (
    <EntityList
      title='Historial de Ejercicios Diarios'
      loadFunction={loadDailyExerciseHistory}
      renderItem={renderDailyExerciseHistoryItem}
      keyExtractor={keyExtractor}
      emptyTitle='No hay historial'
      emptyMessage='No se encontró historial de ejercicios'
      loadingMessage='Cargando historial de ejercicios...'
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
    elevation: 3
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: Colors.light.text,
    flex: 1,
    marginRight: SPACING.sm
  },
  statusText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: Colors.light.tabIconSelected,
    color: Colors.light.background
  },
  description: {
    fontSize: FONT_SIZES.md,
    color: Colors.light.tabIconDefault,
    marginBottom: SPACING.sm,
    lineHeight: 20
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginVertical: SPACING.xs
  },
  label: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault,
    fontWeight: '500',
    minWidth: 140
  },
  value: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    flex: 1
  },
  recordSection: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.tabIconDefault + '20',
    backgroundColor: '#f0f9ff',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm
  },
  recordLabel: {
    fontSize: FONT_SIZES.sm,
    color: '#0066cc',
    fontWeight: '600',
    marginBottom: SPACING.xs
  },
  recordText: {
    fontSize: FONT_SIZES.sm,
    color: '#0066cc',
    fontWeight: '500'
  },
  notesSection: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.tabIconDefault + '20'
  },
  notesLabel: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault,
    fontWeight: '500',
    marginBottom: SPACING.xs
  },
  notesText: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    fontStyle: 'italic',
    lineHeight: 18
  }
});

DailyExerciseHistoryList.displayName = 'DailyExerciseHistoryList';

export default DailyExerciseHistoryList;
