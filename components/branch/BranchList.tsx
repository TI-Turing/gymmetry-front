import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';

const BranchList = React.memo(() => {
  const isRecord = (v: unknown): v is Record<string, unknown> =>
    v !== null && typeof v === 'object';
  const servicePlaceholder = useCallback(() => Promise.resolve([]), []);
  const loadBranches = useCallback(async () => {
    try {
      // Placeholder for actual service call
      const result = await servicePlaceholder();
      return result || [];
    } catch (_error) {
      return [];
    }
  }, [servicePlaceholder]);

  const renderBranchItem = useCallback(
    ({ item }: { item: unknown }) => (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {(() => {
              if (!isRecord(item)) return 'Sucursal';
              const name = item.name;
              const branchName = item.branchName;
              return (typeof name === 'string' && name) ||
                (typeof branchName === 'string' && branchName)
                ? (name as string) || (branchName as string)
                : 'Sucursal';
            })()}
          </Text>
          <Text style={styles.statusText}>
            {isRecord(item) && item.isActive ? 'Activa' : 'Inactiva'}
          </Text>
        </View>

        <Text style={styles.description}>
          {isRecord(item) && typeof item.description === 'string'
            ? item.description
            : 'Sucursal del gimnasio'}
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Dirección:</Text>
          <Text style={styles.value}>
            {isRecord(item) && typeof item.address === 'string'
              ? item.address
              : 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Ciudad:</Text>
          <Text style={styles.value}>
            {isRecord(item) && typeof item.city === 'string'
              ? item.city
              : 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Teléfono:</Text>
          <Text style={styles.value}>
            {isRecord(item) && typeof item.phone === 'string'
              ? item.phone
              : 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Horario:</Text>
          <Text style={styles.value}>
            {isRecord(item) && item.openingTime && item.closingTime
              ? `${item.openingTime as string} - ${item.closingTime as string}`
              : 'Consultar'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Capacidad:</Text>
          <Text style={styles.value}>
            {isRecord(item) && typeof item.currentOccupancy === 'number'
              ? item.currentOccupancy
              : 0}{' '}
            /{' '}
            {isRecord(item) && typeof item.maxCapacity === 'number'
              ? item.maxCapacity
              : 0}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Servicios:</Text>
          <Text style={styles.value}>
            {(() => {
              if (!isRecord(item)) return '0';
              const count = item.servicesCount;
              if (typeof count === 'number') return String(count);
              const arr = item.services;
              return Array.isArray(arr) ? String(arr.length) : '0';
            })()}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Entrenadores:</Text>
          <Text style={styles.value}>
            {(() => {
              if (!isRecord(item)) return '0';
              const count = item.trainersCount;
              if (typeof count === 'number') return String(count);
              const arr = item.trainers;
              return Array.isArray(arr) ? String(arr.length) : '0';
            })()}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Rating:</Text>
          <Text style={styles.value}>
            {(() => {
              const rating =
                isRecord(item) && typeof item.rating === 'number'
                  ? item.rating.toFixed(1)
                  : '0.0';
              const reviews =
                isRecord(item) && typeof item.reviewCount === 'number'
                  ? item.reviewCount
                  : 0;
              return `⭐ ${rating} (${reviews})`;
            })()}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Gerente:</Text>
          <Text style={styles.value}>
            {isRecord(item) && typeof item.manager === 'string'
              ? item.manager
              : 'N/A'}
          </Text>
        </View>

        {!!(
          isRecord(item) &&
          item.amenities &&
          Array.isArray(item.amenities)
        ) && (
          <View style={styles.amenitiesSection}>
            <Text style={styles.amenitiesLabel}>Amenidades:</Text>
            <View style={styles.amenitiesList}>
              {(
                (item.amenities as unknown[]).filter(
                  (v): v is string => typeof v === 'string'
                ) as string[]
              )
                .slice(0, 4)
                .map((amenity: string, index: number) => (
                  <Text key={index} style={styles.amenity}>
                    ✓ {amenity}
                  </Text>
                ))}
              {(item.amenities as unknown[]).length > 4 && (
                <Text style={styles.moreAmenities}>
                  +{(item.amenities as unknown[]).length - 4} más...
                </Text>
              )}
            </View>
          </View>
        )}
      </View>
    ),
    []
  );

  const keyExtractor = useCallback((item: unknown) => {
    if (isRecord(item)) {
      const id = (item.id ?? item.branchId) as unknown;
      if (typeof id === 'string' && id) return id;
    }
    return String(Math.random());
  }, []);

  return (
    <EntityList
      title="Sucursales"
      loadFunction={loadBranches}
      renderItem={renderBranchItem}
      keyExtractor={keyExtractor}
      emptyTitle="No hay sucursales"
      emptyMessage="No se encontraron sucursales"
      loadingMessage="Cargando sucursales..."
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
  amenitiesSection: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.tabIconDefault + '20',
  },
  amenitiesLabel: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  amenitiesList: {
    gap: SPACING.xs,
  },
  amenity: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    marginLeft: SPACING.sm,
  },
  moreAmenities: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconSelected,
    fontStyle: 'italic',
    marginLeft: SPACING.sm,
  },
});

BranchList.displayName = 'BranchList';

export default BranchList;
