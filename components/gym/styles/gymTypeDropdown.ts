import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

export const makeGymTypeDropdownStyles = (mode: 'light' | 'dark') => {
  const c = Colors[mode];
  const colors = {
    background: c.background,
    cardBg: mode === 'dark' ? '#1A1A1A' : '#FFFFFF',
    text: c.text,
    muted: mode === 'dark' ? '#B0B0B0' : '#666666',
    border: mode === 'dark' ? '#333333' : '#666666',
    tint: c.tint,
    danger: '#F44336',
  } as const;

  const styles = StyleSheet.create({
    dropdownContainer: { marginBottom: 12 },
    dropdownLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    dropdownInput: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      minHeight: 48,
      justifyContent: 'center',
      backgroundColor: colors.background,
    },
    dropdownErrorText: { color: colors.danger, marginTop: 6, fontSize: 12 },

    modalOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalContent: {
      maxHeight: '70%',
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      padding: 16,
      backgroundColor: colors.background,
    },
    modalTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 12,
    },
    optionsList: { maxHeight: 320 },
    optionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.text,
    },
    optionContent: { flex: 1, marginRight: 12 },
    optionName: { fontSize: 16, color: colors.text },
    optionDescription: { fontSize: 12, color: colors.muted, marginTop: 2 },
    noOptionsText: { textAlign: 'center', marginTop: 12, color: colors.muted },
  });

  return { styles, colors };
};
