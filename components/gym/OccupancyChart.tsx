import React from 'react';
import { Text, View } from '@/components/Themed';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeOccupancyChartStyles } from './styles/occupancyChart';

interface OccupancyChartProps {
  data?: number[];
}

export default function OccupancyChart({
  data = [30, 60, 80, 90, 70, 50, 40, 35],
}: OccupancyChartProps) {
  const { styles, colors } = useThemedStyles(makeOccupancyChartStyles);
  return (
    <View style={styles.chartCard}>
      <Text style={styles.chartTitle}>Ocupación del Día</Text>
      <View style={styles.chartContainer}>
        {data.map((height, index) => (
          <View key={index} style={styles.chartBarContainer}>
            <View
              style={[
                styles.chartBar,
                {
                  height: `${height}%`,
                  backgroundColor:
                    height > 70
                      ? colors.high
                      : height > 40
                        ? colors.medium
                        : colors.low,
                },
              ]}
            />
            <Text style={styles.chartLabel}>{`${6 + index * 2}:00`}</Text>
          </View>
        ))}
      </View>
      <View style={styles.chartLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.low }]} />
          <Text style={styles.legendText}>Bajo</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendColor, { backgroundColor: colors.medium }]}
          />
          <Text style={styles.legendText}>Medio</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendColor, { backgroundColor: colors.high }]}
          />
          <Text style={styles.legendText}>Alto</Text>
        </View>
      </View>
    </View>
  );
}
