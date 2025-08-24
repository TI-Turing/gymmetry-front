import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

export const makePlanTypeFormStyles = (mode: 'light' | 'dark') => {
  const c = Colors[mode];
  const colors = {
    text: c.text,
    tint: c.tint,
    muted: mode === 'dark' ? '#888888' : '#777777',
    border: mode === 'dark' ? '#444444' : '#CCCCCC',
    cardBg: mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
    background: c.background,
  } as const;

  const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: colors.background },
    title: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 12,
      color: colors.text,
    },
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
      backgroundColor: colors.cardBg,
    },
    row: { flexDirection: 'row', gap: 8, marginVertical: 8 },
    info: { color: colors.tint, marginTop: 8 },
  });

  return { styles, colors };
};
