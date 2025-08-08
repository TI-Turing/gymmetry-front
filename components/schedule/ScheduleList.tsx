import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';

export function ScheduleList() {
  const loadSchedules = useCallback(async () => {
    try {
      // Placeholder for actual service call
      return [];
    } catch {
      return [];
    }
  }, []);

  const renderScheduleItem = useCallback(
    ({ item }: { item: any }) => (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {item.title || item.name || 'Horario'}
          </Text>
          <Text style={styles.statusText}>
            {item.isActive ? 'Activo' : 'Inactivo'}
          </Text>
        </View>
        
        <Text style={styles.description}>
          {item.description || 'Horario de actividades'}
        </Text>
        
        <View style={styles.row}>
          <Text style={styles.label}>Día:</Text>
          <Text style={styles.value}>{item.dayOfWeek || 'N/A'}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Hora inicio:</Text>
          <Text style={styles.value}>
            {item.startTime || 'N/A'}
          </Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Hora fin:</Text>
          <Text style={styles.value}>
            {item.endTime || 'N/A'}
          </Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Duración:</Text>
          <Text style={styles.value}>
            {item.duration ? `${item.duration} min` : 'N/A'}
          </Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Actividad:</Text>
          <Text style={styles.value}>
            {item.activity || item.className || 'N/A'}
          </Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Instructor:</Text>
          <Text style={styles.value}>
            {item.instructor || item.trainerName || 'N/A'}
          </Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Sala:</Text>
          <Text style={styles.value}>{item.room || 'N/A'}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Capacidad:</Text>
          <Text style={[styles.value, {
            color: item.currentParticipants >= item.maxCapacity 
              ? '#ff6b6b' 
              : Colors.light.text
          }]}>
            {item.currentParticipants || 0} / {item.maxCapacity || 0}
          </Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Gimnasio:</Text>
          <Text style={styles.value}>{item.gymName || 'N/A'}</Text>
        </View>
        
        {item.requirements && (
          <View style={styles.requirementsSection}>
            <Text style={styles.requirementsLabel}>Requisitos:</Text>
            <Text style={styles.requirements}>
              {item.requirements}
            </Text>
          </View>
        )}
      </View>
    ),
    []
  );

  const keyExtractor = useCallback(
    (item: any) => item.id || item.scheduleId || String(Math.random()),
    []
  );

  return (
    <EntityList
      title='Horarios'
      loadFunction={loadSchedules}
      renderItem={renderScheduleItem}
      keyExtractor={keyExtractor}
      emptyTitle='No hay horarios'
      emptyMessage='No se encontraron horarios'
      loadingMessage='Cargando horarios...'
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
    minWidth: 100,
  },
  value: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    flex: 1,
  },
  requirementsSection: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.tabIconDefault + '20',
  },
  requirementsLabel: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  requirements: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    fontStyle: 'italic',
  },
});

export default ScheduleList;
