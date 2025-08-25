import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';
import { gymImageService } from '@/services';
import { normalizeCollection } from '@/utils';

const GymImageList = React.memo(() => {
  const loadGymImages = useCallback(async () => {
    const response = await gymImageService.getAllGymImages();
    const items = normalizeCollection<unknown>(response?.Data);
    return items;
  }, []);

  const renderGymImageItem = useCallback(({ item }: { item: unknown }) => {
    const r = (item ?? {}) as Record<string, unknown>;
    const title =
      (r['title'] as string) ||
      (r['imageName'] as string) ||
      'Imagen sin título';
    const isActive =
      (r['isActive'] as boolean) ?? (r['IsActive'] as boolean) ?? false;
    const description =
      (r['description'] as string) ?? 'Sin descripción disponible';
    const gymName = (r['gymName'] as string) || (r['gym'] as string) || 'N/A';
    const category = (r['category'] as string) ?? 'General';
    const format =
      (r['format'] as string) || (r['fileType'] as string) || 'JPG';
    const fileSize = (r['fileSize'] as number) ?? null;
    const width = (r['width'] as number) ?? null;
    const height = (r['height'] as number) ?? null;
    const uploadedAt = (r['uploadedAt'] as string) ?? null;
    const uploadedBy = (r['uploadedBy'] as string) ?? 'Sistema';
    const url = (r['url'] as string) ?? '';

    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.statusText}>
            {isActive ? 'Activa' : 'Inactiva'}
          </Text>
        </View>

        <Text style={styles.description}>{description}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Gimnasio:</Text>
          <Text style={styles.value}>{gymName}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Categoría:</Text>
          <Text style={styles.value}>{category}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Formato:</Text>
          <Text style={styles.value}>{format}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Tamaño:</Text>
          <Text style={styles.value}>
            {fileSize != null ? `${(fileSize / 1024).toFixed(1)} KB` : 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Resolución:</Text>
          <Text style={styles.value}>
            {width != null && height != null ? `${width}x${height}` : 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Subida:</Text>
          <Text style={styles.value}>
            {uploadedAt ? new Date(uploadedAt).toLocaleDateString() : 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Por:</Text>
          <Text style={styles.value}>{uploadedBy}</Text>
        </View>

        {!!url && (
          <View style={styles.urlSection}>
            <Text style={styles.urlLabel}>URL:</Text>
            <Text style={styles.url} numberOfLines={2}>
              {url}
            </Text>
          </View>
        )}
      </View>
    );
  }, []);

  const keyExtractor = useCallback((item: unknown) => {
    const r = (item ?? {}) as Record<string, unknown>;
    const id =
      (r['Id'] as string) ||
      (r['id'] as string) ||
      (r['ImageId'] as string) ||
      (r['imageId'] as string) ||
      null;
    return id ?? String(Math.random());
  }, []);

  return (
    <EntityList
      title="Imágenes del Gimnasio"
      loadFunction={loadGymImages}
      renderItem={renderGymImageItem}
      keyExtractor={keyExtractor}
      emptyTitle="No hay imágenes"
      emptyMessage="No se encontraron imágenes del gimnasio"
      loadingMessage="Cargando imágenes..."
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
  urlSection: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.tabIconDefault + '20',
  },
  urlLabel: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  url: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconSelected,
    fontFamily: 'monospace',
  },
});

GymImageList.displayName = 'GymImageList';

export default GymImageList;
