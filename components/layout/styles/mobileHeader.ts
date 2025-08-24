import { Platform, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

export type ThemeMode = 'light' | 'dark';

export function makeMobileHeaderStyles(theme: ThemeMode) {
  const palette = Colors[theme];
  const isDark = theme === 'dark';
  const headerBg = isDark ? '#1A1A1A' : '#F9FAFB';
  const border = isDark ? '#333333' : '#E5E7EB';
  const subtitle = isDark ? '#B0B0B0' : '#6B7280';
  const menuBg = isDark ? '#121212' : '#FFFFFF';

  return StyleSheet.create({
    header: {
      backgroundColor: headerBg,
      borderBottomWidth: 0.5,
      borderBottomColor: border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 12,
      minHeight: 38,
      overflow: 'hidden',
      zIndex: 1000,
      height: 55,
    },
    leftSlot: {
      width: 40,
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    rightSlot: {
      width: 40,
      justifyContent: 'center',
      alignItems: 'flex-end',
    },
    centerBlock: {
      flex: 1,
      alignItems: 'center',
    },
    logoText: {
      fontSize: 20,
      fontWeight: '700',
      color: palette.tint,
    },
    subtitle: {
      marginTop: 1,
      fontSize: 10,
      color: subtitle,
    },
    backButton: {
      padding: 4,
      borderRadius: 20,
    },
    menuButton: {
      padding: 6,
    },
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-start',
    },
    menuContainer: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: '100%',
      height: '100%',
      backgroundColor: menuBg,
    },
    menuHeader: {
      height: 100,
      backgroundColor: headerBg,
      borderBottomWidth: 1,
      borderBottomColor: border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: Platform.OS === 'ios' ? 54 : 30,
    },
    menuTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: palette.text,
    },
    closeButton: {
      padding: 8,
    },
    menuOptions: {
      flex: 1,
      paddingTop: 20,
    },
    menuOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 20,
      borderBottomWidth: 1,
      borderBottomColor: border,
    },
    logoutOption: {
      borderBottomWidth: 0,
      marginTop: 'auto',
      backgroundColor: isDark
        ? 'rgba(255, 107, 107, 0.1)'
        : 'rgba(220, 38, 38, 0.08)',
    },
    menuIcon: {
      marginRight: 20,
      width: 24,
      textAlign: 'center',
    },
    menuText: {
      color: palette.text,
      fontSize: 18,
      fontWeight: '500',
    },
    logoutText: {
      color: isDark ? '#FF6B6B' : '#DC2626',
    },
  });
}
