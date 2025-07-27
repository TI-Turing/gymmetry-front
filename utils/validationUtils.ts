import { VALIDATION_CONSTANTS } from '@/constants';
import { PasswordValidation, ValidationResult } from '@/types';

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') {
    return false;
  }
  return VALIDATION_CONSTANTS.EMAIL.PATTERN.test(email.trim());
};

/**
 * Validates password strength
 */
export const getPasswordValidation = (password: string): PasswordValidation => {
  const hasMinLength =
    password.length >= VALIDATION_CONSTANTS.PASSWORD.MIN_LENGTH;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[@$!%*?&]/.test(password);

  const isValid =
    hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

  return {
    hasMinLength,
    hasUpperCase,
    hasLowerCase,
    hasNumber,
    hasSpecialChar,
    isValid,
  };
};

/**
 * Validates if password meets all requirements
 */
export const isPasswordValid = (password: string): boolean => {
  return getPasswordValidation(password).isValid;
};

/**
 * Validates phone number format
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  if (!phone || typeof phone !== 'string') {
    return false;
  }

  const cleanPhone = phone.replace(/\D/g, '');
  return (
    cleanPhone.length >= VALIDATION_CONSTANTS.PHONE.MIN_LENGTH &&
    cleanPhone.length <= VALIDATION_CONSTANTS.PHONE.MAX_LENGTH
  );
};

/**
 * Validates username format
 */
export const isValidUsername = (username: string): boolean => {
  if (!username || typeof username !== 'string') {
    return false;
  }

  const trimmedUsername = username.trim();
  return (
    trimmedUsername.length >= VALIDATION_CONSTANTS.USERNAME.MIN_LENGTH &&
    trimmedUsername.length <= VALIDATION_CONSTANTS.USERNAME.MAX_LENGTH &&
    VALIDATION_CONSTANTS.USERNAME.PATTERN.test(trimmedUsername)
  );
};

/**
 * Validates name format (first name, last name)
 */
export const isValidName = (name: string): boolean => {
  if (!name || typeof name !== 'string') {
    return false;
  }

  const trimmedName = name.trim();
  return (
    trimmedName.length >= VALIDATION_CONSTANTS.NAME.MIN_LENGTH &&
    trimmedName.length <= VALIDATION_CONSTANTS.NAME.MAX_LENGTH &&
    VALIDATION_CONSTANTS.NAME.PATTERN.test(trimmedName)
  );
};

/**
 * Validates required field
 */
export const isRequired = (value: any): boolean => {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return Boolean(value);
};

/**
 * Validates date format and range
 */
export const isValidDate = (dateString: string): boolean => {
  if (!dateString) {
    return false;
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return false;
  }

  // Check if date is not in the future
  const today = new Date();
  if (date > today) {
    return false;
  }

  // Check if date is not too old (e.g., more than 120 years ago)
  const minDate = new Date();
  minDate.setFullYear(today.getFullYear() - 120);
  if (date < minDate) {
    return false;
  }

  return true;
};

/**
 * Validates age based on birth date
 */
export const isValidAge = (birthDate: string, minAge: number = 13): boolean => {
  if (!isValidDate(birthDate)) {
    return false;
  }

  const today = new Date();
  const birth = new Date(birthDate);
  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    return age - 1 >= minAge;
  }

  return age >= minAge;
};

/**
 * Validates OTP code format
 */
export const isValidOTP = (otp: string, length: number = 6): boolean => {
  if (!otp || typeof otp !== 'string') {
    return false;
  }

  const cleanOTP = otp.replace(/\D/g, '');
  return cleanOTP.length === length;
};

/**
 * Validates document number format
 */
export const isValidDocumentNumber = (documentNumber: string): boolean => {
  if (!documentNumber || typeof documentNumber !== 'string') {
    return false;
  }

  const cleanDocument = documentNumber.replace(/\D/g, '');
  return cleanDocument.length >= 6 && cleanDocument.length <= 20;
};

/**
 * Generic field validator
 */
export const validateField = (
  value: any,
  rules: {
    required?: boolean;
    email?: boolean;
    phone?: boolean;
    username?: boolean;
    name?: boolean;
    password?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => boolean;
  }
): ValidationResult => {
  const errors: string[] = [];

  // Required validation
  if (rules.required && !isRequired(value)) {
    errors.push('Este campo es requerido');
    return { isValid: false, errors };
  }

  // Skip other validations if value is empty and not required
  if (!isRequired(value)) {
    return { isValid: true, errors: [] };
  }

  // Email validation
  if (rules.email && !isValidEmail(value)) {
    errors.push('Ingresa un email válido');
  }

  // Phone validation
  if (rules.phone && !isValidPhoneNumber(value)) {
    errors.push('Ingresa un número de teléfono válido');
  }

  // Username validation
  if (rules.username && !isValidUsername(value)) {
    errors.push(
      'El nombre de usuario debe tener entre 3-30 caracteres y solo contener letras, números y guiones bajos'
    );
  }

  // Name validation
  if (rules.name && !isValidName(value)) {
    errors.push('Ingresa un nombre válido (solo letras y espacios)');
  }

  // Password validation
  if (rules.password && !isPasswordValid(value)) {
    errors.push(
      'La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y símbolos'
    );
  }

  // Length validations
  if (rules.minLength && value.length < rules.minLength) {
    errors.push(`Debe tener al menos ${rules.minLength} caracteres`);
  }

  if (rules.maxLength && value.length > rules.maxLength) {
    errors.push(`No puede tener más de ${rules.maxLength} caracteres`);
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(value)) {
    errors.push('Formato inválido');
  }

  // Custom validation
  if (rules.custom && !rules.custom(value)) {
    errors.push('Valor inválido');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export default {
  isValidEmail,
  getPasswordValidation,
  isPasswordValid,
  isValidPhoneNumber,
  isValidUsername,
  isValidName,
  isRequired,
  isValidDate,
  isValidAge,
  isValidOTP,
  isValidDocumentNumber,
  validateField,
};
