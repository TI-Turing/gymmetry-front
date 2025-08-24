import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';
import { ThemeMode } from '@/hooks/useThemedStyles';

export const makePlanStyles = (theme: ThemeMode) => {
  const p = Colors[theme];
  return StyleSheet.create({
    // Plan List styles
    container: { flex: 1, backgroundColor: p.background },
    card: {
      backgroundColor: p.card,
      padding: SPACING.lg,
      marginVertical: SPACING.sm,
      borderRadius: BORDER_RADIUS.xl,
      borderWidth: 1,
      borderColor: p.border,
      shadowColor: p.text,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
    popularCard: {
      borderColor: p.tint,
      borderWidth: 2,
      shadowColor: p.tint,
      shadowOpacity: 0.35,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SPACING.md,
    },
    title: {
      fontSize: FONT_SIZES.lg,
      fontWeight: '600',
      color: p.text,
      flex: 1,
      marginRight: SPACING.sm,
    },
    priceContainer: { alignItems: 'flex-end' },
    price: { fontSize: FONT_SIZES.lg, fontWeight: 'bold', color: p.tint },
    priceOld: {
      fontSize: FONT_SIZES.sm,
      color: p.textMuted,
      textDecorationLine: 'line-through',
    },
    pricePeriod: { fontSize: FONT_SIZES.sm, color: p.textMuted },
    popularBadge: {
      position: 'absolute',
      top: -8,
      right: SPACING.lg,
      backgroundColor: p.tint,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.xs,
      borderRadius: BORDER_RADIUS.md,
    },
    popularText: {
      fontSize: FONT_SIZES.xs,
      fontWeight: 'bold',
      color: p.onTint,
    },
    description: {
      fontSize: FONT_SIZES.md,
      color: p.textMuted,
      marginBottom: SPACING.md,
      lineHeight: 22,
    },
    featuresContainer: { marginBottom: SPACING.md },
    featuresTitle: {
      fontSize: FONT_SIZES.md,
      fontWeight: '600',
      color: p.text,
      marginBottom: SPACING.sm,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: SPACING.xs,
    },
    featureIcon: {
      color: p.tint,
      marginRight: SPACING.sm,
      fontSize: FONT_SIZES.md,
    },
    featureText: { fontSize: FONT_SIZES.sm, color: p.text, flex: 1 },
    limitsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: SPACING.md,
      borderTopWidth: 1,
      borderTopColor: p.border,
      backgroundColor: p.card,
      marginTop: SPACING.md,
    },
    limitItem: { alignItems: 'center' },
    limitLabel: {
      fontSize: FONT_SIZES.xs,
      color: p.textMuted,
      marginBottom: 4,
    },
    limitValue: { fontSize: FONT_SIZES.md, color: p.text, fontWeight: '600' },
    selectButton: {
      backgroundColor: p.tint,
      paddingVertical: SPACING.md,
      borderRadius: BORDER_RADIUS.md,
      alignItems: 'center',
      marginTop: SPACING.md,
    },
    selectButtonText: {
      fontSize: FONT_SIZES.md,
      fontWeight: '600',
      color: p.onTint,
    },
    selectedButton: { backgroundColor: p.tint },

    // Plan Form styles
    formContainer: {
      flex: 1,
      backgroundColor: p.background,
      padding: SPACING.lg,
    },
    formTitle: {
      fontSize: FONT_SIZES.xl,
      fontWeight: '600',
      color: p.text,
      marginBottom: SPACING.lg,
    },
    formLabel: {
      fontSize: FONT_SIZES.md,
      fontWeight: '500',
      color: p.text,
      marginBottom: SPACING.xs,
    },
    textarea: {
      borderWidth: 1,
      borderColor: p.border,
      backgroundColor: p.card,
      color: p.text,
      padding: SPACING.md,
      borderRadius: BORDER_RADIUS.md,
      minHeight: 120,
      textAlignVertical: 'top',
      marginBottom: SPACING.md,
      fontSize: FONT_SIZES.md,
    },
    formRow: {
      flexDirection: 'row',
      gap: SPACING.md,
      marginVertical: SPACING.md,
    },
    info: { color: p.tint, marginTop: SPACING.md, fontSize: FONT_SIZES.md },
    error: {
      color: p.danger,
      marginVertical: SPACING.sm,
      fontSize: FONT_SIZES.md,
    },

    // Plan Detail styles
    detailContainer: {
      flex: 1,
      backgroundColor: p.background,
      padding: SPACING.lg,
    },
    detailCard: {
      backgroundColor: p.card,
      padding: SPACING.lg,
      borderRadius: BORDER_RADIUS.xl,
      marginVertical: SPACING.sm,
      borderWidth: 1,
      borderColor: p.border,
    },
    detailText: {
      fontSize: FONT_SIZES.sm,
      color: p.text,
      fontFamily: 'monospace',
      lineHeight: 18,
    },

    // Plan comparison styles
    comparisonContainer: {
      backgroundColor: p.card,
      borderRadius: BORDER_RADIUS.xl,
      padding: SPACING.lg,
      marginBottom: SPACING.md,
      borderWidth: 1,
      borderColor: p.border,
    },
    comparisonTitle: {
      fontSize: FONT_SIZES.lg,
      fontWeight: '600',
      color: p.text,
      marginBottom: SPACING.md,
      textAlign: 'center',
    },
    comparisonTable: {
      borderWidth: 1,
      borderColor: p.border,
      borderRadius: BORDER_RADIUS.md,
    },
    comparisonRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: p.border,
    },
    comparisonCell: { flex: 1, padding: SPACING.md, alignItems: 'center' },
    comparisonHeader: { backgroundColor: p.neutral },
    comparisonHeaderText: {
      fontSize: FONT_SIZES.sm,
      fontWeight: '600',
      color: p.text,
    },
    comparisonCellText: { fontSize: FONT_SIZES.sm, color: p.text },
    row: { flexDirection: 'row', gap: SPACING.sm, marginVertical: SPACING.xs },
    label: {
      fontSize: FONT_SIZES.sm,
      color: p.textMuted,
      fontWeight: '500',
      minWidth: 80,
    },
    value: { fontSize: FONT_SIZES.sm, color: p.text, flex: 1 },

    // Status text helpers
    statusActiveText: {
      fontSize: FONT_SIZES.sm,
      fontWeight: '600',
      color: p.success,
    },
    statusInactiveText: {
      fontSize: FONT_SIZES.sm,
      fontWeight: '600',
      color: p.textMuted,
    },
  });
};

// Backward compatible export for modules importing { styles }
export const styles = StyleSheet.create({});
