import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { ProgressSummaryResponse } from '../../dto/Progress/ProgressSummaryResponse';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import styles from './styles';
import { CustomAlert } from '../common/CustomAlert';

interface Props {
  data?: ProgressSummaryResponse['Objectives'] | unknown;
  loading: boolean;
  error?: Error | null;
  onRefresh: () => void;
}

const ProgressObjectivesTab: React.FC<Props> = ({
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
  const block = data as
    | import('../../dto/Progress/ProgressSummaryResponse').ObjectiveBlock
    | undefined;
  if (!block)
    return <Text style={themed.empty}>No hay datos de objetivos.</Text>;

  return (
    <View style={themed.tabContent}>
      <Text style={themed.title}>Objetivos</Text>
      <Text style={themed.itemTitle}>Planificados:</Text>
      {block.Planned && Object.keys(block.Planned).length ? (
        Object.entries(block.Planned).map(([key, val]) => (
          <Text key={key} style={themed.itemValue}>
            {key}: {val}
          </Text>
        ))
      ) : (
        <Text style={themed.itemValue}>Sin datos</Text>
      )}

      <Text style={themed.itemTitle}>Ejecutados:</Text>
      {block.Executed && Object.keys(block.Executed).length ? (
        Object.entries(block.Executed).map(([key, val]) => (
          <Text key={key} style={themed.itemValue}>
            {key}: {val}
          </Text>
        ))
      ) : (
        <Text style={themed.itemValue}>Sin datos</Text>
      )}

      <Text style={themed.itemTitle}>Brechas:</Text>
      {block.Gaps && block.Gaps.length ? (
        block.Gaps.map((gap, idx) => (
          <View key={idx} style={themed.item}>
            <Text style={themed.itemTitle}>{gap.Objective}</Text>
            <Text style={themed.itemValue}>
              Planificado: {gap.Planned} | Ejecutado: {gap.Executed}
            </Text>
            <Text style={themed.itemValue}>Brecha: {gap.Gap}</Text>
          </View>
        ))
      ) : (
        <Text style={themed.itemValue}>Sin brechas</Text>
      )}
    </View>
  );
};
export default ProgressObjectivesTab;
