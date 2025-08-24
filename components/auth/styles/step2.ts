import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { ThemeMode } from '@/hooks/useThemedStyles';

export const makeStep2Styles = (theme: ThemeMode) => {
  const palette = Colors[theme];
  return StyleSheet.create({
    label: { color: palette.text },
    input: {
      backgroundColor: palette.background,
      color: palette.text,
      borderColor: theme === 'dark' ? '#666' : '#D1D5DB',
    },
    subtle: { color: theme === 'dark' ? '#B0B0B0' : '#6B7280' },
    accent: { color: palette.tint },
    accentBg: { backgroundColor: palette.tint },
    card: {
      backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF',
      borderColor: theme === 'dark' ? '#333' : '#E5E7EB',
    },
  });
};
