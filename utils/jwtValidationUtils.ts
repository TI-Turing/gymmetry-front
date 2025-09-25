// Utilidades específicas para validar JWT y estado de autenticación durante testing
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '@/services/authService';
import { logger } from '@/utils/logger';

/**
 * Estructura esperada del JWT payload
 */
interface JWTPayload {
  sub?: string; // Usuario ID
  email?: string;
  exp?: number; // Timestamp de expiración
  iat?: number; // Timestamp de emisión
  roles?: string[];
  gymId?: string;
  [key: string]: unknown;
}

/**
 * Resultado de la validación del JWT
 */
interface JWTValidationResult {
  isValid: boolean;
  isExpired: boolean;
  payload: JWTPayload | null;
  errors: string[];
  timeUntilExpiry?: number; // Segundos hasta expiración
  issueTime?: Date;
  expiryTime?: Date;
}

export const jwtValidationUtils = {
  /**
   * Decodifica el JWT sin verificar la firma (solo para testing)
   */
  decodeJWT(token: string): JWTPayload | null {
    try {
      if (!token || typeof token !== 'string') {
        return null;
      }

      const parts = token.split('.');
      if (parts.length !== 3) {
        logger.error('🚨 JWT inválido: no tiene 3 partes');
        return null;
      }

      // Decodificar el payload (segunda parte)
      const payload = parts[1];
      const decodedPayload = atob(
        payload.replace(/-/g, '+').replace(/_/g, '/')
      );

      return JSON.parse(decodedPayload) as JWTPayload;
    } catch (error) {
      logger.error('🚨 Error decodificando JWT:', error);
      return null;
    }
  },

  /**
   * Valida completamente el JWT almacenado
   */
  async validateStoredJWT(): Promise<JWTValidationResult> {
    const result: JWTValidationResult = {
      isValid: false,
      isExpired: false,
      payload: null,
      errors: [],
    };

    try {
      // 1. Verificar que existe el token
      const token = await AsyncStorage.getItem('@auth_token');
      if (!token) {
        result.errors.push('Token no encontrado en AsyncStorage');
        return result;
      }

      logger.info('✅ Token encontrado en storage');

      // 2. Decodificar el token
      const payload = this.decodeJWT(token);
      if (!payload) {
        result.errors.push('No se pudo decodificar el token');
        return result;
      }

      result.payload = payload;
      logger.info('✅ Token decodificado correctamente');

      // 3. Validar estructura básica (solo campos críticos)
      if (!payload.sub && !payload.email) {
        result.errors.push(
          'Token no contiene identificador de usuario (sub o email)'
        );
      }

      if (!payload.exp) {
        result.errors.push('Token no contiene fecha de expiración');
      }

      // iat no es crítico, solo advertir si no está presente
      if (!payload.iat) {
        logger.warn(
          '⚠️ Token no contiene fecha de emisión (iat), pero continúa validación'
        );
      }

      // 4. Verificar expiración
      if (payload.exp) {
        const now = Math.floor(Date.now() / 1000);
        result.isExpired = payload.exp <= now;
        result.timeUntilExpiry = payload.exp - now;
        result.expiryTime = new Date(payload.exp * 1000);

        if (result.isExpired) {
          result.errors.push(
            `Token expirado desde hace ${Math.abs(result.timeUntilExpiry)} segundos`
          );
          logger.warn('⚠️ Token expirado');
        } else {
          logger.info(
            `✅ Token válido por ${result.timeUntilExpiry} segundos más`
          );
        }
      }

      // 5. Verificar fecha de emisión
      if (payload.iat) {
        result.issueTime = new Date(payload.iat * 1000);
        logger.info(`📅 Token emitido: ${result.issueTime.toISOString()}`);
      }

      // 6. Validar roles si existen
      if (payload.roles && Array.isArray(payload.roles)) {
        logger.info(`👤 Roles del usuario: ${payload.roles.join(', ')}`);
      }

      // 7. El token es válido si no hay errores críticos y no está expirado
      result.isValid = result.errors.length === 0 && !result.isExpired;

      return result;
    } catch (error) {
      result.errors.push(`Error validando token: ${error}`);
      logger.error('🚨 Error en validación de JWT:', error);
      return result;
    }
  },

  /**
   * Compara el token con los datos del AuthService
   */
  async validateAuthServiceConsistency(): Promise<{
    isConsistent: boolean;
    issues: string[];
    authServiceData: unknown;
    tokenData: JWTPayload | null;
  }> {
    const issues: string[] = [];

    try {
      // Obtener datos del AuthService (await porque es async)
      const authServiceData = await authService.getUserData();
      const isAuthenticated = authService.isAuthenticated();

      // Obtener datos del token
      const jwtValidation = await this.validateStoredJWT();

      logger.info('🔍 Comparando AuthService vs JWT...');

      // Verificar consistencia
      if (!isAuthenticated && jwtValidation.isValid) {
        issues.push('AuthService dice no autenticado pero JWT es válido');
      }

      if (isAuthenticated && !jwtValidation.isValid) {
        issues.push('AuthService dice autenticado pero JWT es inválido');
      }

      if (authServiceData && jwtValidation.payload) {
        // Comparar IDs de usuario
        if (authServiceData.id !== jwtValidation.payload.sub) {
          issues.push(
            `ID de usuario inconsistente: AuthService=${authServiceData.id}, JWT=${jwtValidation.payload.sub}`
          );
        }

        // Comparar emails
        if (authServiceData.email !== jwtValidation.payload.email) {
          issues.push(
            `Email inconsistente: AuthService=${authServiceData.email}, JWT=${jwtValidation.payload.email}`
          );
        }
      }

      return {
        isConsistent: issues.length === 0,
        issues,
        authServiceData,
        tokenData: jwtValidation.payload,
      };
    } catch (error) {
      issues.push(`Error verificando consistencia: ${error}`);
      return {
        isConsistent: false,
        issues,
        authServiceData: null,
        tokenData: null,
      };
    }
  },

  /**
   * Genera un reporte completo del estado de autenticación
   */
  async generateAuthReport(): Promise<void> {
    logger.info('🔍 =============== REPORTE DE AUTENTICACIÓN ===============');

    // 1. Estado del AuthService
    const authServiceData = authService.getUserData();
    const isAuthenticated = authService.isAuthenticated();

    logger.info('📊 Estado del AuthService:');
    logger.info(`   - Autenticado: ${isAuthenticated}`);
    logger.info(
      `   - Datos de usuario: ${JSON.stringify(authServiceData, null, 2)}`
    );

    // 2. Validación del JWT
    const jwtValidation = await this.validateStoredJWT();
    logger.info('🔐 Validación del JWT:');
    logger.info(`   - Es válido: ${jwtValidation.isValid}`);
    logger.info(`   - Está expirado: ${jwtValidation.isExpired}`);

    if (jwtValidation.timeUntilExpiry !== undefined) {
      const minutes = Math.floor(jwtValidation.timeUntilExpiry / 60);
      const seconds = jwtValidation.timeUntilExpiry % 60;
      logger.info(`   - Tiempo hasta expiración: ${minutes}m ${seconds}s`);
    }

    if (jwtValidation.payload) {
      logger.info(`   - Usuario ID: ${jwtValidation.payload.sub}`);
      logger.info(`   - Email: ${jwtValidation.payload.email}`);
      logger.info(
        `   - Roles: ${jwtValidation.payload.roles?.join(', ') || 'N/A'}`
      );
      logger.info(`   - Gym ID: ${jwtValidation.payload.gymId || 'N/A'}`);
    }

    if (jwtValidation.errors.length > 0) {
      logger.error('❌ Errores en JWT:');
      jwtValidation.errors.forEach((error) => logger.error(`   - ${error}`));
    }

    // 3. Consistencia
    const consistency = await this.validateAuthServiceConsistency();
    logger.info('⚖️ Consistencia AuthService vs JWT:');
    logger.info(`   - Es consistente: ${consistency.isConsistent}`);

    if (consistency.issues.length > 0) {
      logger.error('❌ Problemas de consistencia:');
      consistency.issues.forEach((issue) => logger.error(`   - ${issue}`));
    }

    // 4. Datos en AsyncStorage
    logger.info('💾 Datos en AsyncStorage:');
    const keys = [
      '@auth_token',
      '@refresh_token',
      '@token_expiration',
      '@refresh_token_expiration',
      '@user_data',
      '@user_id',
    ];

    for (const key of keys) {
      const value = await AsyncStorage.getItem(key);
      logger.info(`   - ${key}: ${value ? '✅ Presente' : '❌ Ausente'}`);
    }

    logger.info('🔍 ======================================================');
  },
};

// Solo en desarrollo: exponer utilidades globalmente
if (__DEV__) {
  (globalThis as Record<string, unknown>).jwtValidation = jwtValidationUtils;
}
