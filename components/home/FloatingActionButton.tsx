import React from 'react';
import { TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeFloatingActionButtonStyles } from './styles/floatingActionButton';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: React.ComponentProps<typeof FontAwesome>['name'];
  size?: number;
  backgroundColor?: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  icon = 'plus',
  size = 56,
  backgroundColor,
}) => {
  const { styles, colors } = useThemedStyles(makeFloatingActionButtonStyles);
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: backgroundColor || colors.tint,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <FontAwesome name={icon} size={size * 0.4} color={colors.onTint} />
    </TouchableOpacity>
  );
};

export default FloatingActionButton;
