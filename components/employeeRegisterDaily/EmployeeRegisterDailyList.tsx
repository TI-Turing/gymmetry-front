import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';
import { employeeRegisterDailyService } from '@/services';

const EmployeeRegisterDailyList = React.memo(() => {
  const isRecord = (v: unknown): v is Record<string, unknown> =>
    v !== null && typeof v === 'object';
  const loadEmployeeRegisters = useCallback(async () => {
    const response =
      await employeeRegisterDailyService.getAllEmployeeRegisterDailies();
    return response.Success ? response.Data || [] : [];
  }, []);

  const renderEmployeeRegisterItem = useCallback(
    ({ item }: { item: unknown }) => (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {(() => {
              if (!isRecord(item)) return 'Empleado sin nombre';
              const n1 = item.employeeName;
              const n2 = item.employee;
              return (typeof n1 === 'string' && n1) ||
                (typeof n2 === 'string' && n2)
                ? (n1 as string) || (n2 as string)
                : 'Empleado sin nombre';
            })()}
          </Text>
          <Text style={styles.statusText}>
            {isRecord(item) && item.isPresent ? 'Presente' : 'Ausente'}
          </Text>
        </View>

        <Text style={styles.date}>
          {(() => {
            if (!isRecord(item)) return 'Fecha: Sin fecha';
            const d = item.date;
            const iso = typeof d === 'string' || d instanceof Date ? d : '';
            try {
              const val = iso
                ? new Date(iso).toLocaleDateString()
                : 'Sin fecha';
              return `Fecha: ${val}`;
            } catch {
              return 'Fecha: Sin fecha';
            }
          })()}
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Entrada:</Text>
          <Text style={styles.value}>
            {(() => {
              if (!isRecord(item)) return 'Sin registrar';
              const a = item.checkInTime;
              const b = item.entryTime;
              return (typeof a === 'string' && a) ||
                (typeof b === 'string' && b)
                ? (a as string) || (b as string)
                : 'Sin registrar';
            })()}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Salida:</Text>
          <Text style={styles.value}>
            {(() => {
              if (!isRecord(item)) return 'Sin registrar';
              const a = item.checkOutTime;
              const b = item.exitTime;
              return (typeof a === 'string' && a) ||
                (typeof b === 'string' && b)
                ? (a as string) || (b as string)
                : 'Sin registrar';
            })()}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Horas trabajadas:</Text>
          <Text style={styles.value}>
            {(() => {
              if (!isRecord(item)) return '0 horas';
              const n =
                (typeof item.hoursWorked === 'number' && item.hoursWorked) ||
                (typeof item.totalHours === 'number' && item.totalHours) ||
                0;
              return `${n} horas`;
            })()}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Departamento:</Text>
          <Text style={styles.value}>
            {(() => {
              if (!isRecord(item)) return 'No especificado';
              const a = item.department;
              const b = item.area;
              return (typeof a === 'string' && a) ||
                (typeof b === 'string' && b)
                ? (a as string) || (b as string)
                : 'No especificado';
            })()}
          </Text>
        </View>

        {isRecord(item) && typeof item.notes === 'string' && (
          <Text style={styles.notes}>Notas: {item.notes}</Text>
        )}
      </View>
    ),
    []
  );

  const keyExtractor = useCallback((item: unknown) => {
    if (isRecord(item)) {
      const id = (item.id ?? item.registerId) as unknown;
      if (typeof id === 'string' && id) return id;
    }
    return String(Math.random());
  }, []);

  return (
    <EntityList
      title="Registro Diario de Empleados"
      loadFunction={loadEmployeeRegisters}
      renderItem={renderEmployeeRegisterItem}
      keyExtractor={keyExtractor}
      emptyTitle="No hay registros"
      emptyMessage="No se encontraron registros de empleados"
      loadingMessage="Cargando registros..."
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
  date: {
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
    minWidth: 120,
  },
  value: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    flex: 1,
  },
  notes: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault,
    fontStyle: 'italic',
    marginTop: SPACING.sm,
  },
});

EmployeeRegisterDailyList.displayName = 'EmployeeRegisterDailyList';

export default EmployeeRegisterDailyList;
