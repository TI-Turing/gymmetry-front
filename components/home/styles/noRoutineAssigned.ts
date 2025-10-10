import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import type { ThemeMode } from '@/hooks/useThemedStyles';

export const makeNoRoutineAssignedStyles = (theme: ThemeMode) => {
  const palette = Colors[theme];

  const colors = {
    text: palette.text,
    textMuted: palette.textMuted,
    card: palette.card,
    tint: palette.tint,
    onTint: palette.onTint || '#FFFFFF',
  } as const;

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 24,
      marginHorizontal: 16,
      marginVertical: 8,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 3,
    },
    iconContainer: {
      marginBottom: 16,
      backgroundColor: colors.card,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    description: {
      fontSize: 14,
      color: colors.textMuted,
      textAlign: 'center',
      marginBottom: 20,
      lineHeight: 20,
      paddingHorizontal: 8,
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.tint,
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 8,
      gap: 8,
      minWidth: 200,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2.84,
      elevation: 4,
    },
    buttonText: {
      color: colors.onTint,
      fontSize: 16,
      fontWeight: '600',
    },
  });

  return { styles, colors };
};
