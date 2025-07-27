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
    if (error) throw error;
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
      <RootLayoutNav />
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // No hacer nada mientras se carga

    const inAuthGroup = segments[0] === '(tabs)';

    if (!isAuthenticated && inAuthGroup) {
      // Usuario no autenticado intentando acceder a la app, redirigir a login
      router.replace('/login');
    } else if (isAuthenticated && !inAuthGroup) {
      // Usuario autenticado en pantallas de auth, redirigir a la app
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments, isLoading, router]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        <Stack.Screen name='login' options={{ headerShown: false }} />
        <Stack.Screen name='register' options={{ headerShown: false }} />
        <Stack.Screen name='modal' options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
