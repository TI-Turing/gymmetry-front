import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

export const makeGymCrudStyles = (mode: 'light' | 'dark') => {
  const c = Colors[mode];
  const colors = {
    text: c.text,
    info: c.tint,
    error: '#F44336',
    cardBg: mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
    border: mode === 'dark' ? '#555555' : '#CCCCCC',
  } as const;

  const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 12,
      color: colors.text,
    },
    error: { color: colors.error, marginVertical: 8 },
    info: { color: colors.info, marginTop: 8 },
    card: {
      backgroundColor: colors.cardBg,
      padding: 12,
      borderRadius: 8,
      marginVertical: 6,
    },
    cardText: { fontSize: 12, color: colors.text },
    label: { marginBottom: 6, color: colors.text },
    textarea: {
      borderWidth: 1,
      borderColor: colors.border,
      padding: 8,
      borderRadius: 6,
      minHeight: 120,
      textAlignVertical: 'top',
      marginBottom: 8,
      color: colors.text,
    },
    row: { flexDirection: 'row', gap: 8, marginVertical: 8 },
  });

  return { styles, colors };
};
