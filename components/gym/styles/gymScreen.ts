import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

export const makeGymScreenStyles = (mode: 'light' | 'dark') => {
  const c = Colors[mode];
  const colors = {
    background: mode === 'dark' ? '#121212' : c.background,
    text: c.text,
  } as const;

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
  });

  return { styles, colors };
};
