import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';

export function GymPlanSelectedList() {
  const loadGymPlanSelected = useCallback(async () => {
    try {
      // Placeholder for actual service call
      return [];
    } catch (error) {
      return [];
    }
  }, []);

  const renderGymPlanSelectedItem = useCallback(
    ({ item }: { item: any }) => (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {item.planName || item.name || 'Plan seleccionado'}
          </Text>
          <Text style={styles.statusText}>
            {item.isActive ? 'Activo' : 'Inactivo'}
          </Text>
        </View>
        
        <Text style={styles.description}>
          {item.description || 'Plan de gimnasio seleccionado'}
        </Text>
        
        <View style={styles.row}>
          <Text style={styles.label}>Gimnasio:</Text>
          <Text style={styles.value}>{item.gymName || 'N/A'}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Usuario:</Text>
          <Text style={styles.value}>{item.userName || 'N/A'}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Fecha inicio:</Text>
          <Text style={styles.value}>
            {item.startDate 
              ? new Date(item.startDate).toLocaleDateString() 
              : 'N/A'
            }
          </Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Fecha fin:</Text>
          <Text style={styles.value}>
            {item.endDate 
              ? new Date(item.endDate).toLocaleDateString() 
              : 'N/A'
            }
          </Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Precio:</Text>
          <Text style={styles.value}>
            {item.price ? `$${item.price.toFixed(2)}` : 'N/A'}
          </Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Estado pago:</Text>
          <Text style={[styles.value, { 
            color: item.isPaid ? Colors.light.tabIconSelected : '#ff6b6b' 
          }]}>
            {item.isPaid ? 'Pagado' : 'Pendiente'}
          </Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Módulos:</Text>
          <Text style={styles.value}>
            {item.moduleCount || item.modules?.length || '0'}
          </Text>
        </View>
      </View>
    ),
    []
  );

  const keyExtractor = useCallback(
    (item: any) => item.id || item.selectionId || String(Math.random()),
    []
  );

  return (
    <EntityList
      title='Planes de Gimnasio Seleccionados'
      loadFunction={loadGymPlanSelected}
      renderItem={renderGymPlanSelectedItem}
      keyExtractor={keyExtractor}
      emptyTitle='No hay planes seleccionados'
      emptyMessage='No se encontraron planes de gimnasio seleccionados'
      loadingMessage='Cargando planes seleccionados...'
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
});

export default GymPlanSelectedList;
