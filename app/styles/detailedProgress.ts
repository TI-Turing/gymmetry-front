import { StyleSheet } from 'react-native';
import type { ThemeMode } from '@/hooks/useThemedStyles';
import Colors from '@/constants/Colors';

export const makeDetailedProgressScreenStyles = (theme: ThemeMode) => {
  const palette = Colors[theme];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.background,
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: palette.background,
    },
    loadingText: {
      fontSize: 16,
      color: palette.textMuted,
      marginTop: 16,
    },
    errorText: {
      fontSize: 18,
      color: palette.danger,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 8,
    },
    errorSubtext: {
      fontSize: 14,
      color: palette.textMuted,
      textAlign: 'center',
      paddingHorizontal: 32,
    },
  });

  const colors = {
    background: palette.background,
    tint: palette.tint,
  };

  return { styles, colors };
};
