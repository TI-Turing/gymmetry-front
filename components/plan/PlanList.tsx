import React, { useCallback } from 'react';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { planService } from '@/services';
import { Plan } from '@/dto/plan/Plan';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makePlanStyles } from './styles';

const PlanList = React.memo(() => {
  const loadPlans = useCallback(async (): Promise<Plan[]> => {
    const response = await planService.getAllPlans();
    const data = (response.Data || []) as Plan[];
    // Normalizar planType/user a objetos predecibles con nombre en minúscula si vienen como unknown
    return data.map((p) => {
      const pt = p.planType as any;
      const usr = p.user as any;
      return {
        ...p,
        planType:
          pt && typeof pt === 'object'
            ? { name: (pt.Name as string) || (pt.name as string) }
            : undefined,
        user:
          usr && typeof usr === 'object'
            ? { name: (usr.Name as string) || (usr.name as string) }
            : undefined,
      } as Plan;
    });
  }, []);

  const styles = useThemedStyles(makePlanStyles);

  const renderPlanItem = useCallback(
    ({ item }: { item: Plan }) => {
      const pt = (item?.planType || {}) as { name?: string; Name?: string };
      const usr = (item?.user || {}) as { name?: string; Name?: string };
      const planTypeName = pt.name || pt.Name || 'Sin tipo';
      const userName = usr.name || usr.Name;
      return (
        <View style={styles.card}>
          <Text style={styles.title}>Plan: {planTypeName}</Text>
          {userName ? (
            <Text style={styles.label}>Usuario: {userName}</Text>
          ) : null}
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
      );
    },
    [styles]
  );

  const keyExtractor = useCallback(
    (item: Plan) =>
      item.id || `${item.planTypeId}_${item.userId}` || String(Math.random()),
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
