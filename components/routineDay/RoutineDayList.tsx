import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';
import { routineDayService } from '@/services';
import { normalizeCollection } from '@/utils';

// ...

const RoutineDayList = React.memo(() => {
  const loadRoutineDays = useCallback(async () => {
    const response = await routineDayService.getAllRoutineDays();
    const raw = (response?.Data ?? []) as unknown;
    const items = normalizeCollection<unknown>(raw);
    return items;
  }, []);

  const renderRoutineDayItem = useCallback(({ item }: { item: unknown }) => {
    const r = (item ?? {}) as Record<string, unknown>;
    const dayName =
      (r['dayName'] as string) ?? (r['DayName'] as string) ?? null;
    const dayNumber =
      (r['dayNumber'] as number) ?? (r['DayNumber'] as number) ?? null;
    const isCompleted =
      (r['isCompleted'] as boolean) ?? (r['IsCompleted'] as boolean) ?? false;
    const routineName =
      (r['routineName'] as string) ?? (r['RoutineName'] as string) ?? null;
    const routineId =
      (r['routineId'] as string) ?? (r['RoutineId'] as string) ?? null;
    const exerciseCount =
      (r['exerciseCount'] as number) ?? (r['ExerciseCount'] as number) ?? 0;
    const duration =
      (r['duration'] as number) ?? (r['Duration'] as number) ?? null;
    const completedAtStr =
      (r['completedAt'] as string) ?? (r['CompletedAt'] as string) ?? null;
    const completedAt = completedAtStr ? new Date(completedAtStr) : null;

    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {dayName || (dayNumber ? `Día ${dayNumber}` : 'Día')}
          </Text>
          <Text style={styles.statusText}>
            {isCompleted ? 'Completado' : 'Pendiente'}
          </Text>
        </View>

        <Text style={styles.routine}>
          Rutina: {routineName || routineId || 'N/A'}
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Ejercicios:</Text>
          <Text style={styles.value}>{exerciseCount ?? 0}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Duración:</Text>
          <Text style={styles.value}>{duration ?? 'N/A'} min</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Completado:</Text>
          <Text style={styles.value}>
            {completedAt ? completedAt.toLocaleDateString() : 'Pendiente'}
          </Text>
        </View>
      </View>
    );
  }, []);

  const keyExtractor = useCallback((item: unknown) => {
    const r = (item ?? {}) as Record<string, unknown>;
    const id =
      (r['Id'] as string) ||
      (r['id'] as string) ||
      (r['RoutineDayId'] as string) ||
      (r['routineDayId'] as string) ||
      null;
    return id ?? String(Math.random());
  }, []);

  return (
    <EntityList
      title="Días de Rutina"
      loadFunction={loadRoutineDays}
      renderItem={renderRoutineDayItem}
      keyExtractor={keyExtractor}
      emptyTitle="No hay días"
      emptyMessage="No se encontraron días de rutina"
      loadingMessage="Cargando días..."
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
});

RoutineDayList.displayName = 'RoutineDayList';

export default RoutineDayList;
