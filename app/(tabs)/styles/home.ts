import Colors from '@/constants/Colors';
import { ThemeMode } from '@/hooks/useThemedStyles';

export const makeHomeStyles = (theme: ThemeMode) => {
  const palette = Colors[theme];
  const muted = palette.textMuted;
  return {
    container: { flex: 1, backgroundColor: palette.background } as const,
    scrollView: { flex: 1 } as const,
    scrollContent: { paddingBottom: 20 } as const,
    debugSection: { paddingHorizontal: 16, marginTop: 16 } as const,
    debugLabel: { color: muted, marginBottom: 8 } as const,
    spacer: { height: 80 } as const,

    // Estados de loading y error
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
    } as const,
    loadingText: {
      color: palette.text,
      fontSize: 16,
      marginTop: 12,
      textAlign: 'center',
    } as const,
    errorText: {
      color: palette.danger,
      fontSize: 18,
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: 8,
    } as const,
    errorSubtext: {
      color: muted,
      fontSize: 14,
      textAlign: 'center',
      marginBottom: 24,
    } as const,
    retryButton: {
      marginTop: 8,
    } as const,

    // Estados vacíos
    emptySection: {
      backgroundColor: palette.card,
      marginHorizontal: 16,
      marginVertical: 8,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
    } as const,
    emptyText: {
      color: palette.text,
      fontSize: 16,
      fontWeight: '500',
      textAlign: 'center',
      marginBottom: 4,
    } as const,
    emptySubtext: {
      color: muted,
      fontSize: 14,
      textAlign: 'center',
    } as const,

    colors: { muted, background: palette.background, tint: palette.tint },
  };
};
