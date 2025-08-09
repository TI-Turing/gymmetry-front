import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';
import { gymImageService } from '@/services';

const GymImageList = React.memo(() => {
  const loadGymImages = useCallback(async () => {
    const response = await gymImageService.getAllGymImages();
    return response || [];
  }, []);

  const renderGymImageItem = useCallback(
    ({ item }: { item: any }) => (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {item.title || item.imageName || 'Imagen sin título'}
          </Text>
          <Text style={styles.statusText}>
            {item.isActive ? 'Activa' : 'Inactiva'}
          </Text>
        </View>

        <Text style={styles.description}>
          {item.description || 'Sin descripción disponible'}
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Gimnasio:</Text>
          <Text style={styles.value}>{item.gymName || item.gym || 'N/A'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Categoría:</Text>
          <Text style={styles.value}>{item.category || 'General'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Formato:</Text>
          <Text style={styles.value}>
            {item.format || item.fileType || 'JPG'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Tamaño:</Text>
          <Text style={styles.value}>
            {item.fileSize ? `${(item.fileSize / 1024).toFixed(1)} KB` : 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Resolución:</Text>
          <Text style={styles.value}>
            {item.width && item.height ? `${item.width}x${item.height}` : 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Subida:</Text>
          <Text style={styles.value}>
            {item.uploadedAt
              ? new Date(item.uploadedAt).toLocaleDateString()
              : 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Por:</Text>
          <Text style={styles.value}>{item.uploadedBy || 'Sistema'}</Text>
        </View>

        {item.url && (
          <View style={styles.urlSection}>
            <Text style={styles.urlLabel}>URL:</Text>
            <Text style={styles.url} numberOfLines={2}>
              {item.url}
            </Text>
          </View>
        )}
      </View>
    ),
    []
  );

  const keyExtractor = useCallback(
    (item: any) => item.id || item.imageId || String(Math.random()),
    []
  );

  return (
    <EntityList
      title='Imágenes del Gimnasio'
      loadFunction={loadGymImages}
      renderItem={renderGymImageItem}
      keyExtractor={keyExtractor}
      emptyTitle='No hay imágenes'
      emptyMessage='No se encontraron imágenes del gimnasio'
      loadingMessage='Cargando imágenes...'
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
    minWidth: 100
  },
  value: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    flex: 1
  },
  urlSection: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.tabIconDefault + '20'
  },
  urlLabel: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault,
    fontWeight: '500',
    marginBottom: SPACING.xs
  },
  url: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconSelected,
    fontFamily: 'monospace'

}});

GymImageList.displayName = 'GymImageList';

export default GymImageList;