import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

/**
 * Crea estilos temáticos para el componente AdCard
 *
 * @param theme - Tema actual ('light' | 'dark')
 * @returns StyleSheet con estilos del AdCard
 */
export const createAdCardStyles = (theme: 'light' | 'dark') => {
  const colors = Colors[theme];

  return StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      borderRadius: 12,
      marginVertical: 8,
      marginHorizontal: 16,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },

    adBadge: {
      position: 'absolute',
      top: 12,
      right: 12,
      backgroundColor: colors.tint,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      zIndex: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },

    adBadgeText: {
      color: '#FFFFFF',
      fontSize: 11,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },

    image: {
      width: '100%',
      height: 200,
      backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f5f5f5',
    },

    imagePlaceholder: {
      width: '100%',
      height: 200,
      backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f5f5f5',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
    },

    placeholderText: {
      color: '#999',
      fontSize: 14,
    },

    content: {
      padding: 16,
      gap: 12,
      backgroundColor: colors.background,
    },

    title: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      lineHeight: 24,
    },

    description: {
      fontSize: 14,
      color: theme === 'dark' ? '#b3b3b3' : '#666',
      lineHeight: 20,
    },

    ctaButton: {
      backgroundColor: colors.tint,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      marginTop: 4,
    },

    ctaText: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '600',
      letterSpacing: 0.3,
    },
  });
};
