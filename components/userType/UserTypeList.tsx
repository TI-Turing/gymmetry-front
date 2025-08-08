import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';
import { userTypeFunctionsService } from '@/services/functions';

export function UserTypeList() {
  const loadUserTypes = useCallback(async () => {
    const response = await userTypeFunctionsService.getAllUserTypes();
    return response.Data || [];
  }, []);

  const renderUserTypeItem = useCallback(
    ({ item }: { item: any }) => (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {item.name || `Tipo ${item.id?.slice(0, 8)}`}
          </Text>
          <Text style={styles.statusText}>
            {item.isActive ? 'Activo' : 'Inactivo'}
          </Text>
        </View>
        
        {item.description && (
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        
        <View style={styles.row}>
          <Text style={styles.label}>Permisos:</Text>
          <Text style={styles.value}>
            {item.permissions?.length || 0}
          </Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Usuarios:</Text>
          <Text style={styles.value}>
            {item.userCount || 0}
          </Text>
        </View>
      </View>
    ),
    []
  );

  const keyExtractor = useCallback(
    (item: any) => item.id || String(Math.random()),
    []
  );

  return (
    <EntityList
      title='Tipos de Usuario'
      loadFunction={loadUserTypes}
      renderItem={renderUserTypeItem}
      keyExtractor={keyExtractor}
      emptyTitle='No hay tipos'
      emptyMessage='No se encontraron tipos de usuario'
      loadingMessage='Cargando tipos...'
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
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    marginBottom: SPACING.sm,
    lineHeight: 18,
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
    minWidth: 70,
  },
  value: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    flex: 1,
  },
});

export default UserTypeList;
