import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';
export const createUnifiedFeedStyles = (theme: 'light' | 'dark') => {
  const isDark = theme === 'dark';
  const palette = Colors[theme];
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.background,
    },
    // Header section
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      backgroundColor: palette.background,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#333' : '#f0f0f0',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    // List content
    listContent: {
      paddingBottom: SPACING.xl,
    },
    // Loading states
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
    // Error states
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: SPACING.xl,
      paddingHorizontal: SPACING.lg,
    },
    errorText: {
      color: Colors.dark.tint,
      fontSize: FONT_SIZES.md,
      marginBottom: SPACING.md,
      textAlign: 'center',
      lineHeight: 22,
    },
    retryText: {
      color: Colors.dark.tint,
      fontWeight: '600',
      fontSize: FONT_SIZES.md,
      textAlign: 'center',
      textDecorationLine: 'underline',
      marginTop: SPACING.sm,
    },
    // Empty states
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
      color: palette.text,
      marginBottom: SPACING.md,
      textAlign: 'center',
    },
    emptyMessage: {
      fontSize: FONT_SIZES.md,
      color: isDark ? '#888888' : '#666666',
      textAlign: 'center',
      lineHeight: 22,
    },
    // Search results overlay
    searchOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: palette.background,
      zIndex: 10,
    },
    // Floating action buttons
    fab: {
      position: 'absolute',
      bottom: SPACING.xl,
      right: SPACING.lg,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: Colors.dark.tint,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    // Upload section
    uploadSection: {
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      backgroundColor: palette.background,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#333' : '#f0f0f0',
    },
    // Refresh indicator customization
    refreshIndicator: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: BORDER_RADIUS.lg,
    },
    // Separator for items
    separator: {
      height: 1,
      backgroundColor: isDark ? '#333' : '#f0f0f0',
      marginHorizontal: SPACING.md,
    },
    // Pull to refresh text
    pullToRefreshText: {
      fontSize: FONT_SIZES.sm,
      color: isDark ? '#999' : '#666',
      textAlign: 'center',
      paddingVertical: SPACING.sm,
    },
    // Network status indicator
    networkStatus: {
      backgroundColor: isDark ? '#2a1a1a' : '#fff3cd',
      paddingVertical: SPACING.xs,
      paddingHorizontal: SPACING.md,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#4a3a2a' : '#ffeaa7',
    },
    networkStatusText: {
      fontSize: FONT_SIZES.sm,
      color: isDark ? '#ffcc70' : '#856404',
      textAlign: 'center',
    },
  });
  return styles;
};
