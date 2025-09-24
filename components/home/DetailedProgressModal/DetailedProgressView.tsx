import React from 'react';
import { ScrollView } from 'react-native';
import { DetailedProgressViewProps } from './types';
import ProgressDaySquare from './ProgressDaySquare';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import makeDetailedProgressViewStyles from './styles/DetailedProgressViewStyles';

const DetailedProgressView: React.FC<DetailedProgressViewProps> = ({ 
  progressData 
}) => {
  const styles = useThemedStyles(makeDetailedProgressViewStyles);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scrollContainer}
      contentContainerStyle={styles.row}
    >
      {progressData.map((day) => (
        <ProgressDaySquare key={day.dayNumber} {...day} />
      ))}
    </ScrollView>
  );
};

export default DetailedProgressView;
