import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';
import { employeeRegisterDailyService } from '@/services';

const EmployeeRegisterDailyList = React.memo(() => {
  const loadEmployeeRegisters = useCallback(async () => {
    const response =
      await employeeRegisterDailyService.getAllEmployeeRegisterDailies();
    return response.Success ? response.Data || [] : [];
  }, []);

  const renderEmployeeRegisterItem = useCallback(
    ({ item }: { item: any }) => (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {item.employeeName || item.employee || 'Empleado sin nombre'}
          </Text>
          <Text style={styles.statusText}>
            {item.isPresent ? 'Presente' : 'Ausente'}
          </Text>
        </View>

        <Text style={styles.date}>
          Fecha: {' '}
          {item.date ? new Date(item.date).toLocaleDateString() : 'Sin fecha'}
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Entrada:</Text>
          <Text style={styles.value}>
            {item.checkInTime || item.entryTime || 'Sin registrar'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Salida:</Text>
          <Text style={styles.value}>
            {item.checkOutTime || item.exitTime || 'Sin registrar'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Horas trabajadas:</Text>
          <Text style={styles.value}>
            {item.hoursWorked || item.totalHours || 0} horas
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Departamento:</Text>
          <Text style={styles.value}>
            {item.department || item.area || 'No especificado'}
          </Text>
        </View>

        {item.notes && <Text style={styles.notes}>Notas: {item.notes}</Text>}
      </View>
    ),
    []
  );

  const keyExtractor = useCallback(
    (item: any) => item.id || item.registerId || String(Math.random()),
    []
  );

  return (
    <EntityList
      title='Registro Diario de Empleados'
      loadFunction={loadEmployeeRegisters}
      renderItem={renderEmployeeRegisterItem}
      keyExtractor={keyExtractor}
      emptyTitle='No hay registros'
      emptyMessage='No se encontraron registros de empleados'
      loadingMessage='Cargando registros...'
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
  date: {
    fontSize: FONT_SIZES.md,
    color: Colors.light.tabIconSelected,
    marginBottom: SPACING.sm,
    fontWeight: '500'
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
    minWidth: 120
  },
  value: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    flex: 1
  },
  notes: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault,
    fontStyle: 'italic',
    marginTop: SPACING.sm

}});

EmployeeRegisterDailyList.displayName = 'EmployeeRegisterDailyList';

export default EmployeeRegisterDailyList;
