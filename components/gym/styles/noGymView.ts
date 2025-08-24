import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import type { ThemeMode } from '@/hooks/useThemedStyles';

export const makeNoGymViewStyles = (theme: ThemeMode) => {
  const isDark = theme === 'dark';
  const palette = Colors[theme];
  const colors = {
    background: palette.background,
    cardBg: isDark ? '#1E1E1E' : '#F7F7F7',
    text: palette.text,
    muted: isDark ? '#B0B0B0' : '#666666',
    info: '#2196F3',
    border: isDark ? '#333333' : '#DDDDDD',
  } as const;

  const styles = StyleSheet.create({
    scrollView: { flex: 1 },
    scrollContent: { paddingBottom: 20 },
    header: { padding: 20, paddingTop: 10, alignItems: 'center' },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    headerSubtitle: {
      fontSize: 16,
      color: colors.muted,
      textAlign: 'center',
      lineHeight: 22,
    },
    infoCard: {
      backgroundColor: colors.cardBg,
      borderRadius: 12,
      padding: 16,
      marginHorizontal: 16,
      marginVertical: 8,
      flexDirection: 'row',
      alignItems: 'flex-start',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3.84,
      elevation: 8,
    },
    infoText: {
      flex: 1,
      fontSize: 14,
      color: colors.muted,
      lineHeight: 20,
      marginLeft: 12,
    },
  });

  return { ...styles, colors };
};
