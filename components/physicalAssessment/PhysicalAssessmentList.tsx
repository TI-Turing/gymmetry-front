import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';

const PhysicalAssessmentList = React.memo(() => {
  const servicePlaceholder = useCallback(() => Promise.resolve([]), []);
  const loadPhysicalAssessments = useCallback(async () => {
    try {
      // Placeholder for actual service call

      const result = await servicePlaceholder();

      return result || [];
    } catch (error) {return [];
    }
  }, []);

PhysicalAssessmentList.displayName = 'PhysicalAssessmentList';



  const renderPhysicalAssessmentItem = useCallback(
    ({ item }: { item: any }) => (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {item.assessmentType || 'Evaluación Física'}
          </Text>
          <Text style={styles.statusText}>
            {item.isCompleted ? 'Completada' : 'Pendiente'}
          </Text>
        </View>

        <Text style={styles.description}>
          {item.notes || 'Evaluación física del usuario'}
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Usuario:</Text>
          <Text style={styles.value}>{item.userName || 'N/A'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Evaluador:</Text>
          <Text style={styles.value}>{item.evaluatorName || 'N/A'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Fecha:</Text>
          <Text style={styles.value}>
            {item.assessmentDate
              ? new Date(item.assessmentDate).toLocaleDateString()
              : 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Peso:</Text>
          <Text style={styles.value}>
            {item.weight ? `${item.weight} kg` : 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Altura:</Text>
          <Text style={styles.value}>
            {item.height ? `${item.height} cm` : 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>IMC:</Text>
          <Text
            style={[
              styles.value,
              {
                color:
                  item.bmi > 25
                    ? '#ff6b6b'
                    : item.bmi < 18.5
                      ? '#ffa726'
                      : '#4caf50',
              },
            ]}
          >
            {item.bmi ? item.bmi.toFixed(1) : 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>% Grasa corporal:</Text>
          <Text style={styles.value}>
            {item.bodyFat ? `${item.bodyFat}%` : 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Masa muscular:</Text>
          <Text style={styles.value}>
            {item.muscleMass ? `${item.muscleMass} kg` : 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Presión arterial:</Text>
          <Text style={styles.value}>
            {item.systolic && item.diastolic
              ? `${item.systolic}/${item.diastolic} mmHg`
              : 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Frecuencia cardíaca:</Text>
          <Text style={styles.value}>
            {item.heartRate ? `${item.heartRate} bpm` : 'N/A'}
          </Text>
        </View>

        {item.goals && Array.isArray(item.goals) && (
          <View style={styles.goalsSection}>
            <Text style={styles.goalsLabel}>Objetivos:</Text>
            <View style={styles.goalsList}>
              {item.goals.slice(0, 3).map((goal: string, index: number) => (
                <Text key={index} style={styles.goal}>
                  🎯 {goal}
                </Text>
              ))}
              {item.goals.length > 3 && (
                <Text style={styles.moreGoals}>
                  +{item.goals.length - 3} más...
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
    (item: any) => item.id || item.assessmentId || String(Math.random()),
    []
  );

  return (
    <EntityList
      title='Evaluaciones Físicas'
      loadFunction={loadPhysicalAssessments}
      renderItem={renderPhysicalAssessmentItem}
      keyExtractor={keyExtractor}
      emptyTitle='No hay evaluaciones'
      emptyMessage='No se encontraron evaluaciones físicas'
      loadingMessage='Cargando evaluaciones...'
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

export default PhysicalAssessmentList;
