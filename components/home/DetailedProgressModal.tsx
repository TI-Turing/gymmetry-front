import React from 'react';
import { Modal, ScrollView, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeDetailedProgressModalStyles } from './styles/detailedProgressModal';

// Tipo para un día individual con información detallada
export interface DetailedDayData {
  dayOfMonth: number; // Día del mes (1-31)
  dayOfWeek: string; // L, M, X, J, V, S, D
  status: 'completed' | 'failed' | 'rest';
  percentage: number; // Porcentaje completado ese día (0-100)
  date: string; // Fecha ISO para referencia
}

interface DetailedProgressModalProps {
  visible: boolean;
  onClose: () => void;
  planStartDate: string; // Fecha inicio del plan
  planEndDate: string; // Fecha fin del plan
  data: DetailedDayData[]; // Datos de todos los días del período
  gymName: string;
}

const DetailedProgressModal: React.FC<DetailedProgressModalProps> = ({
  visible,
  onClose,
  planStartDate,
  planEndDate,
  data,
  gymName,
}) => {
  const { styles, colors } = useThemedStyles(makeDetailedProgressModalStyles);

  // Función para obtener color del día según estado
  const getDayColor = (status: string) => {
    switch (status) {
      case 'completed':
        return colors.completed;
      case 'failed':
        return colors.failed;
      case 'rest':
        return colors.rest;
      default:
        return colors.border;
    }
  };

  // Función para obtener color del texto según estado
  const getTextColor = (status: string) => {
    switch (status) {
      case 'completed':
        return colors.onCompleted;
      case 'failed':
        return colors.onFailed;
      case 'rest':
        return colors.onRest;
      default:
        return colors.text;
    }
  };

  // Calcular estadísticas
  const totalDays = data.length;
  const completedDays = data.filter((d) => d.status === 'completed').length;
  const failedDays = data.filter((d) => d.status === 'failed').length;
  const restDays = data.filter((d) => d.status === 'rest').length;
  const completionRate =
    totalDays > 0
      ? Math.round((completedDays / (totalDays - restDays)) * 100)
      : 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Progreso Detallado</Text>
            <Text style={styles.subtitle}>{gymName}</Text>
            <Text style={styles.period}>
              {planStartDate} - {planEndDate}
            </Text>
          </View>

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Estadísticas */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{completionRate}%</Text>
            <Text style={styles.statLabel}>Cumplimiento</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.completed }]}>
              {completedDays}
            </Text>
            <Text style={styles.statLabel}>Completados</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.failed }]}>
              {failedDays}
            </Text>
            <Text style={styles.statLabel}>Fallados</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.rest }]}>
              {restDays}
            </Text>
            <Text style={styles.statLabel}>Descanso</Text>
          </View>
        </View>

        {/* Grid de días */}
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.daysGrid}>
            {data.map((dayData, index) => (
              <View
                key={index}
                style={[
                  styles.dayCard,
                  { backgroundColor: getDayColor(dayData.status) },
                ]}
              >
                {/* Día del mes */}
                <Text
                  style={[
                    styles.dayNumber,
                    { color: getTextColor(dayData.status) },
                  ]}
                >
                  {dayData.dayOfMonth}
                </Text>

                {/* Día de la semana */}
                <Text
                  style={[
                    styles.dayOfWeek,
                    { color: getTextColor(dayData.status) },
                  ]}
                >
                  {dayData.dayOfWeek}
                </Text>

                {/* Porcentaje (solo si no es descanso) */}
                {dayData.status !== 'rest' && (
                  <Text
                    style={[
                      styles.percentage,
                      { color: getTextColor(dayData.status) },
                    ]}
                  >
                    {dayData.percentage}%
                  </Text>
                )}

                {/* Indicador de descanso */}
                {dayData.status === 'rest' && (
                  <Text
                    style={[
                      styles.restLabel,
                      { color: getTextColor(dayData.status) },
                    ]}
                  >
                    Descanso
                  </Text>
                )}
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Leyenda */}
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendColor,
                { backgroundColor: colors.completed },
              ]}
            />
            <Text style={styles.legendText}>Completado</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendColor, { backgroundColor: colors.failed }]}
            />
            <Text style={styles.legendText}>Fallado</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendColor, { backgroundColor: colors.rest }]}
            />
            <Text style={styles.legendText}>Descanso</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DetailedProgressModal;
