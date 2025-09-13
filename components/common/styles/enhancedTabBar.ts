import Colors from '@/constants/Colors';
import { ThemeMode } from '@/hooks/useThemedStyles';

export const enhancedTabBarStyles = (theme: ThemeMode) => {
  const palette = Colors[theme];
  const _text = palette.text;
  const tint = palette.tint;
  const muted = theme === 'dark' ? '#B0B0B0' : '#6B7280';
  const border = theme === 'dark' ? '#333' : '#DDD';
  const cardBg = theme === 'dark' ? '#1E1E1E' : '#FFFFFF';
  const selectedBg = theme === 'dark' ? '#2A2A2A' : '#F0F0F0';

  return {
    // Container
    container: {
      backgroundColor: palette.background,
      borderBottomWidth: 1,
      borderBottomColor: border,
    },
    pillsContainer: {
      backgroundColor: 'transparent',
      borderBottomWidth: 0,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    tabsContainer: {
      flexDirection: 'row' as const,
      position: 'relative' as const,
    },

    // Tab styles
    tab: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 8,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      minHeight: 48,
      position: 'relative' as const,
    },
    pillTab: {
      flex: 0,
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginHorizontal: 4,
      borderRadius: 20,
      backgroundColor: cardBg,
      borderWidth: 1,
      borderColor: border,
      minHeight: 36,
    },
    selectedTab: {
      backgroundColor: selectedBg,
    },
    selectedPillTab: {
      backgroundColor: tint,
      borderColor: tint,
    },
    disabledTab: {
      opacity: 0.5,
    },

    // Label styles
    tabLabel: {
      fontSize: 12,
      fontWeight: '500' as const,
      color: muted,
      marginTop: 4,
      textAlign: 'center' as const,
    },
    selectedTabLabel: {
      color: tint,
      fontWeight: '600' as const,
    },
    disabledTabLabel: {
      color: theme === 'dark' ? '#666' : '#CCC',
    },

    // Icon styles
    iconContainer: {
      position: 'relative' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    iconColor: muted,
    selectedIconColor: tint,

    // Badge styles
    badge: {
      position: 'absolute' as const,
      top: -6,
      right: -8,
      backgroundColor: '#FF4444',
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      paddingHorizontal: 6,
    },
    badgeText: {
      color: 'white',
      fontSize: 10,
      fontWeight: '600' as const,
      textAlign: 'center' as const,
    },

    // Indicator styles (for underline variant)
    indicator: {
      position: 'absolute' as const,
      bottom: 0,
      height: 3,
      backgroundColor: tint,
      borderRadius: 1.5,
    },
  } as const;
};
