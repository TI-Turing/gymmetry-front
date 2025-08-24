import Colors from '@/constants/Colors';
import { ThemeMode } from '@/hooks/useThemedStyles';

export const makeStep5Styles = (theme: ThemeMode) => {
  const palette = Colors[theme];
  const text = palette.text;
  const placeholder = `${palette.text}60`;
  const inputBg = palette.background;
  const border = '#666';
  const success = '#00C851';
  const error = '#FF4444';

  return {
    colors: {
      text,
      placeholder,
      inputBg,
      border,
      buttonBg: palette.tint,
      success,
      error,
      modalBackdrop: 'rgba(0, 0, 0, 0.5)',
      cardShadow: '#000',
    },
    input: {
      backgroundColor: inputBg,
      color: text,
      borderColor: border,
    } as const,
    inputSuccess: {
      borderColor: success,
    } as const,
    inputError: {
      borderColor: error,
    } as const,
    button: {
      backgroundColor: palette.tint,
    } as const,
    imagePicker: {
      backgroundColor: inputBg,
      borderColor: border,
    } as const,
    modalCard: {
      backgroundColor: inputBg,
      borderRadius: 12,
      padding: 20,
      width: '90%',
      maxWidth: 400,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    } as const,
  };
};
