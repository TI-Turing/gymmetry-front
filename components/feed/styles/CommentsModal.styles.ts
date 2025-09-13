import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

export default function createStyles(theme: 'light' | 'dark') {
  const palette = Colors[theme];
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: palette.border,
      backgroundColor: palette.background,
    },
    closeButton: {
      padding: 8,
      borderRadius: 20,
    },
    closeButtonText: {
      fontSize: 24,
      color: palette.text,
      fontWeight: 'bold',
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: palette.text,
    },
    headerSpacer: {
      width: 40,
    },
    feedTitleContainer: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: palette.border,
      backgroundColor: palette.card,
    },
    feedTitle: {
      fontSize: 14,
      color: palette.textMuted,
      fontStyle: 'italic',
    },
    commentsList: {
      flex: 1,
      paddingHorizontal: 16,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 40,
    },
    loadingText: {
      marginTop: 12,
      fontSize: 14,
      color: palette.textMuted,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 40,
      paddingHorizontal: 20,
    },
    errorText: {
      fontSize: 14,
      color: palette.danger,
      textAlign: 'center',
      marginBottom: 16,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 40,
    },
    emptyText: {
      fontSize: 16,
      color: palette.textMuted,
      textAlign: 'center',
      marginBottom: 8,
    },
    emptySubtext: {
      fontSize: 14,
      color: palette.textMuted,
      textAlign: 'center',
    },
    commentItem: {
      backgroundColor: palette.card,
      borderRadius: 12,
      padding: 12,
      marginVertical: 6,
      borderWidth: 1,
      borderColor: palette.border,
    },
    commentHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    commentAuthor: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    avatarPlaceholder: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: palette.tint,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
    },
    avatarText: {
      color: 'white',
      fontSize: 14,
      fontWeight: '600',
    },
    commentMeta: {
      flex: 1,
    },
    authorName: {
      fontSize: 14,
      fontWeight: '600',
      color: palette.text,
    },
    commentDate: {
      fontSize: 12,
      color: palette.textMuted,
      marginTop: 2,
    },
    deleteButton: {
      padding: 4,
      borderRadius: 12,
      backgroundColor: palette.danger,
    },
    deleteButtonText: {
      color: palette.danger,
      fontSize: 16,
      fontWeight: 'bold',
    },
    commentContent: {
      fontSize: 14,
      color: palette.text,
      lineHeight: 20,
    },
    inputContainer: {
      borderTopWidth: 1,
      borderTopColor: palette.border,
      backgroundColor: palette.background,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    anonymousToggle: {
      marginBottom: 8,
    },
    anonymousButton: {
      alignSelf: 'flex-start',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: palette.border,
      backgroundColor: palette.background,
    },
    anonymousButtonActive: {
      backgroundColor: palette.tint,
      borderColor: palette.tint,
    },
    anonymousButtonText: {
      fontSize: 12,
      color: palette.textMuted,
    },
    anonymousButtonTextActive: {
      color: 'white',
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
    textInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: palette.border,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 10,
      fontSize: 14,
      color: palette.text,
      backgroundColor: palette.card,
      maxHeight: 100,
      marginRight: 8,
    },
    placeholderColor: {
      color: palette.textMuted,
    },
    sendButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: palette.tint,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sendButtonDisabled: {
      backgroundColor: palette.neutral,
    },
    sendButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    sendButtonTextDisabled: {
      color: palette.textMuted,
    },
    characterCount: {
      fontSize: 12,
      color: palette.textMuted,
      textAlign: 'right',
      marginTop: 4,
    },
  });
}
