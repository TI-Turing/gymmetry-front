import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';
import { accessMethodTypeService } from '@/services';

export function AccessMethodTypeList() {
  const isRecord = (v: unknown): v is Record<string, unknown> =>
    v !== null && typeof v === 'object';
  const loadAccessMethodTypes = useCallback(async () => {
    const response = await accessMethodTypeService.getAllAccessMethodTypes();
    return response.Data || [];
  }, []);

  const renderAccessMethodTypeItem = useCallback(
    ({ item }: { item: unknown }) => {
      const rec = isRecord(item) ? (item as Record<string, unknown>) : null;
      const name =
        rec && typeof rec['name'] === 'string' ? (rec['name'] as string) : '';
      const id =
        rec && typeof rec['id'] === 'string' ? (rec['id'] as string) : '';
      const isActive = rec ? Boolean(rec['isActive']) : false;
      const description =
        rec && typeof rec['description'] === 'string'
          ? (rec['description'] as string)
          : '';
      const type =
        rec && typeof rec['type'] === 'string' ? (rec['type'] as string) : '';
      const securityLevel =
        rec && typeof rec['securityLevel'] === 'string'
          ? (rec['securityLevel'] as string)
          : '';
      return (
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {name || (id ? `Método ${id.slice(0, 8)}` : 'Método sin nombre')}
            </Text>
            <Text style={styles.statusText}>
              {isActive ? 'Activo' : 'Inactivo'}
            </Text>
          </View>

          {description ? (
            <Text style={styles.description} numberOfLines={2}>
              {description}
            </Text>
          ) : null}

          <View style={styles.row}>
            <Text style={styles.label}>Tipo:</Text>
            <Text style={styles.value}>{type || 'Estándar'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Seguridad:</Text>
            <Text style={styles.value}>{securityLevel || 'Media'}</Text>
          </View>
        </View>
      );
    },
    []
  );

  const keyExtractor = useCallback((item: unknown) => {
    if (isRecord(item) && typeof item.id === 'string' && item.id) {
      return item.id;
    }
    return String(Math.random());
  }, []);

  return (
    <EntityList
      title="Métodos de Acceso"
      loadFunction={loadAccessMethodTypes}
      renderItem={renderAccessMethodTypeItem}
      keyExtractor={keyExtractor}
      emptyTitle="No hay métodos"
      emptyMessage="No se encontraron métodos de acceso"
      loadingMessage="Cargando métodos..."
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

export default AccessMethodTypeList;
