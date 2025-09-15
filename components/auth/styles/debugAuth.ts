import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

export const makeDebugAuthStyles = (colorScheme: 'light' | 'dark') => {
  const colors = Colors[colorScheme];

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border || colors.text + '20',
    },
    backButton: {
      padding: 8,
    },
    backButtonText: {
      color: colors.tint,
    },
    title: {
      fontSize: 18,
      fontFamily: 'SpaceMono',
      color: colors.text,
      flex: 1,
      textAlign: 'center',
    },
    refreshButton: {
      padding: 8,
    },
    refreshButtonText: {
      color: colors.tint,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
    },
    section: {
      backgroundColor: colors.card,
      borderRadius: 8,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border || colors.text + '10',
    },
    sectionHeaderText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginLeft: 12,
      flex: 1,
    },
    loadingText: {
      fontSize: 12,
      color: colors.tint,
      fontStyle: 'italic',
    },
    sectionContent: {
      padding: 16,
    },
    dataRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border || colors.text + '10',
    },
    dataKey: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text,
      width: 140,
      marginRight: 12,
    },
    dataValue: {
      fontSize: 14,
      color: colors.text,
      flex: 1,
      fontFamily: 'SpaceMono',
    },
    errorContainer: {
      padding: 16,
      backgroundColor: colors.danger + '20',
    },
    errorText: {
      color: colors.danger,
      fontSize: 14,
    },
    actionsSection: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 16,
      marginTop: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    actionsSectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 16,
      textAlign: 'center',
    },
    actionButton: {
      marginBottom: 12,
    },
    dangerButton: {
      backgroundColor: colors.danger + '20',
    },
  });
};
