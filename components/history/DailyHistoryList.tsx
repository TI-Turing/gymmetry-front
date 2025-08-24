import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';

type DailyHistoryItem = {
  id?: string;
  historyId?: string;
  date?: string;
  isCompleted?: boolean;
  isInProgress?: boolean;
  workoutType?: string;
  routineName?: string;
  duration?: number;
  totalExercises?: number;
  exerciseCount?: number;
  completedSets?: number;
  totalSets?: number;
  caloriesBurned?: number;
  calories?: number;
  totalWeight?: number;
  avgHeartRate?: number;
  startTime?: string;
  endTime?: string;
  trainerName?: string;
  intensity?: 'high' | 'medium' | 'low' | string;
  mood?: 'excellent' | 'good' | 'average' | 'bad' | string;
  gymName?: string;
  location?: string;
  notes?: string;
  achievements?: string[];
};

const DailyHistoryList = React.memo(() => {
  const servicePlaceholder = useCallback(() => Promise.resolve([]), []);
  const loadDailyHistory = useCallback(async () => {
    try {
      // Placeholder for actual service call

      const result = await servicePlaceholder();

      return result || [];
    } catch (_error) {
      return [];
    }
  }, [servicePlaceholder]);

  const renderDailyHistoryItem = useCallback(({ item }: { item: unknown }) => {
    const it = (item || {}) as Partial<DailyHistoryItem>;
    const duration =
      typeof it.duration === 'number' && Number.isFinite(it.duration)
        ? it.duration
        : 0;
    const startTimeStr = typeof it.startTime === 'string' ? it.startTime : '';
    const endTimeStr = typeof it.endTime === 'string' ? it.endTime : '';
    const dateStr = typeof it.date === 'string' ? it.date : '';
    const avgHr =
      typeof it.avgHeartRate === 'number' ? it.avgHeartRate : undefined;
    const achievements = Array.isArray(it.achievements)
      ? (it.achievements as string[])
      : [];
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {dateStr
              ? new Date(dateStr).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : 'Día de entrenamiento'}
          </Text>
          <Text style={styles.statusText}>
            {it.isCompleted
              ? 'Completado'
              : it.isInProgress
                ? 'En progreso'
                : 'Pendiente'}
          </Text>
        </View>

        <Text style={styles.description}>
          {it.workoutType || it.routineName || 'Sesión de entrenamiento'}
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Duración:</Text>
          <Text style={styles.value}>
            {duration > 0
              ? `${Math.floor(duration / 60)}h ${duration % 60}m`
              : 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Ejercicios:</Text>
          <Text style={styles.value}>
            {it.totalExercises || it.exerciseCount || '0'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Series completadas:</Text>
          <Text style={styles.value}>
            {(it.completedSets as number | string) || '0'} /{' '}
            {(it.totalSets as number | string) || '0'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Calorías quemadas:</Text>
          <Text style={styles.value}>
            {it.caloriesBurned || it.calories || '0'} kcal
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Peso total:</Text>
          <Text style={styles.value}>
            {(it.totalWeight as number | string) || '0'} kg
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Ritmo cardíaco:</Text>
          <Text
            style={[
              styles.value,
              {
                color:
                  typeof avgHr === 'number' && avgHr > 160
                    ? '#ff6b6b'
                    : typeof avgHr === 'number' && avgHr > 120
                      ? '#ffa726'
                      : Colors.light.text,
              },
            ]}
          >
            {typeof avgHr === 'number'
              ? `${avgHr} bpm (promedio)`
              : 'No registrado'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Hora inicio:</Text>
          <Text style={styles.value}>
            {startTimeStr
              ? new Date(startTimeStr).toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Hora fin:</Text>
          <Text style={styles.value}>
            {endTimeStr
              ? new Date(endTimeStr).toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'No finalizado'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Entrenador:</Text>
          <Text style={styles.value}>
            {it.trainerName || 'Entrenamiento personal'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Nivel intensidad:</Text>
          <Text
            style={[
              styles.value,
              {
                color:
                  it.intensity === 'high'
                    ? '#ff6b6b'
                    : it.intensity === 'medium'
                      ? '#ffa726'
                      : '#4caf50',
              },
            ]}
          >
            {it.intensity === 'high'
              ? '🔥 Alta'
              : it.intensity === 'medium'
                ? '⚡ Media'
                : '💚 Suave'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Estado físico:</Text>
          <Text
            style={[
              styles.value,
              {
                color:
                  it.mood === 'excellent'
                    ? '#4caf50'
                    : it.mood === 'good'
                      ? '#8bc34a'
                      : it.mood === 'average'
                        ? '#ffa726'
                        : '#ff6b6b',
              },
            ]}
          >
            {it.mood === 'excellent'
              ? '😄 Excelente'
              : it.mood === 'good'
                ? '😊 Bueno'
                : it.mood === 'average'
                  ? '😐 Regular'
                  : '😞 Malo'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Ubicación:</Text>
          <Text style={styles.value}>
            {it.gymName || it.location || 'Casa'}
          </Text>
        </View>

        {typeof it.notes === 'string' && it.notes.length > 0 && (
          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>Notas del día:</Text>
            <Text style={styles.notesText}>💭 {it.notes}</Text>
          </View>
        )}

        {achievements.length > 0 && (
          <View style={styles.achievementsSection}>
            <Text style={styles.achievementsLabel}>Logros obtenidos:</Text>
            <View style={styles.achievementsList}>
              {achievements.slice(0, 3).map((achievement, index) => (
                <Text key={index} style={styles.achievement}>
                  🏆 {achievement}
                </Text>
              ))}
              {achievements.length > 3 && (
                <Text style={styles.moreAchievements}>
                  +{achievements.length - 3} logros más...
                </Text>
              )}
            </View>
          </View>
        )}
      </View>
    );
  }, []);

  const keyExtractor = useCallback((item: unknown) => {
    const o = (item || {}) as Record<string, unknown>;
    if (typeof o.id === 'string') return o.id;
    if (typeof o.historyId === 'string') return o.historyId;
    if (typeof o.date === 'string') return o.date;
    return String(Math.random());
  }, []);

  return (
    <EntityList
      title="Historial Diario"
      loadFunction={loadDailyHistory}
      renderItem={renderDailyHistoryItem}
      keyExtractor={keyExtractor}
      emptyTitle="No hay historial"
      emptyMessage="No se encontró historial de entrenamientos"
      loadingMessage="Cargando historial..."
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
  achievementsSection: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.tabIconDefault + '20',
  },
  achievementsLabel: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  achievementsList: {
    gap: SPACING.xs,
  },
  achievement: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    marginLeft: SPACING.sm,
  },
  moreAchievements: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconSelected,
    fontStyle: 'italic',
    marginLeft: SPACING.sm,
  },
});

DailyHistoryList.displayName = 'DailyHistoryList';

export default DailyHistoryList;
