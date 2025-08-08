import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';
import { planTypeService } from '@/services';

const PlanTypeList = React.memo(() => {
  const loadPlanTypes = useCallback(async () => {
    const response = await planTypeService.getAllPlanTypes();
    return response.Data || [];
  }, []);

PlanTypeList.displayName = 'PlanTypeList';



  const renderPlanTypeItem = useCallback(
    ({ item }: { item: any }) => (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>{item.name || 'Plan sin nombre'}</Text>
          <Text style={styles.statusText}>
            {item.isActive ? 'Activo' : 'Inactivo'}
          </Text>
        </View>

        <Text style={styles.description}>
          {item.description || 'Sin descripción disponible'}
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Precio:</Text>
          <Text style={styles.value}>
            ${item.price || 0} {item.currency || 'USD'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Duración:</Text>
          <Text style={styles.value}>
            {item.duration || 'N/A'} {item.durationType || 'días'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Usuarios:</Text>
          <Text style={styles.value}>{item.userCount || 0} activos</Text>
        </View>

        {item.features && (
          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>Características:</Text>
            <Text style={styles.features}>{item.features}</Text>
          </View>
        )}
      </View>
    ),
    []
  );

  const keyExtractor = useCallback(
    (item: any) => item.id || String(Math.random()),
    []
  );

  return (
    <EntityList
      title='Tipos de Plan'
      loadFunction={loadPlanTypes}
      renderItem={renderPlanTypeItem}
      keyExtractor={keyExtractor}
      emptyTitle='No hay tipos de plan'
      emptyMessage='No se encontraron tipos de plan configurados'
      loadingMessage='Cargando tipos de plan...'
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
    minWidth: 80,
  },
  value: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    flex: 1,
    fontWeight: '600',
  },
  featuresContainer: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.tabIconDefault + '20',
  },
  featuresTitle: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  features: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    lineHeight: 18,
  },
});

export default PlanTypeList;
