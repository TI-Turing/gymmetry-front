import { StyleSheet, Platform } from 'react-native';
import { SPACING, BORDER_RADIUS } from '@/constants/Theme';
import Colors from '@/constants/Colors';

export type ThemeMode = 'light' | 'dark';

export const makeAppHeaderStyles = (theme: ThemeMode) => {
  const palette = Colors[theme];
  const borderColor = theme === 'dark' ? '#262626' : '#E5E7EB';
  const subtitle = theme === 'dark' ? '#B0B0B0' : '#6B7280';
  return StyleSheet.create({
    safeArea: {
      backgroundColor: palette.background,
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: SPACING.md,
      paddingTop: Platform.OS === 'web' ? SPACING.md : 0,
      paddingBottom: SPACING.sm,
      backgroundColor: palette.background,
      borderBottomWidth: 1,
      borderBottomColor: borderColor,
    },
    leftSlot: {
      width: 48,
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    rightSlot: {
      width: 48,
      justifyContent: 'center',
      alignItems: 'flex-end',
    },
    centerBlock: {
      flex: 1,
      alignItems: 'center',
    },
    brandRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    logo: {
      width: 120,
      height: 32,
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: palette.text,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 13,
      color: subtitle,
      marginTop: 2,
      textAlign: 'center',
    },
    backButton: {
      padding: 4,
      borderRadius: BORDER_RADIUS.sm,
    },
    backIconWrapper: {
      width: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    backIcon: {
      width: 10,
      height: 10,
      borderLeftWidth: 2,
      borderBottomWidth: 2,
      borderColor: palette.text,
      transform: [{ rotate: '45deg' }],
    },
  });
};
