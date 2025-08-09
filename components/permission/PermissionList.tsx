import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';

const PermissionList = React.memo(() => {
  const servicePlaceholder = useCallback(() => Promise.resolve([]), []);
  const loadPermissions = useCallback(async () => {
    try {
      // Placeholder for actual service call

      const result = await servicePlaceholder();

      return result || [];
    } catch (_error) {return [];
  }
  }, []);

  const renderPermissionItem = useCallback(
    ({ item }: { item: any }) => (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {item.name || item.permissionName || 'Permiso'}
          </Text>
          <Text style={styles.statusText}>
            {item.isActive ? 'Activo' : 'Inactivo'}
          </Text>
        </View>

        <Text style={styles.description}>
          {item.description || 'Permiso del sistema'}
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Módulo:</Text>
          <Text style={styles.value}>{item.module || 'General'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Acción:</Text>
          <Text style={styles.value}>
            {item.action === 'create'
              ? '➕ Crear'
              : item.action === 'read'
                ? '👁️ Leer'
                : item.action === 'update'
                  ? '✏️ Actualizar'
                  : item.action === 'delete'
                    ? '🗑️ Eliminar'
                    : item.action || 'Personalizada'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Nivel:</Text>
          <Text
            style={[
              styles.value,
              {
                color:
                  item.level === 'admin'
                    ? '#ff6b6b'
                    : item.level === 'manager'
                      ? '#ffa726'
                      : item.level === 'user'
                        ? '#4caf50'
                        : Colors.light.text
  },
            ]}
          >
            {item.level === 'admin'
              ? '🔴 Administrador'
              : item.level === 'manager'
                ? '🟡 Gerente'
                : item.level === 'user'
                  ? '🟢 Usuario'
                  : item.level || 'Personalizado'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Recurso:</Text>
          <Text style={styles.value}>{item.resource || 'N/A'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Código:</Text>
          <Text style={styles.value} numberOfLines={1}>
            {item.code || item.permissionCode || 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Usuarios asignados:</Text>
          <Text style={styles.value}>
            {item.usersCount || item.assignedUsers?.length || '0'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Roles asignados:</Text>
          <Text style={styles.value}>
            {item.rolesCount || item.assignedRoles?.length || '0'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Creado:</Text>
          <Text style={styles.value}>
            {item.createdAt
              ? new Date(item.createdAt).toLocaleDateString()
              : 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Requiere 2FA:</Text>
          <Text
            style={[
              styles.value,
              {
                color: item.requiresTwoFactor ? '#ffa726' : Colors.light.text
  },
            ]}
          >
            {item.requiresTwoFactor ? '🔐 Sí' : '🔓 No'}
          </Text>
        </View>

        {item.constraints && Array.isArray(item.constraints) && (
          <View style={styles.constraintsSection}>
            <Text style={styles.constraintsLabel}>Restricciones:</Text>
            <View style={styles.constraintsList}>
              {item.constraints
                .slice(0, 3)
                .map((constraint: string, index: number) => (
                  <Text key={index} style={styles.constraint}>
                    ⚠️ {constraint}
                  </Text>
                ))}
              {item.constraints.length > 3 && (
                <Text style={styles.moreConstraints}>
                  +{item.constraints.length - 3} más...
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
    (item: any) => item.id || item.permissionId || String(Math.random()),
    []
  );

  return (
    <EntityList
      title='Permisos'
      loadFunction={loadPermissions}
      renderItem={renderPermissionItem}
      keyExtractor={keyExtractor}
      emptyTitle='No hay permisos'
      emptyMessage='No se encontraron permisos'
      loadingMessage='Cargando permisos...'
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
    minWidth: 120
  },
  value: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    flex: 1
  },
  constraintsSection: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.tabIconDefault + '20'
  },
  constraintsLabel: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault,
    fontWeight: '500',
    marginBottom: SPACING.xs
  },
  constraintsList: {
    gap: SPACING.xs
  },
  constraint: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    marginLeft: SPACING.sm
  },
  moreConstraints: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconSelected,
    fontStyle: 'italic',
    marginLeft: SPACING.sm

}});

PermissionList.displayName = 'PermissionList';

export default PermissionList;