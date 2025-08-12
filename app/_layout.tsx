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
import { Modal, View as RNView, Text as RNText, TouchableOpacity, TextInput, Platform } from 'react-native';
import 'react-native-reanimated';
import { LogBox } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import { userSessionService } from '@/services/userSessionService';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { PreloadProvider } from '@/contexts/PreloadContext';

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

  useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      // Inicializar país del usuario al cargar la app
      userSessionService.initializeUserCountry();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <PreloadProvider>
        <RootLayoutNav />
      </PreloadProvider>
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return;
    } // Esperar a que Auth cargue

    const first = segments[0] as string | undefined; // p.ej. '(tabs)', 'login', 'register', 'plans', 'modal', etc.

    // Rutas de la app a las que un usuario autenticado SÍ puede entrar aunque no sean parte de (tabs)
  const allowedWhenAuth = new Set(['(tabs)', 'plans', 'modal', 'routine-day', 'routine-day-detail', 'routine-exercise-detail', 'routine-templates']);

    // Usuario NO autenticado intentando entrar a la app (tabs, plans, modal) -> mandar a login
    if (
    !isAuthenticated &&
  (first === '(tabs)' || first === 'plans' || first === 'modal' || first === 'routine-day' || first === 'routine-day-detail' || first === 'routine-exercise-detail')
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

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {isAuthenticated && <BiometricGate />}
      <Stack>
        {/* Grupo principal con tabs */}
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />

        {/* Auth */}
        <Stack.Screen name='login' options={{ headerShown: false }} />
        <Stack.Screen name='register' options={{ headerShown: false }} />

        {/* Modales / pantallas fuera de tabs */}
        <Stack.Screen name='modal' options={{ presentation: 'modal' }} />
        <Stack.Screen
          name='plans'
          options={{ presentation: 'modal', headerShown: false }}
        />
        <Stack.Screen
          name='routine-day'
          options={{ presentation: 'modal', headerShown: false }}
        />
        <Stack.Screen
          name='routine-day-detail'
          options={{ presentation: 'modal', headerShown: false }}
        />
        <Stack.Screen
          name='routine-exercise-detail'
          options={{ presentation: 'modal', headerShown: false }}
        />
        <Stack.Screen
          name='routine-templates'
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
  }, []);

  const tryBiometric = useCallbackAsync(async () => {
    setMode('working');
    setError(null);
    try {
      // Dynamic import without static analysis to avoid type errors when module is not installed
      const dynamicImport: any = (Function('return import')() as any);
      const LocalAuthentication = (await dynamicImport('expo-local-authentication')).default || (await dynamicImport('expo-local-authentication'));
      const hasHardware = await LocalAuthentication.hasHardwareAsync?.();
      const supported = await LocalAuthentication.isEnrolledAsync?.();
      if (!hasHardware || !supported) {
        setError('Biometría no disponible en este dispositivo. Usa contraseña.');
        setMode('choice');
        return;
      }
      const res = await LocalAuthentication.authenticateAsync?.({
        promptMessage: 'Autenticación requerida',
        fallbackEnabled: true,
        cancelLabel: Platform.OS === 'ios' ? 'Cancelar' : 'Cerrar sesión',
        disableDeviceFallback: false,
      });
      if (res?.success) {
        setVisible(false);
      } else {
        setError('No se pudo verificar con huella.');
        setMode('choice');
      }
    } catch {
      setError('No se pudo iniciar la autenticación biométrica. Usa contraseña.');
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
      const res: any = await authService.login({ UserNameOrEmail: identifier, Password: password } as any);
      if (res?.Success) {
        setVisible(false);
      } else {
        setError(res?.Message || 'Contraseña incorrecta.');
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
    <Modal transparent animationType='fade' visible={visible}>
      <RNView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <RNView style={{ width: '100%', maxWidth: 360, backgroundColor: '#1E1E1E', borderRadius: 12, padding: 20 }}>
          <RNText style={{ color: '#fff', fontSize: 18, fontWeight: '600', marginBottom: 12 }}>Verificación requerida</RNText>
          {error ? <RNText style={{ color: '#ff7675', marginBottom: 8 }}>{error}</RNText> : null}
          {mode === 'choice' && (
            <>
              <TouchableOpacity onPress={tryBiometric} style={{ backgroundColor: '#0EA5E9', padding: 12, borderRadius: 8, marginBottom: 8 }}>
                <RNText style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>Usar huella</RNText>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setMode('password'); setError(null); }} style={{ backgroundColor: '#444', padding: 12, borderRadius: 8, marginBottom: 8 }}>
                <RNText style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>Verificar por contraseña</RNText>
              </TouchableOpacity>
              <TouchableOpacity onPress={doLogout} style={{ backgroundColor: '#EF4444', padding: 12, borderRadius: 8 }}>
                <RNText style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>Cerrar sesión</RNText>
              </TouchableOpacity>
            </>
          )}
          {mode === 'password' && (
            <>
              <RNText style={{ color: '#ddd', marginBottom: 8 }}>Ingresa tu contraseña para continuar</RNText>
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder='Contraseña'
                placeholderTextColor={'#888'}
                style={{ backgroundColor: '#2A2A2A', color: '#fff', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12 }}
                autoCapitalize='none'
                autoCorrect={false}
              />
              <TouchableOpacity onPress={verifyPassword} style={{ backgroundColor: '#10B981', padding: 12, borderRadius: 8, marginBottom: 8 }}>
                <RNText style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>Verificar</RNText>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setMode('choice'); setError(null); }} style={{ padding: 12, borderRadius: 8 }}>
                <RNText style={{ color: '#bbb', textAlign: 'center' }}>Volver</RNText>
              </TouchableOpacity>
            </>
          )}
          {mode === 'working' && (
            <RNText style={{ color: '#bbb' }}>Verificando…</RNText>
          )}
        </RNView>
      </RNView>
    </Modal>
  );
}

// Utilidad para envolver funciones async como callbacks sin re-crear en cada render
function useCallbackAsync<T extends (...args: any[]) => Promise<any>>(fn: T) {
  const ref = useRef(fn);
  ref.current = fn;
  return useMemo(() => ((...args: any[]) => ref.current(...args)) as T, []);
}
