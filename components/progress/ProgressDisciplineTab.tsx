import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { ProgressSummaryResponse } from '../../dto/Progress/ProgressSummaryResponse';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import styles from './styles';
import { CustomAlert } from '../common/CustomAlert';

interface Props {
  data?: ProgressSummaryResponse['Discipline'];
  loading: boolean;
  error?: Error | null;
  onRefresh: () => void;
}

const ProgressDisciplineTab: React.FC<Props> = ({
  data,
  loading,
  error,
  onRefresh,
}) => {
  const themed = useThemedStyles(styles) as ReturnType<typeof styles>;
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
  const block = data as ProgressSummaryResponse['Discipline'] | undefined;
  if (!block) {
    return <Text style={themed.empty}>No hay datos de disciplina.</Text>;
  }
  return (
    <View style={themed.tabContent}>
      <Text style={themed.title}>Disciplina</Text>
      <Text style={themed.itemTitle}>Índice de constancia:</Text>
      <Text style={themed.itemValue}>{block.ConsistencyIndex ?? '-'}</Text>
      <Text style={themed.itemTitle}>Hora habitual de inicio:</Text>
      <Text style={themed.itemValue}>{block.CommonStartHour ?? '-'}</Text>
      <Text style={themed.itemTitle}>Regularidad de horario:</Text>
      <Text style={themed.itemValue}>{block.ScheduleRegularity ?? '-'}</Text>
    </View>
  );
};
export default ProgressDisciplineTab;
