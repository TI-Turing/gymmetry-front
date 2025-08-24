import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';
import { gymTypeService } from '@/services/gymTypeService';

const GymTypeList = React.memo(() => {
  const isRecord = (v: unknown): v is Record<string, unknown> =>
    !!v && typeof v === 'object' && !Array.isArray(v);
  const loadGymTypes = useCallback(async () => {
    try {
      const response = await gymTypeService.getAllGymTypes();
      const raw = (response?.Data ?? []) as unknown;
      if (Array.isArray(raw)) return raw as unknown[];
      if (isRecord(raw) && Array.isArray((raw['$values'] as unknown[]) ?? [])) {
        return ((raw['$values'] as unknown[]) ?? []) as unknown[];
      }
      return [];
    } catch (_error) {
      // Fallback to mock data if service doesn't exist
      return [];
    }
  }, []);

  const renderGymTypeItem = useCallback(({ item }: { item: unknown }) => {
    const r = (item ?? {}) as Record<string, unknown>;
    const name =
      (r['name'] as string) || (r['typeName'] as string) || 'Tipo sin nombre';
    const isActive = (r['isActive'] as boolean) ?? false;
    const description =
      (r['description'] as string) ?? 'Sin descripción disponible';
    const category = (r['category'] as string) ?? 'Comercial';
    const typicalCapacity =
      (r['typicalCapacity'] as number) ?? (r['capacity'] as number) ?? null;
    const suggestedArea = (r['suggestedArea'] as number) ?? null;
    const equipment =
      (r['equipment'] as string) ||
      (r['requiredEquipment'] as string) ||
      'Estándar';
    const services =
      (r['services'] as string) ||
      (r['includedServices'] as string) ||
      'Básicos';
    const basePrice = (r['basePrice'] as number) ?? null;
    const gymCount =
      (r['gymCount'] as number) ?? (r['totalGyms'] as number) ?? null;
    const features = Array.isArray(r['features'])
      ? (r['features'] as string[])
      : [];

    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.statusText}>
            {isActive ? 'Activo' : 'Inactivo'}
          </Text>
        </View>

        <Text style={styles.description}>{description}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Categoría:</Text>
          <Text style={styles.value}>{category}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Capacidad típica:</Text>
          <Text style={styles.value}>{typicalCapacity ?? 'N/A'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Área sugerida:</Text>
          <Text style={styles.value}>
            {suggestedArea != null ? `${suggestedArea} m²` : 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Equipamiento:</Text>
          <Text style={styles.value}>{equipment}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Servicios:</Text>
          <Text style={styles.value}>{services}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Precio base:</Text>
          <Text style={styles.value}>
            {basePrice != null ? `$${basePrice.toFixed(2)}` : 'Consultar'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Gimnasios:</Text>
          <Text style={styles.value}>{gymCount ?? '0'}</Text>
        </View>

        {!!features.length && (
          <View style={styles.featuresSection}>
            <Text style={styles.featuresLabel}>Características:</Text>
            <View style={styles.featuresList}>
              {features.slice(0, 3).map((feature: string, index: number) => (
                <Text key={index} style={styles.feature}>
                  • {feature}
                </Text>
              ))}
              {features.length > 3 && (
                <Text style={styles.moreFeatures}>
                  +{features.length - 3} más...
                </Text>
              )}
            </View>
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
      (r['TypeId'] as string) ||
      (r['typeId'] as string) ||
      null;
    return id ?? String(Math.random());
  }, []);

  return (
    <EntityList
      title="Tipos de Gimnasio"
      loadFunction={loadGymTypes}
      renderItem={renderGymTypeItem}
      keyExtractor={keyExtractor}
      emptyTitle="No hay tipos"
      emptyMessage="No se encontraron tipos de gimnasio"
      loadingMessage="Cargando tipos..."
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

GymTypeList.displayName = 'GymTypeList';

export default GymTypeList;
