import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

export const blockedUsersListStyles = (colorScheme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[colorScheme].background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors[colorScheme].background,
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: Colors[colorScheme].textMuted,
    },
    statsContainer: {
      backgroundColor: Colors[colorScheme].card,
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: Colors[colorScheme].border,
    },
    statsText: {
      fontSize: 14,
      color: Colors[colorScheme].textMuted,
      textAlign: 'center',
    },
    userCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: Colors[colorScheme].card,
      padding: 16,
      marginVertical: 4,
      marginHorizontal: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: Colors[colorScheme].border,
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    avatarContainer: {
      marginRight: 12,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
    },
    avatarPlaceholder: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: Colors[colorScheme].neutral,
      alignItems: 'center',
      justifyContent: 'center',
    },
    userDetails: {
      flex: 1,
    },
    userName: {
      fontSize: 16,
      fontWeight: '600',
      color: Colors[colorScheme].text,
      marginBottom: 2,
    },
    userHandle: {
      fontSize: 14,
      color: Colors[colorScheme].textMuted,
      marginBottom: 4,
    },
    blockInfo: {
      fontSize: 12,
      color: Colors[colorScheme].textMuted,
    },
    unblockButton: {
      backgroundColor: Colors[colorScheme].tint,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
    },
    unblockButtonText: {
      color: Colors[colorScheme].background,
      fontSize: 14,
      fontWeight: '600',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: Colors[colorScheme].text,
      marginTop: 16,
      marginBottom: 8,
      textAlign: 'center',
    },
    emptyMessage: {
      fontSize: 16,
      color: Colors[colorScheme].textMuted,
      textAlign: 'center',
      lineHeight: 24,
    },
    emptyListContainer: {
      flex: 1,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
    },
    errorTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: Colors[colorScheme].danger,
      marginTop: 16,
      marginBottom: 8,
      textAlign: 'center',
    },
    errorMessage: {
      fontSize: 14,
      color: Colors[colorScheme].textMuted,
      textAlign: 'center',
      marginBottom: 24,
      lineHeight: 20,
    },
    retryButton: {
      backgroundColor: Colors[colorScheme].tint,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    retryButtonText: {
      color: Colors[colorScheme].background,
      fontSize: 16,
      fontWeight: '600',
    },
  });
