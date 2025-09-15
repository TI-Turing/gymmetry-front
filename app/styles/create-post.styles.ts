import { StyleSheet } from 'react-native';
import { Colors } from '@/constants';
import { SPACING } from '@/constants/Theme';

export const createStyles = (colorScheme: 'light' | 'dark') => {
  const colors = Colors[colorScheme];
  
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      padding: SPACING.md,
    },
    inputContainer: {
      marginBottom: SPACING.md,
    },
    titleInput: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: SPACING.md,
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    contentInput: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: SPACING.md,
      fontSize: 16,
      color: colors.text,
      minHeight: 120,
      maxHeight: 200,
      borderWidth: 1,
      borderColor: colors.border,
    },
    placeholderColor: {
      color: colors.tabIconDefault,
    },
    characterCount: {
      alignItems: 'flex-end',
      marginTop: SPACING.xs,
    },
    characterCountText: {
      fontSize: 14,
      color: colors.tabIconDefault,
    },
    characterCountError: {
      color: '#FF6B6B',
    },
    mediaPreview: {
      marginBottom: SPACING.md,
    },
    mediaContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: SPACING.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    mediaText: {
      fontSize: 16,
      color: colors.text,
    },
    mediaButtons: {
      flexDirection: 'row',
      gap: SPACING.md,
      marginBottom: SPACING.xl,
    },
    mediaButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: SPACING.xs,
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: SPACING.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    mediaButtonText: {
      fontSize: 16,
      color: colors.text,
    },
    actionButtons: {
      flexDirection: 'row',
      gap: SPACING.md,
      padding: SPACING.md,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.background,
    },
    cancelButton: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: SPACING.md,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.tabIconDefault,
    },
    cancelButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.tabIconDefault,
    },
    publishButton: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: SPACING.md,
      borderRadius: 12,
      backgroundColor: colors.tint,
    },
    publishButtonDisabled: {
      backgroundColor: colors.tabIconDefault,
      opacity: 0.5,
    },
    publishButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    publishButtonTextDisabled: {
      color: '#FFFFFF',
      opacity: 0.7,
    },
  });
};