import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import type { ThemeMode } from '@/hooks/useThemedStyles';

export const makeNoPlanActiveStyles = (theme: ThemeMode) => {
  const palette = Colors[theme];

  const colors = {
    text: palette.text,
    textMuted: palette.textMuted,
    card: palette.card,
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
      lineHeight: 20,
      paddingHorizontal: 8,
    },
  });

  return { styles, colors };
};
