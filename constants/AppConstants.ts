// UI Constants
export const UI_CONSTANTS = {
  BORDER_RADIUS: {
    SMALL: 4,
    MEDIUM: 8,
    LARGE: 12,
    EXTRA_LARGE: 16,
  },
  SPACING: {
    XS: 4,
    SM: 8,
    MD: 16,
    LG: 24,
    XL: 32,
    XXL: 48,
  },
  FONT_SIZE: {
    XS: 12,
    SM: 14,
    MD: 16,
    LG: 18,
    XL: 20,
    XXL: 24,
    XXXL: 32,
  },
  FONT_WEIGHT: {
    NORMAL: '400' as const,
    MEDIUM: '500' as const,
    SEMIBOLD: '600' as const,
    BOLD: '700' as const,
  },
  OPACITY: {
    DISABLED: 0.6,
    OVERLAY: 0.5,
    LIGHT: 0.7,
  },
  Z_INDEX: {
    MODAL: 1000,
    OVERLAY: 999,
    DROPDOWN: 100,
    HEADER: 50,
  },
} as const;

// Form validation constants
export const VALIDATION_CONSTANTS = {
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  PHONE: {
    MIN_LENGTH: 7,
    MAX_LENGTH: 15,
  },
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 30,
    PATTERN: /^[a-zA-Z0-9_]+$/,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ\s]+$/,
  },
} as const;

// API constants
export const API_CONSTANTS = {
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      VERIFY_PHONE: '/auth/verify-phone',
      VERIFY_OTP: '/auth/verify-otp',
      REFRESH_TOKEN: '/auth/refresh',
    },
    USER: {
      PROFILE: '/user/profile',
      UPDATE_PROFILE: '/user/profile',
      UPLOAD_IMAGE: '/user/upload-image',
      CHECK_USERNAME: '/user/check-username',
    },
    CATALOGS: {
      COUNTRIES: '/catalogs/countries',
      REGIONS: '/catalogs/regions',
      CITIES: '/catalogs/cities',
      GENDERS: '/catalogs/genders',
      DOCUMENT_TYPES: '/catalogs/document-types',
      EPS: '/catalogs/eps',
    },
  },
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// Application constants
export const APP_CONSTANTS = {
  NAME: 'GYMMETRY',
  VERSION: '1.0.0',
  SUPPORT_EMAIL: 'support@gymmetry.com',
  TERMS_URL: 'https://gymmetry.com/terms',
  PRIVACY_URL: 'https://gymmetry.com/privacy',
} as const;

// Image processing constants
export const IMAGE_CONSTANTS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_WIDTH: 1024,
  MAX_HEIGHT: 1024,
  QUALITY: 0.8,
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
} as const;

// Animation constants
export const ANIMATION_CONSTANTS = {
  DURATION: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
  },
  EASING: {
    EASE_OUT: 'ease-out',
    EASE_IN: 'ease-in',
    EASE_IN_OUT: 'ease-in-out',
  },
} as const;

// Storage keys
export const STORAGE_KEYS = {
  USER_TOKEN: '@gymmetry/user_token',
  USER_REFRESH_TOKEN: '@gymmetry/user_refresh_token',
  USER_DATA: '@gymmetry/user_data',
  USER_PREFERENCES: '@gymmetry/user_preferences',
  COUNTRY_DATA: '@gymmetry/country_data',
  ONBOARDING_COMPLETED: '@gymmetry/onboarding_completed',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NETWORK: 'Error de conexión. Verifica tu internet e intenta nuevamente.',
  TIMEOUT: 'La operación tardó demasiado. Intenta nuevamente.',
  GENERIC: 'Ha ocurrido un error inesperado. Intenta nuevamente.',
  VALIDATION: {
    REQUIRED_FIELD: 'Este campo es requerido',
    INVALID_EMAIL: 'Ingresa un email válido',
    INVALID_PHONE: 'Ingresa un número de teléfono válido',
    WEAK_PASSWORD:
      'La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y símbolos',
    PASSWORDS_DONT_MATCH: 'Las contraseñas no coinciden',
    INVALID_OTP: 'Código de verificación inválido',
    USERNAME_TAKEN: 'Este nombre de usuario ya está en uso',
  },
  AUTH: {
    INVALID_CREDENTIALS: 'Email o contraseña incorrectos',
    ACCOUNT_DISABLED: 'Esta cuenta ha sido deshabilitada',
    ACCOUNT_NOT_VERIFIED: 'Debes verificar tu cuenta antes de continuar',
    SESSION_EXPIRED: 'Tu sesión ha expirado. Inicia sesión nuevamente',
  },
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: 'Perfil actualizado correctamente',
  IMAGE_UPLOADED: 'Imagen subida correctamente',
  PHONE_VERIFIED: 'Teléfono verificado correctamente',
  REGISTRATION_COMPLETE: 'Registro completado exitosamente',
  LOGIN_SUCCESS: 'Sesión iniciada correctamente',
} as const;

export default {
  UI_CONSTANTS,
  VALIDATION_CONSTANTS,
  API_CONSTANTS,
  APP_CONSTANTS,
  IMAGE_CONSTANTS,
  ANIMATION_CONSTANTS,
  STORAGE_KEYS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
};
