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
    [styles]
  );

  const keyExtractor = useCallback(
    (item: any) => item.id || String(Math.random()),
    []
  );

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
