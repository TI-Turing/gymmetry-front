import { StyleSheet } from 'react-native';
import Colors from '../../../../constants/Colors';

export default (theme: 'light' | 'dark') =>
  StyleSheet.create({
    square: {
      width: 56,
      height: 72,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 4,
      backgroundColor: theme === 'dark' ? Colors.dark.card : Colors.light.card,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 2,
    },
    success: {
      borderColor: theme === 'dark' ? Colors.dark.success : Colors.light.success,
      borderWidth: 2,
    },
    fail: {
      borderColor: theme === 'dark' ? Colors.dark.danger : Colors.light.danger,
      borderWidth: 2,
    },
    rest: {
      borderColor: theme === 'dark' ? Colors.dark.neutral : Colors.light.neutral,
      borderWidth: 2,
    },
    dayNumber: {
      fontSize: 18,
      fontWeight: 'bold' as const,
      color: theme === 'dark' ? Colors.dark.text : Colors.light.text,
      marginBottom: 4,
    },
    percentage: {
      fontSize: 14,
      color: theme === 'dark' ? Colors.dark.textMuted : Colors.light.textMuted,
    },
  });
