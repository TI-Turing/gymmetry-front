import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { ThemeMode } from '@/hooks/useThemedStyles';

export const makeStep1Styles = (theme: ThemeMode) => {
  const palette = Colors[theme];
  return StyleSheet.create({
    headerTitle: { color: palette.text },
    headerSubtitle: { color: palette.text },
    label: { color: palette.text },
    input: {
      backgroundColor: palette.background,
      color: palette.text,
      borderColor: theme === 'dark' ? '#666' : '#D1D5DB',
    },
    chipOk: { color: palette.tint },
  });
};
