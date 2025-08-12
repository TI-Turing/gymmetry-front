import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';

interface TodayRoutineProps {
  routineName: string;
  hasAttended: boolean;
  onPress?: () => void;
  showTitle?: boolean; // Permite ocultar el título interno cuando el header global ya lo muestra
}

const TodayRoutine: React.FC<TodayRoutineProps> = ({
  routineName,
  hasAttended,
  onPress,
  showTitle = true,
}) => {
  const getStatusIcon = () => {
    return hasAttended ? 'check-circle' : 'clock-o';
  };

  const getStatusColor = () => {
    return hasAttended ? '#4CAF50' : '#FF9800';
  };

  const getStatusText = () => {
    return hasAttended ? 'Completado' : 'Pendiente';
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        hasAttended ? styles.completedContainer : styles.pendingContainer,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <FontAwesome
            name={getStatusIcon()}
            size={24}
            color={getStatusColor()}
          />
        </View>

        <View style={styles.textContainer}>
          {showTitle && <Text style={styles.title}>Rutina de Hoy</Text>}
          <Text style={styles.routineName}>{routineName}</Text>
          <Text style={[styles.status, { color: getStatusColor() }]}>
            {getStatusText()}
          </Text>
        </View>

        <View style={styles.arrowContainer}>
          <FontAwesome name='chevron-right' size={16} color='#B0B0B0' />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
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
  completedContainer: {
    backgroundColor: '#1E2E1E',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  pendingContainer: {
    backgroundColor: '#2E2E1E',
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    color: '#B0B0B0',
    marginBottom: 4,
  },
  routineName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
  },
  arrowContainer: {
    marginLeft: 12,
  },
});

export default TodayRoutine;
