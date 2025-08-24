import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Modal,
  View as RNView,
  Text as RNText,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import 'react-native-reanimated';
import { LogBox } from 'react-native';

import { userSessionService } from '@/services/userSessionService';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import {
  AppSettingsProvider,
  useAppSettings,
} from '@/contexts/AppSettingsContext';
import {
  scheduleLocalNotificationAsync,
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
} from '@/utils/localNotifications';
import { PreloadProvider } from '@/contexts/PreloadContext';
import { I18nProvider } from '@/i18n';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeRootLayoutStyles } from './styles/rootLayout';

// Importar el watcher para activarlo globalmente
import '@/services/gymDataWatcher';

// Suprimir warnings específicos que no son críticos
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'A non-serializable value was detected in an action',
  'Require cycle',
  'Module RNDeviceInfo requires main queue setup',
  'Failed to fetch',
  'Network request failed',
  'timeout',
  'Deprecated Warning',
]);

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });
  const [fontReady, setFontReady] = useState(false);

  // Si la carga de fuentes falla (por ejemplo, al descargar FontAwesome.ttf desde Metro), no detengas la app.
  useEffect(() => {
    if (loaded) {
      setFontReady(true);
    } else if (error) {
      console.warn(
        'No se pudieron cargar las fuentes. Continuando sin pre-carga de íconos.',
        error
      );
      setFontReady(true);
    }
  }, [loaded, error]);

  useEffect(() => {
    if (fontReady) {
      SplashScreen.hideAsync();
      // Inicializar país del usuario al cargar la app
      userSessionService.initializeUserCountry();
    }
  }, [fontReady]);

  if (!fontReady) {
    return null;
  }

  return (
    <AppSettingsProvider>
      <AuthProvider>
        <PreloadProvider>
          <I18nProvider>
            <RootLayoutNav />
          </I18nProvider>
        </PreloadProvider>
      </AuthProvider>
    </AppSettingsProvider>
  );
}

function RootLayoutNav() {
  const { resolvedColorScheme } = useAppSettings();
  const { settings } = useAppSettings();
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return;
    } // Esperar a que Auth cargue

    const first = segments[0] as string | undefined; // p.ej. '(tabs)', 'login', 'register', 'plans', 'modal', etc.

    // Rutas de la app a las que un usuario autenticado SÍ puede entrar aunque no sean parte de (tabs)
    const allowedWhenAuth = new Set([
      '(tabs)',
      'plans',
      'modal',
      'routine-day',
      'routine-day-detail',
      'routine-exercise-detail',
      'routine-templates',
      'routine-template-detail',
      'routine-template-days',
      'exercise-detail',
      'settings',
      'create-routine',
      'physical-assessment',
      'user-exercise-max',
    ]);

    // Usuario NO autenticado intentando entrar a la app (tabs, plans, modal) -> mandar a login
    if (
      !isAuthenticated &&
      (first === '(tabs)' ||
        first === 'plans' ||
        first === 'modal' ||
        first === 'routine-day' ||
        first === 'routine-day-detail' ||
        first === 'routine-exercise-detail')
    ) {
      router.replace('/login');
      return;
    }

    // Usuario autenticado en pantallas de auth -> mandarlo a la app (tabs)
    const inAuthScreens = first === 'login' || first === 'register';
    if (isAuthenticated && inAuthScreens) {
      router.replace('/(tabs)');
      return;
    }

    // (Opcional) Si está autenticado pero está en una ruta no permitida, redirigir a tabs
    if (isAuthenticated && !allowedWhenAuth.has(first ?? '(tabs)')) {
      router.replace('/(tabs)');
      return;
    }
  }, [isAuthenticated, segments, isLoading, router]);

  // Programar recordatorios de bienestar (una sola próxima ocurrencia) según ajustes
  useEffect(() => {
    if (!settings.notificationsEnabled) return;
    // Hidratación
    if (settings.hydrationRemindersEnabled) {
      const secs = Math.max(
        5 * 60,
        (settings.hydrationIntervalMinutes || 60) * 60
      );
      scheduleLocalNotificationAsync(
        {
          title: 'Hidrátate',
          body: 'Toma un vaso de agua y recarga energía.',
          data: { type: 'wellness:hydration' },
        },
        { seconds: secs },
        { settings }
      ).catch((err) => {
        if (__DEV__) console.debug('Notif hydration schedule failed', err);
      });
    }
    // Pausas activas
    if (settings.activeBreaksEnabled) {
      const secs = Math.max(
        10 * 60,
        (settings.activeBreaksIntervalMinutes || 120) * 60
      );
      scheduleLocalNotificationAsync(
        {
          title: 'Pausa activa',
          body: 'Levántate, camina un poco y estira tus músculos.',
          data: { type: 'wellness:activeBreak' },
        },
        { seconds: secs },
        { settings }
      ).catch((err) => {
        if (__DEV__) console.debug('Notif activeBreak schedule failed', err);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    settings.notificationsEnabled,
    settings.hydrationRemindersEnabled,
    settings.hydrationIntervalMinutes,
    settings.activeBreaksEnabled,
    settings.activeBreaksIntervalMinutes,
  ]);

  // Listener para re-agendar wellness al recibir la notificación
  useEffect(() => {
    let sub: { remove: () => void } | null = null;
    let subResp: { remove: () => void } | null = null;
    (async () => {
      sub = await addNotificationReceivedListener(async (event: unknown) => {
        try {
          const rec = (v: unknown): v is Record<string, unknown> =>
            v !== null && typeof v === 'object';
          let type: string | undefined;
          if (rec(event)) {
            const req = (event as Record<string, unknown>)[
              'request'
            ] as unknown;
            if (rec(req)) {
              const content = (req as Record<string, unknown>)[
                'content'
              ] as unknown;
              if (rec(content)) {
                const data = (content as Record<string, unknown>)[
                  'data'
                ] as unknown;
                if (rec(data)) {
                  const t = (data as Record<string, unknown>)[
                    'type'
                  ] as unknown;
                  const k = (data as Record<string, unknown>)[
                    'kind'
                  ] as unknown;
                  type =
                    (typeof t === 'string' && t) ||
                    (typeof k === 'string' && k) ||
                    undefined;
                }
              }
            }
          }
          if (!type) return;
          if (!settings.notificationsEnabled) return;
          if (
            type === 'wellness:hydration' &&
            settings.hydrationRemindersEnabled
          ) {
            const secs = Math.max(
              5 * 60,
              (settings.hydrationIntervalMinutes || 60) * 60
            );
            await scheduleLocalNotificationAsync(
              {
                title: 'Hidrátate',
                body: 'Toma un vaso de agua y recarga energía.',
                data: { type },
              },
              { seconds: secs },
              { settings }
            );
          }
          if (type === 'wellness:activeBreak' && settings.activeBreaksEnabled) {
            const secs = Math.max(
              10 * 60,
              (settings.activeBreaksIntervalMinutes || 120) * 60
            );
            await scheduleLocalNotificationAsync(
              {
                title: 'Pausa activa',
                body: 'Levántate, camina un poco y estira tus músculos.',
                data: { type },
              },
              { seconds: secs },
              { settings }
            );
          }
        } catch {}
      });

      // Tap/response listener (cuando la app está en background)
      subResp = await addNotificationResponseReceivedListener(
        async (response: unknown) => {
          try {
            const rec = (v: unknown): v is Record<string, unknown> =>
              v !== null && typeof v === 'object';
            let type: string | undefined;
            if (rec(response)) {
              const noti = (response as Record<string, unknown>)[
                'notification'
              ] as unknown;
              if (rec(noti)) {
                const req = (noti as Record<string, unknown>)[
                  'request'
                ] as unknown;
                if (rec(req)) {
                  const content = (req as Record<string, unknown>)[
                    'content'
                  ] as unknown;
                  if (rec(content)) {
                    const data = (content as Record<string, unknown>)[
                      'data'
                    ] as unknown;
                    if (rec(data)) {
                      const t = (data as Record<string, unknown>)[
                        'type'
                      ] as unknown;
                      const k = (data as Record<string, unknown>)[
                        'kind'
                      ] as unknown;
                      type =
                        (typeof t === 'string' && t) ||
                        (typeof k === 'string' && k) ||
                        undefined;
                    }
                  }
                }
              }
            }
            if (!type) return;
            if (!settings.notificationsEnabled) return;
            if (
              type === 'wellness:hydration' &&
              settings.hydrationRemindersEnabled
            ) {
              const secs = Math.max(
                5 * 60,
                (settings.hydrationIntervalMinutes || 60) * 60
              );
              await scheduleLocalNotificationAsync(
                {
                  title: 'Hidrátate',
                  body: 'Toma un vaso de agua y recarga energía.',
                  data: { type },
                },
                { seconds: secs },
                { settings }
              );
            }
            if (
              type === 'wellness:activeBreak' &&
              settings.activeBreaksEnabled
            ) {
              const secs = Math.max(
                10 * 60,
                (settings.activeBreaksIntervalMinutes || 120) * 60
              );
              await scheduleLocalNotificationAsync(
                {
                  title: 'Pausa activa',
                  body: 'Levántate, camina un poco y estira tus músculos.',
                  data: { type },
                },
                { seconds: secs },
                { settings }
              );
            }
          } catch {}
        }
      );
    })();
    return () => {
      try {
        sub?.remove?.();
      } catch {}
      try {
        subResp?.remove?.();
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    settings.notificationsEnabled,
    settings.hydrationRemindersEnabled,
    settings.hydrationIntervalMinutes,
    settings.activeBreaksEnabled,
    settings.activeBreaksIntervalMinutes,
  ]);

  return (
    <ThemeProvider
      value={resolvedColorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      {isAuthenticated && <BiometricGate />}
      <Stack>
        {/* Grupo principal con tabs */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Auth */}
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />

        {/* Modales / pantallas fuera de tabs */}
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        <Stack.Screen
          name="plans"
          options={{ presentation: 'modal', headerShown: false }}
        />
        <Stack.Screen
          name="routine-day"
          options={{ presentation: 'modal', headerShown: false }}
        />
        <Stack.Screen
          name="routine-day-detail"
          options={{ presentation: 'modal', headerShown: false }}
        />
        <Stack.Screen
          name="routine-exercise-detail"
          options={{ presentation: 'modal', headerShown: false }}
        />
        <Stack.Screen
          name="routine-templates"
          options={{ presentation: 'modal', headerShown: false }}
        />
        <Stack.Screen
          name="routine-template-detail"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="routine-template-days"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="exercise-detail" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        <Stack.Screen
          name="create-routine"
          options={{ presentation: 'modal', headerShown: false }}
        />
      </Stack>
    </ThemeProvider>
  );
}

// Componente ligero para gate biométrico para dueños/admin al entrar
function BiometricGate() {
  const { user, logout, hasRole } = useAuth();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<'choice' | 'password' | 'working'>('choice');
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [identifier, setIdentifier] = useState<string | null>(null);
  const styles = useThemedStyles(makeRootLayoutStyles);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!user) return;
      setIdentifier(user.email || user.userName || null);
      // Gate sólo para roles privilegiados sin gym vinculado aún (dueño en proceso de set up)
      if (hasRole('owner') && user.gymId) {
        if (!cancelled) {
          setVisible(true);
          setMode('choice');
          setError(null);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tryBiometric = useCallbackAsync(async () => {
    setMode('working');
    setError(null);
    try {
      // Dynamic import without static analysis to avoid type errors when module is not installed
      const dynamicImport = Function('return import')() as unknown as (
        m: string
      ) => Promise<unknown>;
      const mod = (await dynamicImport('expo-local-authentication')) as unknown;
      const LocalAuthentication = (mod || {}) as Record<string, unknown>;
      const hasHardware = await (
        LocalAuthentication['hasHardwareAsync'] as
          | (() => Promise<boolean>)
          | undefined
      )?.();
      const supported = await (
        LocalAuthentication['isEnrolledAsync'] as
          | (() => Promise<boolean>)
          | undefined
      )?.();
      if (!hasHardware || !supported) {
        setError(
          'Biometría no disponible en este dispositivo. Usa contraseña.'
        );
        setMode('choice');
        return;
      }
      const res = await (
        LocalAuthentication['authenticateAsync'] as
          | ((opts: Record<string, unknown>) => Promise<{ success?: boolean }>)
          | undefined
      )?.({
        promptMessage: 'Autenticación requerida',
        fallbackEnabled: true,
        cancelLabel: Platform.OS === 'ios' ? 'Cancelar' : 'Cerrar sesión',
        disableDeviceFallback: false,
      });
      if ((res as Record<string, unknown>)?.['success']) {
        setVisible(false);
      } else {
        setError('No se pudo verificar con huella.');
        setMode('choice');
      }
    } catch {
      setError(
        'No se pudo iniciar la autenticación biométrica. Usa contraseña.'
      );
      setMode('choice');
    }
  });

  const verifyPassword = useCallbackAsync(async () => {
    if (!identifier || !password) {
      setError('Ingresa tu contraseña.');
      return;
    }
    setMode('working');
    setError(null);
    try {
      const { authService } = await import('@/services/authService');
      const resUnknown = (await authService.login({
        UserNameOrEmail: identifier,
        Password: password,
      })) as unknown;
      const res = (resUnknown || {}) as Record<string, unknown>;
      if (res && (res['Success'] as boolean)) {
        setVisible(false);
      } else {
        const msg = res['Message'] as unknown;
        setError((typeof msg === 'string' && msg) || 'Contraseña incorrecta.');
        setMode('password');
      }
    } catch {
      setError('Error al verificar. Intenta de nuevo.');
      setMode('password');
    }
  });

  const doLogout = async () => {
    await logout();
    router.replace('/login');
  };

  if (!visible) return null;
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <RNView style={styles.overlay}>
        <RNView style={styles.dialog}>
          <RNText style={styles.title}>Verificación requerida</RNText>
          {error ? <RNText style={styles.errorText}>{error}</RNText> : null}
          {mode === 'choice' && (
            <>
              <TouchableOpacity
                onPress={tryBiometric}
                style={styles.primaryBtn}
              >
                <RNText style={styles.primaryBtnText}>Usar huella</RNText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setMode('password');
                  setError(null);
                }}
                style={styles.secondaryBtn}
              >
                <RNText style={styles.secondaryBtnText}>
                  Verificar por contraseña
                </RNText>
              </TouchableOpacity>
              <TouchableOpacity onPress={doLogout} style={styles.dangerBtn}>
                <RNText style={styles.dangerBtnText}>Cerrar sesión</RNText>
              </TouchableOpacity>
            </>
          )}
          {mode === 'password' && (
            <>
              <RNText style={styles.infoText}>
                Ingresa tu contraseña para continuar
              </RNText>
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="Contraseña"
                placeholderTextColor={styles.colors.placeholder}
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={verifyPassword}
                style={styles.primaryBtn}
              >
                <RNText style={styles.primaryBtnText}>Verificar</RNText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setMode('choice');
                  setError(null);
                }}
                style={{ padding: 12, borderRadius: 8 }}
              >
                <RNText style={styles.backText}>Volver</RNText>
              </TouchableOpacity>
            </>
          )}
          {mode === 'working' && (
            <RNText style={styles.workingText}>Verificando…</RNText>
          )}
        </RNView>
      </RNView>
    </Modal>
  );
}

// Utilidad para envolver funciones async como callbacks sin re-crear en cada render
function useCallbackAsync<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T
) {
  const ref = useRef(fn);
  ref.current = fn;
  return useMemo(() => ((...args: unknown[]) => ref.current(...args)) as T, []);
}
