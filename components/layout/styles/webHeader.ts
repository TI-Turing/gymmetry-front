import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { ThemeMode } from '@/hooks/useThemedStyles';

export const makeWebHeaderStyles = (theme: ThemeMode) => {
  const palette = Colors[theme];
  const border = theme === 'dark' ? '#333333' : '#E5E7EB';
  const controlBg = theme === 'dark' ? '#121212' : '#F3F4F6';
  const placeholder = theme === 'dark' ? '#B0B0B0' : '#6B7280';
  const menuBg = theme === 'dark' ? '#121212' : '#FFFFFF';
  const danger = theme === 'dark' ? '#FF6B6B' : '#EF4444';

  return StyleSheet.create({
    container: {
      height: 60,
      backgroundColor: palette.background,
      borderBottomWidth: 1,
      borderBottomColor: border,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      zIndex: 1000,
    },
    logoContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 10,
    },
    logoText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: palette.tint,
      textAlign: 'center',
    },
    logoCompact: { fontSize: 24 },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    searchContainer: {
      width: 400,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: controlBg,
      borderRadius: 25,
      paddingHorizontal: 15,
      height: 40,
    },
    searchIcon: { marginRight: 10 },
    searchInput: {
      flex: 1,
      color: palette.text,
      fontSize: 14,
      borderWidth: 0,
      outlineWidth: 0 as any,
      backgroundColor: 'transparent',
    },
    searchContainerFocused: {
      borderWidth: 2,
      borderColor: palette.tint,
      shadowColor: palette.tint,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    },
    userContainer: { position: 'relative' },
    userButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: controlBg,
    },
    userAvatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
    defaultAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: palette.tint,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
    },
    userName: {
      color: palette.text,
      fontSize: 14,
      fontWeight: '500',
      marginRight: 8,
    },
    userMenu: {
      position: 'absolute',
      top: '100%',
      right: 0,
      backgroundColor: menuBg,
      borderRadius: 8,
      marginTop: 8,
      minWidth: 200,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
      zIndex: 1001,
      borderWidth: 1,
      borderColor: border,
    },
    menuOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: border,
    },
    logoutOption: { borderBottomWidth: 0 },
    menuIcon: { marginRight: 12, width: 16 },
    menuText: { color: palette.text, fontSize: 14 },
    logoutText: { color: danger },
    logoutIcon: { color: danger },
    overlay: {
      position: 'fixed' as any,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 999,
    },
    placeholderColor: { color: placeholder },
    subtleIcon: { color: placeholder },
  });
};
