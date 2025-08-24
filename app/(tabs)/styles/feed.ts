import Colors from '@/constants/Colors';
import { ThemeMode } from '@/hooks/useThemedStyles';

export const makeFeedStyles = (theme: ThemeMode) => {
  const palette = Colors[theme];
  const text = palette.text;
  const muted = palette.textMuted;
  const success = palette.success;
  const cardBg = palette.card;
  const footerText = palette.textMuted;

  return {
    container: { flex: 1, backgroundColor: palette.background } as const,
    header: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      paddingHorizontal: 20,
      paddingTop: 60,
      paddingBottom: 20,
    } as const,
    title: { fontSize: 28, fontWeight: 'bold' as const, color: text } as const,
    notificationButton: { padding: 8 } as const,
    activeUsersCard: {
      backgroundColor: cardBg,
      marginHorizontal: 20,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: palette.border,
    } as const,
    activeUsersTitle: {
      fontSize: 16,
      fontWeight: 'bold' as const,
      color: text,
      marginBottom: 12,
    } as const,
    activeUsersList: { flexDirection: 'row' as const, gap: 16 } as const,
    activeUser: { alignItems: 'center' as const } as const,
    activeUserImageContainer: { position: 'relative' as const } as const,
    activeUserImage: { width: 50, height: 50, borderRadius: 25 } as const,
    onlineIndicator: {
      position: 'absolute' as const,
      bottom: 2,
      right: 2,
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: success,
      borderWidth: 2,
      borderColor: palette.card,
    } as const,
    activeUserName: { fontSize: 12, color: muted, marginTop: 4 } as const,
    postsContainer: { paddingBottom: 20 } as const,
    footer: { height: 100 } as const,
    skeletonCard: {
      backgroundColor: cardBg,
      borderRadius: 16,
      padding: 16,
    } as const,
    colors: {
      text,
      muted,
      skeletonCardBg: cardBg,
      footerText,
      success,
    } as const,
  };
};
