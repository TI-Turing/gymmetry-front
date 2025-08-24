import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import type { ThemeMode } from '@/hooks/useThemedStyles';
import { UI_CONSTANTS } from '@/constants/AppConstants';

export const makeGymInfoViewStyles = (theme: ThemeMode) => {
  const isDark = theme === 'dark';
  const palette = Colors[theme];
  const colors = {
    background: palette.background,
    headerBg: isDark ? '#1A1A1A' : '#F5F5F5',
    surface2: isDark ? '#333333' : '#E6E6E6',
    border: isDark ? '#333333' : '#DDDDDD',
    text: palette.text,
    muted: isDark ? '#B0B0B0' : '#666666',
    tint: palette.tint,
    success: '#4CAF50',
    warning: '#FFA726',
    cta2: '#FF6B35',
    onTint: '#FFFFFF',
  } as const;

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: 'row',
      padding: UI_CONSTANTS.SPACING.LG,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.headerBg,
    },
    logo: {
      width: 80,
      height: 80,
      borderRadius: 12,
      backgroundColor: colors.surface2,
    },
    logoPlaceholder: {
      width: 80,
      height: 80,
      borderRadius: 12,
      backgroundColor: colors.surface2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerInfo: {
      flex: 1,
      marginLeft: UI_CONSTANTS.SPACING.MD,
      justifyContent: 'center',
    },
    gymName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    slogan: {
      fontSize: 16,
      color: colors.muted,
      fontStyle: 'italic',
      marginBottom: 8,
    },
    statusContainer: { flexDirection: 'row', alignItems: 'center' },
    statusText: { fontSize: 14, marginLeft: 6, fontWeight: '500' },
    refreshButton: {
      padding: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    section: {
      padding: UI_CONSTANTS.SPACING.LG,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.tint,
      marginBottom: UI_CONSTANTS.SPACING.MD,
    },
    infoItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: UI_CONSTANTS.SPACING.SM,
      paddingVertical: 4,
    },
    infoText: {
      fontSize: 16,
      color: colors.text,
      marginLeft: 12,
      flex: 1,
      lineHeight: 22,
    },
    linkText: { color: colors.tint, textDecorationLine: 'underline' },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: UI_CONSTANTS.SPACING.MD,
    },
    statItem: { alignItems: 'center' },
    statNumber: { fontSize: 28, fontWeight: 'bold', color: colors.tint },
    statLabel: { fontSize: 14, color: colors.muted, marginTop: 4 },
    addBranchButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.tint,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      marginTop: UI_CONSTANTS.SPACING.MD,
    },
    addBranchText: {
      color: colors.onTint,
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    },
    selectPlanButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.cta2,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      marginTop: UI_CONSTANTS.SPACING.SM,
    },
    selectPlanText: {
      color: colors.onTint,
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    },
  });

  return { ...styles, colors };
};
