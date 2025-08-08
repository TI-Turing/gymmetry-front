// Utilidades para probar el refresh token en desarrollo
import { authService } from '@/services/authService';
import { logger } from '@/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const tokenTestUtils = {
  // Función para simular un token expirado (solo para testing)
  async simulateExpiredToken(): Promise<void> {
    try {
      // Establecer una fecha de expiración en el pasado
      const expiredDate = new Date(Date.now() - 60000).toISOString(); // 1 minuto atrás
      await AsyncStorage.setItem('@token_expiration', expiredDate);

      logger.info('🧪 Token marcado como expirado para testing');
    } catch (error) {
      logger.error('Error simulando token expirado:', error);
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

      logger.info('🔍 Estado del token:');
      logger.info('Token existe:', !!token);
      logger.info('Refresh token existe:', !!refreshToken);
      logger.info('Token expira:', tokenExpiration);
      logger.info('Refresh token expira:', refreshTokenExpiration);

      if (tokenExpiration) {
        const expDate = new Date(tokenExpiration);
        const now = new Date();
        logger.info('Token expirado:', expDate <= now);
        logger.info(
          'Tiempo hasta expiración:',
          Math.round((expDate.getTime() - now.getTime()) / 1000 / 60),
          'minutos'
        );
      }

      logger.info(
        'AuthService isAuthenticated:',
        authService.isAuthenticated()
      );
    } catch (error) {
      logger.error('Error verificando estado del token:', error);
    }
  },

  // Función para probar el refresh manualmente
  async testRefreshToken(): Promise<boolean> {
    try {
      logger.info('🧪 Probando refresh token...');
      const result = await authService.checkAndRefreshToken();
      logger.info('Resultado del refresh:', result);
      return result;
    } catch (error) {
      logger.error('Error en test de refresh:', error);
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
      logger.info('🧹 Datos de autenticación limpiados');
    } catch (error) {
      logger.error('Error limpiando datos:', error);
    }
  },
};

// Función global para usar en la consola del navegador (solo desarrollo)
if (__DEV__) {
  (global as any).tokenTest = tokenTestUtils;
}
