import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

export type ThemeMode = 'light' | 'dark';

export function makeRegisterFormStyles(theme: ThemeMode) {
  const palette = Colors[theme];
  const isDark = theme === 'dark';

  return StyleSheet.create({
    headerText: {
      color: palette.text,
    },
    headerTextMuted: {
      color: isDark ? '#B0B0B0' : '#6B7280',
    },
    // Additional hooks for future step components if needed
    link: {
      color: palette.tint,
      fontWeight: '600',
    },
  });
}
