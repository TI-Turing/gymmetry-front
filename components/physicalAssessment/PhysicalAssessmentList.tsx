import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';

type PhysicalAssessmentItem = {
  id?: string;
  assessmentId?: string;
  assessmentType?: string;
  isCompleted?: boolean;
  notes?: string;
  userName?: string;
  evaluatorName?: string;
  assessmentDate?: string;
  weight?: number;
  height?: number;
  bmi?: number;
  bodyFat?: number;
  muscleMass?: number;
  systolic?: number;
  diastolic?: number;
  heartRate?: number;
  goals?: string[];
};

const PhysicalAssessmentList = React.memo(() => {
  const servicePlaceholder = useCallback(() => Promise.resolve([]), []);
  const loadPhysicalAssessments = useCallback(async () => {
    try {
      // Placeholder for actual service call

      const result = await servicePlaceholder();

      return result || [];
    } catch (_error) {
      return [];
    }
  }, [servicePlaceholder]);

  const renderPhysicalAssessmentItem = useCallback(
    ({ item }: { item: unknown }) => {
      const it = (item || {}) as Partial<PhysicalAssessmentItem>;
      const dateStr =
        typeof it.assessmentDate === 'string' ? it.assessmentDate : '';
      const weight = typeof it.weight === 'number' ? it.weight : null;
      const height = typeof it.height === 'number' ? it.height : null;
      const bmi = typeof it.bmi === 'number' ? it.bmi : null;
      const bodyFat = typeof it.bodyFat === 'number' ? it.bodyFat : null;
      const muscleMass =
        typeof it.muscleMass === 'number' ? it.muscleMass : null;
      const sys = typeof it.systolic === 'number' ? it.systolic : null;
      const dia = typeof it.diastolic === 'number' ? it.diastolic : null;
      const heart = typeof it.heartRate === 'number' ? it.heartRate : null;
      const goals = Array.isArray(it.goals) ? (it.goals as string[]) : [];
      return (
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {it.assessmentType || 'Evaluación Física'}
            </Text>
            <Text style={styles.statusText}>
              {it.isCompleted ? 'Completada' : 'Pendiente'}
            </Text>
          </View>

          <Text style={styles.description}>
            {it.notes || 'Evaluación física del usuario'}
          </Text>

          <View style={styles.row}>
            <Text style={styles.label}>Usuario:</Text>
            <Text style={styles.value}>{it.userName || 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Evaluador:</Text>
            <Text style={styles.value}>{it.evaluatorName || 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Fecha:</Text>
            <Text style={styles.value}>
              {dateStr ? new Date(dateStr).toLocaleDateString() : 'N/A'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Peso:</Text>
            <Text style={styles.value}>
              {weight !== null ? `${weight} kg` : 'N/A'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Altura:</Text>
            <Text style={styles.value}>
              {height !== null ? `${height} cm` : 'N/A'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>IMC:</Text>
            <Text
              style={[
                styles.value,
                {
                  color:
                    bmi !== null && bmi > 25
                      ? '#FF6B35'
                      : bmi !== null && bmi < 18.5
                        ? '#ffa726'
                        : '#ff6300',
                },
              ]}
            >
              {bmi !== null ? bmi.toFixed(1) : 'N/A'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>% Grasa corporal:</Text>
            <Text style={styles.value}>
              {bodyFat !== null ? `${bodyFat}%` : 'N/A'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Masa muscular:</Text>
            <Text style={styles.value}>
              {muscleMass !== null ? `${muscleMass} kg` : 'N/A'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Presión arterial:</Text>
            <Text style={styles.value}>
              {sys !== null && dia !== null ? `${sys}/${dia} mmHg` : 'N/A'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Frecuencia cardíaca:</Text>
            <Text style={styles.value}>
              {heart !== null ? `${heart} bpm` : 'N/A'}
            </Text>
          </View>

          {goals.length > 0 && (
            <View style={styles.goalsSection}>
              <Text style={styles.goalsLabel}>Objetivos:</Text>
              <View style={styles.goalsList}>
                {goals.slice(0, 3).map((goal, index) => (
                  <Text key={index} style={styles.goal}>
                    🎯 {goal}
                  </Text>
                ))}
                {goals.length > 3 && (
                  <Text style={styles.moreGoals}>
                    +{goals.length - 3} más...
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
    const o = (item || {}) as Record<string, unknown>;
    if (typeof o.id === 'string') return o.id;
    if (typeof o.assessmentId === 'string') return o.assessmentId;
    return String(Math.random());
  }, []);

  return (
    <EntityList
      title="Evaluaciones Físicas"
      loadFunction={loadPhysicalAssessments}
      renderItem={renderPhysicalAssessmentItem}
      keyExtractor={keyExtractor}
      emptyTitle="No hay evaluaciones"
      emptyMessage="No se encontraron evaluaciones físicas"
      loadingMessage="Cargando evaluaciones..."
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
  goalsSection: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.tabIconDefault + '20',
  },
  goalsLabel: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  goalsList: {
    gap: SPACING.xs,
  },
  goal: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    marginLeft: SPACING.sm,
  },
  moreGoals: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconSelected,
    fontStyle: 'italic',
    marginLeft: SPACING.sm,
  },
});

PhysicalAssessmentList.displayName = 'PhysicalAssessmentList';

export default PhysicalAssessmentList;
