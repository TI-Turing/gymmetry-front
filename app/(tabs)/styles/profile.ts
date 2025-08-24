import Colors from '@/constants/Colors';
import { ThemeMode } from '@/hooks/useThemedStyles';

export const makeProfileStyles = (theme: ThemeMode) => {
  const palette = Colors[theme];
  const text = palette.text;
  const muted = palette.textMuted;
  const cardBg = palette.card;
  const chipBg = palette.neutral;
  const border = palette.border;
  const red = palette.danger;

  return {
    container: { flex: 1, backgroundColor: palette.background } as const,
    scrollView: { flex: 1 } as const,
    header: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      paddingHorizontal: 20,
      paddingTop: 60,
      paddingBottom: 20,
    } as const,
    title: { fontSize: 28, fontWeight: 'bold' as const, color: text } as const,
    profileHeader: {
      alignItems: 'center' as const,
      paddingHorizontal: 20,
      marginBottom: 24,
    } as const,
    avatarContainer: {
      position: 'relative' as const,
      marginBottom: 16,
    } as const,
    avatar: { width: 100, height: 100, borderRadius: 50 } as const,
    editAvatarButton: {
      position: 'absolute' as const,
      bottom: 0,
      right: 0,
      backgroundColor: palette.tint,
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      borderWidth: 2,
      borderColor: palette.background,
    } as const,
    userName: {
      fontSize: 24,
      fontWeight: 'bold' as const,
      color: text,
      marginBottom: 4,
    } as const,
    userEmail: { fontSize: 16, color: muted, marginBottom: 4 } as const,
    joinDate: { fontSize: 14, color: muted } as const,
    statsCard: {
      backgroundColor: cardBg,
      marginHorizontal: 20,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
    } as const,
    statsTitle: {
      fontSize: 18,
      fontWeight: 'bold' as const,
      color: text,
      marginBottom: 16,
    } as const,
    statsGrid: {
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
      justifyContent: 'space-between' as const,
    } as const,
    statItem: {
      width: '48%',
      alignItems: 'center' as const,
      marginBottom: 16,
    } as const,
    statValue: {
      fontSize: 24,
      fontWeight: 'bold' as const,
      color: palette.tint,
      marginBottom: 4,
    } as const,
    statLabel: {
      fontSize: 14,
      color: muted,
      textAlign: 'center' as const,
    } as const,
    achievementsCard: {
      backgroundColor: cardBg,
      marginHorizontal: 20,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
    } as const,
    achievementsTitle: {
      fontSize: 18,
      fontWeight: 'bold' as const,
      color: text,
      marginBottom: 16,
    } as const,
    achievementsGrid: {
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
      justifyContent: 'space-between' as const,
    } as const,
    achievementItem: {
      width: '48%',
      alignItems: 'center' as const,
      marginBottom: 16,
      padding: 16,
      backgroundColor: chipBg,
      borderRadius: 12,
    } as const,
    achievementTitle: {
      fontSize: 12,
      color: muted,
      textAlign: 'center' as const,
      marginTop: 8,
    } as const,
    menuCard: {
      backgroundColor: cardBg,
      marginHorizontal: 20,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
    } as const,
    menuTitle: {
      fontSize: 18,
      fontWeight: 'bold' as const,
      color: text,
      marginBottom: 16,
    } as const,
    menuItem: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: border,
    } as const,
    menuItemText: {
      flex: 1,
      fontSize: 16,
      color: text,
      marginLeft: 16,
    } as const,
    logoutButton: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      backgroundColor: cardBg,
      marginHorizontal: 20,
      borderRadius: 16,
      padding: 16,
      marginBottom: 24,
    } as const,
    logoutText: {
      fontSize: 16,
      fontWeight: 'bold' as const,
      color: red,
      marginLeft: 12,
    } as const,
    footer: { height: 100 } as const,
    colors: { text, muted, red, tint: palette.tint },
  };
};
