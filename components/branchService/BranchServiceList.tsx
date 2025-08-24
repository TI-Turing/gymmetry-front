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

  const renderBranchServiceItem = useCallback(
    ({ item }: { item: any }) => (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {item.serviceName || item.name || 'Servicio'}
          </Text>
          <Text style={styles.statusText}>
            {item.isActive ? 'Activo' : 'Inactivo'}
          </Text>
        </View>

        <Text style={styles.description}>
          {item.description || 'Servicio de la sucursal'}
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Sucursal:</Text>
          <Text style={styles.value}>{item.branchName || 'N/A'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Categoría:</Text>
          <Text style={styles.value}>{item.category || 'General'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Precio:</Text>
          <Text style={styles.value}>
            {item.price ? `$${item.price.toFixed(2)}` : 'Incluido'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Duración:</Text>
          <Text style={styles.value}>
            {item.duration ? `${item.duration} min` : 'Variable'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Disponibilidad:</Text>
          <Text style={styles.value}>{item.availability || 'Por horario'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Capacidad:</Text>
          <Text style={styles.value}>
            {item.maxCapacity ? `${item.maxCapacity} personas` : 'Ilimitada'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Instructor:</Text>
          <Text style={styles.value}>
            {item.requiresInstructor ? 'Requerido' : 'No requerido'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Reserva:</Text>
          <Text style={styles.value}>
            {item.requiresReservation ? 'Con reserva' : 'Sin reserva'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Popularidad:</Text>
          <Text style={styles.value}>
            ⭐ {item.rating || '0.0'} ({item.reviewCount || 0} reseñas)
          </Text>
        </View>

        {item.equipment && Array.isArray(item.equipment) && (
          <View style={styles.equipmentSection}>
            <Text style={styles.equipmentLabel}>Equipamiento:</Text>
            <View style={styles.equipmentList}>
              {item.equipment
                .slice(0, 3)
                .map((equip: string, index: number) => (
                  <Text key={index} style={styles.equipmentItem}>
                    • {equip}
                  </Text>
                ))}
              {item.equipment.length > 3 && (
                <Text style={styles.moreEquipment}>
                  +{item.equipment.length - 3} más...
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
    (item: any) =>
      item.id ||
      item.serviceId ||
      `${item.branchId}-${item.serviceId}` ||
      String(Math.random()),
    []
  );

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
