import Colors from '@/constants/Colors';
import { ThemeMode } from '@/hooks/useThemedStyles';

export const makeStep3Styles = (theme: ThemeMode) => {
  const palette = Colors[theme];
  const text = palette.text;
  const placeholder = `${palette.text}60`;
  const inputBg = palette.background;
  const disabledBg = `${palette.text}05`;
  const border = '#666';

  return {
    colors: {
      text,
      placeholder,
      border,
      inputBg,
      disabledBg,
      buttonBg: palette.tint,
    },
    input: {
      backgroundColor: inputBg,
      borderColor: border,
      color: text,
    } as const,
    inputDisabled: {
      backgroundColor: disabledBg,
      borderColor: border,
      justifyContent: 'center',
    } as const,
    button: {
      backgroundColor: palette.tint,
    } as const,
    headerTitle: {
      color: text,
    } as const,
    headerSubtitle: {
      color: text,
    } as const,
  };
};
