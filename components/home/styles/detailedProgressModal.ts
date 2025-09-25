import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import type { ThemeMode } from '@/hooks/useThemedStyles';

export const makeDetailedProgressModalStyles = (theme: ThemeMode) => {
  const palette = Colors[theme];
  const colors = {
    text: palette.text,
    textMuted: palette.textMuted,
    card: palette.card,
    border: palette.border,
    tint: palette.tint,
    background: palette.background,
    // Colores específicos del modal
    completed: palette.tint || '#FF6B35',
    failed: '#FF4444',
    rest: palette.textMuted + '50',
    // Colores de texto sobre fondos
    onCompleted: '#FFFFFF',
    onFailed: '#FFFFFF',
    onRest: palette.text,
  } as const;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: 60, // Para evitar el notch
    },

    // Header
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingHorizontal: 20,
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border || colors.text + '20',
    },

    headerLeft: {
      flex: 1,
    },

    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },

    subtitle: {
      fontSize: 16,
      color: colors.text,
      opacity: 0.8,
      marginBottom: 2,
    },

    period: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.6,
    },

    closeButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: colors.text + '10',
    },

    // Estadísticas
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 20,
      paddingHorizontal: 20,
      marginBottom: 10,
    },

    statItem: {
      alignItems: 'center',
    },

    statNumber: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },

    statLabel: {
      fontSize: 12,
      color: colors.text,
      opacity: 0.7,
    },

    // Grid de días
    scrollContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },

    daysGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      paddingBottom: 20,
    },

    dayCard: {
      width: '18%', // Para 5 tarjetas por fila con espacio
      aspectRatio: 1, // Cuadrado
      borderRadius: 12,
      marginBottom: 10,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 8,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },

    dayNumber: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 2,
    },

    dayOfWeek: {
      fontSize: 10,
      fontWeight: '600',
      marginBottom: 4,
      textTransform: 'uppercase',
    },

    percentage: {
      fontSize: 11,
      fontWeight: '600',
    },

    restLabel: {
      fontSize: 9,
      fontWeight: '600',
      textAlign: 'center',
    },

    // Leyenda
    legendContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderTopWidth: 1,
      borderTopColor: colors.border || colors.text + '20',
      gap: 25,
    },

    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },

    legendColor: {
      width: 12,
      height: 12,
      borderRadius: 6,
    },

    legendText: {
      fontSize: 12,
      color: colors.text,
      opacity: 0.8,
    },
  });

  return { styles, colors };
};
