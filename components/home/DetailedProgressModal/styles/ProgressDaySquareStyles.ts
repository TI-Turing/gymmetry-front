import { StyleSheet } from 'react-native';
import Colors from '../../../../constants/Colors';

export default (theme: 'light' | 'dark') => {
  const palette = Colors[theme];
  const colors = {
    text: palette.text,
    textMuted: palette.textMuted,
    card: palette.card,
    tint: palette.tint,
    rest: palette.textMuted,
    failBg: 'rgba(255, 99, 0, 0.1)',
  };

  return StyleSheet.create({
    square: {
      width: 60,
      height: 80,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    success: {
      backgroundColor: colors.tint,
    },
    fail: {
      backgroundColor: colors.failBg,
      borderColor: colors.tint,
      borderWidth: 2,
    },
    rest: {
      backgroundColor: colors.rest,
    },
    dayNumber: {
      fontSize: 20,
      fontWeight: 'bold' as const,
      color: '#FFFFFF',
      marginBottom: 4,
    },
    percentage: {
      fontSize: 12,
      color: '#FFFFFF',
      opacity: 0.9,
    },
  });
};
