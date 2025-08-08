import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';

export function MachineCategoryList() {
  const loadMachineCategories = useCallback(async () => {
    try {
      // Placeholder for actual service call
      return [];
    } catch {
      return [];
    }
  }, []);

  const renderMachineCategoryItem = useCallback(
    ({ item }: { item: any }) => (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {item.name || item.categoryName || 'Categoría de máquina'}
          </Text>
          <Text style={styles.statusText}>
            {item.isActive ? 'Activa' : 'Inactiva'}
          </Text>
        </View>
        
        <Text style={styles.description}>
          {item.description || 'Categoría de equipamiento de gimnasio'}
        </Text>
        
        <View style={styles.row}>
          <Text style={styles.label}>Tipo:</Text>
          <Text style={styles.value}>{item.type || 'General'}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Área objetivo:</Text>
          <Text style={styles.value}>
            {item.targetArea || item.muscleGroup || 'Múltiples'}
          </Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Máquinas:</Text>
          <Text style={styles.value}>
            {item.machinesCount || item.machines?.length || '0'}
          </Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Dificultad:</Text>
          <Text style={[styles.value, {
            color: item.difficulty === 'advanced' ? '#ff6b6b' :
                  item.difficulty === 'intermediate' ? '#ffa726' : '#4caf50'
          }]}>
            {item.difficulty === 'advanced' ? 'Avanzado' :
             item.difficulty === 'intermediate' ? 'Intermedio' : 'Principiante'}
          </Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Espacio requerido:</Text>
          <Text style={styles.value}>
            {item.spaceRequired ? `${item.spaceRequired} m²` : 'Variable'}
          </Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Mantenimiento:</Text>
          <Text style={styles.value}>
            {item.maintenanceFrequency || 'Mensual'}
          </Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Costo promedio:</Text>
          <Text style={styles.value}>
            {item.averageCost 
              ? `$${item.averageCost.toLocaleString()}` 
              : 'Consultar'}
          </Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Capacitación:</Text>
          <Text style={styles.value}>
            {item.requiresTraining ? 'Requerida' : 'No requerida'}
          </Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Vida útil:</Text>
          <Text style={styles.value}>
            {item.lifespan ? `${item.lifespan} años` : 'N/A'}
          </Text>
        </View>
        
        {item.benefits && Array.isArray(item.benefits) && (
          <View style={styles.benefitsSection}>
            <Text style={styles.benefitsLabel}>Beneficios:</Text>
            <View style={styles.benefitsList}>
              {item.benefits.slice(0, 3).map((benefit: string, index: number) => (
                <Text key={index} style={styles.benefit}>
                  💪 {benefit}
                </Text>
              ))}
              {item.benefits.length > 3 && (
                <Text style={styles.moreBenefits}>
                  +{item.benefits.length - 3} más...
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
    (item: any) => item.id || item.categoryId || String(Math.random()),
    []
  );

  return (
    <EntityList
      title='Categorías de Máquinas'
      loadFunction={loadMachineCategories}
      renderItem={renderMachineCategoryItem}
      keyExtractor={keyExtractor}
      emptyTitle='No hay categorías'
      emptyMessage='No se encontraron categorías de máquinas'
      loadingMessage='Cargando categorías...'
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

export default MachineCategoryList;
