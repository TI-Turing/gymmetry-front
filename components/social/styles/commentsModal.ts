import Colors from '@/constants/Colors';
import { ThemeMode } from '@/hooks/useThemedStyles';

export const makeCommentsModalStyles = (theme: ThemeMode) => {
  const palette = Colors[theme];
  const text = palette.text;
  const muted = theme === 'dark' ? '#B0B0B0' : '#6B7280';
  const overlay = theme === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.3)';
  const border = theme === 'dark' ? '#333' : '#DDD';
  const cardBg = theme === 'dark' ? '#1E1E1E' : '#FFFFFF';
  const cardBg2 = theme === 'dark' ? '#1A1A1A' : '#F7F7F7';
  const inputBg = theme === 'dark' ? '#2A2A2A' : '#F2F2F2';
  const danger = '#FF6B35';

  return {
    backdrop: {
      position: 'absolute' as const,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: overlay,
      justifyContent: 'flex-end' as const,
    } as const,
    card: {
      backgroundColor: cardBg,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      maxHeight: '80%' as const,
      padding: 16,
    } as const,
    header: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      marginBottom: 12,
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: border,
    } as const,
    title: {
      color: text,
      fontSize: 18,
      fontWeight: '600' as const,
    } as const,
    close: { color: text } as const,

    // Comments container and states
    commentsContainer: {
      flex: 1,
      minHeight: 200,
    } as const,
    loadingContainer: {
      flex: 1,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      paddingVertical: 40,
    } as const,
    errorContainer: {
      flex: 1,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      paddingVertical: 40,
      paddingHorizontal: 16,
    } as const,
    errorText: {
      color: danger,
      fontSize: 14,
      textAlign: 'center' as const,
    } as const,
    emptyContainer: {
      flex: 1,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      paddingVertical: 40,
      paddingHorizontal: 16,
    } as const,
    emptyTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: text,
      marginTop: 12,
      marginBottom: 8,
    } as const,
    emptyMessage: {
      fontSize: 14,
      color: muted,
      textAlign: 'center' as const,
    } as const,

    // Comment item styles
    commentRow: {
      marginBottom: 16,
      padding: 12,
      backgroundColor: cardBg2,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: border,
    } as const,
    commentHeader: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      marginBottom: 8,
    } as const,
    commentMeta: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      flex: 1,
    } as const,
    commentAuthor: {
      color: text,
      fontWeight: '600' as const,
      fontSize: 14,
      marginRight: 8,
    } as const,
    commentTime: {
      color: muted,
      fontSize: 12,
    } as const,
    commentText: {
      color: text,
      fontSize: 14,
      lineHeight: 20,
    } as const,
    actionsButton: {
      padding: 4,
    } as const,
    actionsMenu: {
      backgroundColor: cardBg,
      borderRadius: 6,
      marginTop: 8,
      borderWidth: 1,
      borderColor: border,
    } as const,
    actionItem: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      paddingHorizontal: 12,
      paddingVertical: 8,
    } as const,
    actionText: {
      fontSize: 14,
      color: text,
      marginLeft: 8,
    } as const,

    // Input styles
    inputRow: {
      flexDirection: 'row' as const,
      alignItems: 'flex-end' as const,
      gap: 8,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: border,
    } as const,
    input: {
      flex: 1,
      color: text,
      backgroundColor: inputBg,
      borderWidth: 1,
      borderColor: border,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 8,
      maxHeight: 80,
      textAlignVertical: 'top' as const,
    } as const,
    sendButton: {
      backgroundColor: palette.tint,
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    } as const,
    sendButtonDisabled: {
      backgroundColor: muted,
      opacity: 0.5,
    } as const,

    // Counter
    counterContainer: {
      paddingHorizontal: 16,
      paddingTop: 4,
    } as const,
    counterText: {
      fontSize: 12,
      color: muted,
      textAlign: 'right' as const,
    } as const,

    colors: {
      placeholder: theme === 'dark' ? '#999' : '#666',
    },
  };
};
