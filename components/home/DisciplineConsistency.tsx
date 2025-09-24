import React from 'react';
import { Text, View } from '@/components/Themed';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeDisciplineConsistencyStyles } from './styles/disciplineConsistency';

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
  const { styles, colors } = useThemedStyles(makeDisciplineConsistencyStyles);
  
  // Debug: Log de datos recibidos por el componente
  // eslint-disable-next-line no-console
  console.log(
    '🎨 DEBUG - DisciplineConsistency data:',
    JSON.stringify(data, null, 2)
  );
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return colors.tint;
      case 'failed':
        return colors.failBg;
      case 'rest':
        return colors.rest;
      default:
        return colors.border;
    }
  };

  const getStatusBorderColor = (status: string) => {
    switch (status) {
      case 'completed':
        return colors.tint;
      case 'failed':
        return colors.tint;
      case 'rest':
        return colors.rest;
      default:
        return colors.border;
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
          <View
            style={[styles.legendCircle, { backgroundColor: colors.rest }]}
          />
          <Text style={styles.legendText}>Descanso</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendCircle, { backgroundColor: colors.tint }]}
          />
          <Text style={styles.legendText}>Cumplido</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendCircle,
              {
                backgroundColor: colors.failBg,
                borderColor: colors.tint,
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

export default DisciplineConsistency;
