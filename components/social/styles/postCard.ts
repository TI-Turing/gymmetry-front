import Colors from '@/constants/Colors';
import { ThemeMode } from '@/hooks/useThemedStyles';

export const makePostCardStyles = (theme: ThemeMode) => {
  const palette = Colors[theme];
  const text = palette.text;
  const muted = '#B0B0B0';
  const cardBg = `${text}08`;
  const like = '#FF6B6B';
  return {
    card: {
      backgroundColor: cardBg,
      marginHorizontal: 20,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
    } as const,
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 12,
    } as const,
    avatar: { width: 40, height: 40, borderRadius: 20 } as const,
    userInfo: { flex: 1, marginLeft: 12 } as const,
    userName: {
      fontSize: 16,
      fontWeight: 'bold' as const,
      color: text,
    } as const,
    time: { fontSize: 12, color: muted, marginTop: 2 } as const,
    menu: { padding: 4 } as const,
    content: {
      fontSize: 14,
      color: text,
      lineHeight: 20,
      marginBottom: 12,
    } as const,
    image: {
      width: '100%',
      height: 200,
      borderRadius: 12,
      marginBottom: 12,
    } as const,
    actions: { flexDirection: 'row', alignItems: 'center', gap: 24 } as const,
    actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 8 } as const,
    actionText: { color: muted, fontSize: 14 } as const,
    colors: { muted, like, text } as const,
  };
};
