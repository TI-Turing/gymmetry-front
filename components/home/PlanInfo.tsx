import React from 'react';
import { Text, View } from '@/components/Themed';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makePlanInfoStyles } from './styles/planInfo';

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
  const { styles } = useThemedStyles(makePlanInfoStyles);
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
export default PlanInfo;
