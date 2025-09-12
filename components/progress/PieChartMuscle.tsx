import React from 'react';
import { View, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

interface PieChartMuscleProps {
  distribution: Record<string, number>;
}

const COLORS = [
  '#4CAF50',
  '#2196F3',
  '#FF9800',
  '#E91E63',
  '#9C27B0',
  '#00BCD4',
  '#FFC107',
  '#8BC34A',
  '#FF5722',
  '#607D8B',
];

const PieChartMuscle: React.FC<PieChartMuscleProps> = ({ distribution }) => {
  const data = Object.entries(distribution || {})
    .filter(([_, v]) => v > 0)
    .map(([key, value], idx) => ({
      name: key,
      population: value,
      color: COLORS[idx % COLORS.length],
      legendFontColor: '#333',
      legendFontSize: 12,
    }));

  if (!data.length) return null;

  return (
    <View style={{ alignItems: 'center', marginVertical: 12 }}>
      <PieChart
        data={data}
        width={Math.min(Dimensions.get('window').width, 320)}
        height={160}
        chartConfig={{
          color: () => '#333',
          labelColor: () => '#333',
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="0"
        absolute
      />
    </View>
  );
};

export default PieChartMuscle;
