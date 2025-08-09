import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';

const RoutineAssignedList = React.memo(() => {
  const servicePlaceholder = useCallback(() => Promise.resolve([]), []);
  const loadRoutineAssigned = useCallback(async () => {
    try {
      // Placeholder for actual service call

      const result = await servicePlaceholder();

      return result || [];
    } catch (_error) {return [];
  }
  }, []);

  const renderRoutineAssignedItem = useCallback(
    ({ item }: { item: any }) => (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {item.routineName || item.name || 'Rutina asignada'}
          </Text>
          <Text style={styles.statusText}>
            {item.isActive ? 'Activa' : 'Inactiva'}
          </Text>
        </View>

        <Text style={styles.description}>
          {item.description || 'Rutina asignada al usuario'}
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Usuario:</Text>
          <Text style={styles.value}>{item.userName || 'N/A'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Entrenador:</Text>
          <Text style={styles.value}>{item.trainerName || 'N/A'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Rutina:</Text>
          <Text style={styles.value}>{item.routineName || 'N/A'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Duración:</Text>
          <Text style={styles.value}>
            {item.duration ? `${item.duration} min` : 'N/A'}
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
              ? 'Difícil'
              : item.difficulty === 'medium'
                ? 'Medio'
                : 'Fácil'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Fecha asignación:</Text>
          <Text style={styles.value}>
            {item.assignedAt
              ? new Date(item.assignedAt).toLocaleDateString()
              : 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Fecha inicio:</Text>
          <Text style={styles.value}>
            {item.startDate
              ? new Date(item.startDate).toLocaleDateString()
              : 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Progreso:</Text>
          <Text style={styles.value}>
            {item.completedSessions || 0} / {item.totalSessions || 0} sesiones
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Última sesión:</Text>
          <Text style={styles.value}>
            {item.lastSession
              ? new Date(item.lastSession).toLocaleDateString()
              : 'Sin sesiones'}
          </Text>
        </View>

        {item.goals && Array.isArray(item.goals) && (
          <View style={styles.goalsSection}>
            <Text style={styles.goalsLabel}>Objetivos:</Text>
            <View style={styles.goalsList}>
              {item.goals.slice(0, 2).map((goal: string, index: number) => (
                <Text key={index} style={styles.goal}>
                  🎯 {goal}
                </Text>
              ))}
              {item.goals.length > 2 && (
                <Text style={styles.moreGoals}>
                  +{item.goals.length - 2} más...
                </Text>
              )}
            </View>
          </View>
        )}
      </View>
    ),
    []
  );

  const keyExtractor = useCallback(
    (item: any) =>
      item.id ||
      item.assignmentId ||
      `${item.userId}-${item.routineId}` ||
      String(Math.random()),
    []
  );

  return (
    <EntityList
      title='Rutinas Asignadas'
      loadFunction={loadRoutineAssigned}
      renderItem={renderRoutineAssignedItem}
      keyExtractor={keyExtractor}
      emptyTitle='No hay rutinas asignadas'
      emptyMessage='No se encontraron rutinas asignadas'
      loadingMessage='Cargando rutinas asignadas...'
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
  },
  goalsSection: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.tabIconDefault + '20'
  },
  goalsLabel: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault,
    fontWeight: '500',
    marginBottom: SPACING.xs
  },
  goalsList: {
    gap: SPACING.xs
  },
  goal: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    marginLeft: SPACING.sm
  },
  moreGoals: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconSelected,
    fontStyle: 'italic',
    marginLeft: SPACING.sm

}});

RoutineAssignedList.displayName = 'RoutineAssignedList';

export default RoutineAssignedList;
