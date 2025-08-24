import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';

type CurrentOccupancyItem = Record<string, unknown> & {
  id?: string;
  areaId?: string;
  areaName?: string;
  section?: string;
  occupancyLevel?: 'high' | 'medium' | 'low' | string;
  description?: string;
  currentOccupancy?: number;
  maxCapacity?: number;
  averageStayTime?: number;
  peakTime?: string;
  lowTime?: string;
  lastUpdate?: string;
  isOpen?: boolean;
  openTime?: string;
  closeTime?: string;
  waitingQueue?: number;
  estimatedWaitTime?: number;
  areaType?: string;
  availableEquipment?: number;
  totalEquipment?: number;
  restrictions?: string[];
  recommendations?: string;
};

const CurrentOccupancyList = React.memo(() => {
  const servicePlaceholder = useCallback(
    () => Promise.resolve([] as CurrentOccupancyItem[]),
    []
  );
  const loadCurrentOccupancy = useCallback(async (): Promise<
    CurrentOccupancyItem[]
  > => {
    try {
      // Placeholder for actual service call

      const result = await servicePlaceholder();

      return result || [];
    } catch (_error) {
      return [];
    }
  }, [servicePlaceholder]);

  const renderCurrentOccupancyItem = useCallback(
    ({ item }: { item: CurrentOccupancyItem }) => {
      const occ = (item.currentOccupancy ?? 0) as number;
      const cap = (item.maxCapacity ?? 1) as number;
      const ratio = cap > 0 ? occ / cap : 0;
      const percent = Math.round(ratio * 100);
      return (
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {item.areaName || item.section || 'Área del gimnasio'}
            </Text>
            <Text
              style={[
                styles.statusText,
                {
                  backgroundColor:
                    item.occupancyLevel === 'high'
                      ? '#FF6B35'
                      : item.occupancyLevel === 'medium'
                        ? '#ffa726'
                        : '#ff6300',
                },
              ]}
            >
              {item.occupancyLevel === 'high'
                ? 'Lleno'
                : item.occupancyLevel === 'medium'
                  ? 'Moderado'
                  : 'Disponible'}
            </Text>
          </View>

          <Text style={styles.description}>
            {item.description || 'Zona de entrenamiento'}
          </Text>

          <View style={styles.row}>
            <Text style={styles.label}>Ocupación actual:</Text>
            <Text
              style={[
                styles.value,
                {
                  color:
                    ratio > 0.8
                      ? '#FF6B35'
                      : ratio > 0.6
                        ? '#ffa726'
                        : '#ff6300',
                },
              ]}
            >
              {occ || 0} / {cap || 0} personas
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Porcentaje:</Text>
            <Text
              style={[
                styles.value,
                {
                  color:
                    percent > 80
                      ? '#FF6B35'
                      : percent > 60
                        ? '#ffa726'
                        : '#ff6300',
                },
              ]}
            >
              {cap ? `${percent}%` : '0%'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Tiempo promedio:</Text>
            <Text style={styles.value}>
              {item.averageStayTime
                ? `${Math.floor(item.averageStayTime / 60)}h ${
                    item.averageStayTime % 60
                  }m`
                : 'N/A'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Pico de ocupación:</Text>
            <Text style={styles.value}>
              {item.peakTime || 'No determinado'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Tiempo valle:</Text>
            <Text style={styles.value}>{item.lowTime || 'No determinado'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Última actualización:</Text>
            <Text style={styles.value}>
              {item.lastUpdate
                ? new Date(item.lastUpdate).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Hace unos momentos'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Estado:</Text>
            <Text
              style={[
                styles.value,
                {
                  color: item.isOpen ? '#ff6300' : '#FF6B35',
                },
              ]}
            >
              {item.isOpen ? '🟢 Abierto' : '🔴 Cerrado'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Horario:</Text>
            <Text style={styles.value}>
              {item.openTime && item.closeTime
                ? `${item.openTime} - ${item.closeTime}`
                : '24 horas'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Cola de espera:</Text>
            <Text style={styles.value}>
              {item.waitingQueue || '0'} personas esperando
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Tiempo espera est.:</Text>
            <Text style={styles.value}>
              {item.estimatedWaitTime
                ? `${item.estimatedWaitTime} minutos`
                : 'Sin espera'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Tipo de área:</Text>
            <Text style={styles.value}>
              {item.areaType === 'cardio'
                ? '🏃 Cardio'
                : item.areaType === 'weights'
                  ? '🏋️ Pesas'
                  : item.areaType === 'functional'
                    ? '🤸 Funcional'
                    : item.areaType === 'pool'
                      ? '🏊 Piscina'
                      : '🏃 General'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Equipos disponibles:</Text>
            <Text style={styles.value}>
              {item.availableEquipment || '0'} / {item.totalEquipment || '0'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Temperatura:</Text>
            <Text style={styles.value}>
              {item.temperature ? `${item.temperature}°C` : 'N/A'}
            </Text>
          </View>

          {item.restrictions && Array.isArray(item.restrictions) && (
            <View style={styles.restrictionsSection}>
              <Text style={styles.restrictionsLabel}>
                Restricciones actuales:
              </Text>
              <View style={styles.restrictionsList}>
                {item.restrictions.map((restriction: string, index: number) => (
                  <Text key={index} style={styles.restriction}>
                    ⚠️ {restriction}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {item.recommendations && (
            <View style={styles.recommendationsSection}>
              <Text style={styles.recommendationsLabel}>Recomendaciones:</Text>
              <Text style={styles.recommendationsText}>
                💡 {item.recommendations}
              </Text>
            </View>
          )}
        </View>
      );
    },
    []
  );

  const keyExtractor = useCallback((item: CurrentOccupancyItem) => {
    return (
      (item.id as string) ||
      (item.areaId as string) ||
      (item.areaName as string) ||
      String(Math.random())
    );
  }, []);

  return (
    <EntityList
      title="Ocupación Actual"
      loadFunction={loadCurrentOccupancy}
      renderItem={renderCurrentOccupancyItem}
      keyExtractor={keyExtractor}
      emptyTitle="No hay datos de ocupación"
      emptyMessage="No se encontraron datos de ocupación actual"
      loadingMessage="Cargando ocupación actual..."
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
    minWidth: 160,
  },
  value: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    flex: 1,
  },
  restrictionsSection: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.tabIconDefault + '20',
    backgroundColor: '#fff3cd',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  restrictionsLabel: {
    fontSize: FONT_SIZES.sm,
    color: '#856404',
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  restrictionsList: {
    gap: SPACING.xs,
  },
  restriction: {
    fontSize: FONT_SIZES.sm,
    color: '#856404',
    marginLeft: SPACING.sm,
  },
  recommendationsSection: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.tabIconDefault + '20',
  },
  recommendationsLabel: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  recommendationsText: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    fontStyle: 'italic',
    lineHeight: 18,
  },
});

CurrentOccupancyList.displayName = 'CurrentOccupancyList';

export default CurrentOccupancyList;
