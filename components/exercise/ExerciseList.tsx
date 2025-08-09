import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';
import { exerciseService } from '@/services';

const ExerciseList = React.memo(() => {
  const loadExercises = useCallback(async () => {
    const response = await exerciseService.getAllExercises();
    return response.Success ? response.Data || [] : [];
  }, []);

  const renderExerciseItem = useCallback(
    ({ item }: { item: any }) => (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {item.name || 'Ejercicio sin nombre'}
          </Text>
          <Text style={styles.statusText}>
            {item.difficulty || 'Intermedio'}
          </Text>
        </View>

        <Text style={styles.description}>
          {item.description || 'Sin descripción disponible'}
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Categoría:</Text>
          <Text style={styles.value}>{item.category || 'General'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Músculos:</Text>
          <Text style={styles.value}>{item.targetMuscles || 'N/A'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Equipamiento:</Text>
          <Text style={styles.value}>
            {item.equipment || 'Sin equipamiento'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Duración:</Text>
          <Text style={styles.value}>{item.duration || 'Variable'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Calorías:</Text>
          <Text style={styles.value}>{item.caloriesBurned || 0} kcal/min</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Usado en:</Text>
          <Text style={styles.value}>{item.routineCount || 0} rutinas</Text>
        </View>
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
      title='Ejercicios'
      loadFunction={loadExercises}
      renderItem={renderExerciseItem}
      keyExtractor={keyExtractor}
      emptyTitle='No hay ejercicios'
      emptyMessage='No se encontraron ejercicios configurados'
      loadingMessage='Cargando ejercicios...'
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
    minWidth: 100
  },
  value: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    flex: 1

}});

ExerciseList.displayName = 'ExerciseList';

export default ExerciseList;
