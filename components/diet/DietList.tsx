import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';
import { dietService } from '@/services';

const DietList = React.memo(() => {
  const isRecord = (v: unknown): v is Record<string, unknown> =>
    v !== null && typeof v === 'object';
  const loadDiets = useCallback(async () => {
    const response = await dietService.getAllDiets();
    return response.Success ? response.Data || [] : [];
  }, []);

  const renderDietItem = useCallback(
    ({ item }: { item: unknown }) => (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {(() => {
              if (!isRecord(item)) return 'Dieta sin nombre';
              const n1 = item.name;
              const n2 = item.dietName;
              return (typeof n1 === 'string' && n1) ||
                (typeof n2 === 'string' && n2)
                ? (n1 as string) || (n2 as string)
                : 'Dieta sin nombre';
            })()}
          </Text>
          <Text style={styles.statusText}>
            {isRecord(item) && item.isActive ? 'Activa' : 'Inactiva'}
          </Text>
        </View>

        <Text style={styles.description}>
          {isRecord(item) && typeof item.description === 'string'
            ? item.description
            : 'Sin descripción disponible'}
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Tipo:</Text>
          <Text style={styles.value}>
            {(() => {
              if (!isRecord(item)) return 'General';
              const t1 = item.type;
              const t2 = item.dietType;
              return (typeof t1 === 'string' && t1) ||
                (typeof t2 === 'string' && t2)
                ? (t1 as string) || (t2 as string)
                : 'General';
            })()}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Calorías:</Text>
          <Text style={styles.value}>
            {(() => {
              if (!isRecord(item)) return '0 kcal';
              const c1 = item.calories;
              const c2 = item.totalCalories;
              const n =
                (typeof c1 === 'number' && c1) ||
                (typeof c2 === 'number' && c2) ||
                0;
              return `${n} kcal`;
            })()}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Duración:</Text>
          <Text style={styles.value}>
            {(() => {
              if (!isRecord(item)) return 'N/A días';
              const d = item.duration;
              const v =
                typeof d === 'number' || typeof d === 'string' ? d : 'N/A';
              return `${v} días`;
            })()}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Usuarios:</Text>
          <Text style={styles.value}>
            {(() => {
              if (!isRecord(item)) return '0 siguiendo';
              const n = typeof item.userCount === 'number' ? item.userCount : 0;
              return `${n} siguiendo`;
            })()}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Comidas:</Text>
          <Text style={styles.value}>
            {(() => {
              if (!isRecord(item)) return '0 configuradas';
              const n = typeof item.mealCount === 'number' ? item.mealCount : 0;
              return `${n} configuradas`;
            })()}
          </Text>
        </View>

        {isRecord(item) && typeof item.nutritionist === 'string' && (
          <View style={styles.row}>
            <Text style={styles.label}>Nutricionista:</Text>
            <Text style={styles.value}>{item.nutritionist}</Text>
          </View>
        )}
      </View>
    ),
    []
  );

  const keyExtractor = useCallback((item: unknown) => {
    if (isRecord(item)) {
      const id = (item.id ?? item.dietId) as unknown;
      if (typeof id === 'string' && id) return id;
    }
    return String(Math.random());
  }, []);

  return (
    <EntityList
      title="Planes de Dieta"
      loadFunction={loadDiets}
      renderItem={renderDietItem}
      keyExtractor={keyExtractor}
      emptyTitle="No hay dietas"
      emptyMessage="No se encontraron planes de dieta configurados"
      loadingMessage="Cargando dietas..."
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
    minWidth: 100,
  },
  value: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    flex: 1,
  },
});

DietList.displayName = 'DietList';

export default DietList;
