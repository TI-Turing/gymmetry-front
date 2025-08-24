import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { ThemeMode } from '@/hooks/useThemedStyles';

export const makePaymentModalStyles = (theme: ThemeMode) => {
  const palette = Colors[theme];
  const sheetBg = palette.card;
  const border = palette.border;
  const cardBg = theme === 'dark' ? '#171717' : '#F9FAFB';
  const disabledBg = theme === 'dark' ? '#0f0f0f' : '#F3F4F6';
  const iconBg = palette.neutral;
  const subtitle = palette.textMuted;
  const badgeBg = palette.neutral;
  const badgeText = theme === 'dark' ? '#bbbbbb' : '#4B5563';

  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: palette.overlay,
      justifyContent: 'flex-end',
    },
    sheet: {
      height: '70%',
      backgroundColor: sheetBg,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      overflow: 'hidden',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: border,
    },
    title: { color: palette.text, fontSize: 16, fontWeight: '600' },
    close: { color: palette.tint, fontWeight: '600' },
    body: { flex: 1, padding: 16, gap: 12 },

    methodCard: {
      backgroundColor: cardBg,
      borderWidth: 1,
      borderColor: border,
      borderRadius: 12,
      padding: 12,
    },
    methodCardRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    },
    methodCardPrimary: { borderColor: palette.tint },
    methodLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1,
    },
    methodIconWrap: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: iconBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    brandMonogram: { color: palette.text, fontWeight: '900', fontSize: 12 },
    methodTexts: { flex: 1, flexShrink: 1, minWidth: 0 },
    methodTitle: { color: palette.text, fontSize: 15, fontWeight: '600' },
    methodTitleDisabled: { color: subtitle, fontSize: 15, fontWeight: '600' },
    methodSubtitle: {
      color: subtitle,
      fontSize: 12,
      marginTop: 2,
      flexWrap: 'wrap',
      lineHeight: 16,
    },

    primaryButtonText: { color: palette.onTint, fontWeight: '700' },
    primaryPill: {
      backgroundColor: palette.tint,
      borderRadius: 999,
      paddingVertical: 8,
      paddingHorizontal: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },

    methodCardDisabled: {
      backgroundColor: disabledBg,
      borderWidth: 1,
      borderColor: border,
      borderRadius: 12,
      padding: 12,
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    },
    badge: {
      backgroundColor: badgeBg,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 999,
      alignSelf: 'flex-start',
    },
    badgeText: { color: badgeText, fontSize: 12 },
    footerNote: {
      color: subtitle,
      fontSize: 12,
      textAlign: 'center',
      marginTop: 8,
    },
  });
};
