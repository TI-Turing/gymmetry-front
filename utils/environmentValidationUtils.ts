// Utilidades para validar configuración de variables de entorno durante testing
/* eslint-disable expo/no-dynamic-env-var */
import { logger } from '@/utils/logger';

/**
 * Configuración de variables esperadas por ambiente
 */
interface EnvironmentConfig {
  required: string[];
  optional: string[];
  expectedValues?: Record<string, string | RegExp>;
}

/**
 * Resultado de la validación de variables de entorno
 */
interface EnvironmentValidationResult {
  isValid: boolean;
  environment: string;
  missingRequired: string[];
  missingOptional: string[];
  invalidValues: {
    key: string;
    value: string | undefined;
    expected: string | RegExp;
  }[];
  warnings: string[];
  summary: {
    total: number;
    present: number;
    missing: number;
    valid: number;
  };
}

const ENVIRONMENT_CONFIGS: Record<string, EnvironmentConfig> = {
  local: {
    required: [
      'EXPO_PUBLIC_API_BASE_URL',
      'EXPO_PUBLIC_API_MAIN_FUNCTIONS_KEY',
      'EXPO_PUBLIC_ENV',
    ],
    optional: [
      'EXPO_PUBLIC_DEBUG',
      'EXPO_PUBLIC_LOG_LEVEL',
      'EXPO_PUBLIC_ENABLE_ANALYTICS',
    ],
    expectedValues: {
      EXPO_PUBLIC_ENV: 'local',
      EXPO_PUBLIC_API_BASE_URL: /^https?:\/\/.+/,
    },
  },
  development: {
    required: [
      'EXPO_PUBLIC_API_BASE_URL',
      'EXPO_PUBLIC_API_MAIN_FUNCTIONS_KEY',
      'EXPO_PUBLIC_ENV',
    ],
    optional: [
      'EXPO_PUBLIC_DEBUG',
      'EXPO_PUBLIC_LOG_LEVEL',
      'EXPO_PUBLIC_ENABLE_ANALYTICS',
      'EXPO_PUBLIC_SENTRY_DSN',
    ],
    expectedValues: {
      EXPO_PUBLIC_ENV: 'development',
      EXPO_PUBLIC_API_BASE_URL: /^https:\/\/.+/,
    },
  },
  production: {
    required: [
      'EXPO_PUBLIC_API_BASE_URL',
      'EXPO_PUBLIC_API_MAIN_FUNCTIONS_KEY',
      'EXPO_PUBLIC_ENV',
    ],
    optional: ['EXPO_PUBLIC_SENTRY_DSN', 'EXPO_PUBLIC_ENABLE_ANALYTICS'],
    expectedValues: {
      EXPO_PUBLIC_ENV: 'production',
      EXPO_PUBLIC_API_BASE_URL: /^https:\/\/.+/,
    },
  },
};

export const environmentValidationUtils = {
  /**
   * Obtiene el valor de una variable de entorno desde process.env
   */
  getEnvVar(key: string): string | undefined {
    return process.env[key];
  },

  /**
   * Obtiene todas las variables EXPO_PUBLIC_*
   */
  getAllExpoPublicVars(): Record<string, string | undefined> {
    const expoVars: Record<string, string | undefined> = {};

    for (const key in process.env) {
      if (key.startsWith('EXPO_PUBLIC_')) {
        expoVars[key] = process.env[key];
      }
    }

    return expoVars;
  },

  /**
   * Determina el ambiente actual basado en variables
   */
  getCurrentEnvironment(): string {
    const expoEnv = process.env.EXPO_PUBLIC_ENV || 'local';
    return expoEnv;
  },

  /**
   * Valida las variables de entorno para el ambiente actual
   */
  validateCurrentEnvironment(): EnvironmentValidationResult {
    const currentEnv = this.getCurrentEnvironment();
    return this.validateEnvironment(currentEnv);
  },

  /**
   * Valida las variables de entorno para un ambiente específico
   */
  validateEnvironment(environment: string): EnvironmentValidationResult {
    const config = ENVIRONMENT_CONFIGS[environment];

    if (!config) {
      return {
        isValid: false,
        environment,
        missingRequired: [],
        missingOptional: [],
        invalidValues: [],
        warnings: [`Ambiente desconocido: ${environment}`],
        summary: {
          total: 0,
          present: 0,
          missing: 0,
          valid: 0,
        },
      };
    }

    const missingRequired: string[] = [];
    const missingOptional: string[] = [];
    const invalidValues: {
      key: string;
      value: string | undefined;
      expected: string | RegExp;
    }[] = [];
    const warnings: string[] = [];

    const allVars = [...config.required, ...config.optional];
    let present = 0;
    let valid = 0;

    // Validar variables requeridas
    for (const key of config.required) {
      const value = process.env[key];

      if (!value) {
        missingRequired.push(key);
      } else {
        present++;

        // Validar valor esperado si está configurado
        if (config.expectedValues?.[key]) {
          const expected = config.expectedValues[key];

          if (typeof expected === 'string') {
            if (value !== expected) {
              invalidValues.push({ key, value, expected });
            } else {
              valid++;
            }
          } else if (expected instanceof RegExp) {
            if (!expected.test(value)) {
              invalidValues.push({ key, value, expected });
            } else {
              valid++;
            }
          }
        } else {
          valid++;
        }
      }
    }

    // Validar variables opcionales
    for (const key of config.optional) {
      const value = process.env[key];

      if (!value) {
        missingOptional.push(key);
      } else {
        present++;

        // Validar valor esperado si está configurado
        if (config.expectedValues?.[key]) {
          const expected = config.expectedValues[key];

          if (typeof expected === 'string') {
            if (value !== expected) {
              invalidValues.push({ key, value, expected });
            } else {
              valid++;
            }
          } else if (expected instanceof RegExp) {
            if (!expected.test(value)) {
              invalidValues.push({ key, value, expected });
            } else {
              valid++;
            }
          }
        } else {
          valid++;
        }
      }
    }

    // Generar warnings adicionales
    if (missingRequired.length > 0) {
      warnings.push(`Faltan ${missingRequired.length} variables requeridas`);
    }

    if (invalidValues.length > 0) {
      warnings.push(
        `${invalidValues.length} variables tienen valores inválidos`
      );
    }

    const isValid = missingRequired.length === 0 && invalidValues.length === 0;

    return {
      isValid,
      environment,
      missingRequired,
      missingOptional,
      invalidValues,
      warnings,
      summary: {
        total: allVars.length,
        present,
        missing: allVars.length - present,
        valid,
      },
    };
  },

  /**
   * Genera un reporte completo de las variables de entorno
   */
  generateEnvironmentReport(): EnvironmentValidationResult {
    const validation = this.validateCurrentEnvironment();

    logger.info('🌍 ============ REPORTE DE VARIABLES DE ENTORNO ============');

    // 1. Ambiente actual
    const currentEnv = this.getCurrentEnvironment();

    logger.info('📊 Configuración del Ambiente:');
    logger.info(`   - EXPO_PUBLIC_ENV: ${currentEnv}`);
    logger.info(`   - Ambiente detectado: ${currentEnv}`);

    // 2. Validación del ambiente actual
    logger.info('✅ Validación de Variables:');
    logger.info(`   - Es válido: ${validation.isValid}`);
    logger.info(`   - Total de variables: ${validation.summary.total}`);
    logger.info(`   - Presentes: ${validation.summary.present}`);
    logger.info(`   - Faltantes: ${validation.summary.missing}`);

    // 3. Variables faltantes
    if (validation.missingRequired.length > 0) {
      logger.warn('⚠️ Variables REQUERIDAS faltantes:');
      validation.missingRequired.forEach((key) => {
        logger.warn(`   - ${key}`);
      });
    }

    if (validation.missingOptional.length > 0) {
      logger.info('ℹ️ Variables opcionales faltantes:');
      validation.missingOptional.forEach((key) => {
        logger.info(`   - ${key}`);
      });
    }

    // 4. Valores inválidos
    if (validation.invalidValues.length > 0) {
      logger.error('❌ Variables con valores inválidos:');
      validation.invalidValues.forEach((invalid) => {
        logger.error(
          `   - ${invalid.key}: "${invalid.value}" (esperado: ${invalid.expected})`
        );
      });
    }

    // 5. Warnings
    if (validation.warnings.length > 0) {
      logger.warn('⚠️ Advertencias:');
      validation.warnings.forEach((warning) => {
        logger.warn(`   - ${warning}`);
      });
    }

    logger.info('🌍 =======================================================');

    return validation;
  },
};

// Solo en desarrollo: exponer utilidades globalmente
if (__DEV__) {
  (globalThis as Record<string, unknown>).envValidation =
    environmentValidationUtils;
}
