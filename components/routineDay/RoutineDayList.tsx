import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';
import { routineDayFunctionsService } from '@/services/functions';

const RoutineDayList = React.memo(() => {
  const loadRoutineDays = useCallback(async () => {
    const response = await routineDayFunctionsService.getAllRoutineDays();
    return response.Data || [];
  }, []);

RoutineDayList.displayName = 'RoutineDayList';



  const renderRoutineDayItem = useCallback(
    ({ item }: { item: any }) => (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {item.dayName || `Día ${item.dayNumber}`}
          </Text>
          <Text style={styles.statusText}>
            {item.isCompleted ? 'Completado' : 'Pendiente'}
          </Text>
        </View>

        <Text style={styles.routine}>
          Rutina: {item.routineName || item.routineId || 'N/A'}
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Ejercicios:</Text>
          <Text style={styles.value}>{item.exerciseCount || 0}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Duración:</Text>
          <Text style={styles.value}>{item.duration || 'N/A'} min</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Completado:</Text>
          <Text style={styles.value}>
            {item.completedAt
              ? new Date(item.completedAt).toLocaleDateString()
              : 'Pendiente'}
          </Text>
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
      title='Días de Rutina'
      loadFunction={loadRoutineDays}
      renderItem={renderRoutineDayItem}
      keyExtractor={keyExtractor}
      emptyTitle='No hay días'
      emptyMessage='No se encontraron días de rutina'
      loadingMessage='Cargando días...'
    />
  );
}

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

export default RoutineDayList;
