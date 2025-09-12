import PieChartMuscle from './PieChartMuscle';
import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { ProgressSummaryResponse } from '../../dto/Progress/ProgressSummaryResponse';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import styles from './styles';

import { CustomAlert } from '../common/CustomAlert';

interface Props {
  data?: ProgressSummaryResponse['Muscles'] | unknown;
  loading: boolean;
  error?: Error | null;
  onRefresh: () => void;
}

const ProgressMusclesTab: React.FC<Props> = ({
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
    | import('../../dto/Progress/ProgressSummaryResponse').MuscleBlock
    | undefined;
  if (!block)
    return <Text style={themed.empty}>No hay datos de músculos.</Text>;

  return (
    <View style={themed.tabContent}>
      <Text style={themed.title}>Músculos</Text>
      {block.Distribution && Object.keys(block.Distribution).length ? (
        <>
          <PieChartMuscle distribution={block.Distribution} />
          <Text style={themed.itemTitle}>Distribución:</Text>
          {Object.entries(block.Distribution).map(([key, val]) => (
            <Text key={key} style={themed.itemValue}>
              {key}: {val}
            </Text>
          ))}
        </>
      ) : (
        <Text style={themed.itemValue}>Sin datos</Text>
      )}

      <Text style={themed.itemTitle}>Dominantes:</Text>
      {block.Dominant && block.Dominant.length ? (
        block.Dominant.map((m, idx) => (
          <Text key={idx} style={themed.itemValue}>
            {m}
          </Text>
        ))
      ) : (
        <Text style={themed.itemValue}>Sin datos</Text>
      )}

      <Text style={themed.itemTitle}>Poco trabajados:</Text>
      {block.Underworked && block.Underworked.length ? (
        block.Underworked.map((m, idx) => (
          <Text key={idx} style={themed.itemValue}>
            {m}
          </Text>
        ))
      ) : (
        <Text style={themed.itemValue}>Sin datos</Text>
      )}

      <Text style={themed.itemTitle}>
        Índice de balance: {block.BalanceIndex}
      </Text>

      <Text style={themed.itemTitle}>Alertas:</Text>
      {block.Alerts && block.Alerts.length ? (
        block.Alerts.map((a, idx) => (
          <Text key={idx} style={themed.itemValue}>
            {a}
          </Text>
        ))
      ) : (
        <Text style={themed.itemValue}>Sin alertas</Text>
      )}
    </View>
  );
};
export default ProgressMusclesTab;
