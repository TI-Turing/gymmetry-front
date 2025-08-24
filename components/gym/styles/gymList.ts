import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';

export const makeGymListStyles = (mode: 'light' | 'dark') => {
  const c = Colors[mode];
  const colors = {
    cardBg: mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
    text: c.text,
    muted: c.tabIconDefault,
    accent: c.tabIconSelected,
    borderSoft: c.tabIconDefault + '20',
    shadow: '#000000',
  } as const;

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.cardBg,
      padding: SPACING.md,
      marginVertical: SPACING.xs,
      borderRadius: BORDER_RADIUS.md,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SPACING.sm,
    },
    title: {
      fontSize: FONT_SIZES.lg,
      fontWeight: '600',
      color: colors.text,
      flex: 1,
      marginRight: SPACING.sm,
    },
    statusText: {
      fontSize: FONT_SIZES.sm,
      fontWeight: '600',
      paddingHorizontal: SPACING.sm,
      paddingVertical: SPACING.xs,
      borderRadius: BORDER_RADIUS.sm,
      backgroundColor: colors.accent,
      color: colors.cardBg,
    },
    description: {
      fontSize: FONT_SIZES.md,
      color: colors.muted,
      marginBottom: SPACING.sm,
      lineHeight: 20,
    },
    addressSection: {
      marginBottom: SPACING.sm,
      paddingBottom: SPACING.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderSoft,
    },
    address: {
      fontSize: FONT_SIZES.sm,
      color: colors.text,
      fontWeight: '500',
      marginBottom: 2,
    },
    city: { fontSize: FONT_SIZES.sm, color: colors.muted },
    row: { flexDirection: 'row', gap: SPACING.sm, marginVertical: SPACING.xs },
    label: {
      fontSize: FONT_SIZES.sm,
      color: colors.muted,
      fontWeight: '500',
      minWidth: 100,
    },
    value: { fontSize: FONT_SIZES.sm, color: colors.text, flex: 1 },
    ratingSection: {
      marginTop: SPACING.sm,
      paddingTop: SPACING.sm,
      borderTopWidth: 1,
      borderTopColor: colors.borderSoft,
    },
    rating: {
      fontSize: FONT_SIZES.sm,
      color: colors.accent,
      fontWeight: '600',
      textAlign: 'center',
    },
  });

  return { styles, colors };
};
