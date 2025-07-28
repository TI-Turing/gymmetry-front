import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';

interface DisciplineConsistencyData {
  week: number;
  days: {
    day: string;
    status: 'completed' | 'failed' | 'rest';
  }[];
}

interface DisciplineConsistencyProps {
  data: DisciplineConsistencyData[];
  completionPercentage: number;
}

const DisciplineConsistency: React.FC<DisciplineConsistencyProps> = ({
  data,
  completionPercentage,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#ff6300'; // Color principal
      case 'failed':
        return 'rgba(255, 99, 0, 0.1)'; // Color principal con opacidad muy baja
      case 'rest':
        return '#9E9E9E'; // Gris
      default:
        return '#E0E0E0'; // Blanco/Sin datos
    }
  };

  const getStatusBorderColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#ff6300'; // Color principal
      case 'failed':
        return '#ff6300'; // Borde en color principal
      case 'rest':
        return '#9E9E9E'; // Gris
      default:
        return '#E0E0E0'; // Blanco/Sin datos
    }
  };

  const dayLabels = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Disciplina y Consistencia</Text>
        <Text style={styles.percentage}>{completionPercentage}%</Text>
      </View>

      <View style={styles.calendarContainer}>
        {/* Headers de días */}
        <View style={styles.daysHeader}>
          {dayLabels.map((day, index) => (
            <Text key={index} style={styles.dayLabel}>
              {day}
            </Text>
          ))}
        </View>

        {/* Grid de semanas */}
        {data.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.weekRow}>
            <Text style={styles.weekNumber}>{week.week}</Text>
            <View style={styles.daysRow}>
              {week.days.map((dayData, dayIndex) => (
                <View
                  key={dayIndex}
                  style={[
                    styles.dayCircle,
                    {
                      backgroundColor: getStatusColor(dayData.status),
                      borderColor: getStatusBorderColor(dayData.status),
                      borderWidth: dayData.status === 'failed' ? 2 : 0,
                    },
                  ]}
                />
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* Leyenda */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendCircle, { backgroundColor: '#9E9E9E' }]} />
          <Text style={styles.legendText}>Descanso</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendCircle, { backgroundColor: '#ff6300' }]} />
          <Text style={styles.legendText}>Cumplido</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendCircle,
              {
                backgroundColor: 'rgba(255, 99, 0, 0.1)',
                borderColor: '#ff6300',
                borderWidth: 2,
              },
            ]}
          />
          <Text style={styles.legendText}>Falla</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  percentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  calendarContainer: {
    marginBottom: 16,
  },
  daysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    paddingLeft: 32,
  },
  dayLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#B0B0B0',
    width: 24,
    textAlign: 'center',
  },
  weekRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  weekNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#B0B0B0',
    width: 24,
    textAlign: 'center',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 1,
    marginLeft: 8,
  },
  dayCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginHorizontal: 2,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendCircle: {
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

export default DisciplineConsistency;
