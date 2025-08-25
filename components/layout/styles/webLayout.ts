import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { ThemeMode } from '@/hooks/useThemedStyles';

export const makeWebLayoutStyles = (theme: ThemeMode) => {
  const palette = Colors[theme];
  const sideBg = theme === 'dark' ? '#121212' : '#FFFFFF';
  const textMuted = theme === 'dark' ? '#B0B0B0' : '#6B7280';
  const iconInactive = textMuted;
  const iconActive = palette.tint;

  return StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: palette.background,
    },
    mainContent: { flex: 1, flexDirection: 'row' },
    leftColumn: { width: 250, backgroundColor: sideBg, paddingVertical: 20 },
    menuContainer: { flex: 1, paddingHorizontal: 10, paddingTop: 20 },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 15,
      paddingHorizontal: 15,
      borderRadius: 8,
      marginBottom: 5,
    },
    menuItemCompact: { justifyContent: 'center', paddingHorizontal: 10 },
    activeMenuItem: {
      backgroundColor:
        theme === 'dark' ? 'rgba(255, 99, 0, 0.1)' : 'rgba(255, 99, 0, 0.08)',
    },
    menuIcon: { marginRight: 15 },
    menuIconInactive: { color: iconInactive },
    menuIconActive: { color: iconActive },
    menuIconCompact: { marginRight: 0 },
    menuText: { fontSize: 16, color: textMuted, fontWeight: '500' },
    activeMenuText: { color: palette.tint, fontWeight: '600' },
    centerColumn: { flex: 1, backgroundColor: palette.background },
    rightColumn: { width: 300, backgroundColor: sideBg },
    // Nueva sección inferior del menú
    menuBottomSection: {
      marginTop: 'auto',
      paddingTop: 10,
    },
    menuDivider: {
      height: 1,
      backgroundColor: theme === 'dark' ? '#2A2A2A' : '#E5E7EB',
      marginVertical: 10,
      marginHorizontal: 8,
    },
  });
};
