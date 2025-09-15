import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { SPACING } from '@/constants/Theme';

export default (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === 'dark' ? Colors.dark.background : Colors.light.background,
    },
    content: {
      flex: 1,
      padding: SPACING.md,
    },
    inputContainer: {
      marginBottom: SPACING.md,
    },
    titleInput: {
      backgroundColor: theme === 'dark' ? Colors.dark.card : Colors.light.card,
      borderRadius: 12,
      padding: SPACING.md,
      fontSize: 18,
      fontWeight: '600',
      color: theme === 'dark' ? Colors.dark.text : Colors.light.text,
      borderWidth: 1,
      borderColor: theme === 'dark' ? Colors.dark.border : Colors.light.border,
    },
    contentInput: {
      backgroundColor: theme === 'dark' ? Colors.dark.card : Colors.light.card,
      borderRadius: 12,
      padding: SPACING.md,
      fontSize: 16,
      color: theme === 'dark' ? Colors.dark.text : Colors.light.text,
      minHeight: 120,
      maxHeight: 200,
      borderWidth: 1,
      borderColor: theme === 'dark' ? Colors.dark.border : Colors.light.border,
    },
    characterCount: {
      alignItems: 'flex-end',
      marginTop: SPACING.xs,
    },
    characterCountText: {
      fontSize: 14,
      color: theme === 'dark' ? Colors.dark.tabIconDefault : Colors.light.tabIconDefault,
    },
    characterCountError: {
      color: theme === 'dark' ? Colors.dark.danger : Colors.light.danger,
    },
    mediaPreview: {
      marginBottom: SPACING.md,
    },
    mediaContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme === 'dark' ? Colors.dark.card : Colors.light.card,
      borderRadius: 12,
      padding: SPACING.md,
      borderWidth: 1,
      borderColor: theme === 'dark' ? Colors.dark.border : Colors.light.border,
    },
    mediaText: {
      fontSize: 16,
      color: theme === 'dark' ? Colors.dark.text : Colors.light.text,
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
      backgroundColor: theme === 'dark' ? Colors.dark.card : Colors.light.card,
      borderRadius: 12,
      padding: SPACING.md,
      borderWidth: 1,
      borderColor: theme === 'dark' ? Colors.dark.border : Colors.light.border,
    },
    mediaButtonText: {
      fontSize: 16,
      color: theme === 'dark' ? Colors.dark.text : Colors.light.text,
    },
    actionButtons: {
      flexDirection: 'row',
      gap: SPACING.md,
      padding: SPACING.md,
      borderTopWidth: 1,
      borderTopColor: theme === 'dark' ? Colors.dark.border : Colors.light.border,
      backgroundColor: theme === 'dark' ? Colors.dark.background : Colors.light.background,
    },
    cancelButton: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: SPACING.md,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme === 'dark' ? Colors.dark.tabIconDefault : Colors.light.tabIconDefault,
    },
    cancelButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme === 'dark' ? Colors.dark.tabIconDefault : Colors.light.tabIconDefault,
    },
    publishButton: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: SPACING.md,
      borderRadius: 12,
      backgroundColor: theme === 'dark' ? Colors.dark.tint : Colors.light.tint,
    },
    publishButtonDisabled: {
      backgroundColor: theme === 'dark' ? Colors.dark.tabIconDefault : Colors.light.tabIconDefault,
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