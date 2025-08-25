import Colors from '@/constants/Colors';
import { ThemeMode } from '@/hooks/useThemedStyles';

export const makeCommunityRulesModalStyles = (theme: ThemeMode) => {
  const palette = Colors[theme];
  const text = palette.text;
  const border = theme === 'dark' ? '#333' : '#E5E7EB';
  const overlay = palette.overlay;
  const cardBg = palette.card;
  return {
    backdrop: {
      position: 'absolute' as const,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: overlay,
      justifyContent: 'flex-end' as const,
    },
    card: {
      backgroundColor: cardBg,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      maxHeight: '85%' as const,
      paddingBottom: 8,
    },
    header: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: border,
    },
    title: { color: text, fontSize: 18, fontWeight: '700' as const },
    close: { color: text },
    body: { paddingHorizontal: 16, paddingVertical: 8 },
    ruleRow: { flexDirection: 'row' as const, gap: 8, marginBottom: 12 },
    ruleIndex: { color: text, fontWeight: '600' as const },
    ruleText: { color: text, flex: 1 },
    footer: {
      borderTopWidth: 1,
      borderTopColor: border,
      padding: 16,
    },
    button: {
      backgroundColor: palette.tint,
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: 'center' as const,
    },
    buttonText: { color: palette.onTint, fontWeight: '600' as const },
  };
};
