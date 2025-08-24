import Colors from '@/constants/Colors';
import { ThemeMode } from '@/hooks/useThemedStyles';

export const makeSkipButtonStyles = (theme: ThemeMode) => {
  const palette = Colors[theme];
  return {
    colors: {
      textOnPrimary: '#FFFFFF',
    },
  } as const;
};
