import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { ThemeMode } from '@/hooks/useThemedStyles';

export const makeStepsBarStyles = (theme: ThemeMode) => {
  const palette = Colors[theme];
  const inactiveBg = theme === 'dark' ? '#333' : '#E5E7EB';
  const inactiveBorder = theme === 'dark' ? '#666' : '#D1D5DB';
  const inactiveText = theme === 'dark' ? '#999' : '#6B7280';

  return StyleSheet.create({
    stepCircleActive: {
      backgroundColor: palette.tint,
      borderColor: palette.tint,
    },
    stepCircleInactive: {
      backgroundColor: inactiveBg,
      borderColor: inactiveBorder,
    },
    stepNumberActive: { color: '#fff' },
    stepNumberInactive: { color: inactiveText },
    stepLineActive: { backgroundColor: palette.tint },
    stepLineInactive: { backgroundColor: inactiveBg },
  });
};
