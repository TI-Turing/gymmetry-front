import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import makeFilterSelectorStyles from './styles/FilterSelectorStyles';

interface FilterSelectorProps {
  selectedFilter: 'month' | 'plan';
  onFilterChange: (filter: 'month' | 'plan') => void;
  hasActivePlan: boolean;
}

const FilterSelector: React.FC<FilterSelectorProps> = ({
  selectedFilter,
  onFilterChange,
  hasActivePlan,
}) => {
  const styles = useThemedStyles(makeFilterSelectorStyles);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mostrar progreso por:</Text>
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === 'month' && styles.activeButton,
          ]}
          onPress={() => onFilterChange('month')}
        >
          <Text
            style={[
              styles.buttonText,
              selectedFilter === 'month' && styles.activeButtonText,
            ]}
          >
            Mes Actual
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === 'plan' && styles.activeButton,
            !hasActivePlan && styles.disabledButton,
          ]}
          onPress={() => hasActivePlan && onFilterChange('plan')}
          disabled={!hasActivePlan}
        >
          <Text
            style={[
              styles.buttonText,
              selectedFilter === 'plan' && styles.activeButtonText,
              !hasActivePlan && styles.disabledButtonText,
            ]}
          >
            Plan {!hasActivePlan && '(No disponible)'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FilterSelector;