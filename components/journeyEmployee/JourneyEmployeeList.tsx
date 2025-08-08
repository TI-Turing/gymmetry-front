import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';

export function JourneyEmployeeList() {
  const loadJourneyEmployees = useCallback(async () => {
    try {
      // Placeholder for actual service call
      return [];
    } catch {
      return [];
    }
  }, []);

  const renderJourneyEmployeeItem = useCallback(
    ({ item }: { item: any }) => (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {item.employeeName || 'Empleado'}
          </Text>
          <Text style={styles.statusText}>
            {item.status === 'working' ? 'Trabajando' :
             item.status === 'break' ? 'Descanso' :
             item.status === 'finished' ? 'Terminado' : 'Inactivo'}
          </Text>
        </View>
        
        <Text style={styles.description}>
          {item.position || 'Registro de jornada laboral'}
        </Text>
        
        <View style={styles.row}>
          <Text style={styles.label}>Empleado:</Text>
          <Text style={styles.value}>{item.employeeName || 'N/A'}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Posición:</Text>
          <Text style={styles.value}>{item.position || 'N/A'}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Fecha:</Text>
          <Text style={styles.value}>
            {item.date 
              ? new Date(item.date).toLocaleDateString() 
              : 'N/A'}
          </Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Hora entrada:</Text>
          <Text style={styles.value}>
            {item.checkIn 
              ? new Date(item.checkIn).toLocaleTimeString() 
              : 'N/A'}
          </Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Hora salida:</Text>
          <Text style={styles.value}>
            {item.checkOut 
              ? new Date(item.checkOut).toLocaleTimeString() 
              : 'Pendiente'}
          </Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Horas trabajadas:</Text>
          <Text style={styles.value}>
            {item.hoursWorked 
              ? `${item.hoursWorked.toFixed(1)}h` 
              : 'Calculando...'}
          </Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Horas extra:</Text>
          <Text style={[styles.value, {
            color: item.overtimeHours > 0 ? '#ffa726' : Colors.light.text
          }]}>
            {item.overtimeHours 
              ? `${item.overtimeHours.toFixed(1)}h` 
              : '0h'}
          </Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Sucursal:</Text>
          <Text style={styles.value}>{item.branchName || 'N/A'}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Área:</Text>
          <Text style={styles.value}>{item.workArea || 'General'}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Descansos:</Text>
          <Text style={styles.value}>
            {item.breakCount || 0} ({item.breakDuration || 0} min)
          </Text>
        </View>
        
        {item.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>Notas:</Text>
            <Text style={styles.notes} numberOfLines={3}>
              {item.notes}
            </Text>
          </View>
        )}
        
        {item.tasks && Array.isArray(item.tasks) && (
          <View style={styles.tasksSection}>
            <Text style={styles.tasksLabel}>Tareas asignadas:</Text>
            <View style={styles.tasksList}>
              {item.tasks.slice(0, 3).map((task: string, index: number) => (
                <Text key={index} style={styles.task}>
                  ✓ {task}
                </Text>
              ))}
              {item.tasks.length > 3 && (
                <Text style={styles.moreTasks}>
                  +{item.tasks.length - 3} más...
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
    (item: any) => item.id || item.journeyId || String(Math.random()),
    []
  );

  return (
    <EntityList
      title='Jornadas de Empleados'
      loadFunction={loadJourneyEmployees}
      renderItem={renderJourneyEmployeeItem}
      keyExtractor={keyExtractor}
      emptyTitle='No hay jornadas'
      emptyMessage='No se encontraron jornadas de empleados'
      loadingMessage='Cargando jornadas...'
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
    minWidth: 120,
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
  notes: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    fontStyle: 'italic',
    backgroundColor: Colors.light.tabIconDefault + '10',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  tasksSection: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.tabIconDefault + '20',
  },
  tasksLabel: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  tasksList: {
    gap: SPACING.xs,
  },
  task: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    marginLeft: SPACING.sm,
  },
  moreTasks: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconSelected,
    fontStyle: 'italic',
    marginLeft: SPACING.sm,
  },
});

export default JourneyEmployeeList;
