import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';
import { branchMediaFunctionsService } from '@/services/functions';

export function BranchMediaList() {
  const loadBranchMedia = useCallback(async () => {
    const response = await branchMediaFunctionsService.getAllBranchMedia();
    return response.Data || [];
  }, []);

  const renderBranchMediaItem = useCallback(
    ({ item }: { item: any }) => (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {item.title || `Media ${item.id?.slice(0, 8)}`}
          </Text>
          <Text style={styles.statusText}>
            {item.type || 'Imagen'}
          </Text>
        </View>
        
        <Text style={styles.branch}>
          Sucursal: {item.branchName || item.branchId || 'N/A'}
        </Text>
        
        {item.description && (
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        
        <View style={styles.row}>
          <Text style={styles.label}>Tamaño:</Text>
          <Text style={styles.value}>
            {item.size ? `${(item.size / 1024).toFixed(2)} KB` : 'N/A'}
          </Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Subido:</Text>
          <Text style={styles.value}>
            {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
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
      title='Media de Sucursales'
      loadFunction={loadBranchMedia}
      renderItem={renderBranchMediaItem}
      keyExtractor={keyExtractor}
      emptyTitle='No hay archivos'
      emptyMessage='No se encontraron archivos multimedia'
      loadingMessage='Cargando archivos...'
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
    backgroundColor: Colors.light.tabIconDefault,
    color: Colors.light.background,
  },
  branch: {
    fontSize: FONT_SIZES.md,
    color: Colors.light.tabIconSelected,
    marginBottom: SPACING.sm,
    fontWeight: '500',
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
    minWidth: 60,
  },
  value: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    flex: 1,
  },
});

export default BranchMediaList;
