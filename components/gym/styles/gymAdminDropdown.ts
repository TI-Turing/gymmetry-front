import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

export const makeGymAdminDropdownStyles = (mode: 'light' | 'dark') => {
  const c = Colors[mode];
  const colors = {
    background: mode === 'dark' ? '#1A1A1A' : '#FFFFFF',
    background2: mode === 'dark' ? '#2A2A2A' : '#F5F5F5',
    cardBg: mode === 'dark' ? '#1A1A1A' : '#FFFFFF',
    text: mode === 'dark' ? '#FFFFFF' : '#111111',
    muted: mode === 'dark' ? '#B0B0B0' : '#666666',
    dim: mode === 'dark' ? '#888888' : '#999999',
    border: mode === 'dark' ? '#333333' : '#DDDDDD',
    disabled: mode === 'dark' ? '#666666' : '#BBBBBB',
    tint: c.tint,
    tintSoft: c.tint + '20',
    danger: '#FF6B6B',
    shadow: '#000000',
  } as const;

  const styles = StyleSheet.create({
    container: { marginBottom: 12 },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    required: { color: colors.danger },

    dropdown: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      minHeight: 48,
    },
    dropdownDisabled: {
      backgroundColor: colors.background2,
      borderColor: colors.border,
    },
    dropdownOpen: {
      borderColor: colors.tint,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
    dropdownText: { fontSize: 16, color: colors.text, flex: 1 },
    placeholderText: { color: colors.muted },
    disabledText: { color: colors.disabled },
    helpText: {
      fontSize: 12,
      color: colors.muted,
      marginTop: 4,
      fontStyle: 'italic',
    },

    dropdownList: {
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.tint,
      borderTopWidth: 0,
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
      maxHeight: 250,
      position: 'relative',
      zIndex: 1000,
    },
    scrollView: { maxHeight: 250 },
    dropdownItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    dropdownItemSelected: { backgroundColor: colors.tintSoft },
    employeeInfoItem: { flex: 1 },
    dropdownItemText: { fontSize: 16, color: colors.text },
    dropdownItemTextSelected: { color: colors.tint, fontWeight: '600' },
    employeeEmailItem: { fontSize: 12, color: colors.muted, marginTop: 2 },
    employeeNameItem: { fontSize: 12, color: colors.dim, marginTop: 1 },

    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingVertical: 16,
      paddingHorizontal: 16,
    },
    loadingText: { color: colors.muted, fontSize: 16, marginLeft: 8 },

    errorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: mode === 'dark' ? '#2A1A1A' : '#FFF1F1',
      borderWidth: 1,
      borderColor: colors.danger,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    errorText: { color: colors.danger, fontSize: 14, flex: 1, marginLeft: 8 },
    retryButton: { paddingVertical: 4, paddingHorizontal: 8 },
    retryText: { color: colors.tint, fontSize: 14, fontWeight: '600' },

    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background2,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingHorizontal: 12,
      paddingVertical: 8,
      margin: 4,
      borderRadius: 6,
    },
    searchIcon: { marginRight: 8 },
    searchInput: {
      flex: 1,
      color: colors.text,
      fontSize: 14,
      paddingVertical: 4,
    },
    clearButton: { padding: 4, marginLeft: 4 },

    noResultsContainer: {
      alignItems: 'center',
      paddingVertical: 20,
      paddingHorizontal: 16,
    },
    noResultsText: { color: colors.muted, fontSize: 14, fontStyle: 'italic' },
  });

  return { styles, colors };
};
