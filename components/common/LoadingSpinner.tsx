import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

import { useColorScheme } from '../useColorScheme';
import Colors from '@/constants/Colors';
import { UI_CONSTANTS } from '@/constants/AppConstants';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  overlay?: boolean;
  style?: any;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color,
  text,
  overlay = false,
  style,
}) => {
  const colorScheme = useColorScheme();
  const spinnerColor = color || Colors[colorScheme].tint;

  const containerStyles = [styles.container, overlay && styles.overlay, style];

  return (
    <View style={containerStyles}>
      <ActivityIndicator size={size} color={spinnerColor} />
      {text && (
        <Text style={[styles.text, { color: Colors[colorScheme].text }]}>
          {text}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: UI_CONSTANTS.SPACING.LG,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: UI_CONSTANTS.Z_INDEX.OVERLAY,
  },
  text: {
    marginTop: UI_CONSTANTS.SPACING.MD,
    fontSize: UI_CONSTANTS.FONT_SIZE.MD,
    textAlign: 'center',
  },
});

export default LoadingSpinner;
