import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';

export const createUnifiedPostCardStyles = (theme: 'light' | 'dark') => {
  const isDark = theme === 'dark';
  const palette = Colors[theme];

  return StyleSheet.create({
    // Variantes de card
    card: {
      backgroundColor: isDark ? '#1A1A1A' : '#FFF',
      marginHorizontal: SPACING.md,
      borderRadius: BORDER_RADIUS.xl,
      padding: SPACING.lg,
      marginBottom: SPACING.md,
      borderWidth: 1,
      borderColor: isDark ? '#333333' : '#E5E7EB',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: isDark ? 8 : 3,
    },
    cardCompact: {
      paddingVertical: SPACING.md,
      marginBottom: SPACING.sm,
    },
    cardDetailed: {
      padding: SPACING.xl,
      marginBottom: SPACING.lg,
    },

    // Header section
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: SPACING.md,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDark ? '#333' : '#f0f0f0',
    },
    userInfo: {
      flex: 1,
      marginLeft: SPACING.md,
    },
    userName: {
      fontSize: FONT_SIZES.md,
      fontWeight: '600',
      color: palette.text,
      marginBottom: 2,
    },
    time: {
      fontSize: FONT_SIZES.sm,
      color: isDark ? '#B0B0B0' : '#666',
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.sm,
    },

    // Status badge
    statusBadge: {
      paddingHorizontal: SPACING.xs,
      paddingVertical: 2,
      borderRadius: BORDER_RADIUS.sm,
      minWidth: 24,
      alignItems: 'center',
    },
    statusPublic: {
      backgroundColor: isDark ? '#1a3d1a' : '#e8f5e8',
    },
    statusPrivate: {
      backgroundColor: isDark ? '#3d1a1a' : '#f5e8e8',
    },
    statusText: {
      fontSize: 12,
    },

    // Menu button
    menuButton: {
      padding: SPACING.sm,
      borderRadius: BORDER_RADIUS.sm,
      backgroundColor: isDark ? '#2a2a2a' : '#f8f8f8',
    },

    // Avatar placeholder
    avatarPlaceholder: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0',
    },

    // Options menu
    optionsMenu: {
      backgroundColor: isDark ? '#2a2a2a' : '#fff',
      borderRadius: BORDER_RADIUS.md,
      marginTop: SPACING.sm,
      marginBottom: SPACING.sm,
      borderWidth: 1,
      borderColor: isDark ? '#333' : '#e0e0e0',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    optionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.md,
      gap: SPACING.sm,
    },
    optionText: {
      fontSize: FONT_SIZES.md,
      color: palette.text,
    },
    optionDivider: {
      height: 1,
      backgroundColor: isDark ? '#333' : '#e0e0e0',
    },

    // Content sections
    title: {
      fontSize: FONT_SIZES.lg,
      fontWeight: '700',
      color: palette.text,
      marginBottom: SPACING.sm,
      lineHeight: 24,
    },
    content: {
      fontSize: FONT_SIZES.md,
      color: isDark ? '#E0E0E0' : '#333',
      lineHeight: 22,
      marginBottom: SPACING.md,
    },
    contentCompact: {
      fontSize: FONT_SIZES.sm,
      marginBottom: SPACING.sm,
    },

    // Media
    media: {
      width: '100%',
      height: 200,
      borderRadius: BORDER_RADIUS.lg,
      marginBottom: SPACING.md,
      backgroundColor: isDark ? '#333' : '#f0f0f0',
    },
    mediaCompact: {
      height: 120,
      marginBottom: SPACING.sm,
    },

    // Tags
    tagsContainer: {
      marginBottom: SPACING.sm,
    },
    tags: {
      fontSize: FONT_SIZES.sm,
      color: Colors.dark.tint,
      fontWeight: '500',
    },

    // Actions section
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: SPACING.sm,
      borderTopWidth: 1,
      borderTopColor: isDark ? '#333' : '#f0f0f0',
      marginTop: SPACING.sm,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.xs,
      paddingVertical: SPACING.xs,
      paddingHorizontal: SPACING.sm,
      borderRadius: BORDER_RADIUS.md,
      backgroundColor: isDark ? '#2a2a2a' : '#f8f8f8',
    },
    actionText: {
      fontSize: FONT_SIZES.sm,
      color: isDark ? '#B0B0B0' : '#666',
      fontWeight: '500',
    },
    totalReactions: {
      marginLeft: 'auto',
    },
    totalReactionsText: {
      fontSize: FONT_SIZES.xs,
      color: isDark ? '#999' : '#666',
      fontStyle: 'italic',
    },

    // Moderation actions
    moderationActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: SPACING.sm,
      marginTop: SPACING.sm,
      borderTopWidth: 1,
      borderTopColor: isDark ? '#2a2a2a' : '#f5f5f5',
      gap: SPACING.sm,
    },

    // Loading and error states
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: SPACING.xl,
    },
    loadingText: {
      fontSize: FONT_SIZES.md,
      color: palette.text,
      marginTop: SPACING.md,
    },
    errorContainer: {
      backgroundColor: isDark ? '#2a1a1a' : '#fff5f5',
      padding: SPACING.md,
      borderRadius: BORDER_RADIUS.lg,
      borderWidth: 1,
      borderColor: isDark ? '#4a2a2a' : '#ffd0d0',
      marginBottom: SPACING.md,
    },
    errorText: {
      fontSize: FONT_SIZES.sm,
      color: isDark ? '#ff8a8a' : '#cc4444',
      textAlign: 'center',
    },

    // Skeleton loading
    skeleton: {
      backgroundColor: isDark ? '#333' : '#f0f0f0',
      borderRadius: BORDER_RADIUS.sm,
    },
    skeletonAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    skeletonText: {
      height: 16,
      marginBottom: SPACING.xs,
    },
    skeletonTitle: {
      height: 20,
      width: '80%',
      marginBottom: SPACING.sm,
    },
    skeletonContent: {
      height: 14,
      marginBottom: SPACING.xs,
    },

    // Responsive variants
    mobileCard: {
      marginHorizontal: SPACING.sm,
      padding: SPACING.md,
    },
    tabletCard: {
      marginHorizontal: SPACING.lg,
      padding: SPACING.lg,
      maxWidth: 600,
      alignSelf: 'center',
    },
  });
};
