import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';

interface OccupancyChartProps {
  data?: number[];
}

export default function OccupancyChart({
  data = [30, 60, 80, 90, 70, 50, 40, 35],
}: OccupancyChartProps) {
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
                      ? '#F44336'
                      : height > 40
                        ? '#FF9800'
                        : '#4CAF50',
                },
              ]}
            />
            <Text style={styles.chartLabel}>{`${6 + index * 2}:00`}</Text>
          </View>
        ))}
      </View>
      <View style={styles.chartLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
          <Text style={styles.legendText}>Bajo</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#FF9800' }]} />
          <Text style={styles.legendText}>Medio</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#F44336' }]} />
          <Text style={styles.legendText}>Alto</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chartCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 8,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 16,
  },
  chartBarContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 2,
  },
  chartBar: {
    width: '80%',
    borderRadius: 4,
    marginBottom: 8,
  },
  chartLabel: {
    fontSize: 10,
    color: '#B0B0B0',
    transform: [{ rotate: '-45deg' }],
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#B0B0B0',
  },
});
