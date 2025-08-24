import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

export const makeGymOptionCardStyles = (mode: 'light' | 'dark') => {
  const c = Colors[mode];
  const colors = {
    cardBg: mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
    text: mode === 'dark' ? '#FFFFFF' : '#111111',
    muted: mode === 'dark' ? '#B0B0B0' : '#666666',
    shadow: '#000000',
    chevron: mode === 'dark' ? '#B0B0B0' : '#888888',
    tint: c.tint,
    success: '#4CAF50',
  } as const;

  const styles = StyleSheet.create({
    optionCard: {
      backgroundColor: colors.cardBg,
      borderRadius: 12,
      padding: 20,
      marginHorizontal: 16,
      marginVertical: 8,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3.84,
      elevation: 8,
    },
    optionIcon: { marginRight: 16 },
    optionContent: { flex: 1 },
    optionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    optionSubtitle: { fontSize: 14, color: colors.muted, lineHeight: 20 },
  });

  return { styles, colors };
};
