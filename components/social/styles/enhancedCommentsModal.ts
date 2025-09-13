import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';
import type { ThemeMode } from '@/hooks/useThemedStyles';

export const createEnhancedCommentsModalStyles = (theme: ThemeMode) => {
  const isDark = theme === 'dark';
  const palette = Colors[theme];

  const colors = {
    background: palette.background,
    text: palette.text,
    textMuted: palette.textMuted || (isDark ? '#B0B0B0' : '#6B7280'),
    cardBg: isDark ? '#1F1F1F' : '#FFFFFF',
    cardBg2: isDark ? '#1A1A1A' : '#F7F7F7',
    border: isDark ? '#333333' : '#DDDDDD',
    inputBg: isDark ? '#2A2A2A' : '#F2F2F2',
    tint: palette.tint,
    danger: '#FF6B35',
    success: '#00C851',
    overlay: 'rgba(0,0,0,0.6)',
    onTint: '#FFFFFF',
    skeleton: isDark ? '#333333' : '#E6E6E6',
    shadow: '#000',
  } as const;

  return StyleSheet.create({
    // Modal backdrop
    backdrop: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: 'flex-end',
    },

    // Main container
    container: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: SPACING.md,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.25,
      shadowRadius: 10,
      elevation: 10,
    },

    // Header
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: FONT_SIZES.xl,
      fontWeight: '600',
      color: colors.text,
    },
    closeButton: {
      padding: SPACING.sm,
    },

    // Comments container
    commentsContainer: {
      flex: 1,
      maxHeight: 400,
    },

    // Loading states
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: SPACING.xl,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: SPACING.xl,
      paddingHorizontal: SPACING.lg,
    },
    errorText: {
      color: colors.danger,
      fontSize: FONT_SIZES.md,
      textAlign: 'center',
      marginBottom: SPACING.md,
    },
    retryButton: {
      backgroundColor: colors.tint,
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.sm,
      borderRadius: BORDER_RADIUS.md,
    },
    retryButtonText: {
      color: colors.onTint,
      fontSize: FONT_SIZES.md,
      fontWeight: '600',
    },
    loadingMore: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: SPACING.md,
    },
    loadingMoreText: {
      color: colors.textMuted,
      fontSize: FONT_SIZES.sm,
      marginLeft: SPACING.sm,
    },

    // Empty state
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: SPACING.xl,
      paddingHorizontal: SPACING.lg,
    },
    emptyTitle: {
      fontSize: FONT_SIZES.lg,
      fontWeight: '600',
      color: colors.text,
      marginTop: SPACING.md,
      marginBottom: SPACING.sm,
    },
    emptyMessage: {
      fontSize: FONT_SIZES.md,
      color: colors.textMuted,
      textAlign: 'center',
    },

    // Comment items
    commentItem: {
      backgroundColor: colors.cardBg,
      marginHorizontal: SPACING.md,
      marginVertical: SPACING.xs,
      padding: SPACING.md,
      borderRadius: BORDER_RADIUS.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    commentHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: SPACING.sm,
    },
    commentMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    commentAuthor: {
      fontSize: FONT_SIZES.sm,
      fontWeight: '600',
      color: colors.text,
      marginRight: SPACING.sm,
    },
    commentTime: {
      fontSize: FONT_SIZES.xs,
      color: colors.textMuted,
      marginRight: SPACING.sm,
    },
    editedLabel: {
      fontSize: FONT_SIZES.xs,
      color: colors.textMuted,
      fontStyle: 'italic',
    },
    actionsButton: {
      padding: SPACING.xs,
    },
    commentContent: {
      fontSize: FONT_SIZES.md,
      color: colors.text,
      lineHeight: 20,
      marginBottom: SPACING.sm,
    },

    // Actions menu
    actionsMenu: {
      backgroundColor: colors.cardBg2,
      borderRadius: BORDER_RADIUS.sm,
      marginTop: SPACING.sm,
      borderWidth: 1,
      borderColor: colors.border,
    },
    actionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
    },
    actionText: {
      fontSize: FONT_SIZES.sm,
      color: colors.text,
      marginLeft: SPACING.sm,
    },

    // Edit container
    editContainer: {
      marginTop: SPACING.sm,
    },
    editInput: {
      backgroundColor: colors.inputBg,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: BORDER_RADIUS.sm,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      fontSize: FONT_SIZES.md,
      minHeight: 60,
      textAlignVertical: 'top',
    },
    editActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: SPACING.sm,
    },
    cancelButton: {
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      borderRadius: BORDER_RADIUS.sm,
      marginRight: SPACING.sm,
    },
    cancelButtonText: {
      color: colors.textMuted,
      fontSize: FONT_SIZES.sm,
      fontWeight: '600',
    },
    saveButton: {
      backgroundColor: colors.tint,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      borderRadius: BORDER_RADIUS.sm,
    },
    saveButtonText: {
      color: colors.onTint,
      fontSize: FONT_SIZES.sm,
      fontWeight: '600',
    },

    // Comment footer
    commentFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: SPACING.sm,
    },
    reactionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: SPACING.sm,
      paddingVertical: SPACING.xs,
      borderRadius: BORDER_RADIUS.sm,
      marginRight: SPACING.md,
    },
    reactionIcon: {
      fontSize: 14,
      marginRight: SPACING.xs,
    },
    reactionCount: {
      fontSize: FONT_SIZES.xs,
      color: colors.textMuted,
    },
    replyButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: SPACING.sm,
      paddingVertical: SPACING.xs,
    },
    replyButtonText: {
      fontSize: FONT_SIZES.xs,
      color: colors.textMuted,
      marginLeft: SPACING.xs,
    },

    // Reply container
    replyContainer: {
      marginTop: SPACING.sm,
      paddingLeft: SPACING.lg,
      borderLeftWidth: 2,
      borderLeftColor: colors.border,
    },
    replyInput: {
      backgroundColor: colors.inputBg,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: BORDER_RADIUS.sm,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      fontSize: FONT_SIZES.sm,
      minHeight: 40,
      textAlignVertical: 'top',
    },
    replyActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: SPACING.sm,
    },

    // Deleted comment
    deletedComment: {
      backgroundColor: colors.cardBg2,
      marginHorizontal: SPACING.md,
      marginVertical: SPACING.xs,
      padding: SPACING.md,
      borderRadius: BORDER_RADIUS.md,
      borderWidth: 1,
      borderColor: colors.border,
      opacity: 0.6,
    },
    deletedText: {
      fontSize: FONT_SIZES.sm,
      color: colors.textMuted,
      fontStyle: 'italic',
      textAlign: 'center',
    },

    // Input section
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingHorizontal: SPACING.lg,
      paddingTop: SPACING.md,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    textInput: {
      flex: 1,
      backgroundColor: colors.inputBg,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: BORDER_RADIUS.lg,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      fontSize: FONT_SIZES.md,
      maxHeight: 100,
      textAlignVertical: 'top',
      marginRight: SPACING.sm,
    },
    sendButton: {
      backgroundColor: colors.tint,
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sendButtonDisabled: {
      backgroundColor: colors.skeleton,
      opacity: 0.5,
    },

    // Character counter
    counterContainer: {
      paddingHorizontal: SPACING.lg,
      paddingTop: SPACING.xs,
    },
    counterText: {
      fontSize: FONT_SIZES.xs,
      color: colors.textMuted,
      textAlign: 'right',
    },
  });
};
