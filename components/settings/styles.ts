import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { ThemeMode } from '@/hooks/useThemedStyles';

export const makeSettingsStyles = (theme: ThemeMode) => {
  const palette = Colors[theme];
  const cardBg = palette.card;
  const cardBorder = palette.border;
  const subtle = palette.textMuted;
  const chipSelectedBg = palette.neutral;
  const chipBorder = palette.border;

  return StyleSheet.create({
    scroll: { flex: 1 },
    scrollContent: { padding: 16, paddingBottom: 32 },
    card: {
      backgroundColor: cardBg,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: cardBorder,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      marginBottom: 12,
      color: palette.text,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 8,
    },
    rowLeft: { flex: 1, paddingRight: 12 },
    rowTitle: { fontSize: 15, fontWeight: '600', color: palette.text },
    rowSub: { opacity: 0.8, marginTop: 2, fontSize: 12, color: subtle },
    chipRow: { flexDirection: 'row', gap: 8 },
    chip: {
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
      minWidth: 70,
      alignItems: 'center',
    },
    chipText: { color: palette.text, fontWeight: '600' },
    chipSelected: {
      borderColor: palette.tint,
      backgroundColor: chipSelectedBg,
    },
    chipUnselected: { borderColor: chipBorder, backgroundColor: 'transparent' },
    testRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
    testButtonBlue: {
      backgroundColor: palette.tint,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
    },
    testButtonGreen: {
      backgroundColor: palette.success as string,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
    },
    testButtonText: { color: palette.onTint, fontWeight: '600' },
    footerText: { opacity: 0.7, fontSize: 12, color: subtle },
    // Ad Configuration
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 12,
    },
    adRatioInfo: {
      marginTop: 8,
      fontSize: 13,
      fontWeight: '600',
      color: palette.tint,
    },
    sliderRow: {
      flexDirection: 'row',
      gap: 8,
      flexWrap: 'wrap',
      paddingVertical: 8,
    },
    saveButtonContainer: {
      marginTop: 12,
      alignItems: 'center',
    },
    saveButton: {
      backgroundColor: palette.tint,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      minWidth: 200,
      alignItems: 'center',
    },
    saveButtonDisabled: {
      opacity: 0.5,
    },
    saveButtonText: {
      color: palette.onTint,
      fontWeight: '600',
      fontSize: 15,
    },
    // Admin Section
    adminDivider: {
      backgroundColor: palette.card,
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      borderWidth: 2,
      borderColor: palette.warning || '#FF6B35',
      alignItems: 'center',
    },
    adminDividerText: {
      fontSize: 16,
      fontWeight: '700',
      color: palette.warning || '#FF6B35',
      letterSpacing: 1,
    },
  });
};
