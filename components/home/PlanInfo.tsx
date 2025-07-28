import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';

interface PlanInfoProps {
  startDate: string;
  endDate: string;
  currentGym: string;
  progress: number; // 0-100
}

const PlanInfo: React.FC<PlanInfoProps> = ({
  startDate,
  endDate,
  currentGym,
  progress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Plan Actual</Text>
      <View style={styles.infoContainer}>
        <View style={styles.dateContainer}>
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>Inicio</Text>
            <Text style={styles.dateValue}>{startDate}</Text>
          </View>
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>Fin</Text>
            <Text style={styles.dateValue}>{endDate}</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <Text style={styles.progressLabel}>Progreso del Plan</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{progress}%</Text>
        </View>

        <View style={styles.gymContainer}>
          <Text style={styles.gymLabel}>Gimnasio Actual</Text>
          <Text style={styles.gymValue}>{currentGym}</Text>
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  infoContainer: {
    gap: 16,
    backgroundColor: '#1E1E1E',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
  },
  dateLabel: {
    fontSize: 14,
    color: '#B0B0B0',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  progressContainer: {
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
  },
  progressLabel: {
    fontSize: 14,
    color: '#B0B0B0',
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#333333',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.dark.tint,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#B0B0B0',
  },
  gymContainer: {
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#333333',
    backgroundColor: '#1E1E1E',
  },
  gymLabel: {
    fontSize: 14,
    color: '#B0B0B0',
    marginBottom: 4,
  },
  gymValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default PlanInfo;
