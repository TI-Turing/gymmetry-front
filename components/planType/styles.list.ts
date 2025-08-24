import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import type { ThemeMode } from '@/hooks/useThemedStyles';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';

export const makePlanTypeListStyles = (theme: ThemeMode) => {
  const isDark = theme === 'dark';
  const palette = Colors[theme];
  const colors = {
    background: palette.background,
    cardBg: isDark ? '#1E1E1E' : '#FFFFFF',
    text: palette.text,
    muted: isDark ? '#B0B0B0' : '#666666',
    tint: palette.tint,
    badgeFg: palette.background,
    divider: isDark ? '#66666622' : '#66666622',
    shadow: '#000',
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
      backgroundColor: colors.tint,
      color: colors.badgeFg,
    },
    description: {
      fontSize: FONT_SIZES.md,
      color: colors.muted,
      marginBottom: SPACING.sm,
      lineHeight: 20,
    },
    row: { flexDirection: 'row', gap: SPACING.sm, marginVertical: SPACING.xs },
    label: {
      fontSize: FONT_SIZES.sm,
      color: colors.muted,
      fontWeight: '500',
      minWidth: 80,
    },
    value: {
      fontSize: FONT_SIZES.sm,
      color: colors.text,
      flex: 1,
      fontWeight: '600',
    },
    featuresContainer: {
      marginTop: SPACING.sm,
      paddingTop: SPACING.sm,
      borderTopWidth: 1,
      borderTopColor: colors.divider,
    },
    featuresTitle: {
      fontSize: FONT_SIZES.sm,
      color: colors.muted,
      fontWeight: '600',
      marginBottom: SPACING.xs,
    },
    features: { fontSize: FONT_SIZES.sm, color: colors.text, lineHeight: 18 },
  });

  return { ...styles, colors };
};
