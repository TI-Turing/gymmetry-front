import { StyleSheet } from 'react-native';
import { Colors } from '@/constants';
import { SPACING } from '@/constants/Theme';

export const createStyles = (colorScheme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      right: SPACING.xl + 10, // Más a la izquierda
      bottom: SPACING.xl + 80, // Más abajo
      zIndex: 1000,
    },
    button: {
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
    },
  });
