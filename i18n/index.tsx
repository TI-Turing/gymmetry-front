import React, { createContext, useContext, useMemo } from 'react';
import { I18nManager, Platform } from 'react-native';
import { useAppSettings } from '@/contexts/AppSettingsContext';

type Dict = Record<string, string>;

const es: Dict = {
  settings_title: 'Ajustes',
  appearance: 'Apariencia',
  theme: 'Tema',
  system: 'Sistema',
  light: 'Claro',
  dark: 'Oscuro',
  reduce_motion: 'Reducir animaciones',
  preferences: 'Preferencias',
  language: 'Idioma',
  data_saver: 'Ahorro de datos',
  image_quality: 'Calidad de imágenes',
  notifications: 'Notificaciones',
  enable_notifications: 'Habilitar notificaciones',
  training_notifications: 'Recordatorios durante entreno',
  quiet_hours: 'Horas silenciosas',
  wellness: 'Bienestar',
  hydration_reminders: 'Recordatorios de hidratación',
  hydration_interval: 'Intervalo hidratación',
  active_breaks: 'Pausas activas',
  breaks_interval: 'Intervalo pausas',
  diagnostics_cache: 'Diagnóstico y caché',
  analytics: 'Analítica y telemetría',
  log_level: 'Nivel de logs',
  offline_cache: 'Caché offline',
  training: 'Entrenamiento',
  sound_cues: 'Señales sonoras / vibración',
  prep_time: 'Tiempo de preparación entre ciclos',
  test_hydration: 'Probar hidratación (5s)',
  test_break: 'Probar pausa (5s)',
  // Navegación / menú
  back: 'Atrás',
  menu_title: 'Menú',
  menu_open: 'Abrir menú',
  menu_close: 'Cerrar menú',
  routines: 'Rutinas',
  plans: 'Planes',
  physical_assessment: 'Estado físico',
  user_exercise_max_short: 'RM',
  settings_label: 'Ajustes',
  support_contact: 'Contactar Soporte',
  report_bug: 'Reportar un problema o bug',
  logout: 'Cerrar Sesión',
  // Auth
  login_subtitle: 'Inicia sesión para continuar',
  username_or_email: 'Usuario o Email',
  password_label: 'Contraseña',
  show_password: 'Mostrar contraseña',
  hide_password: 'Ocultar contraseña',
  sign_in: 'Iniciar sesión',
  signing_in: 'Iniciando sesión...',
  no_account: '¿No tienes cuenta?',
  go_register: 'Regístrate',
  // Register steps
  step_credentials: 'Credenciales',
  step_basic: 'Datos básicos',
  step_personal: 'Información personal',
  step_fitness: 'Datos fitness',
  step_profile: 'Perfil',
  // Alerts/messages
  fill_all_fields: 'Por favor completa todos los campos',
  unknown_error: 'Error desconocido',
  connection_error: 'Error de conexión. Verifica tu conexión a internet e intenta nuevamente.',
  incorrect_credentials: 'Credenciales incorrectas',
  server_error: 'Error del servidor. Intenta más tarde.',
  get_user_error: 'Error al obtener los datos del usuario',
  welcome: 'Bienvenido',
  login_success: 'Has iniciado sesión exitosamente.',
};

const en: Dict = {
  settings_title: 'Settings',
  appearance: 'Appearance',
  theme: 'Theme',
  system: 'System',
  light: 'Light',
  dark: 'Dark',
  reduce_motion: 'Reduce animations',
  preferences: 'Preferences',
  language: 'Language',
  data_saver: 'Data saver',
  image_quality: 'Image quality',
  notifications: 'Notifications',
  enable_notifications: 'Enable notifications',
  training_notifications: 'Training reminders',
  quiet_hours: 'Quiet hours',
  wellness: 'Wellness',
  hydration_reminders: 'Hydration reminders',
  hydration_interval: 'Hydration interval',
  active_breaks: 'Active breaks',
  breaks_interval: 'Breaks interval',
  diagnostics_cache: 'Diagnostics & cache',
  analytics: 'Analytics & telemetry',
  log_level: 'Log level',
  offline_cache: 'Offline cache',
  training: 'Training',
  sound_cues: 'Sound/vibration cues',
  prep_time: 'Prep time between cycles',
  test_hydration: 'Test hydration (5s)',
  test_break: 'Test break (5s)',
  // Navigation / menu
  back: 'Back',
  menu_title: 'Menu',
  menu_open: 'Open menu',
  menu_close: 'Close menu',
  routines: 'Routines',
  plans: 'Plans',
  physical_assessment: 'Physical assessment',
  user_exercise_max_short: '1RM',
  settings_label: 'Settings',
  support_contact: 'Contact support',
  report_bug: 'Report a problem or bug',
  logout: 'Log out',
  // Auth
  login_subtitle: 'Sign in to continue',
  username_or_email: 'Username or Email',
  password_label: 'Password',
  show_password: 'Show password',
  hide_password: 'Hide password',
  sign_in: 'Sign in',
  signing_in: 'Signing in...',
  no_account: "Don't have an account?",
  go_register: 'Sign up',
  // Register steps
  step_credentials: 'Credentials',
  step_basic: 'Basic data',
  step_personal: 'Personal info',
  step_fitness: 'Fitness data',
  step_profile: 'Profile',
  // Alerts/messages
  fill_all_fields: 'Please fill in all fields',
  unknown_error: 'Unknown error',
  connection_error: 'Connection error. Check your internet and try again.',
  incorrect_credentials: 'Incorrect credentials',
  server_error: 'Server error. Try later.',
  get_user_error: 'Failed to get user data',
  welcome: 'Welcome',
  login_success: 'You have signed in successfully.',
};

const dicts: Record<string, Dict> = { es, en };

type I18nCtx = {
  t: (key: string) => string;
  lang: 'es' | 'en';
};

const I18nContext = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useAppSettings();

  const lang = useMemo(() => {
    if (settings.language === 'es' || settings.language === 'en') return settings.language;
    // auto: intenta por locale del dispositivo
    try {
      const nav = (typeof navigator !== 'undefined' ? (navigator as any) : null);
      const locale = (nav?.language || nav?.userLanguage || '').toLowerCase();
      if (locale.startsWith('es')) return 'es';
      return 'en';
    } catch {
      return 'es';
    }
  }, [settings.language]);

  const value = useMemo<I18nCtx>(() => ({
    lang,
    t: (key: string) => {
      const d = dicts[lang] || es;
      return d[key] ?? key;
    },
  }), [lang]);

  // LTR/RTL si se expandiera a idiomas RTL en el futuro
  useMemo(() => {
    I18nManager.allowRTL(false);
  }, [lang]);

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
