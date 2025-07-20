import { useColorScheme as _useColorScheme } from 'react-native';

export function useColorScheme() {
  // Siempre devolver 'dark' como tema predeterminado
  return 'dark' as const;
}
