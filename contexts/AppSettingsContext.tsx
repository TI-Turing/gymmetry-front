import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import { Platform, useColorScheme as rnUseColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_CONFIG } from '@/constants/AppConfig';
import { setLoggerConfig } from '@/utils/logger';
import { isWithinQuietHours as _isWithinQuietHours } from '@/utils/quietHours';

export type ThemePreference = 'system' | 'light' | 'dark';
export type ImageQuality = 'auto' | 'high' | 'medium' | 'low';
export type LogLevel = 'off' | 'error' | 'warn' | 'info' | 'debug';

export interface QuietHours {
  enabled: boolean;
  start: string; // HH:mm
  end: string; // HH:mm
}

export interface AppSettings {
  theme: ThemePreference;
  reduceMotion: boolean;
  dataSaver: boolean;
  language: 'auto' | 'es' | 'en';
  imageQuality: ImageQuality;
  notificationsEnabled: boolean;
  trainingNotificationsEnabled: boolean;
  hydrationRemindersEnabled: boolean;
  hydrationIntervalMinutes: number; // 30/45/60
  activeBreaksEnabled: boolean;
  activeBreaksIntervalMinutes: number; // 60/90/120
  quietHours: QuietHours;
  analyticsEnabled: boolean;
  logLevel: LogLevel;
  enableOfflineCache: boolean;
  experiments: Record<string, boolean>;
  // Social
  socialAnonymousMode: boolean; // Mostrar publicaciones/comentarios/acciones propias como anónimas
  // futuros: otaChannel, lockOnBackground, hideScreenshots
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  reduceMotion: false,
  dataSaver: false,
  language: 'auto',
  imageQuality: 'auto',
  notificationsEnabled: true,
  trainingNotificationsEnabled: true,
  hydrationRemindersEnabled: false,
  hydrationIntervalMinutes: 60,
  activeBreaksEnabled: false,
  activeBreaksIntervalMinutes: 120,
  quietHours: { enabled: false, start: '22:00', end: '07:00' },
  analyticsEnabled: true,
  logLevel: 'warn',
  enableOfflineCache: false,
  experiments: {},
  socialAnonymousMode: false,
};

type Ctx = {
  settings: AppSettings;
  setSettings: (
    next: Partial<AppSettings> | ((prev: AppSettings) => AppSettings)
  ) => Promise<void>;
  resolvedColorScheme: 'light' | 'dark';
};

const AppSettingsContext = createContext<Ctx | null>(null);

export function AppSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, setSettingsState] = useState<AppSettings>(DEFAULT_SETTINGS);
  const systemScheme = rnUseColorScheme() ?? 'light';

  // Persistencia
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const key =
          APP_CONFIG?.STORAGE_KEYS?.APP_PREFERENCES || '@app_preferences';
        const raw =
          Platform.OS === 'web' &&
          typeof window !== 'undefined' &&
          'localStorage' in window
            ? window.localStorage.getItem(key)
            : await AsyncStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (!cancelled) setSettingsState({ ...DEFAULT_SETTINGS, ...parsed });
        }
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Aplicar config de logger cuando cambie logLevel
  useEffect(() => {
    setLoggerConfig(settings.logLevel === 'off' ? 'error' : settings.logLevel);
  }, [settings.logLevel]);

  const persist = async (val: AppSettings) => {
    const key = APP_CONFIG?.STORAGE_KEYS?.APP_PREFERENCES || '@app_preferences';
    const json = JSON.stringify(val);
    if (
      Platform.OS === 'web' &&
      typeof window !== 'undefined' &&
      'localStorage' in window
    ) {
      window.localStorage.setItem(key, json);
    } else {
      await AsyncStorage.setItem(key, json);
    }
  };

  const setSettings = useCallback<Ctx['setSettings']>(async (next) => {
    setSettingsState((prev) => {
      const merged =
        typeof next === 'function'
          ? (next as (p: AppSettings) => AppSettings)(prev)
          : { ...prev, ...next };
      // best-effort persist
      persist(merged).catch(() => {
        // ignore
      });
      return merged;
    });
  }, []);

  const resolvedColorScheme: 'light' | 'dark' = useMemo(() => {
    if (settings.theme === 'system')
      return systemScheme === 'dark' ? 'dark' : 'light';
    return settings.theme;
  }, [settings.theme, systemScheme]);

  const value = useMemo<Ctx>(
    () => ({ settings, setSettings, resolvedColorScheme }),
    [settings, setSettings, resolvedColorScheme]
  );

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const ctx = useContext(AppSettingsContext);
  if (!ctx)
    throw new Error('useAppSettings must be used within AppSettingsProvider');
  return ctx;
}

// Helpers utilitarios
export const isWithinQuietHours = _isWithinQuietHours;
