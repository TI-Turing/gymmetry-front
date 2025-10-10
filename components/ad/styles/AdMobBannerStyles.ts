import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

export const createAdMobBannerStyles = (colorScheme: 'light' | 'dark') => {
  const colors = Colors[colorScheme];

  return StyleSheet.create({
    container: {
      width: '100%',
      backgroundColor: colors.card,
      borderRadius: 12,
      marginVertical: 8,
      marginHorizontal: 16, // Matching post card padding
      alignSelf: 'center',
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      maxWidth: '92%', // Limitar ancho máximo
    },

    badgeContainer: {
      position: 'absolute',
      top: 8,
      right: 8,
      zIndex: 10,
    },

    badge: {
      backgroundColor: '#4285F4', // Google Blue
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
    },

    badgeText: {
      color: '#FFFFFF',
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 0.5,
    },

    bannerContainer: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 50, // Altura mínima para banner
      maxHeight: 250, // Altura máxima para banner
      backgroundColor: colors.card,
      overflow: 'hidden', // Prevenir desbordamiento
    },

    errorContainer: {
      padding: 16,
      backgroundColor: colors.card,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 80,
    },

    errorText: {
      color: colors.danger || '#FF4444',
      fontSize: 14,
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: 4,
    },

    errorDetails: {
      color: colors.textMuted,
      fontSize: 11,
      textAlign: 'center',
      marginTop: 4,
      fontFamily: 'monospace',
    },

    loadingContainer: {
      padding: 16,
      backgroundColor: colors.card,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 80,
    },

    loadingText: {
      color: colors.textMuted,
      fontSize: 14,
      fontWeight: '500',
    },
  });
};
