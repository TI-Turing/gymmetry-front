import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { ThemeMode } from '@/hooks/useThemedStyles';

export const makeSmartImageStyles = (theme: ThemeMode) => {
  const palette = Colors[theme];
  // fondos discretos para placeholders/cargas diferidas
  const placeholderBg = theme === 'dark' ? '#333' : '#E5E7EB';
  const deferredBg = theme === 'dark' ? '#222' : '#F3F4F6';

  return StyleSheet.create({
    placeholder: { backgroundColor: placeholderBg, borderRadius: 8 },
    deferredButton: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: deferredBg,
      borderRadius: 12,
    },
    deferredText: { color: palette.text, opacity: 0.85, fontSize: 12 },
  });
};
