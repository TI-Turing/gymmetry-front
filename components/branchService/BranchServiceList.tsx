import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';

const BranchServiceList = React.memo(() => {
  const servicePlaceholder = useCallback(() => Promise.resolve([]), []);

  const loadBranchServices = useCallback(async () => {
    try {
      // Placeholder for actual service call
      const result = await servicePlaceholder();
      return result || [];
    } catch (_error) {
      // Handle error silently or use proper error handling
      return [];
    }
  }, [servicePlaceholder]);

  const isRecord = (v: unknown): v is Record<string, unknown> =>
    !!v && typeof v === 'object';

  const renderBranchServiceItem = useCallback(({ item }: { item: unknown }) => {
    const o = isRecord(item) ? item : ({} as Record<string, unknown>);
    const title =
      (typeof o.serviceName === 'string' && o.serviceName) ||
      (typeof o.name === 'string' && o.name) ||
      'Servicio';
    const isActive = Boolean((o as any).isActive);
    const description =
      (typeof o.description === 'string' && o.description) ||
      'Servicio de la sucursal';
    const branchName =
      (typeof o.branchName === 'string' && o.branchName) || 'N/A';
    const category =
      (typeof o.category === 'string' && o.category) || 'General';
    const priceRaw = (o as any).price;
    const priceText =
      typeof priceRaw === 'number' ? `$${priceRaw.toFixed(2)}` : 'Incluido';
    const durationRaw = (o as any).duration;
    const durationText =
      typeof durationRaw === 'number' ? `${durationRaw} min` : 'Variable';
    const availability =
      (typeof o.availability === 'string' && o.availability) || 'Por horario';
    const maxCapacityRaw = (o as any).maxCapacity;
    const maxCapacityText =
      typeof maxCapacityRaw === 'number'
        ? `${maxCapacityRaw} personas`
        : 'Ilimitada';
    const requiresInstructor = Boolean((o as any).requiresInstructor);
    const requiresReservation = Boolean((o as any).requiresReservation);
    const rating = (o as any).rating ?? '0.0';
    const reviewCount = (o as any).reviewCount ?? 0;
    const equipmentArr = Array.isArray((o as any).equipment)
      ? ((o as any).equipment as unknown[]).filter((e) => typeof e === 'string')
      : [];

    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.statusText}>
            {isActive ? 'Activo' : 'Inactivo'}
          </Text>
        </View>

        <Text style={styles.description}>{description}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Sucursal:</Text>
          <Text style={styles.value}>{branchName}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Categoría:</Text>
          <Text style={styles.value}>{category}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Precio:</Text>
          <Text style={styles.value}>{priceText}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Duración:</Text>
          <Text style={styles.value}>{durationText}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Disponibilidad:</Text>
          <Text style={styles.value}>{availability}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Capacidad:</Text>
          <Text style={styles.value}>{maxCapacityText}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Instructor:</Text>
          <Text style={styles.value}>
            {requiresInstructor ? 'Requerido' : 'No requerido'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Reserva:</Text>
          <Text style={styles.value}>
            {requiresReservation ? 'Con reserva' : 'Sin reserva'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Popularidad:</Text>
          <Text style={styles.value}>
            ⭐ {String(rating)} ({String(reviewCount)} reseñas)
          </Text>
        </View>

        {equipmentArr.length > 0 && (
          <View style={styles.equipmentSection}>
            <Text style={styles.equipmentLabel}>Equipamiento:</Text>
            <View style={styles.equipmentList}>
              {equipmentArr.slice(0, 3).map((equip: unknown, index: number) => (
                <Text key={index} style={styles.equipmentItem}>
                  • {String(equip)}
                </Text>
              ))}
              {equipmentArr.length > 3 && (
                <Text style={styles.moreEquipment}>
                  +{equipmentArr.length - 3} más...
                </Text>
              )}
            </View>
          </View>
        )}
      </View>
    );
  }, []);

  const keyExtractor = useCallback((item: unknown) => {
    if (isRecord(item)) {
      const id = (item.id as any) ?? (item.serviceId as any);
      if (id != null) return String(id);
      const b = (item.branchId as any) ?? (item.BranchId as any);
      const s = (item.serviceId as any) ?? (item.ServiceId as any);
      if (b != null && s != null) return `${String(b)}-${String(s)}`;
    }
    return String(Math.random());
  }, []);

  return (
    <EntityList
      title="Servicios de Sucursal"
      loadFunction={loadBranchServices}
      renderItem={renderBranchServiceItem}
      keyExtractor={keyExtractor}
      emptyTitle="No hay servicios"
      emptyMessage="No se encontraron servicios para esta sucursal"
      loadingMessage="Cargando servicios..."
    />
  );
});

BranchServiceList.displayName = 'BranchServiceList';

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
  equipmentSection: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.tabIconDefault + '20',
  },
  equipmentLabel: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  equipmentList: {
    gap: SPACING.xs,
  },
  equipmentItem: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    marginLeft: SPACING.sm,
  },
  moreEquipment: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconSelected,
    fontStyle: 'italic',
    marginLeft: SPACING.sm,
  },
});

export default BranchServiceList;
