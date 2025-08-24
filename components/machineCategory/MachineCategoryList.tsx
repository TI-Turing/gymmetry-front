import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';

const MachineCategoryList = React.memo(() => {
  const servicePlaceholder = useCallback(() => Promise.resolve([]), []);
  const loadMachineCategories = useCallback(async () => {
    try {
      // Placeholder for actual service call

      const result = await servicePlaceholder();

      return result || [];
    } catch (_error) {
      return [];
    }
  }, [servicePlaceholder]);

  type MachineCategoryItem = {
    id?: string;
    categoryId?: string;
    name?: string;
    categoryName?: string;
    isActive?: boolean;
    description?: string;
    type?: string;
    targetArea?: string;
    muscleGroup?: string;
    machinesCount?: number;
    machines?: unknown[];
    difficulty?: 'advanced' | 'intermediate' | 'beginner' | string;
    spaceRequired?: number;
    maintenanceFrequency?: string;
    averageCost?: number;
    requiresTraining?: boolean;
    lifespan?: number;
    benefits?: string[];
  };
  const renderMachineCategoryItem = useCallback(
    ({ item }: { item: unknown }) => {
      const it = (item || {}) as MachineCategoryItem;
      return (
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {it.name || it.categoryName || 'Categoría de máquina'}
            </Text>
            <Text style={styles.statusText}>
              {it.isActive ? 'Activa' : 'Inactiva'}
            </Text>
          </View>

          <Text style={styles.description}>
            {it.description || 'Categoría de equipamiento de gimnasio'}
          </Text>

          <View style={styles.row}>
            <Text style={styles.label}>Tipo:</Text>
            <Text style={styles.value}>{it.type || 'General'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Área objetivo:</Text>
            <Text style={styles.value}>
              {it.targetArea || it.muscleGroup || 'Múltiples'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Máquinas:</Text>
            <Text style={styles.value}>
              {it.machinesCount ||
                (Array.isArray(it.machines) ? it.machines.length : 0) ||
                '0'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Dificultad:</Text>
            <Text
              style={[
                styles.value,
                {
                  color:
                    it.difficulty === 'advanced'
                      ? '#FF6B35'
                      : it.difficulty === 'intermediate'
                        ? '#ffa726'
                        : '#ff6300',
                },
              ]}
            >
              {it.difficulty === 'advanced'
                ? 'Avanzado'
                : it.difficulty === 'intermediate'
                  ? 'Intermedio'
                  : 'Principiante'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Espacio requerido:</Text>
            <Text style={styles.value}>
              {typeof it.spaceRequired === 'number'
                ? `${it.spaceRequired} m²`
                : 'Variable'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Mantenimiento:</Text>
            <Text style={styles.value}>
              {it.maintenanceFrequency || 'Mensual'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Costo promedio:</Text>
            <Text style={styles.value}>
              {typeof it.averageCost === 'number'
                ? `$${it.averageCost.toLocaleString()}`
                : 'Consultar'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Capacitación:</Text>
            <Text style={styles.value}>
              {it.requiresTraining ? 'Requerida' : 'No requerida'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Vida útil:</Text>
            <Text style={styles.value}>
              {typeof it.lifespan === 'number' ? `${it.lifespan} años` : 'N/A'}
            </Text>
          </View>

          {it.benefits && Array.isArray(it.benefits) && (
            <View style={styles.benefitsSection}>
              <Text style={styles.benefitsLabel}>Beneficios:</Text>
              <View style={styles.benefitsList}>
                {it.benefits
                  .slice(0, 3)
                  .map((benefit: string, index: number) => (
                    <Text key={index} style={styles.benefit}>
                      💪 {benefit}
                    </Text>
                  ))}
                {it.benefits.length > 3 && (
                  <Text style={styles.moreBenefits}>
                    +{it.benefits.length - 3} más...
                  </Text>
                )}
              </View>
            </View>
          )}
        </View>
      );
    },
    []
  );

  const keyExtractor = useCallback((item: unknown) => {
    const it = (item || {}) as MachineCategoryItem;
    return it.id || it.categoryId || String(Math.random());
  }, []);

  return (
    <EntityList
      title="Categorías de Máquinas"
      loadFunction={loadMachineCategories}
      renderItem={renderMachineCategoryItem}
      keyExtractor={keyExtractor}
      emptyTitle="No hay categorías"
      emptyMessage="No se encontraron categorías de máquinas"
      loadingMessage="Cargando categorías..."
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
    minWidth: 120,
  },
  value: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    flex: 1,
  },
  benefitsSection: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.tabIconDefault + '20',
  },
  benefitsLabel: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  benefitsList: {
    gap: SPACING.xs,
  },
  benefit: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    marginLeft: SPACING.sm,
  },
  moreBenefits: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconSelected,
    fontStyle: 'italic',
    marginLeft: SPACING.sm,
  },
});

MachineCategoryList.displayName = 'MachineCategoryList';

export default MachineCategoryList;
