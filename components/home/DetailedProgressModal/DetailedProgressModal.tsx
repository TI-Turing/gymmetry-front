import React, { useState } from 'react';
import { Modal, View, TouchableWithoutFeedback } from 'react-native';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import DetailedProgressView from './DetailedProgressView';
import FilterSelector from './FilterSelector';
import { DetailedProgressModalProps } from './types';
import makeDetailedProgressModalStyles from './styles/DetailedProgressModalStyles';

const DetailedProgressModal: React.FC<DetailedProgressModalProps> = ({
  visible,
  onClose,
  planData,
  monthData,
  hasActivePlan,
}) => {
  const styles = useThemedStyles(makeDetailedProgressModalStyles);
  const [filterMode, setFilterMode] = useState<'month' | 'plan'>('month');

  // Seleccionar datos según el filtro
  const currentData =
    filterMode === 'plan' && hasActivePlan ? planData : monthData;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      supportedOrientations={['landscape']}
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
        <DetailedProgressView progressData={currentData} />
      </View>
    </Modal>
  );
};

export default DetailedProgressModal;
