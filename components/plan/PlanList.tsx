import React, { useCallback } from 'react';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { planService } from '@/services';
import { Plan } from '@/dto/plan/Plan';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makePlanStyles } from './styles';

const PlanList = React.memo(() => {
  const loadPlans = useCallback(async () => {
    const response = await planService.getAllPlans();
    return response.Data || [];
  }, []);

  const styles = useThemedStyles(makePlanStyles);

  const renderPlanItem = useCallback(
    ({ item }: { item: Plan }) => (
      <View style={styles.card}>
        <Text style={styles.title}>
          Plan: {item.planType?.name || 'Sin tipo'}
        </Text>
        {item.user?.name && (
          <Text style={styles.label}>Usuario: {item.user.name}</Text>
        )}
        <Text style={styles.value}>
          Inicio: {new Date(item.startDate).toLocaleDateString()},
        </Text>
        <Text style={styles.value}>
          Fin: {new Date(item.endDate).toLocaleDateString()},
        </Text>
        <View style={{ marginTop: 4, alignItems: 'flex-start' }}>
          <Text
            style={
              item.isActive
                ? styles.statusActiveText
                : styles.statusInactiveText
            }
          >
            {item.isActive ? 'Activo' : 'Inactivo'}
          </Text>
        </View>
      </View>
    ),
    [styles]
  );

  const keyExtractor = useCallback(
    (item: Plan) => item.id || String(Math.random()),
    []
  );

  return (
    <EntityList<Plan>
      title="Planes"
      loadFunction={loadPlans}
      renderItem={renderPlanItem}
      keyExtractor={keyExtractor}
      emptyTitle="No hay planes"
      emptyMessage="No se encontraron planes registrados"
      loadingMessage="Cargando planes..."
    />
  );
});

PlanList.displayName = 'PlanList';

export default PlanList;
