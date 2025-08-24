import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';
import { branchMediaService } from '@/services';

const BranchMediaList = React.memo(() => {
  const isRecord = (v: unknown): v is Record<string, unknown> =>
    v !== null && typeof v === 'object';
  const loadBranchMedia = useCallback(async () => {
    const response = await branchMediaService.getAllBranchMedias();
    return response.Data || [];
  }, []);

  BranchMediaList.displayName = 'BranchMediaList';

  const renderBranchMediaItem = useCallback(
    ({ item }: { item: unknown }) => (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {(() => {
              if (!isRecord(item)) return 'Media';
              const title = item.title;
              const id = item.id;
              const idStr = typeof id === 'string' ? id.slice(0, 8) : 'N/A';
              return typeof title === 'string' && title
                ? title
                : `Media ${idStr}`;
            })()}
          </Text>
          <Text style={styles.statusText}>
            {isRecord(item) && typeof item.type === 'string'
              ? item.type
              : 'Imagen'}
          </Text>
        </View>

        <Text style={styles.branch}>
          {(() => {
            if (!isRecord(item)) return 'Sucursal: N/A';
            const name = item.branchName;
            const bid = item.branchId;
            const value =
              (typeof name === 'string' && name) ||
              (typeof bid === 'string' && bid) ||
              'N/A';
            return `Sucursal: ${value}`;
          })()}
        </Text>

        {isRecord(item) && typeof item.description === 'string' && (
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        )}

        <View style={styles.row}>
          <Text style={styles.label}>Tamaño:</Text>
          <Text style={styles.value}>
            {(() => {
              if (!isRecord(item)) return 'N/A';
              const size = item.size;
              const n = typeof size === 'number' ? size : NaN;
              return Number.isFinite(n) ? `${(n / 1024).toFixed(2)} KB` : 'N/A';
            })()}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Subido:</Text>
          <Text style={styles.value}>
            {(() => {
              if (!isRecord(item)) return 'N/A';
              const d = item.createdAt;
              const iso = typeof d === 'string' || d instanceof Date ? d : '';
              try {
                return iso ? new Date(iso).toLocaleDateString() : 'N/A';
              } catch {
                return 'N/A';
              }
            })()}
          </Text>
        </View>
      </View>
    ),
    []
  );

  const keyExtractor = useCallback((item: unknown) => {
    if (isRecord(item)) {
      const id = item.id;
      if (typeof id === 'string' && id) return id;
    }
    return String(Math.random());
  }, []);

  return (
    <EntityList
      title="Media de Sucursales"
      loadFunction={loadBranchMedia}
      renderItem={renderBranchMediaItem}
      keyExtractor={keyExtractor}
      emptyTitle="No hay archivos"
      emptyMessage="No se encontraron archivos multimedia"
      loadingMessage="Cargando archivos..."
    />
  );
});

BranchMediaList.displayName = 'BranchMediaList';

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
