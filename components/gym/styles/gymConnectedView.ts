import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

export const makeGymConnectedViewStyles = (mode: 'light' | 'dark') => {
  const c = Colors[mode];
  const colors = {
    background: c.background,
    cardBg: mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
    text: c.text,
    muted: mode === 'dark' ? '#B0B0B0' : '#666666',
    border: mode === 'dark' ? '#333333' : '#DDDDDD',
    tint: c.tint,
    success: '#4CAF50',
    onCard: mode === 'dark' ? '#FFFFFF' : '#111111',
    shadow: '#000000',
  } as const;

  const styles = StyleSheet.create({
    scrollView: { flex: 1 },
    scrollContent: { paddingBottom: 20 },
    gymHeader: { padding: 20, paddingTop: 10, alignItems: 'center' },
    gymName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.onCard,
      marginBottom: 4,
    },
    gymAddress: { fontSize: 16, color: colors.muted },

    statusCard: {
      backgroundColor: colors.cardBg,
      borderRadius: 12,
      padding: 20,
      marginHorizontal: 16,
      marginVertical: 8,
      flexDirection: 'row',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3.84,
      elevation: 8,
    },
    statusItem: { flex: 1, alignItems: 'center' },
    statusDivider: {
      width: 1,
      backgroundColor: colors.border,
      marginHorizontal: 20,
    },
    statusNumber: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.onCard,
      marginTop: 8,
      marginBottom: 4,
    },
    statusLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.onCard,
      marginBottom: 2,
    },
    statusSubLabel: { fontSize: 12, color: colors.muted },

    infoCard: {
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
    infoTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.onCard,
      marginBottom: 12,
    },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    infoDetail: { fontSize: 14, color: colors.muted, marginLeft: 12 },
  });

  return { styles, colors };
};
