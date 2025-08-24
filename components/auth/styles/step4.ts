import Colors from '@/constants/Colors';
import { ThemeMode } from '@/hooks/useThemedStyles';

export const makeStep4Styles = (theme: ThemeMode) => {
  const palette = Colors[theme];
  const text = palette.text;
  const placeholder = `${palette.text}60`;
  const inputBg = palette.background;
  const border = '#666';

  return {
    colors: {
      text,
      placeholder,
      inputBg,
      border,
      buttonBg: palette.tint,
    },
    input: {
      backgroundColor: inputBg,
      color: text,
      borderColor: border,
    } as const,
    button: {
      backgroundColor: palette.tint,
    } as const,
  };
};
