import { StyleSheet } from 'react-native';
import Colors from '../../../../constants/Colors';

export default (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme === 'dark' ? Colors.dark.border : Colors.light.border,
      backgroundColor: theme === 'dark' ? Colors.dark.background : Colors.light.background,
    },
    title: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: theme === 'dark' ? Colors.dark.text : Colors.light.text,
      marginBottom: 8,
      textAlign: 'center' as const,
    },
    buttonGroup: {
      flexDirection: 'row' as const,
      gap: 8,
      justifyContent: 'center',
    },
    filterButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme === 'dark' ? Colors.dark.border : Colors.light.border,
      backgroundColor: 'transparent',
      minWidth: 100,
    },
    activeButton: {
      backgroundColor: theme === 'dark' ? Colors.dark.tint : Colors.light.tint,
      borderColor: theme === 'dark' ? Colors.dark.tint : Colors.light.tint,
    },
    disabledButton: {
      opacity: 0.5,
      backgroundColor: theme === 'dark' ? Colors.dark.neutral : Colors.light.neutral,
    },
    buttonText: {
      fontSize: 14,
      fontWeight: '500' as const,
      color: theme === 'dark' ? Colors.dark.text : Colors.light.text,
      textAlign: 'center' as const,
    },
    activeButtonText: {
      color: theme === 'dark' ? Colors.dark.onTint : Colors.light.onTint,
    },
    disabledButtonText: {
      color: theme === 'dark' ? Colors.dark.textMuted : Colors.light.textMuted,
    },
  });