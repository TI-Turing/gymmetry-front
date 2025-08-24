import { StyleSheet } from 'react-native';

export const makeOccupancyChartStyles = (mode: 'light' | 'dark') => {
  const colors = {
    cardBg: mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
    onCard: mode === 'dark' ? '#FFFFFF' : '#111111',
    muted: mode === 'dark' ? '#B0B0B0' : '#666666',
    border: mode === 'dark' ? '#333333' : '#DDDDDD',
    shadow: '#000000',
    low: '#4CAF50',
    medium: '#FF9800',
    high: '#F44336',
  } as const;

  const styles = StyleSheet.create({
    chartCard: {
      backgroundColor: colors.cardBg,
      borderRadius: 12,
      padding: 16,
      marginHorizontal: 16,
      marginVertical: 8,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3.84,
      elevation: 8,
    },
    chartTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.onCard,
      marginBottom: 16,
      textAlign: 'center',
    },
    chartContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      height: 120,
      marginBottom: 16,
    },
    chartBarContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginHorizontal: 2,
    },
    chartBar: { width: '80%', borderRadius: 4, marginBottom: 8 },
    chartLabel: {
      fontSize: 10,
      color: colors.muted,
      transform: [{ rotate: '-45deg' }],
    },
    chartLegend: {
      flexDirection: 'row',
      justifyContent: 'center',
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 12,
    },
    legendColor: { width: 12, height: 12, borderRadius: 6, marginRight: 6 },
    legendText: { fontSize: 12, color: colors.muted },
  });

  return { styles, colors };
};
