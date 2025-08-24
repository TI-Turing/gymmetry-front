import React, { useCallback } from 'react';
import { View } from 'react-native';
import { Text } from '@/components/Themed';
import { styles } from './styles';
import { EntityList } from '@/components/common';
// Colors desde la paleta tematizada
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

const RoutineAssignedList = React.memo(() => {
  const servicePlaceholder = useCallback(() => Promise.resolve([]), []);
  const loadRoutineAssigned = useCallback(async () => {
    try {
      // Placeholder for actual service call

      const result = await servicePlaceholder();

      return result || [];
    } catch (_error) {
      return [];
    }
  }, []);

  const theme = useColorScheme();
  const palette = Colors[theme];

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
                    ? palette.danger
                    : item.difficulty === 'medium'
                      ? palette.warning
                      : palette.tint,
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
      title="Rutinas Asignadas"
      loadFunction={loadRoutineAssigned}
      renderItem={renderRoutineAssignedItem}
      keyExtractor={keyExtractor}
      emptyTitle="No hay rutinas asignadas"
      emptyMessage="No se encontraron rutinas asignadas"
      loadingMessage="Cargando rutinas asignadas..."
    />
  );
});

RoutineAssignedList.displayName = 'RoutineAssignedList';

export { RoutineAssignedList };
