import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
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
    const allowedWhenAuth = new Set(['(tabs)', 'plans', 'modal', 'routine-day-detail']);

    // Usuario NO autenticado intentando entrar a la app (tabs, plans, modal) -> mandar a login
    if (
      !isAuthenticated &&
      (first === '(tabs)' || first === 'plans' || first === 'modal' || first === 'routine-day-detail')
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
          name='routine-day-detail'
          options={{ presentation: 'modal', headerShown: false }}
        />
      </Stack>
    </ThemeProvider>
  );
}
