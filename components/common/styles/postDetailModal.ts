import { StyleSheet } from 'react-native';
import type { ThemeMode } from '@/hooks/useThemedStyles';
import Colors from '@/constants/Colors';

export const createPostDetailModalStyles = (theme: ThemeMode) => {
  const colors = Colors[theme];

  return StyleSheet.create({
    modalContainer: {
      flex: 1,
    },
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    contentContainer: {
      width: '95%',
      maxWidth: 600,
      maxHeight: '90%',
      backgroundColor: colors.background,
      borderRadius: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 10,
    } as any,
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.card,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    closeButton: {
      padding: 8,
      borderRadius: 20,
    },
    scrollView: {
      flex: 1,
    },
    tabsContainer: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.card,
      marginTop: 8,
    },
    tab: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      gap: 8,
    },
    tabActive: {
      borderBottomWidth: 2,
      borderBottomColor: colors.tint,
    },
    tabText: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.textMuted,
    },
    tabTextActive: {
      color: colors.tint,
      fontWeight: '600',
    },
    tabContent: {
      flex: 1,
      paddingVertical: 16,
    },
    commentsWrapper: {
      padding: 16,
    },
    reactionsWrapper: {
      padding: 16,
    },
    placeholderContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 48,
      paddingHorizontal: 24,
    },
    placeholderText: {
      fontSize: 16,
      color: colors.textMuted,
      marginTop: 16,
      textAlign: 'center',
    },
    placeholderSubtext: {
      fontSize: 12,
      color: colors.textMuted,
      marginTop: 8,
      fontStyle: 'italic',
      textAlign: 'center',
    },
  });
};
