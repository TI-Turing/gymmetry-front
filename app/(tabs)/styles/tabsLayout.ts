import Colors from '@/constants/Colors';
import { ThemeMode } from '@/hooks/useThemedStyles';

export const makeTabsLayoutStyles = (theme: ThemeMode) => {
  const palette = Colors[theme];
  const barBg = palette.card;
  const border = palette.border;
  return {
    tabBarActiveTintColor: palette.tint,
    tabBarStyleNative: {
      backgroundColor: barBg,
      borderTopColor: border,
      borderTopWidth: 1,
      height: 80,
      paddingBottom: 20,
      paddingTop: 10,
    } as const,
    tabBarLabelStyle: { fontSize: 12, fontWeight: '500' as const } as const,
  };
};
