import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';

const ModuleList = React.memo(() => {
  const servicePlaceholder = useCallback(() => Promise.resolve([]), []);
  const loadModules = useCallback(async () => {
    try {
      // Placeholder for actual service call

      const result = await servicePlaceholder();

      return result || [];
    } catch (_error) {
      return [];
    }
  }, []);

  const renderModuleItem = useCallback(
    ({ item }: { item: any }) => (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {item.name || item.moduleName || 'Módulo'}
          </Text>
          <Text style={styles.statusText}>
            {item.isActive ? 'Activo' : 'Inactivo'}
          </Text>
        </View>

        <Text style={styles.description}>
          {item.description || 'Sin descripción disponible'}
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Categoría:</Text>
          <Text style={styles.value}>{item.category || 'General'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Versión:</Text>
          <Text style={styles.value}>{item.version || '1.0.0'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Precio:</Text>
          <Text style={styles.value}>
            {item.price ? `$${item.price.toFixed(2)}` : 'Gratis'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Instalaciones:</Text>
          <Text style={styles.value}>
            {item.installations || item.installCount || '0'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Submódulos:</Text>
          <Text style={styles.value}>
            {item.subModules?.length || item.subModuleCount || '0'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Desarrollador:</Text>
          <Text style={styles.value}>
            {item.developer || item.author || 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Fecha creación:</Text>
          <Text style={styles.value}>
            {item.createdAt
              ? new Date(item.createdAt).toLocaleDateString()
              : 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Última actualización:</Text>
          <Text style={styles.value}>
            {item.updatedAt
              ? new Date(item.updatedAt).toLocaleDateString()
              : 'N/A'}
          </Text>
        </View>

        {item.features && Array.isArray(item.features) && (
          <View style={styles.featuresSection}>
            <Text style={styles.featuresLabel}>Características:</Text>
            <View style={styles.featuresList}>
              {item.features
                .slice(0, 3)
                .map((feature: string, index: number) => (
                  <Text key={index} style={styles.feature}>
                    • {feature}
                  </Text>
                ))}
              {item.features.length > 3 && (
                <Text style={styles.moreFeatures}>
                  +{item.features.length - 3} más...
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
    (item: any) => item.id || item.moduleId || String(Math.random()),
    []
  );

  return (
    <EntityList
      title="Módulos"
      loadFunction={loadModules}
      renderItem={renderModuleItem}
      keyExtractor={keyExtractor}
      emptyTitle="No hay módulos"
      emptyMessage="No se encontraron módulos"
      loadingMessage="Cargando módulos..."
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
  featuresSection: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.tabIconDefault + '20',
  },
  featuresLabel: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  featuresList: {
    gap: SPACING.xs,
  },
  feature: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    marginLeft: SPACING.sm,
  },
  moreFeatures: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconSelected,
    fontStyle: 'italic',
    marginLeft: SPACING.sm,
  },
});

ModuleList.displayName = 'ModuleList';

export default ModuleList;
