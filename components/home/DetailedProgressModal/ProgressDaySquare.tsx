import React from 'react';
import { View, Text } from 'react-native';
import { ProgressDaySquareProps } from './types';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import makeProgressDaySquareStyles from './styles/ProgressDaySquareStyles';

const ProgressDaySquare: React.FC<ProgressDaySquareProps> = ({ 
  dayNumber, 
  percentage, 
  status 
}) => {
  const styles = useThemedStyles(makeProgressDaySquareStyles);
  const getStatusStyle = () => {
    switch (status) {
      case 'success':
        return styles.success;
      case 'fail':
        return styles.fail;
      case 'rest':
        return styles.rest;
      default:
        return {};
    }
  };

  return (
    <View style={[styles.square, getStatusStyle()]}>
      <Text style={styles.dayNumber}>{dayNumber}</Text>
      <Text style={styles.percentage}>{percentage}%</Text>
    </View>
  );
};

export default ProgressDaySquare;
