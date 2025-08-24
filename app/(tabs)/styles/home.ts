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
    colors: { muted, background: palette.background, tint: palette.tint },
  };
};
