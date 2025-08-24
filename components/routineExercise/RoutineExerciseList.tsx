import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';
import { routineexerciseService } from '@/services';

const RoutineExerciseList = React.memo(() => {
  const loadRoutineExercises = useCallback(async () => {
    const response = await routineexerciseService.getAllRoutineExercises();
    return response.Data || [];
  }, []);

  const renderRoutineExerciseItem = useCallback(
    ({ item }: { item: any }) => (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {item.exerciseName || item.name || 'Ejercicio sin nombre'}
          </Text>
          <Text style={styles.statusText}>
            {item.isCompleted ? 'Realizado' : 'Pendiente'}
          </Text>
        </View>

        <Text style={styles.routine}>
          Rutina: {item.routineName || item.routineId || 'N/A'}
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Series:</Text>
          <Text style={styles.value}>{item.sets || 0}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Repeticiones:</Text>
          <Text style={styles.value}>{item.reps || 0}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Peso:</Text>
          <Text style={styles.value}>{item.weight || 'N/A'} kg</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Descanso:</Text>
          <Text style={styles.value}>{item.restTime || 'N/A'} seg</Text>
        </View>

        {item.notes && <Text style={styles.notes}>Notas: {item.notes}</Text>}
      </View>
    ),
    []
  );

  const keyExtractor = useCallback(
    (item: any) => item.id || String(Math.random()),
    []
  );

  return (
    <EntityList
      title="Ejercicios de Rutina"
      loadFunction={loadRoutineExercises}
      renderItem={renderRoutineExerciseItem}
      keyExtractor={keyExtractor}
      emptyTitle="No hay ejercicios"
      emptyMessage="No se encontraron ejercicios en rutinas"
      loadingMessage="Cargando ejercicios..."
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
    backgroundColor: Colors.light.tabIconSelected,
    color: Colors.light.background,
  },
  routine: {
    fontSize: FONT_SIZES.md,
    color: Colors.light.tabIconSelected,
    marginBottom: SPACING.sm,
    fontWeight: '500',
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
    minWidth: 80,
  },
  value: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    flex: 1,
  },
  notes: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault,
    fontStyle: 'italic',
    marginTop: SPACING.sm,
  },
});

RoutineExerciseList.displayName = 'RoutineExerciseList';

export default RoutineExerciseList;
