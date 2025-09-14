import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

type ButtonSize = 'small' | 'medium' | 'large';

const SIZE_CONFIG = {
  small: {
    iconSize: 16,
    padding: 6,
    fontSize: 12,
  },
  medium: {
    iconSize: 20,
    padding: 8,
    fontSize: 14,
  },
  large: {
    iconSize: 24,
    padding: 10,
    fontSize: 16,
  },
} as const;

export const reportButtonStyles = (
  colorScheme: 'light' | 'dark',
  size: ButtonSize
) => {
  const config = SIZE_CONFIG[size];

  return StyleSheet.create({
    container: {
      padding: config.padding,
      borderRadius: 6,
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: config.iconSize + config.padding * 2,
      minHeight: config.iconSize + config.padding * 2,
    },
    containerDisabled: {
      opacity: 0.5,
    },
    icon: {
      fontSize: config.iconSize,
    },
    text: {
      fontSize: config.fontSize,
      color: Colors[colorScheme].text,
      fontWeight: '500',
    },
    textDisabled: {
      color: Colors[colorScheme].textMuted,
    },
    compactContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    compactText: {
      fontSize: config.fontSize - 1,
      color: Colors[colorScheme].text,
      fontWeight: '400',
    },
  });
};
