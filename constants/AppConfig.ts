/**
 * Constantes de configuración de la aplicación
 */

export const APP_CONFIG = {
  // API Configuration
  REQUEST_TIMEOUT: 30000, // 30 segundos
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 segundo

  // Storage Keys
  STORAGE_KEYS: {
    ACCESS_TOKEN: '@access_token',
    REFRESH_TOKEN: '@refresh_token',
    USER_DATA: '@user_data',
    GYM_DATA: '@gym_data',
    APP_PREFERENCES: '@app_preferences',
    THEME_PREFERENCE: '@theme_preference',
  },

  // Environment
  ENVIRONMENTS: {
    LOCAL: 'local',
    DEVELOPMENT: 'development',
    STAGING: 'staging',
    PRODUCTION: 'production',
  },

  // Navigation
  NAVIGATION: {
    HEADER_HEIGHT: 56,
    TAB_BAR_HEIGHT: 60,
    SAFE_AREA_PADDING: 20,
  },

  // Form Validation
  VALIDATION: {
    MIN_PASSWORD_LENGTH: 8,
    MAX_PASSWORD_LENGTH: 128,
    MIN_USERNAME_LENGTH: 3,
    MAX_USERNAME_LENGTH: 50,
    PHONE_REGEX: /^[+]?[\d\s\-\(\)]+$/,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },

  // Image Configuration
  IMAGE: {
    MAX_SIZE_MB: 5,
    MAX_WIDTH: 1920,
    MAX_HEIGHT: 1080,
    QUALITY: 0.8,
    SUPPORTED_FORMATS: ['jpg', 'jpeg', 'png', 'webp'],
  },

  // Performance
  PERFORMANCE: {
    DEBOUNCE_DELAY: 300,
    THROTTLE_DELAY: 1000,
    PAGINATION_SIZE: 20,
    MAX_CACHE_SIZE: 100,
  },
} as const;

export const MESSAGES = {
  ERROR: {
    NETWORK: 'Error de conexión. Verifica tu conexión a internet.',
    TIMEOUT: 'La operación tardó demasiado tiempo. Inténtalo de nuevo.',
    UNAUTHORIZED: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
    FORBIDDEN: 'No tienes permisos para realizar esta acción.',
    NOT_FOUND: 'El recurso solicitado no fue encontrado.',
    SERVER_ERROR: 'Error interno del servidor. Inténtalo más tarde.',
    VALIDATION_ERROR: 'Por favor, verifica los datos ingresados.',
    UNKNOWN_ERROR: 'Ha ocurrido un error inesperado.',
  },
  SUCCESS: {
    SAVE: 'Guardado exitosamente',
    UPDATE: 'Actualizado exitosamente',
    DELETE: 'Eliminado exitosamente',
    LOGIN: 'Sesión iniciada correctamente',
    LOGOUT: 'Sesión cerrada correctamente',
    REGISTER: 'Registro completado exitosamente',
    PASSWORD_RESET: 'Se ha enviado un enlace para restablecer tu contraseña',
  },
} as const;
