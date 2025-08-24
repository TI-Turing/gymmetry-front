import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

export type ThemeMode = 'light' | 'dark';
export type LoginStyles = ReturnType<typeof makeLoginStyles>;

export function makeLoginStyles(theme: ThemeMode) {
  const palette = Colors[theme];
  const isDark = theme === 'dark';

  return StyleSheet.create({
    // Web gradient container and colors
    webGradientContainer: {
      borderRadius: 0,
      padding: 40,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 12,
      borderWidth: 0,
    },
    // Titles
    titleWeb: {
      color: isDark ? '#FFFFFF' : palette.tint,
      fontSize: 34,
      fontWeight: 'bold',
    },
    subtitleWeb: {
      color: isDark ? '#FFFFFF' : '#111111',
      backgroundColor: 'transparent',
    },
    titleMobile: {
      color: palette.tint,
      fontSize: 34,
      fontWeight: 'bold',
    },
    subtitleMobile: {
      color: palette.text,
    },
    // Labels
    label: {
      color: isDark ? '#FFFFFF' : '#111111',
    },
    // Inputs
    webInput: {
      backgroundColor: isDark ? '#1E1E1E' : '#F7F7F7',
      color: isDark ? '#FFFFFF' : '#111111',
      borderColor: isDark ? '#888888' : '#CCCCCC',
      borderWidth: 2,
    },
    mobileInput: {
      backgroundColor: palette.background,
      color: palette.text,
      borderColor: palette.tint,
    },
    passwordInputMobile: {
      backgroundColor: palette.background,
      color: palette.text,
      borderColor: '#666666',
      paddingRight: 50,
    },
    eyeButton: {
      position: 'absolute',
      right: 16,
      top: 12,
      padding: 4,
    },
    eyeButtonWeb: {
      position: 'absolute',
      right: 16,
      top: 12,
      padding: 4,
      backgroundColor: 'transparent',
    },
    // Buttons
    primaryButton: {
      backgroundColor: palette.tint,
    },
    primaryButtonWeb: {
      backgroundColor: palette.tint,
      marginTop: 24,
    },
    buttonText: {
      color: '#FFFFFF',
    },
    link: {
      color: palette.tint,
      fontWeight: '600',
    },
  });
}

export function getWebGradientColors(theme: ThemeMode): string[] {
  const isDark = theme === 'dark';
  return isDark
    ? ['#000000', '#121212', '#000000']
    : ['#FFFFFF', '#F5F5F5', '#FFFFFF'];
}
