import React, { useCallback } from 'react';
import { View } from 'react-native';
import { Text } from '@/components/Themed';
import { styles } from './styles';
import { EntityList } from '@/components/common';
// Colors desde la paleta tematizada
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

type RoutineAssignedItem = {
  id?: string;
  assignmentId?: string;
  userId?: string;
  routineId?: string;
  routineName?: string;
  name?: string;
  isActive?: boolean;
  description?: string;
  userName?: string;
  trainerName?: string;
  duration?: number;
  difficulty?: 'hard' | 'medium' | 'easy' | string;
  assignedAt?: string;
  startDate?: string;
  completedSessions?: number;
  totalSessions?: number;
  lastSession?: string;
  goals?: string[];
};

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
  }, [servicePlaceholder]);

  const theme = useColorScheme();
  const palette = Colors[theme];

  const renderRoutineAssignedItem = useCallback(
    ({ item }: { item: unknown }) => {
      const it = (item || {}) as Partial<RoutineAssignedItem>;
      const assignedAt = typeof it.assignedAt === 'string' ? it.assignedAt : '';
      const startDate = typeof it.startDate === 'string' ? it.startDate : '';
      const lastSession =
        typeof it.lastSession === 'string' ? it.lastSession : '';
      const duration = typeof it.duration === 'number' ? it.duration : null;
      const goals = Array.isArray(it.goals) ? (it.goals as string[]) : [];
      return (
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {it.routineName || it.name || 'Rutina asignada'}
            </Text>
            <Text style={styles.statusText}>
              {it.isActive ? 'Activa' : 'Inactiva'}
            </Text>
          </View>

          <Text style={styles.description}>
            {it.description || 'Rutina asignada al usuario'}
          </Text>

          <View style={styles.row}>
            <Text style={styles.label}>Usuario:</Text>
            <Text style={styles.value}>{it.userName || 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Entrenador:</Text>
            <Text style={styles.value}>{it.trainerName || 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Rutina:</Text>
            <Text style={styles.value}>{it.routineName || 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Duración:</Text>
            <Text style={styles.value}>
              {duration !== null ? `${duration} min` : 'N/A'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Dificultad:</Text>
            <Text
              style={[
                styles.value,
                {
                  color:
                    it.difficulty === 'hard'
                      ? palette.danger
                      : it.difficulty === 'medium'
                        ? palette.warning
                        : palette.tint,
                },
              ]}
            >
              {it.difficulty === 'hard'
                ? 'Difícil'
                : it.difficulty === 'medium'
                  ? 'Medio'
                  : 'Fácil'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Fecha asignación:</Text>
            <Text style={styles.value}>
              {assignedAt ? new Date(assignedAt).toLocaleDateString() : 'N/A'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Fecha inicio:</Text>
            <Text style={styles.value}>
              {startDate ? new Date(startDate).toLocaleDateString() : 'N/A'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Progreso:</Text>
            <Text style={styles.value}>
              {(it.completedSessions as number | string) || 0} /{' '}
              {(it.totalSessions as number | string) || 0} sesiones
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Última sesión:</Text>
            <Text style={styles.value}>
              {lastSession
                ? new Date(lastSession).toLocaleDateString()
                : 'Sin sesiones'}
            </Text>
          </View>

          {goals.length > 0 && (
            <View style={styles.goalsSection}>
              <Text style={styles.goalsLabel}>Objetivos:</Text>
              <View style={styles.goalsList}>
                {goals.slice(0, 2).map((goal, index) => (
                  <Text key={index} style={styles.goal}>
                    🎯 {goal}
                  </Text>
                ))}
                {goals.length > 2 && (
                  <Text style={styles.moreGoals}>
                    +{goals.length - 2} más...
                  </Text>
                )}
              </View>
            </View>
          )}
        </View>
      );
    },
    []
  );

  const keyExtractor = useCallback((item: unknown) => {
    const o = (item || {}) as Record<string, unknown>;
    if (typeof o.id === 'string') return o.id;
    if (typeof o.assignmentId === 'string') return o.assignmentId;
    if (typeof o.userId === 'string' && typeof o.routineId === 'string')
      return `${o.userId}-${o.routineId}`;
    return String(Math.random());
  }, []);

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
