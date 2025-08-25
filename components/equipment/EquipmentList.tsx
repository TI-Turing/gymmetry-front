import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';
import { equipmentService } from '@/services';

const EquipmentList = React.memo(() => {
  const loadEquipment = useCallback(async () => {
    const response = await equipmentService.getAllEquipment();
    const raw = (response as unknown as { Data?: unknown })?.Data;
    const list: unknown[] = Array.isArray(raw)
      ? raw
      : (raw as { $values?: unknown[] })?.$values || [];
    return list;
  }, []);

  const isRecord = (v: unknown): v is Record<string, unknown> =>
    !!v && typeof v === 'object';

  const renderEquipmentItem = useCallback(({ item }: { item: unknown }) => {
    const o = isRecord(item) ? item : ({} as Record<string, unknown>);
    const title =
      (typeof o.name === 'string' && o.name) || 'Equipamiento sin nombre';
    const isAvailable = Boolean(
      (o as { isAvailable?: unknown; IsAvailable?: unknown }).isAvailable ??
        (o as { isAvailable?: unknown; IsAvailable?: unknown }).IsAvailable
    );
    const description =
      (typeof o.description === 'string' && o.description) ||
      'Sin descripción disponible';
    const category =
      (typeof o.category === 'string' && o.category) || 'General';
    const brand = (typeof o.brand === 'string' && o.brand) || 'N/A';
    const condition =
      (typeof o.condition === 'string' && o.condition) || 'Bueno';
    const location =
      (typeof o.location === 'string' && o.location) ||
      (typeof o.zone === 'string' && o.zone) ||
      'N/A';
    const ec = (o as { exerciseCount?: unknown; ExerciseCount?: unknown })
      .exerciseCount;
    const ecAlt = (o as { exerciseCount?: unknown; ExerciseCount?: unknown })
      .ExerciseCount;
    const exerciseCount = Number(ec ?? ecAlt ?? 0);
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.statusText}>
            {isAvailable ? 'Disponible' : 'No disponible'}
          </Text>
        </View>

        <Text style={styles.description}>{description}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Categoría:</Text>
          <Text style={styles.value}>{category}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Marca:</Text>
          <Text style={styles.value}>{brand}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Estado:</Text>
          <Text style={styles.value}>{condition}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Ubicación:</Text>
          <Text style={styles.value}>{location}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Ejercicios:</Text>
          <Text style={styles.value}>{String(exerciseCount)} configurados</Text>
        </View>
      </View>
    );
  }, []);

  const keyExtractor = useCallback((item: unknown) => {
    if (isRecord(item)) {
      const rec = item as { id?: unknown; Id?: unknown };
      const id = rec.id ?? rec.Id;
      if (id != null) return String(id);
    }
    return String(Math.random());
  }, []);

  return (
    <EntityList
      title="Equipamiento"
      loadFunction={loadEquipment}
      renderItem={renderEquipmentItem}
      keyExtractor={keyExtractor}
      emptyTitle="No hay equipamiento"
      emptyMessage="No se encontró equipamiento registrado"
      loadingMessage="Cargando equipamiento..."
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
    minWidth: 80,
  },
  value: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    flex: 1,
  },
});

EquipmentList.displayName = 'EquipmentList';

export default EquipmentList;
