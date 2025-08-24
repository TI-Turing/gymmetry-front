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
    } catch (_error) {
      return [];
    }
  }, [servicePlaceholder]);

  const renderDailyExerciseHistoryItem = useCallback(
    ({ item }: { item: unknown }) => {
      const r = (item ?? {}) as Record<string, unknown>;
      const exerciseName =
        (r['exerciseName'] as string) || (r['name'] as string) || 'Ejercicio';
      const isCompleted =
        (r['isCompleted'] as boolean) ?? (r['IsCompleted'] as boolean) ?? false;
      const isInProgress =
        (r['isInProgress'] as boolean) ??
        (r['IsInProgress'] as boolean) ??
        false;
      const description =
        (r['description'] as string) ||
        (r['muscleGroup'] as string) ||
        'Ejercicio del día';
      const dateStr = (r['date'] as string) ?? null;
      const completedSets =
        (r['completedSets'] as number) ?? (r['CompletedSets'] as number) ?? 0;
      const totalSets =
        (r['totalSets'] as number) ?? (r['TotalSets'] as number) ?? 0;
      const averageReps =
        (r['averageReps'] as number) ?? (r['reps'] as number) ?? 0;
      const weight = (r['weight'] as number) ?? (r['maxWeight'] as number) ?? 0;
      const restTime = (r['restTime'] as number) ?? null;
      const duration = (r['duration'] as number) ?? null;
      const calories =
        (r['caloriesBurned'] as number) ?? (r['calories'] as number) ?? 0;
      const difficulty =
        (r['difficulty'] as string) ?? (r['Difficulty'] as string) ?? '';
      const muscleGroup =
        (r['muscleGroup'] as string) ??
        (r['targetMuscle'] as string) ??
        'General';
      const equipment =
        (r['equipment'] as string) ?? (r['machine'] as string) ?? 'Peso libre';
      const technique =
        (r['technique'] as string) ?? (r['Technique'] as string) ?? '';
      const startTime = (r['startTime'] as string) ?? null;
      const endTime = (r['endTime'] as string) ?? null;
      const progress = (r['progress'] as number) ?? null;
      const personalRecord =
        (r['personalRecord'] as {
          type: string;
          value: number | string;
        } | null) ?? null;
      const notes = (r['notes'] as string) ?? null;

      const fmtMinSec = (secs: number | null) =>
        typeof secs === 'number'
          ? `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`
          : 'N/A';

      return (
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>{exerciseName}</Text>
            <Text style={styles.statusText}>
              {isCompleted
                ? 'Completado'
                : isInProgress
                  ? 'En progreso'
                  : 'Pendiente'}
            </Text>
          </View>

          <Text style={styles.description}>{description}</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Fecha:</Text>
            <Text style={styles.value}>
              {dateStr ? new Date(dateStr).toLocaleDateString('es-ES') : 'Hoy'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Series:</Text>
            <Text style={styles.value}>
              {completedSets} / {totalSets}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Repeticiones:</Text>
            <Text style={styles.value}>{averageReps} por serie</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Peso:</Text>
            <Text style={styles.value}>{weight} kg</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Tiempo descanso:</Text>
            <Text style={styles.value}>{fmtMinSec(restTime)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Duración:</Text>
            <Text style={styles.value}>{fmtMinSec(duration)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Calorías:</Text>
            <Text style={styles.value}>{calories} kcal</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Dificultad:</Text>
            <Text
              style={[
                styles.value,
                {
                  color:
                    difficulty === 'hard'
                      ? '#ff6b6b'
                      : difficulty === 'medium'
                        ? '#ffa726'
                        : '#4caf50',
                },
              ]}
            >
              {difficulty === 'hard'
                ? '🔴 Difícil'
                : difficulty === 'medium'
                  ? '🟡 Medio'
                  : '🟢 Fácil'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Grupo muscular:</Text>
            <Text style={styles.value}>{muscleGroup}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Equipo usado:</Text>
            <Text style={styles.value}>{equipment}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Técnica:</Text>
            <Text
              style={[
                styles.value,
                {
                  color:
                    technique === 'excellent'
                      ? '#4caf50'
                      : technique === 'good'
                        ? '#8bc34a'
                        : technique === 'average'
                          ? '#ffa726'
                          : '#ff6b6b',
                },
              ]}
            >
              {technique === 'excellent'
                ? '⭐ Excelente'
                : technique === 'good'
                  ? '👍 Buena'
                  : technique === 'average'
                    ? '👌 Regular'
                    : '👎 Mejorable'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Tiempo inicio:</Text>
            <Text style={styles.value}>
              {startTime
                ? new Date(startTime).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'N/A'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Tiempo fin:</Text>
            <Text style={styles.value}>
              {endTime
                ? new Date(endTime).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'No finalizado'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Progreso:</Text>
            <Text style={styles.value}>
              {typeof progress === 'number'
                ? `${progress}% completado`
                : isCompleted
                  ? '100% completado'
                  : '0% completado'}
            </Text>
          </View>

          {!!personalRecord && (
            <View style={styles.recordSection}>
              <Text style={styles.recordLabel}>🏆 Récord personal:</Text>
              <Text style={styles.recordText}>
                {personalRecord.type === 'weight'
                  ? `Peso máximo: ${personalRecord.value} kg`
                  : personalRecord.type === 'reps'
                    ? `Más repeticiones: ${personalRecord.value}`
                    : `Mejor tiempo: ${personalRecord.value}`}
              </Text>
            </View>
          )}

          {!!notes && (
            <View style={styles.notesSection}>
              <Text style={styles.notesLabel}>Observaciones:</Text>
              <Text style={styles.notesText}>💭 {notes}</Text>
            </View>
          )}
        </View>
      );
    },
    []
  );

  const keyExtractor = useCallback((item: unknown) => {
    const r = (item ?? {}) as Record<string, unknown>;
    const id =
      (r['Id'] as string) ||
      (r['id'] as string) ||
      (r['exerciseHistoryId'] as string) ||
      (r['ExerciseHistoryId'] as string) ||
      (r['exerciseId'] as string) ||
      (r['ExerciseId'] as string) ||
      null;
    return id ?? String(Math.random());
  }, []);

  return (
    <EntityList
      title="Historial de Ejercicios Diarios"
      loadFunction={loadDailyExerciseHistory}
      renderItem={renderDailyExerciseHistoryItem}
      keyExtractor={keyExtractor}
      emptyTitle="No hay historial"
      emptyMessage="No se encontró historial de ejercicios"
      loadingMessage="Cargando historial de ejercicios..."
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
    minWidth: 140,
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
    backgroundColor: '#f0f9ff',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  recordLabel: {
    fontSize: FONT_SIZES.sm,
    color: '#0066cc',
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  recordText: {
    fontSize: FONT_SIZES.sm,
    color: '#0066cc',
    fontWeight: '500',
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

DailyExerciseHistoryList.displayName = 'DailyExerciseHistoryList';

export default DailyExerciseHistoryList;
