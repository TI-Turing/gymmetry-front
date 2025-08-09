import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';
import { employeeUserService } from '@/services';

const EmployeeUserList = React.memo(() => {
  const loadEmployeeUsers = useCallback(async () => {
    const response = await employeeUserService.getAllEmployeeUsers();
    return response.Success ? response.Data || [] : [];
  }, []);

  const renderEmployeeUserItem = useCallback(
    ({ item }: { item: any }) => (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {item.fullName || item.name || 'Empleado sin nombre'}
          </Text>
          <Text style={styles.statusText}>
            {item.isActive ? 'Activo' : 'Inactivo'}
          </Text>
        </View>

        <Text style={styles.email}>
          {item.email || 'Sin email configurado'}
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Código:</Text>
          <Text style={styles.value}>
            {item.employeeCode || item.code || 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Posición:</Text>
          <Text style={styles.value}>
            {item.position || item.jobTitle || 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Departamento:</Text>
          <Text style={styles.value}>{item.department || 'No asignado'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Teléfono:</Text>
          <Text style={styles.value}>
            {item.phone || item.phoneNumber || 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Fecha ingreso:</Text>
          <Text style={styles.value}>
            {item.hireDate
              ? new Date(item.hireDate).toLocaleDateString()
              : 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Salario:</Text>
          <Text style={styles.value}>
            {item.salary ? `$${item.salary}` : 'No especificado'}
          </Text>
        </View>
      </View>
    ),
    []
  );

  const keyExtractor = useCallback(
    (item: any) => item.id || item.employeeId || String(Math.random()),
    []
  );

  return (
    <EntityList
      title='Usuarios Empleados'
      loadFunction={loadEmployeeUsers}
      renderItem={renderEmployeeUserItem}
      keyExtractor={keyExtractor}
      emptyTitle='No hay empleados'
      emptyMessage='No se encontraron usuarios empleados'
      loadingMessage='Cargando empleados...'
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
  email: {
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

}});

EmployeeUserList.displayName = 'EmployeeUserList';

export default EmployeeUserList;
