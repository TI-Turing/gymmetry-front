import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';
import { gymService } from '@/services';

const GymTypeList = React.memo(() => {
  const loadGymTypes = useCallback(async () => {
    try {
      const response = await gymService.getGymTypes();
      return response.Data || [];
    } catch (_error) {
      // Fallback to mock data if service doesn't exist
      return [];
  }
  }, []);

  const renderGymTypeItem = useCallback(
    ({ item }: { item: any }) => (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {item.name || item.typeName || 'Tipo sin nombre'}
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
          <Text style={styles.value}>{item.category || 'Comercial'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Capacidad típica:</Text>
          <Text style={styles.value}>
            {item.typicalCapacity || item.capacity || 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Área sugerida:</Text>
          <Text style={styles.value}>
            {item.suggestedArea ? `${item.suggestedArea} m²` : 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Equipamiento:</Text>
          <Text style={styles.value}>
            {item.equipment || item.requiredEquipment || 'Estándar'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Servicios:</Text>
          <Text style={styles.value}>
            {item.services || item.includedServices || 'Básicos'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Precio base:</Text>
          <Text style={styles.value}>
            {item.basePrice ? `$${item.basePrice.toFixed(2)}` : 'Consultar'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Gimnasios:</Text>
          <Text style={styles.value}>
            {item.gymCount || item.totalGyms || '0'}
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
    (item: any) => item.id || item.typeId || String(Math.random()),
    []
  );

  return (
    <EntityList
      title='Tipos de Gimnasio'
      loadFunction={loadGymTypes}
      renderItem={renderGymTypeItem}
      keyExtractor={keyExtractor}
      emptyTitle='No hay tipos'
      emptyMessage='No se encontraron tipos de gimnasio'
      loadingMessage='Cargando tipos...'
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
  featuresSection: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.tabIconDefault + '20'
  },
  featuresLabel: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault,
    fontWeight: '500',
    marginBottom: SPACING.xs
  },
  featuresList: {
    gap: SPACING.xs
  },
  feature: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    marginLeft: SPACING.sm
  },
  moreFeatures: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconSelected,
    fontStyle: 'italic',
    marginLeft: SPACING.sm

}});

GymTypeList.displayName = 'GymTypeList';

export default GymTypeList;
