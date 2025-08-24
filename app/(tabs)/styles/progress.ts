import Colors from '@/constants/Colors';
import { ThemeMode } from '@/hooks/useThemedStyles';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const makeProgressStyles = (theme: ThemeMode) => {
  const palette = Colors[theme];
  const text = palette.text;
  const muted = palette.textMuted;
  const cardBg = palette.card;
  const track = palette.neutral;
  const accentGreen = palette.success;
  const accentRed = palette.danger;
  const gold = palette.warning; // usar warning como sustituto de dorado
  const orange = palette.tint; // usar color de marca para acentos

  return {
    scrollView: { flex: 1, paddingHorizontal: 20 } as const,
    header: { paddingTop: 60, paddingBottom: 20 } as const,
    title: {
      fontSize: 28,
      fontWeight: 'bold' as const,
      color: text,
      marginBottom: 8,
    } as const,
    subtitle: { fontSize: 16, color: muted } as const,
    periodContainer: {
      flexDirection: 'row' as const,
      backgroundColor: cardBg,
      borderRadius: 25,
      padding: 4,
      marginBottom: 24,
    } as const,
    periodButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 20,
      alignItems: 'center' as const,
    } as const,
    periodButtonActive: { backgroundColor: palette.background } as const,
    periodText: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: muted,
    } as const,
    periodTextActive: { color: palette.text } as const,
    statsGrid: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      marginBottom: 24,
    } as const,
    statCard: {
      backgroundColor: cardBg,
      borderRadius: 16,
      padding: 20,
      width: (width - 60) / 2,
    } as const,
    statHeader: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      marginBottom: 12,
    } as const,
    statIcon: { marginRight: 8 } as const,
    statTitle: {
      fontSize: 14,
      color: muted,
      fontWeight: '600' as const,
    } as const,
    statValue: {
      fontSize: 24,
      fontWeight: 'bold' as const,
      color: text,
      marginBottom: 4,
    } as const,
    statTarget: { fontSize: 12, color: muted } as const,
    statSubtitle: { fontSize: 12, color: muted, marginTop: 4 } as const,
    chartCard: {
      backgroundColor: cardBg,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
    } as const,
    chartTitle: {
      fontSize: 16,
      fontWeight: 'bold' as const,
      color: text,
      marginBottom: 16,
    } as const,
    chartContainer: { marginBottom: 20 } as const,
    chartBar: {
      height: 8,
      backgroundColor: track,
      borderRadius: 4,
      marginBottom: 8,
    } as const,
    chartProgress: {
      height: '100%',
      backgroundColor: accentGreen,
      borderRadius: 4,
    } as const,
    chartLabel: { fontSize: 14, color: muted } as const,
    weightCard: {
      backgroundColor: cardBg,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
    } as const,
    weightHeader: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      marginBottom: 16,
    } as const,
    weightTitle: {
      fontSize: 18,
      fontWeight: 'bold' as const,
      color: text,
      marginLeft: 12,
    } as const,
    weightValue: {
      fontSize: 32,
      fontWeight: 'bold' as const,
      color: text,
      marginBottom: 8,
    } as const,
    weightChange: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
    } as const,
    weightChangeText: {
      fontSize: 16,
      fontWeight: '600' as const,
      marginLeft: 8,
    } as const,
    achievementsCard: {
      backgroundColor: cardBg,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
    } as const,
    achievementsTitle: {
      fontSize: 18,
      fontWeight: 'bold' as const,
      color: text,
      marginBottom: 16,
    } as const,
    achievementsList: { gap: 12 } as const,
    achievementItem: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
    } as const,
    achievementText: { fontSize: 14, color: muted, marginLeft: 12 } as const,
    footer: { height: 100 } as const,
    colors: {
      text,
      muted,
      green: accentGreen,
      red: accentRed,
      track,
      gold,
      orange,
    },
  };
};
