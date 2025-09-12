import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { ProgressSummaryResponse } from '../../dto/Progress/ProgressSummaryResponse';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import stylesFn from './styles';
import { CustomAlert } from '../common/CustomAlert';

interface Props {
  data?: ProgressSummaryResponse['Exercises'] | unknown;
  loading: boolean;
  error?: Error | null;
  onRefresh: () => void;
}

const ProgressExercisesTab: React.FC<Props> = ({
  data,
  loading,
  error,
  onRefresh,
}) => {
  const themed = useThemedStyles(stylesFn) as ReturnType<typeof stylesFn>;
  if (loading) return <ActivityIndicator style={themed.loading} />;
  if (error)
    return (
      <CustomAlert
        visible
        type="error"
        title="Error"
        message={error.message}
        onClose={onRefresh}
      />
    );
  const block = data as
    | import('../../dto/Progress/ProgressSummaryResponse').ExerciseBlock
    | undefined;
  if (!block)
    return <Text style={themed.empty}>No hay datos de ejercicios.</Text>;

  return (
    <View style={themed.tabContent}>
      <Text style={themed.title}>Ejercicios</Text>
      <Text style={themed.value}>
        Total de ejercicios distintos: {block.DistinctExercises}
      </Text>
      <Text style={themed.value}>Total de series: {block.TotalSeries}</Text>
      <Text style={themed.value}>Total de repeticiones: {block.TotalReps}</Text>

      <Text style={themed.itemTitle}>Más realizados:</Text>
      {block.TopExercises?.length ? (
        block.TopExercises.map((ex) => (
          <View key={ex.ExerciseId} style={themed.item}>
            <Text style={themed.itemTitle}>{ex.Name}</Text>
            <Text style={themed.itemValue}>
              Sesiones: {ex.Sessions} | Series: {ex.Series} | Reps: {ex.Reps}
            </Text>
          </View>
        ))
      ) : (
        <Text style={themed.itemValue}>Sin datos</Text>
      )}

      <Text style={themed.itemTitle}>Menos utilizados:</Text>
      {block.UnderusedExercises?.length ? (
        block.UnderusedExercises.map((ex) => (
          <View key={ex.ExerciseId} style={themed.item}>
            <Text style={themed.itemTitle}>{ex.Name}</Text>
            <Text style={themed.itemValue}>
              Sesiones: {ex.Sessions} | Series: {ex.Series} | Reps: {ex.Reps}
            </Text>
          </View>
        ))
      ) : (
        <Text style={themed.itemValue}>Sin datos</Text>
      )}

      <Text style={themed.itemTitle}>Nuevos ejercicios:</Text>
      {block.NewExercises?.length ? (
        block.NewExercises.map((ex) => (
          <View key={ex.ExerciseId} style={themed.item}>
            <Text style={themed.itemTitle}>{ex.Name}</Text>
            <Text style={themed.itemValue}>
              Sesiones: {ex.Sessions} | Series: {ex.Series} | Reps: {ex.Reps}
            </Text>
          </View>
        ))
      ) : (
        <Text style={themed.itemValue}>Sin datos</Text>
      )}
    </View>
  );
};
export default ProgressExercisesTab;
