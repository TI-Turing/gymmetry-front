// Utilidades para probar el refresh token en desarrollo
import { authService } from '@/services/authService';
/* eslint-disable no-console */
import AsyncStorage from '@react-native-async-storage/async-storage';

export const tokenTestUtils = {
  // Función para simular un token expirado (solo para testing)
  async simulateExpiredToken(): Promise<void> {
    try {
      // Establecer una fecha de expiración en el pasado
      const expiredDate = new Date(Date.now() - 60000).toISOString(); // 1 minuto atrás
      await AsyncStorage.setItem('@token_expiration', expiredDate);

      console.log('🧪 Token marcado como expirado para testing');
    } catch (error) {
      console.error('Error simulando token expirado:', error);
    }
  },

  // Función para verificar el estado actual del token
  async checkTokenStatus(): Promise<void> {
    try {
      const token = await AsyncStorage.getItem('@auth_token');
      const refreshToken = await AsyncStorage.getItem('@refresh_token');
      const tokenExpiration = await AsyncStorage.getItem('@token_expiration');
      const refreshTokenExpiration = await AsyncStorage.getItem(
        '@refresh_token_expiration'
      );

      console.log('🔍 Estado del token:');
      console.log('Token existe:', !!token);
      console.log('Refresh token existe:', !!refreshToken);
      console.log('Token expira:', tokenExpiration);
      console.log('Refresh token expira:', refreshTokenExpiration);

      if (tokenExpiration) {
        const expDate = new Date(tokenExpiration);
        const now = new Date();
        console.log('Token expirado:', expDate <= now);
        console.log(
          'Tiempo hasta expiración:',
          Math.round((expDate.getTime() - now.getTime()) / 1000 / 60),
          'minutos'
        );
      }

      console.log(
        'AuthService isAuthenticated:',
        authService.isAuthenticated()
      );
    } catch (error) {
      console.error('Error verificando estado del token:', error);
    }
  },

  // Función para probar el refresh manualmente
  async testRefreshToken(): Promise<boolean> {
    try {
      console.log('🧪 Probando refresh token...');
      const result = await authService.checkAndRefreshToken();
      console.log('Resultado del refresh:', result);
      return result;
    } catch (error) {
      console.error('Error en test de refresh:', error);
      return false;
    }
  },

  // Función para limpiar todos los datos de autenticación
  async clearAuthData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        '@auth_token',
        '@refresh_token',
        '@token_expiration',
        '@refresh_token_expiration',
        '@user_data',
        '@user_id',
        '@plan_id',
        '@gym_id',
        '@username',
        '@gym_data',
      ]);
      console.log('🧹 Datos de autenticación limpiados');
    } catch (error) {
      console.error('Error limpiando datos:', error);
    }
  },
};

// Función global para usar en la consola del navegador (solo desarrollo)
if (__DEV__) {
  (global as any).tokenTest = tokenTestUtils;
}
