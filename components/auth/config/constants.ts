// Configuración y constantes de autenticación

// Configuración de validación
export const VALIDATION_CONFIG = {
  password: {
    minLength: 8,
    maxLength: 50,
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  phone: {
    minLength: 7,
    maxLength: 15,
  },
} as const;

// Mensajes de error
export const ERROR_MESSAGES = {
  required: 'Este campo es obligatorio',
  invalidEmail: 'Por favor ingresa un email válido',
  invalidPassword: 'La contraseña no cumple con los requisitos',
  passwordMismatch: 'Las contraseñas no coinciden',
  networkError: 'Error de conexión. Verifica tu internet.',
  genericError: 'Ha ocurrido un error. Intenta nuevamente.',
} as const;

// Configuración de pasos
export const REGISTRATION_STEPS = {
  total: 4,
  titles: ['Cuenta', 'Datos', 'Ubicación', 'Fitness'],
} as const;
