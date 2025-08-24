import { useAppSettings } from '@/contexts/AppSettingsContext';

export function useColorScheme() {
  // Resuelve desde AppSettings para RN
  const { resolvedColorScheme } = useAppSettings();
  return resolvedColorScheme;
}
