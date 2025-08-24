import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';

const GymPlanSelectedTypeList = React.memo(() => {
  const servicePlaceholder = useCallback(() => Promise.resolve([]), []);
  const loadGymPlanSelectedTypes = useCallback(async () => {
    try {
      // Placeholder for actual service call

      const result = await servicePlaceholder();

      return result || [];
    } catch (_error) {
      return [];
    }
  }, [servicePlaceholder]);

  const renderGymPlanSelectedTypeItem = useCallback(
    ({ item }: { item: unknown }) => {
      const r = (item ?? {}) as Record<string, unknown>;
      const typeName =
        (r['typeName'] as string) ||
        (r['name'] as string) ||
        'Tipo de plan seleccionado';
      const isActive = (r['isActive'] as boolean) ?? false;
      const description =
        (r['description'] as string) || 'Tipo de plan de gimnasio seleccionado';
      const planName = (r['planName'] as string) ?? 'N/A';
      const category = (r['category'] as string) ?? 'General';
      const duration = (r['duration'] as number) ?? null;
      const durationType = (r['durationType'] as string) ?? 'días';
      const additionalPrice = (r['additionalPrice'] as number) ?? null;
      const accessLevel = (r['accessLevel'] as string) ?? 'restricted';
      const startDate = (r['startDate'] as string) ?? null;
      const endDate = (r['endDate'] as string) ?? null;
      const selectedBy = (r['selectedBy'] as string) ?? 'Usuario';
      const isPaid = (r['isPaid'] as boolean) ?? false;
      const benefits = Array.isArray(r['benefits'])
        ? (r['benefits'] as string[])
        : [];

      return (
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>{typeName}</Text>
            <Text style={styles.statusText}>
              {isActive ? 'Activo' : 'Inactivo'}
            </Text>
          </View>

          <Text style={styles.description}>{description}</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Plan:</Text>
            <Text style={styles.value}>{planName}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Tipo:</Text>
            <Text style={styles.value}>{typeName}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Categoría:</Text>
            <Text style={styles.value}>
              {category === 'premium'
                ? '⭐ Premium'
                : category === 'standard'
                  ? '🏃 Estándar'
                  : category === 'basic'
                    ? '💪 Básico'
                    : 'General'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Duración:</Text>
            <Text style={styles.value}>
              {duration != null ? `${duration} ${durationType}` : 'Indefinida'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Precio adicional:</Text>
            <Text style={styles.value}>
              {additionalPrice != null
                ? `$${additionalPrice.toFixed(2)}`
                : 'Incluido'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Acceso nivel:</Text>
            <Text
              style={[
                styles.value,
                {
                  color:
                    accessLevel === 'full'
                      ? '#4caf50'
                      : accessLevel === 'limited'
                        ? '#ffa726'
                        : '#ff6b6b',
                },
              ]}
            >
              {accessLevel === 'full'
                ? '✅ Completo'
                : accessLevel === 'limited'
                  ? '⚠️ Limitado'
                  : '❌ Restringido'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Fecha inicio:</Text>
            <Text style={styles.value}>
              {startDate ? new Date(startDate).toLocaleDateString() : 'N/A'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Fecha fin:</Text>
            <Text style={styles.value}>
              {endDate ? new Date(endDate).toLocaleDateString() : 'N/A'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Seleccionado por:</Text>
            <Text style={styles.value}>{selectedBy}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Estado pago:</Text>
            <Text
              style={[styles.value, { color: isPaid ? '#4caf50' : '#ff6b6b' }]}
            >
              {isPaid ? '✅ Pagado' : '❌ Pendiente'}
            </Text>
          </View>

          {!!benefits.length && (
            <View style={styles.benefitsSection}>
              <Text style={styles.benefitsLabel}>Beneficios incluidos:</Text>
              <View style={styles.benefitsList}>
                {benefits.slice(0, 4).map((benefit: string, index: number) => (
                  <Text key={index} style={styles.benefit}>
                    🎁 {benefit}
                  </Text>
                ))}
                {benefits.length > 4 && (
                  <Text style={styles.moreBenefits}>
                    +{benefits.length - 4} más...
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
    const r = (item ?? {}) as Record<string, unknown>;
    const id =
      (r['Id'] as string) ||
      (r['id'] as string) ||
      (r['SelectionId'] as string) ||
      (r['selectionId'] as string) ||
      (typeof r['planId'] === 'string' && typeof r['typeId'] === 'string'
        ? `${r['planId']}-${r['typeId']}`
        : null);
    return id ?? String(Math.random());
  }, []);

  return (
    <EntityList
      title="Tipos de Plan Seleccionados"
      loadFunction={loadGymPlanSelectedTypes}
      renderItem={renderGymPlanSelectedTypeItem}
      keyExtractor={keyExtractor}
      emptyTitle="No hay tipos seleccionados"
      emptyMessage="No se encontraron tipos de plan seleccionados"
      loadingMessage="Cargando tipos seleccionados..."
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

GymPlanSelectedTypeList.displayName = 'GymPlanSelectedTypeList';

export default GymPlanSelectedTypeList;
