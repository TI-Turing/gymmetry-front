import { useMemo } from 'react';
import { useColorScheme } from '@/components/useColorScheme';

export type ThemeMode = 'light' | 'dark';

export function useThemedStyles<T>(factory: (theme: ThemeMode) => T): T {
  const theme = useColorScheme();
  return useMemo(() => factory(theme), [factory, theme]);
}
