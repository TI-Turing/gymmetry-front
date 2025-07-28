import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';

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
        return Colors.dark.tint; // Color principal
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
        return Colors.dark.tint; // Color principal
      case 'failed':
        return Colors.dark.tint; // Borde en color principal
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
          <View
            style={[styles.legendCircle, { backgroundColor: Colors.dark.tint }]}
          />
          <Text style={styles.legendText}>Cumplido</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendCircle,
              {
                backgroundColor: 'rgba(255, 99, 0, 0.1)',
                borderColor: Colors.dark.tint,
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
    backgroundColor: '#1E1E1E',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  percentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark.tint,
  },
  calendarContainer: {
    marginBottom: 16,
    backgroundColor: '#1E1E1E',
  },
  daysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    paddingLeft: 32,
    backgroundColor: '#1E1E1E',
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
    backgroundColor: '#1E1E1E',
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
    backgroundColor: '#1E1E1E',
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
    backgroundColor: '#1E1E1E',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
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
