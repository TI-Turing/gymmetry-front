import Colors from '@/constants/Colors';
import { ThemeMode } from '@/hooks/useThemedStyles';

export const makePlansStyles = (theme: ThemeMode) => {
  const palette = Colors[theme];
  const text = palette.text;
  const background = palette.background;
  const border = palette.border;
  const muted = palette.textMuted;

  return {
    container: { flex: 1, backgroundColor: background } as const,
    header: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      padding: 20,
      paddingTop: 60,
      borderBottomWidth: 1,
      borderBottomColor: border,
    } as const,
    title: { fontSize: 24, fontWeight: 'bold' as const, color: text } as const,
    closeButton: { padding: 10 } as const,
    loadingContainer: {
      flex: 1,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      padding: 20,
    } as const,
    loadingText: { color: muted, marginTop: 16, fontSize: 16 } as const,
    errorContainer: {
      flex: 1,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      padding: 20,
    } as const,
    errorText: {
      color: palette.danger,
      textAlign: 'center' as const,
      marginVertical: 16,
      fontSize: 16,
    } as const,
    retryButton: {
      backgroundColor: palette.tint,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
    } as const,
    retryButtonText: {
      color: palette.onTint,
      fontWeight: 'bold' as const,
    } as const,
    colors: {
      text,
      muted,
      tint: palette.tint,
      danger: palette.danger,
      onTint: palette.onTint,
    },
  };
};
