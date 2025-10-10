import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

/**
 * Estilos temáticos para la pantalla de debug de anuncios
 */
export const createDebugAdsScreenStyles = (theme: 'light' | 'dark') => {
  const colors = Colors[theme];

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    header: {
      padding: 20,
      backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f5f5f5',
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },

    headerTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 4,
    },

    headerSubtitle: {
      fontSize: 14,
      color: colors.textMuted,
    },

    section: {
      padding: 16,
      marginVertical: 8,
      backgroundColor: colors.card,
      borderRadius: 12,
      marginHorizontal: 16,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
    },

    configRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme === 'dark' ? '#2a2a2a' : '#e0e0e0',
    },

    configLabel: {
      fontSize: 15,
      color: colors.textMuted,
    },

    configValue: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.tint,
    },

    loader: {
      marginVertical: 20,
    },

    errorText: {
      fontSize: 14,
      color: colors.danger,
      textAlign: 'center',
      paddingVertical: 12,
    },

    emptyText: {
      fontSize: 14,
      color: colors.textMuted,
      textAlign: 'center',
      paddingVertical: 12,
      fontStyle: 'italic',
    },

    adListItem: {
      padding: 12,
      backgroundColor: theme === 'dark' ? '#2a2a2a' : '#f9f9f9',
      borderRadius: 8,
      marginBottom: 8,
      borderWidth: 2,
      borderColor: 'transparent',
    },

    adListItemSelected: {
      borderColor: colors.tint,
      backgroundColor: theme === 'dark' ? '#1a1a1a' : '#fff',
    },

    adListTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },

    adListPriority: {
      fontSize: 13,
      color: colors.textMuted,
    },

    testingNote: {
      fontSize: 13,
      color: colors.textMuted,
      marginBottom: 12,
      fontStyle: 'italic',
    },

    buttonRow: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 8,
    },

    testButton: {
      flex: 1,
      backgroundColor: colors.tint,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 44,
    },

    testButtonDisabled: {
      opacity: 0.6,
    },

    testButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
    },

    logHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },

    clearButton: {
      fontSize: 14,
      color: colors.danger,
      fontWeight: '600',
    },

    logItem: {
      padding: 10,
      backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f5f5f5',
      borderRadius: 6,
      marginBottom: 6,
      borderLeftWidth: 3,
      borderLeftColor: colors.tint,
    },

    logText: {
      fontSize: 13,
      color: colors.text,
      marginBottom: 4,
    },

    logTimestamp: {
      fontSize: 11,
      color: colors.textMuted,
      fontStyle: 'italic',
    },

    footer: {
      padding: 16,
      marginVertical: 20,
      backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f5f5f5',
      borderRadius: 12,
      marginHorizontal: 16,
    },

    footerText: {
      fontSize: 13,
      color: colors.textMuted,
      textAlign: 'center',
      lineHeight: 18,
    },
  });
};
