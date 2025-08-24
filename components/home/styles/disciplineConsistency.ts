import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import type { ThemeMode } from '@/hooks/useThemedStyles';

export const makeDisciplineConsistencyStyles = (theme: ThemeMode) => {
  const palette = Colors[theme];
  const colors = {
    text: palette.text,
    textMuted: palette.textMuted,
    card: palette.card,
    border: palette.border,
    tint: palette.tint,
    rest: palette.textMuted,
    failBg: 'rgba(255, 99, 0, 0.1)',
  } as const;

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginHorizontal: 16,
      // Añade espacio respecto al header
      marginTop: 12,
      marginBottom: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 3,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
      backgroundColor: colors.card,
    },
    title: { fontSize: 18, fontWeight: 'bold', color: colors.text },
    percentage: { fontSize: 24, fontWeight: 'bold', color: colors.tint },
    calendarContainer: { marginBottom: 16, backgroundColor: colors.card },
    daysHeader: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 12,
      paddingLeft: 32,
      backgroundColor: colors.card,
    },
    dayLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textMuted,
      width: 24,
      textAlign: 'center',
    },
    weekRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      backgroundColor: colors.card,
    },
    weekNumber: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textMuted,
      width: 24,
      textAlign: 'center',
    },
    daysRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      flex: 1,
      marginLeft: 8,
      backgroundColor: colors.card,
    },
    dayCircle: { width: 24, height: 24, borderRadius: 12, marginHorizontal: 2 },
    legend: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.card,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
    },
    legendCircle: { width: 12, height: 12, borderRadius: 6, marginRight: 6 },
    legendText: { fontSize: 12, color: colors.textMuted },
  });

  return { styles, colors };
};
