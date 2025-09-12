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
  // Validación más robusta de los datos
  if (
    !distribution ||
    typeof distribution !== 'object' ||
    Object.keys(distribution).length === 0
  ) {
    return null;
  }

  const data = Object.entries(distribution)
    .filter(([key, value]) => {
      // Validar que key sea string no vacío y value sea number válido
      return (
        typeof key === 'string' &&
        key.trim() !== '' &&
        typeof value === 'number' &&
        value > 0 &&
        !isNaN(value) &&
        isFinite(value)
      );
    })
    .map(([key, value], idx) => ({
      name: key.trim(),
      population: Math.round(value * 100) / 100, // Redondear a 2 decimales
      color: COLORS[idx % COLORS.length],
      legendFontColor: '#333',
      legendFontSize: 12,
    }));

  // Si no hay datos válidos después del filtrado
  if (!data.length) {
    return null;
  }

  try {
    const screenWidth = Dimensions.get('window').width;
    const chartWidth = Math.min(screenWidth - 40, 320); // Dar margen para padding

    return (
      <View style={{ alignItems: 'center', marginVertical: 12 }}>
        <PieChart
          data={data}
          width={chartWidth}
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
  } catch (error) {
    return null;
  }
};

export default PieChartMuscle;
