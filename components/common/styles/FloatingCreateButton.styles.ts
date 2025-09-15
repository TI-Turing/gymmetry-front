import { StyleSheet } from 'react-native';
import { Colors } from '@/constants';
import { SPACING } from '@/constants/Theme';

export const createStyles = (colorScheme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      right: SPACING.lg,
      bottom: SPACING.xl + 60, // Espacio para tab bar
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor:
        colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      zIndex: 1000,
    },
  });