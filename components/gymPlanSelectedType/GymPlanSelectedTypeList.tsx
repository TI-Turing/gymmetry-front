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
    } catch (error) {return [];
    }
  }, []);

GymPlanSelectedTypeList.displayName = 'GymPlanSelectedTypeList';



  const renderGymPlanSelectedTypeItem = useCallback(
    ({ item }: { item: any }) => (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {item.typeName || item.name || 'Tipo de plan seleccionado'}
          </Text>
          <Text style={styles.statusText}>
            {item.isActive ? 'Activo' : 'Inactivo'}
          </Text>
        </View>

        <Text style={styles.description}>
          {item.description || 'Tipo de plan de gimnasio seleccionado'}
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Plan:</Text>
          <Text style={styles.value}>{item.planName || 'N/A'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Tipo:</Text>
          <Text style={styles.value}>{item.typeName || 'N/A'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Categoría:</Text>
          <Text style={styles.value}>
            {item.category === 'premium'
              ? '⭐ Premium'
              : item.category === 'standard'
                ? '🏃 Estándar'
                : item.category === 'basic'
                  ? '💪 Básico'
                  : 'General'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Duración:</Text>
          <Text style={styles.value}>
            {item.duration
              ? `${item.duration} ${item.durationType || 'días'}`
              : 'Indefinida'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Precio adicional:</Text>
          <Text style={styles.value}>
            {item.additionalPrice
              ? `$${item.additionalPrice.toFixed(2)}`
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
                  item.accessLevel === 'full'
                    ? '#4caf50'
                    : item.accessLevel === 'limited'
                      ? '#ffa726'
                      : '#ff6b6b',
              },
            ]}
          >
            {item.accessLevel === 'full'
              ? '✅ Completo'
              : item.accessLevel === 'limited'
                ? '⚠️ Limitado'
                : '❌ Restringido'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Fecha inicio:</Text>
          <Text style={styles.value}>
            {item.startDate
              ? new Date(item.startDate).toLocaleDateString()
              : 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Fecha fin:</Text>
          <Text style={styles.value}>
            {item.endDate ? new Date(item.endDate).toLocaleDateString() : 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Seleccionado por:</Text>
          <Text style={styles.value}>{item.selectedBy || 'Usuario'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Estado pago:</Text>
          <Text
            style={[
              styles.value,
              {
                color: item.isPaid ? '#4caf50' : '#ff6b6b',
              },
            ]}
          >
            {item.isPaid ? '✅ Pagado' : '❌ Pendiente'}
          </Text>
        </View>

        {item.benefits && Array.isArray(item.benefits) && (
          <View style={styles.benefitsSection}>
            <Text style={styles.benefitsLabel}>Beneficios incluidos:</Text>
            <View style={styles.benefitsList}>
              {item.benefits
                .slice(0, 4)
                .map((benefit: string, index: number) => (
                  <Text key={index} style={styles.benefit}>
                    🎁 {benefit}
                  </Text>
                ))}
              {item.benefits.length > 4 && (
                <Text style={styles.moreBenefits}>
                  +{item.benefits.length - 4} más...
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
    (item: any) =>
      item.id ||
      item.selectionId ||
      `${item.planId}-${item.typeId}` ||
      String(Math.random()),
    []
  );

  return (
    <EntityList
      title='Tipos de Plan Seleccionados'
      loadFunction={loadGymPlanSelectedTypes}
      renderItem={renderGymPlanSelectedTypeItem}
      keyExtractor={keyExtractor}
      emptyTitle='No hay tipos seleccionados'
      emptyMessage='No se encontraron tipos de plan seleccionados'
      loadingMessage='Cargando tipos seleccionados...'
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

export default GymPlanSelectedTypeList;
