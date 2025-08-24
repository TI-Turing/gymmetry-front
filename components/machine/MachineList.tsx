import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';

const MachineList = React.memo(() => {
  const servicePlaceholder = useCallback(() => Promise.resolve([]), []);
  const loadMachines = useCallback(async () => {
    try {
      // Placeholder for actual service call

      const result = await servicePlaceholder();

      return result || [];
    } catch (_error) {
      return [];
    }
  }, [servicePlaceholder]);

  type MachineItem = {
    id?: string;
    machineId?: string;
    name?: string;
    machineName?: string;
    status?: 'available' | 'occupied' | 'maintenance' | string;
    description?: string;
    category?: string;
    brand?: string;
    model?: string;
    targetMuscle?: string;
    muscleGroup?: string;
    location?: string;
    zone?: string;
    currentUser?: string;
    sessionTime?: number;
    difficulty?: 'hard' | 'medium' | 'easy' | string;
    maxWeight?: number;
    lastMaintenance?: string | number | Date;
    nextMaintenance?: string | number | Date;
    dailyUsage?: string | number;
    features?: string[];
  };
  const renderMachineItem = useCallback(({ item }: { item: unknown }) => {
    const it = (item || {}) as MachineItem;
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {it.name || it.machineName || 'Máquina'}
          </Text>
          <Text style={styles.statusText}>
            {it.status === 'available'
              ? 'Disponible'
              : it.status === 'occupied'
                ? 'Ocupada'
                : it.status === 'maintenance'
                  ? 'Mantenimiento'
                  : 'Fuera de servicio'}
          </Text>
        </View>

        <Text style={styles.description}>
          {it.description || 'Máquina de gimnasio'}
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Categoría:</Text>
          <Text style={styles.value}>{it.category || 'General'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Marca:</Text>
          <Text style={styles.value}>{it.brand || 'N/A'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Modelo:</Text>
          <Text style={styles.value}>{it.model || 'N/A'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Área objetivo:</Text>
          <Text style={styles.value}>
            {it.targetMuscle || it.muscleGroup || 'Múltiples'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Ubicación:</Text>
          <Text style={styles.value}>{it.location || it.zone || 'N/A'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Usuario actual:</Text>
          <Text style={styles.value}>
            {it.currentUser || (it.status === 'available' ? 'Libre' : 'N/A')}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Tiempo uso:</Text>
          <Text style={styles.value}>
            {typeof it.sessionTime === 'number'
              ? `${Math.floor(it.sessionTime / 60)}:${String(it.sessionTime % 60).padStart(2, '0')}`
              : 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Dificultad:</Text>
          <Text
            style={[
              styles.value,
              {
                color:
                  it.difficulty === 'hard'
                    ? '#FF6B35'
                    : it.difficulty === 'medium'
                      ? '#ffa726'
                      : '#ff6300',
              },
            ]}
          >
            {it.difficulty === 'hard'
              ? '🔴 Difícil'
              : it.difficulty === 'medium'
                ? '🟡 Medio'
                : '🟢 Fácil'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Peso máximo:</Text>
          <Text style={styles.value}>
            {typeof it.maxWeight === 'number' ? `${it.maxWeight} kg` : 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Último mantenim.:</Text>
          <Text style={styles.value}>
            {it.lastMaintenance
              ? new Date(it.lastMaintenance).toLocaleDateString()
              : 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Próximo mantenim.:</Text>
          <Text
            style={[
              styles.value,
              {
                color:
                  it.nextMaintenance &&
                  new Date(it.nextMaintenance) <=
                    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    ? '#ffa726'
                    : Colors.light.text,
              },
            ]}
          >
            {it.nextMaintenance
              ? new Date(it.nextMaintenance).toLocaleDateString()
              : 'No programado'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Usos hoy:</Text>
          <Text style={styles.value}>{it.dailyUsage || '0'}</Text>
        </View>

        {it.features && Array.isArray(it.features) && (
          <View style={styles.featuresSection}>
            <Text style={styles.featuresLabel}>Características:</Text>
            <View style={styles.featuresList}>
              {it.features.slice(0, 3).map((feature: string, index: number) => (
                <Text key={index} style={styles.feature}>
                  ⚙️ {feature}
                </Text>
              ))}
              {it.features.length > 3 && (
                <Text style={styles.moreFeatures}>
                  +{it.features.length - 3} más...
                </Text>
              )}
            </View>
          </View>
        )}
      </View>
    );
  }, []);

  const keyExtractor = useCallback((item: unknown) => {
    const it = (item || {}) as MachineItem;
    return it.id || it.machineId || String(Math.random());
  }, []);

  return (
    <EntityList
      title="Máquinas"
      loadFunction={loadMachines}
      renderItem={renderMachineItem}
      keyExtractor={keyExtractor}
      emptyTitle="No hay máquinas"
      emptyMessage="No se encontraron máquinas"
      loadingMessage="Cargando máquinas..."
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
  featuresSection: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.tabIconDefault + '20',
  },
  featuresLabel: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  featuresList: {
    gap: SPACING.xs,
  },
  feature: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    marginLeft: SPACING.sm,
  },
  moreFeatures: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconSelected,
    fontStyle: 'italic',
    marginLeft: SPACING.sm,
  },
});

MachineList.displayName = 'MachineList';

export default MachineList;
