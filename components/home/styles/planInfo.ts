import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import type { ThemeMode } from '@/hooks/useThemedStyles';

export const makePlanInfoStyles = (theme: ThemeMode) => {
  const p = Colors[theme];
  const colors = {
    text: p.text,
    textMuted: p.textMuted,
    card: p.card,
    border: p.border,
    tint: p.tint,
  } as const;

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginHorizontal: 16,
      marginVertical: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 3,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
    },
    infoContainer: { gap: 16, backgroundColor: colors.card },
    dateContainer: { flexDirection: 'row', justifyContent: 'space-between' },
    dateItem: { flex: 1, alignItems: 'center', backgroundColor: colors.card },
    dateLabel: { fontSize: 14, color: colors.textMuted, marginBottom: 4 },
    dateValue: { fontSize: 16, fontWeight: '600', color: colors.text },
    progressContainer: { alignItems: 'center', backgroundColor: colors.card },
    progressLabel: { fontSize: 14, color: colors.textMuted, marginBottom: 8 },
    progressBar: {
      width: '100%',
      height: 8,
      backgroundColor: p.neutral,
      borderRadius: 4,
      overflow: 'hidden',
      marginBottom: 4,
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.tint,
      borderRadius: 4,
    },
    progressText: { fontSize: 12, color: colors.textMuted },
    gymContainer: {
      alignItems: 'center',
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.card,
    },
    gymLabel: { fontSize: 14, color: colors.textMuted, marginBottom: 4 },
    gymValue: { fontSize: 16, fontWeight: '600', color: colors.text },
  });

  return { styles, colors };
};
