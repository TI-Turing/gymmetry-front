import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';
import { employeeTypeService } from '@/services';

const EmployeeTypeList = React.memo(() => {
  const loadEmployeeTypes = useCallback(async () => {
    const response = await employeeTypeService.getAllEmployeeTypes();
    return response.Success ? response.Data || [] : [];
  }, []);

  const isRecord = (v: unknown): v is Record<string, unknown> =>
    !!v && typeof v === 'object';

  const renderEmployeeTypeItem = useCallback(({ item }: { item: unknown }) => {
    const o = isRecord(item) ? item : ({} as Record<string, unknown>);
    const title =
      (typeof o.name === 'string' && o.name) ||
      (typeof o.typeName === 'string' && o.typeName) ||
      'Tipo sin nombre';
    const isActive = Boolean((o as any).isActive);
    const description =
      (typeof o.description === 'string' && o.description) ||
      'Sin descripción disponible';
    const code =
      (typeof o.code === 'string' && o.code) ||
      (typeof o.typeCode === 'string' && o.typeCode) ||
      'N/A';
    const accessLevel =
      (typeof o.accessLevel === 'string' && o.accessLevel) ||
      (typeof o.level === 'string' && o.level) ||
      'Básico';
    const department =
      (typeof o.department === 'string' && o.department) ||
      (typeof o.defaultDepartment === 'string' && o.defaultDepartment) ||
      'General';
    const employeeCount = (o as any).employeeCount ?? 0;
    const permissionsLen = Array.isArray((o as any).permissions)
      ? ((o as any).permissions as unknown[]).length
      : ((o as any).permissionCount ?? 0);

    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.statusText}>
            {isActive ? 'Activo' : 'Inactivo'}
          </Text>
        </View>

        <Text style={styles.description}>{description}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Código:</Text>
          <Text style={styles.value}>{code}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Nivel acceso:</Text>
          <Text style={styles.value}>{accessLevel}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Departamento:</Text>
          <Text style={styles.value}>{department}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Empleados:</Text>
          <Text style={styles.value}>{String(employeeCount)} asignados</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Permisos:</Text>
          <Text style={styles.value}>
            {String(permissionsLen)} configurados
          </Text>
        </View>
      </View>
    );
  }, []);

  const keyExtractor = useCallback((item: unknown) => {
    if (isRecord(item)) {
      const id = (item.id as any) ?? (item.typeId as any) ?? (item.Id as any);
      if (id != null) return String(id);
    }
    return String(Math.random());
  }, []);

  return (
    <EntityList
      title="Tipos de Empleado"
      loadFunction={loadEmployeeTypes}
      renderItem={renderEmployeeTypeItem}
      keyExtractor={keyExtractor}
      emptyTitle="No hay tipos de empleado"
      emptyMessage="No se encontraron tipos de empleado configurados"
      loadingMessage="Cargando tipos de empleado..."
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
    minWidth: 100,
  },
  value: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    flex: 1,
  },
});

EmployeeTypeList.displayName = 'EmployeeTypeList';

export default EmployeeTypeList;
