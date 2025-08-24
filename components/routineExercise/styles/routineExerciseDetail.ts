import Colors from '@/constants/Colors';
import { ThemeMode } from '@/hooks/useThemedStyles';

export const makeRoutineExerciseDetailStyles = (theme: ThemeMode) => {
  const palette = Colors[theme];
  const text = palette.text;
  const cardBg = `${text}08`;
  const border = `${text}20`;
  return {
    container: { flex: 1, padding: 16 } as const,
    title: {
      fontSize: 18,
      fontWeight: '600' as const,
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
    exerciseName: {
      fontSize: 16,
      fontWeight: '700' as const,
      marginBottom: 6,
      color: text,
    } as const,
    exerciseDesc: { fontSize: 14, opacity: 0.9, color: text } as const,
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
    } as const,
    row: { flexDirection: 'row' as const, gap: 8, marginVertical: 8 } as const,
    chartCard: {
      backgroundColor: cardBg,
      padding: 12,
      borderRadius: 8,
      marginTop: 8,
    } as const,
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      marginBottom: 8,
      color: text,
    } as const,
    muted: { opacity: 0.7, color: text } as const,
    barRow: { marginBottom: 10 } as const,
    barHeader: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      marginBottom: 4,
    } as const,
    barLabel: { fontSize: 14, color: text } as const,
    barValue: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: text,
    } as const,
    barTrack: {
      height: 10,
      backgroundColor: `${text}20`,
      borderRadius: 6,
      overflow: 'hidden' as const,
    } as const,
    barFill: {
      height: '100%',
      backgroundColor: palette.tint,
      borderRadius: 6,
    } as const,
    scaleRow: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      marginTop: 6,
    } as const,
    scaleTick: { fontSize: 12, opacity: 0.8, color: text } as const,
  };
};
