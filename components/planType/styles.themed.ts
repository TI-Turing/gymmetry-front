import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import type { ThemeMode } from '@/hooks/useThemedStyles';

export const makePlanTypeStyles = (theme: ThemeMode) => {
  const isDark = theme === 'dark';
  const palette = Colors[theme];
  const colors = {
    background: palette.background,
    cardBg: isDark ? '#1a1a1a' : '#F7F7F7',
    border: isDark ? '#333333' : '#DDDDDD',
    text: palette.text,
    muted: isDark ? '#CCCCCC' : '#666666',
    tint: palette.tint,
    danger: '#FF6B35',
    onTint: '#FFFFFF',
  } as const;

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    loadingText: { color: colors.text, marginTop: 16, fontSize: 16 },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
      padding: 20,
    },
    errorText: {
      color: colors.danger,
      textAlign: 'center',
      marginVertical: 16,
      fontSize: 16,
    },
    retryButton: {
      backgroundColor: colors.tint,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
    },
    retryButtonText: { color: colors.onTint, fontWeight: 'bold' },
    plansContainer: { padding: 20 },
    planCard: {
      backgroundColor: colors.cardBg,
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    planHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    planName: { fontSize: 24, fontWeight: 'bold', color: colors.text, flex: 1 },
    planPrice: { fontSize: 20, fontWeight: 'bold', color: colors.tint },
    planDescription: {
      fontSize: 14,
      color: colors.muted,
      marginBottom: 16,
      lineHeight: 20,
    },
    featuresContainer: { marginBottom: 20 },
    featuresTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
    },
    featureIcon: { marginRight: 8 },
    featureText: { fontSize: 14, color: colors.muted, flex: 1 },
    selectButton: {
      backgroundColor: colors.tint,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    selectButtonDisabled: { backgroundColor: isDark ? '#666666' : '#BBBBBB' },
    selectButtonText: {
      color: colors.onTint,
      fontSize: 16,
      fontWeight: 'bold',
    },
    paymentStatusBanner: {
      backgroundColor: colors.cardBg,
      borderColor: colors.tint,
      borderWidth: 1,
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
    },
    paymentStatusText: {
      color: colors.tint,
      fontSize: 14,
      textAlign: 'center',
    },
    emailInput: {
      backgroundColor: colors.cardBg,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      height: 40,
    },
  });

  return { ...styles, colors };
};
