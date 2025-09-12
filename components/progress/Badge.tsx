import React from 'react';
import { View, Text } from 'react-native';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import badgeStyles from './styles/badge';

interface BadgeProps {
  label: string;
  value: string | number;
  color?: string;
}

const Badge: React.FC<BadgeProps> = ({ label, value, color }) => {
  const themed = useThemedStyles(badgeStyles) as ReturnType<typeof badgeStyles>;
  return (
    <View style={[themed.badge, color ? { backgroundColor: color } : null]}>
      <Text style={themed.badgeLabel}>{label}</Text>
      <Text style={themed.badgeValue}>{value}</Text>
    </View>
  );
};

export default Badge;
