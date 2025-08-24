import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { ThemeMode } from '@/hooks/useThemedStyles';

export const makePlanViewStyles = (theme: ThemeMode) => {
  const p = Colors[theme];
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: p.background },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: p.background,
    },
    loadingText: { color: p.text, marginTop: 16, fontSize: 16 },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: p.background,
      padding: 20,
    },
    errorText: {
      color: p.danger,
      textAlign: 'center',
      marginVertical: 16,
      fontSize: 16,
    },
    retryButton: {
      backgroundColor: p.tint,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
    },
    retryButtonText: { color: p.onTint, fontWeight: 'bold' },

    compactWrapper: { paddingBottom: 4 },
    noPlanBanner: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: p.card,
      marginHorizontal: 16,
      marginTop: 12,
      padding: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: p.border,
    },
    noPlanIcon: { marginRight: 12, marginTop: 2 },
    noPlanBannerTitle: {
      color: p.text,
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 2,
    },
    noPlanBannerText: { color: p.textMuted, fontSize: 12, lineHeight: 16 },

    planCard: {
      backgroundColor: p.card,
      borderRadius: 10,
      padding: 14,
      borderWidth: 1,
      borderColor: p.border,
    },
    expiredPlanCard: { borderColor: p.danger },
    expiringSoonPlanCard: { borderColor: p.warning },
    collapsibleCard: { marginHorizontal: 16, marginTop: 10 },
    summaryRow: { flexDirection: 'row', alignItems: 'center' },
    detailSection: { marginTop: 10 },

    planHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    planInfo: { flex: 1 },
    planName: {
      fontSize: 18,
      fontWeight: '600',
      color: p.text,
      marginBottom: 2,
    },
    planLabel: { color: p.tint },
    planPrice: { fontSize: 14, fontWeight: '600', color: p.tint },

    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    activeBadge: { backgroundColor: p.success },
    expiringSoonBadge: { backgroundColor: p.warning },
    expiredBadge: { backgroundColor: p.danger },
    statusText: { fontSize: 12, fontWeight: 'bold' },
    activeText: { color: p.onTint },
    expiringSoonText: { color: p.onTint },
    expiredText: { color: p.onTint },

    planDetails: { marginBottom: 12 },
    detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    detailLabel: {
      color: p.textMuted,
      fontSize: 12,
      marginLeft: 8,
      marginRight: 6,
      minWidth: 80,
    },
    detailValue: { color: p.text, fontSize: 12, fontWeight: '500', flex: 1 },

    renewalContainer: {
      backgroundColor: p.card,
      borderRadius: 6,
      padding: 10,
      borderWidth: 1,
      borderColor: p.warning,
    },
    renewalText: {
      color: p.warning,
      fontSize: 12,
      textAlign: 'center',
      marginBottom: 8,
    },
    renewButton: {
      backgroundColor: p.warning,
      paddingVertical: 8,
      borderRadius: 6,
      alignItems: 'center',
    },
    renewButtonCompact: {
      backgroundColor: p.warning,
      paddingVertical: 6,
      borderRadius: 4,
      alignSelf: 'flex-start',
      paddingHorizontal: 12,
      marginTop: 4,
    },
    renewButtonText: { color: p.onTint, fontSize: 13, fontWeight: '600' },
  });
};
