import React, { useState } from 'react';
import { Modal, View, TouchableWithoutFeedback, Text } from 'react-native';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import DetailedProgressView from './DetailedProgressView';
import FilterSelector from './FilterSelector';
import { DetailedProgressModalProps } from './types';
import makeDetailedProgressModalStyles from './styles/DetailedProgressModalStyles';

const DetailedProgressModal: React.FC<DetailedProgressModalProps> = ({ 
  visible, 
  onClose, 
  progressData,
  hasActivePlan,
}) => {
  const styles = useThemedStyles(makeDetailedProgressModalStyles);
  const [filterMode, setFilterMode] = useState<'month' | 'plan'>('month');

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      supportedOrientations={["landscape"]}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <View style={styles.container}>
        <FilterSelector
          selectedFilter={filterMode}
          onFilterChange={setFilterMode}
          hasActivePlan={hasActivePlan}
        />
        <DetailedProgressView progressData={progressData} />
      </View>
    </Modal>
  );
};

export default DetailedProgressModal;
