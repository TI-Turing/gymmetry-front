import React, { useCallback } from 'react';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { planTypeService } from '@/services';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makePlanTypeListStyles } from './styles.list';

const PlanTypeList = React.memo(() => {
  const styles = useThemedStyles(makePlanTypeListStyles);

  const loadPlanTypes = useCallback(async () => {
    const response = await planTypeService.getAllPlanTypes();
    return response.Data || [];
  }, []);

  type PlanTypeItem = {
    id?: string;
    name?: string;
    isActive?: boolean;
    description?: string;
    price?: number;
    currency?: string;
    duration?: number | string;
    durationType?: string;
    userCount?: number;
    features?: string;
  };
  const renderPlanTypeItem = useCallback(
    ({ item }: { item: unknown }) => {
      const it = (item || {}) as PlanTypeItem;
      return (
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>{it.name || 'Plan sin nombre'}</Text>
            <Text style={styles.statusText}>
              {it.isActive ? 'Activo' : 'Inactivo'}
            </Text>
          </View>

          <Text style={styles.description}>
            {it.description || 'Sin descripción disponible'}
          </Text>

          <View style={styles.row}>
            <Text style={styles.label}>Precio:</Text>
            <Text style={styles.value}>
              ${it.price || 0} {it.currency || 'USD'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Duración:</Text>
            <Text style={styles.value}>
              {it.duration || 'N/A'} {it.durationType || 'días'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Usuarios:</Text>
            <Text style={styles.value}>{it.userCount || 0} activos</Text>
          </View>

          {it.features && (
            <View style={styles.featuresContainer}>
              <Text style={styles.featuresTitle}>Características:</Text>
              <Text style={styles.features}>{it.features}</Text>
            </View>
          )}
        </View>
      );
    },
    [styles]
  );

  const keyExtractor = useCallback((item: unknown) => {
    const it = (item || {}) as PlanTypeItem;
    return it.id || String(Math.random());
  }, []);

  return (
    <EntityList
      title="Tipos de Plan"
      loadFunction={loadPlanTypes}
      renderItem={renderPlanTypeItem}
      keyExtractor={keyExtractor}
      emptyTitle="No hay tipos de plan"
      emptyMessage="No se encontraron tipos de plan configurados"
      loadingMessage="Cargando tipos de plan..."
    />
  );
});

PlanTypeList.displayName = 'PlanTypeList';

export default PlanTypeList;
