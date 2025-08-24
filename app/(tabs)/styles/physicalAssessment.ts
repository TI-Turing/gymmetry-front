import Colors from '@/constants/Colors';
import { ThemeMode } from '@/hooks/useThemedStyles';

export const makePhysicalAssessmentStyles = (theme: ThemeMode) => {
  const palette = Colors[theme];
  const text = palette.text;
  const muted = palette.textMuted;
  const cardBg = palette.card;
  const border = palette.border;

  return {
    screen: { flex: 1, backgroundColor: palette.background } as const,
    scroll: { flex: 1, paddingHorizontal: 20 } as const,
    header: { paddingTop: 0, paddingBottom: 16 } as const,
    title: {
      fontSize: 24,
      fontWeight: 'bold' as const,
      color: text,
      marginBottom: 6,
    } as const,
    subtitle: { fontSize: 14, color: muted } as const,

    card: {
      backgroundColor: cardBg,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      borderColor: border,
      borderWidth: 1,
    } as const,
    emptyTitle: {
      fontWeight: '600' as const,
      fontSize: 16,
      color: text,
    } as const,
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold' as const,
      marginBottom: 12,
      color: text,
    } as const,
    sectionTitleSm: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: text,
    } as const,
    grid: { flexDirection: 'row' as const, flexWrap: 'wrap' as const } as const,
    item: { width: '50%', marginBottom: 10 } as const,
    label: { fontSize: 12, color: muted } as const,
    value: { fontSize: 16, fontWeight: '600' as const, color: text } as const,
    updatedAt: {
      fontSize: 12,
      marginTop: 8,
      marginBottom: 12,
      color: muted,
    } as const,

    formCard: {
      backgroundColor: cardBg,
      borderRadius: 16,
      padding: 16,
      marginTop: 8,
      borderColor: border,
      borderWidth: 1,
    } as const,
    inputLabel: { fontSize: 12, marginTop: 8, color: muted } as const,
    input: {
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 8,
      marginTop: 6,
      backgroundColor: palette.background,
      color: text,
    } as const,
    errorText: { fontSize: 12, marginTop: 4, color: palette.tint } as const,

    historyRow: {
      paddingVertical: 10,
      borderTopWidth: 1,
      borderColor: border,
    } as const,
    trendCard: {
      backgroundColor: cardBg,
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
      borderColor: border,
      borderWidth: 1,
    } as const,

    actionsRow: {
      flexDirection: 'row' as const,
      gap: 12,
      marginTop: 12,
    } as const,
    colors: { text, muted, tint: palette.tint },
  };
};
