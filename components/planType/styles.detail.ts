import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

export const makePlanTypeDetailStyles = (mode: 'light' | 'dark') => {
  const c = Colors[mode];
  const colors = {
    text: c.text,
    tint: c.tint,
    error: '#d33',
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
    card: {
      backgroundColor: colors.cardBg,
      padding: 12,
      borderRadius: 8,
      marginVertical: 6,
    },
    muted: { fontSize: 12, color: colors.text },
    error: { color: colors.error, marginVertical: 8 },
  });

  return { styles, colors };
};
