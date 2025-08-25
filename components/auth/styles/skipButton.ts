import { ThemeMode } from '@/hooks/useThemedStyles';

export const makeSkipButtonStyles = (_theme: ThemeMode) => {
  return {
    colors: {
      textOnPrimary: '#FFFFFF',
    },
  } as const;
};
