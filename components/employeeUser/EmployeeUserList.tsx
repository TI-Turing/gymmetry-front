import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';
import { employeeUserService } from '@/services';

const EmployeeUserList = React.memo(() => {
  const isRecord = (v: unknown): v is Record<string, unknown> =>
    v !== null && typeof v === 'object';
  const loadEmployeeUsers = useCallback(async () => {
    const response = await employeeUserService.getAllEmployeeUsers();
    return response.Success ? response.Data || [] : [];
  }, []);

  const renderEmployeeUserItem = useCallback(
    ({ item }: { item: unknown }) => (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {(() => {
              if (!isRecord(item)) return 'Empleado sin nombre';
              const n1 = item.fullName;
              const n2 = item.name;
              return (typeof n1 === 'string' && n1) ||
                (typeof n2 === 'string' && n2)
                ? (n1 as string) || (n2 as string)
                : 'Empleado sin nombre';
            })()}
          </Text>
          <Text style={styles.statusText}>
            {isRecord(item) && item.isActive ? 'Activo' : 'Inactivo'}
          </Text>
        </View>

        <Text style={styles.email}>
          {isRecord(item) && typeof item.email === 'string'
            ? item.email
            : 'Sin email configurado'}
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Código:</Text>
          <Text style={styles.value}>
            {(() => {
              if (!isRecord(item)) return 'N/A';
              const a = item.employeeCode;
              const b = item.code;
              return (typeof a === 'string' && a) ||
                (typeof b === 'string' && b)
                ? (a as string) || (b as string)
                : 'N/A';
            })()}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Posición:</Text>
          <Text style={styles.value}>
            {(() => {
              if (!isRecord(item)) return 'N/A';
              const a = item.position;
              const b = item.jobTitle;
              return (typeof a === 'string' && a) ||
                (typeof b === 'string' && b)
                ? (a as string) || (b as string)
                : 'N/A';
            })()}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Departamento:</Text>
          <Text style={styles.value}>
            {isRecord(item) && typeof item.department === 'string'
              ? item.department
              : 'No asignado'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Teléfono:</Text>
          <Text style={styles.value}>
            {(() => {
              if (!isRecord(item)) return 'N/A';
              const a = item.phone;
              const b = item.phoneNumber;
              return (typeof a === 'string' && a) ||
                (typeof b === 'string' && b)
                ? (a as string) || (b as string)
                : 'N/A';
            })()}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Fecha ingreso:</Text>
          <Text style={styles.value}>
            {(() => {
              if (!isRecord(item)) return 'N/A';
              const d = item.hireDate;
              const iso = typeof d === 'string' || d instanceof Date ? d : '';
              try {
                return iso ? new Date(iso).toLocaleDateString() : 'N/A';
              } catch {
                return 'N/A';
              }
            })()}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Salario:</Text>
          <Text style={styles.value}>
            {(() => {
              if (!isRecord(item)) return 'No especificado';
              const s = item.salary;
              return typeof s === 'number' ? `$${s}` : 'No especificado';
            })()}
          </Text>
        </View>
      </View>
    ),
    []
  );

  const keyExtractor = useCallback((item: unknown) => {
    if (isRecord(item)) {
      const id = (item.id ?? item.employeeId) as unknown;
      if (typeof id === 'string' && id) return id;
    }
    return String(Math.random());
  }, []);

  return (
    <EntityList
      title="Usuarios Empleados"
      loadFunction={loadEmployeeUsers}
      renderItem={renderEmployeeUserItem}
      keyExtractor={keyExtractor}
      emptyTitle="No hay empleados"
      emptyMessage="No se encontraron usuarios empleados"
      loadingMessage="Cargando empleados..."
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
  email: {
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
});

EmployeeUserList.displayName = 'EmployeeUserList';

export default EmployeeUserList;
