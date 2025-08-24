import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import type { ThemeMode } from '@/hooks/useThemedStyles';

export const makeFloatingActionButtonStyles = (theme: ThemeMode) => {
  const p = Colors[theme];
  const colors = { tint: p.tint, onTint: p.onTint } as const;
  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 100,
      right: 20,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 4.65,
      elevation: 6,
    },
  });
  return { styles, colors };
};
