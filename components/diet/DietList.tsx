import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';
import { dietService } from '@/services';

export function DietList() {
  const loadDiets = useCallback(async () => {
    const response = await dietService.getAllDiets();
    return response.Data || [];
  }, []);

  const renderDietItem = useCallback(
    ({ item }: { item: any }) => (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {item.name || item.dietName || 'Dieta sin nombre'}
          </Text>
          <Text style={styles.statusText}>
            {item.isActive ? 'Activa' : 'Inactiva'}
          </Text>
        </View>
        
        <Text style={styles.description}>
          {item.description || 'Sin descripción disponible'}
        </Text>
        
        <View style={styles.row}>
          <Text style={styles.label}>Tipo:</Text>
          <Text style={styles.value}>{item.type || item.dietType || 'General'}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Calorías:</Text>
          <Text style={styles.value}>{item.calories || item.totalCalories || 0} kcal</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Duración:</Text>
          <Text style={styles.value}>{item.duration || 'N/A'} días</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Usuarios:</Text>
          <Text style={styles.value}>{item.userCount || 0} siguiendo</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Comidas:</Text>
          <Text style={styles.value}>{item.mealCount || 0} configuradas</Text>
        </View>
        
        {item.nutritionist && (
          <View style={styles.row}>
            <Text style={styles.label}>Nutricionista:</Text>
            <Text style={styles.value}>{item.nutritionist}</Text>
          </View>
        )}
      </View>
    ),
    []
  );

  const keyExtractor = useCallback(
    (item: any) => item.id || item.dietId || String(Math.random()),
    []
  );

  return (
    <EntityList
      title='Planes de Dieta'
      loadFunction={loadDiets}
      renderItem={renderDietItem}
      keyExtractor={keyExtractor}
      emptyTitle='No hay dietas'
      emptyMessage='No se encontraron planes de dieta configurados'
      loadingMessage='Cargando dietas...'
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

export default DietList;
