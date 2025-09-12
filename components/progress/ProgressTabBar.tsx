import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import styles from './styles';

interface ProgressTabBarProps {
  tabs: readonly string[];
  selected: string;
  onSelect: (tab: string) => void;
}

const ProgressTabBar: React.FC<ProgressTabBarProps> = ({
  tabs,
  selected,
  onSelect,
}) => {
  const themed = useThemedStyles(styles);
  return (
    <View style={themed.tabBar}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[themed.tab, selected === tab && themed.tabSelected]}
          onPress={() => onSelect(tab)}
          accessibilityRole="tab"
          accessibilityState={{ selected: selected === tab }}
        >
          <Text
            style={[themed.tabText, selected === tab && themed.tabTextSelected]}
          >
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
export default ProgressTabBar;
