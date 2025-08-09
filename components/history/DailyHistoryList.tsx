import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';

const DailyHistoryList = React.memo(() => {
  const servicePlaceholder = useCallback(() => Promise.resolve([]), []);
  const loadDailyHistory = useCallback(async () => {
    try {
      // Placeholder for actual service call

      const result = await servicePlaceholder();

      return result || [];
    } catch (_error) {return [];
  }
  }, []);

  const renderDailyHistoryItem = useCallback(
    ({ item }: { item: any }) => (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {item.date
              ? new Date(item.date).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              : 'Día de entrenamiento'}
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
          {item.workoutType || item.routineName || 'Sesión de entrenamiento'}
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Duración:</Text>
          <Text style={styles.value}>
            {item.duration
              ? `${Math.floor(item.duration / 60)}h ${item.duration % 60}m`
              : 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Ejercicios:</Text>
          <Text style={styles.value}>
            {item.totalExercises || item.exerciseCount || '0'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Series completadas:</Text>
          <Text style={styles.value}>
            {item.completedSets || '0'} / {item.totalSets || '0'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Calorías quemadas:</Text>
          <Text style={styles.value}>
            {item.caloriesBurned || item.calories || '0'} kcal
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Peso total:</Text>
          <Text style={styles.value}>{item.totalWeight || '0'} kg</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Ritmo cardíaco:</Text>
          <Text
            style={[
              styles.value,
              {
                color:
                  item.avgHeartRate > 160
                    ? '#ff6b6b'
                    : item.avgHeartRate > 120
                      ? '#ffa726'
                      : Colors.light.text
  },
            ]}
          >
            {item.avgHeartRate
              ? `${item.avgHeartRate} bpm (promedio)`
              : 'No registrado'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Hora inicio:</Text>
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
          <Text style={styles.label}>Hora fin:</Text>
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
          <Text style={styles.label}>Entrenador:</Text>
          <Text style={styles.value}>
            {item.trainerName || 'Entrenamiento personal'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Nivel intensidad:</Text>
          <Text
            style={[
              styles.value,
              {
                color:
                  item.intensity === 'high'
                    ? '#ff6b6b'
                    : item.intensity === 'medium'
                      ? '#ffa726'
                      : '#4caf50'
  },
            ]}
          >
            {item.intensity === 'high'
              ? '🔥 Alta'
              : item.intensity === 'medium'
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
                  item.mood === 'excellent'
                    ? '#4caf50'
                    : item.mood === 'good'
                      ? '#8bc34a'
                      : item.mood === 'average'
                        ? '#ffa726'
                        : '#ff6b6b'
  },
            ]}
          >
            {item.mood === 'excellent'
              ? '😄 Excelente'
              : item.mood === 'good'
                ? '😊 Bueno'
                : item.mood === 'average'
                  ? '😐 Regular'
                  : '😞 Malo'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Ubicación:</Text>
          <Text style={styles.value}>
            {item.gymName || item.location || 'Casa'}
          </Text>
        </View>

        {item.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>Notas del día:</Text>
            <Text style={styles.notesText}>💭 {item.notes}</Text>
          </View>
        )}

        {item.achievements && Array.isArray(item.achievements) && (
          <View style={styles.achievementsSection}>
            <Text style={styles.achievementsLabel}>Logros obtenidos:</Text>
            <View style={styles.achievementsList}>
              {item.achievements
                .slice(0, 3)
                .map((achievement: string, index: number) => (
                  <Text key={index} style={styles.achievement}>
                    🏆 {achievement}
                  </Text>
                ))}
              {item.achievements.length > 3 && (
                <Text style={styles.moreAchievements}>
                  +{item.achievements.length - 3} logros más...
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
      item.id || item.historyId || item.date || String(Math.random()),
    []
  );

  return (
    <EntityList
      title='Historial Diario'
      loadFunction={loadDailyHistory}
      renderItem={renderDailyHistoryItem}
      keyExtractor={keyExtractor}
      emptyTitle='No hay historial'
      emptyMessage='No se encontró historial de entrenamientos'
      loadingMessage='Cargando historial...'
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
  },
  achievementsSection: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.tabIconDefault + '20'
  },
  achievementsLabel: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault,
    fontWeight: '500',
    marginBottom: SPACING.xs
  },
  achievementsList: {
    gap: SPACING.xs
  },
  achievement: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    marginLeft: SPACING.sm
  },
  moreAchievements: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconSelected,
    fontStyle: 'italic',
    marginLeft: SPACING.sm,
}});

DailyHistoryList.displayName = 'DailyHistoryList';

export default DailyHistoryList;