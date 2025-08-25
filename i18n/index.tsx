import React, { createContext, useContext, useMemo } from 'react';
import { I18nManager } from 'react-native';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import es from './locales/es';
import en from './locales/en';

export type Dict = Record<string, string>;

const dicts: Record<string, Dict> = { es, en };

type I18nCtx = {
  t: (key: string) => string;
  lang: 'es' | 'en';
};

const I18nContext = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useAppSettings();

  const lang = useMemo(() => {
    if (settings.language === 'es' || settings.language === 'en')
      return settings.language;
    // auto: intenta por locale del dispositivo
    try {
      const nav =
        typeof navigator !== 'undefined'
          ? (navigator as unknown as {
              language?: string;
              userLanguage?: string;
            })
          : null;
      const locale = (nav?.language || nav?.userLanguage || '').toLowerCase();
      if (locale.startsWith('es')) return 'es';
      return 'en';
    } catch {
      return 'es';
    }
  }, [settings.language]);

  const value = useMemo<I18nCtx>(
    () => ({
      lang,
      t: (key: string) => {
        const d = dicts[lang] || es;
        return d[key] ?? key;
      },
    }),
    [lang]
  );

  // LTR/RTL si se expandiera a idiomas RTL en el futuro
  useMemo(() => {
    I18nManager.allowRTL(false);
  }, []);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
