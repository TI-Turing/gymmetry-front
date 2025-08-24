import Colors from '@/constants/Colors';
import { ThemeMode } from '@/hooks/useThemedStyles';

export const makeRoutineDayDetailStyles = (theme: ThemeMode) => {
  const palette = Colors[theme];
  const text = palette.text;
  const bg = palette.background;
  const border = `${text}20`;
  const cardBg = `${text}08`;
  return {
    container: { flex: 1, padding: 16 } as const,
    bodyOverlay: {
      marginBottom: 12,
      borderRadius: 12,
      overflow: 'hidden' as const,
      backgroundColor: 'transparent' as const,
      height: '70%' as const,
      padding: 8,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 12,
      color: text,
    } as const,
    error: { color: '#FF4444', marginVertical: 8 } as const,
    info: { color: palette.tint, marginTop: 8 } as const,
    card: {
      backgroundColor: cardBg,
      padding: 12,
      borderRadius: 8,
      marginVertical: 6,
    } as const,
    cardText: { fontSize: 12, color: text } as const,
    label: { marginBottom: 6, color: text } as const,
    textarea: {
      borderWidth: 1,
      borderColor: border,
      padding: 8,
      borderRadius: 6,
      minHeight: 120,
      textAlignVertical: 'top' as const,
      marginBottom: 8,
      color: text,
      backgroundColor: bg,
    } as const,
    row: { flexDirection: 'row', gap: 8, marginVertical: 8 } as const,
  };
};
