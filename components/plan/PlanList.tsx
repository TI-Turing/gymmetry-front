import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';
import { planFunctionsService } from '@/services/functions';
import { Plan } from '@/dto/plan/Plan';

const PlanList = React.memo(() => {
  const loadPlans = useCallback(async () => {
    const response = await planFunctionsService.getAllPlans();
    return response.Data || [];
  }, []);

  const renderPlanItem = useCallback(
    ({ item }: { item: Plan }) => (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Plan: {item.planType?.name || 'Sin tipo'}
        </Text>
        {item.user?.name && (
          <Text style={styles.cardUser}>Usuario: {item.user.name}</Text>
        )}
        <Text style={styles.cardDate}>
          Inicio: {new Date(item.startDate).toLocaleDateString()},
        </Text>
        <Text style={styles.cardDate}>
          Fin: {new Date(item.endDate).toLocaleDateString()},
        </Text>
        <View style={styles.statusContainer}>
          <Text
            style={[
              styles.statusText,
              {
                color: item.isActive
                  ? Colors.light.tabIconSelected
                  : Colors.light.tabIconDefault
              },
            ]}
          >
            {item.isActive ? 'Activo' : 'Inactivo'}
          </Text>
        </View>
      </View>
    ),
    []
  );

  const keyExtractor = useCallback(
    (item: Plan) => item.id || String(Math.random()),
    []
  );

  return (
    <EntityList<Plan>
      title='Planes'
      loadFunction={loadPlans}
      renderItem={renderPlanItem}
      keyExtractor={keyExtractor}
      emptyTitle='No hay planes'
      emptyMessage='No se encontraron planes registrados'
      loadingMessage='Cargando planes...'
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
    elevation: 3
  },
  cardTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    marginBottom: SPACING.xs,
    color: Colors.light.text
  },
  cardUser: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault,
    marginBottom: SPACING.xs
  },
  cardDate: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    marginBottom: SPACING.xs
  },
  statusContainer: {
    marginTop: SPACING.xs,
    alignItems: 'flex-start'
  },
  statusText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: Colors.light.background
}});

PlanList.displayName = 'PlanList';

export default PlanList;