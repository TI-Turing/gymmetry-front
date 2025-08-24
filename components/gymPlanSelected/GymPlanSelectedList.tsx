import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';

export function GymPlanSelectedList() {
  const servicePlaceholder = () => Promise.resolve([]);
  const loadGymPlanSelected = useCallback(async () => {
    try {
      // Placeholder for actual service call

      const result = await servicePlaceholder();

      const raw = (result ?? []) as unknown;
      return Array.isArray(raw) ? (raw as unknown[]) : [];
    } catch (error) {
      return [];
    }
  }, []);

  const renderGymPlanSelectedItem = useCallback(
    ({ item }: { item: unknown }) => {
      const r = (item ?? {}) as Record<string, unknown>;
      const planName =
        (r['planName'] as string) ||
        (r['name'] as string) ||
        'Plan seleccionado';
      const isActive =
        (r['isActive'] as boolean) ?? (r['IsActive'] as boolean) ?? false;
      const description =
        (r['description'] as string) ?? 'Plan de gimnasio seleccionado';
      const gymName = (r['gymName'] as string) ?? 'N/A';
      const userName = (r['userName'] as string) ?? 'N/A';
      const startDate = (r['startDate'] as string) ?? null;
      const endDate = (r['endDate'] as string) ?? null;
      const price = (r['price'] as number) ?? null;
      const isPaid = (r['isPaid'] as boolean) ?? false;
      const moduleCount = (r['moduleCount'] as number) ?? null;
      const modules = Array.isArray(r['modules'])
        ? (r['modules'] as unknown[])
        : null;

      return (
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>{planName}</Text>
            <Text style={styles.statusText}>
              {isActive ? 'Activo' : 'Inactivo'}
            </Text>
          </View>

          <Text style={styles.description}>{description}</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Gimnasio:</Text>
            <Text style={styles.value}>{gymName}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Usuario:</Text>
            <Text style={styles.value}>{userName}</Text>
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
            <Text style={styles.label}>Precio:</Text>
            <Text style={styles.value}>
              {price != null ? `$${price.toFixed(2)}` : 'N/A'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Estado pago:</Text>
            <Text
              style={[
                styles.value,
                { color: isPaid ? Colors.light.tabIconSelected : '#ff6b6b' },
              ]}
            >
              {isPaid ? 'Pagado' : 'Pendiente'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Módulos:</Text>
            <Text style={styles.value}>
              {moduleCount ?? modules?.length ?? '0'}
            </Text>
          </View>
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
      null;
    return id ?? String(Math.random());
  }, []);

  return (
    <EntityList
      title="Planes de Gimnasio Seleccionados"
      loadFunction={loadGymPlanSelected}
      renderItem={renderGymPlanSelectedItem}
      keyExtractor={keyExtractor}
      emptyTitle="No hay planes seleccionados"
      emptyMessage="No se encontraron planes de gimnasio seleccionados"
      loadingMessage="Cargando planes seleccionados..."
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

export default GymPlanSelectedList;
