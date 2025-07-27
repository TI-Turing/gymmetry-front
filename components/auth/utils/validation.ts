import { PasswordValidation } from '../types';

const NUMERIC_SEQUENCES = /12345|23451|34512|45123|51234/;
const LETTER_SEQUENCES =
  /abcdef|bcdefg|cdefgh|defghi|efghij|fghijk|ABCDEF|BCDEFG|CDEFGH|DEFGHI|EFGHIJ|FGHIJK/;
const VALID_CHARS = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
const HAS_LETTER = /[a-zA-Z]/;
const HAS_NUMBER = /[0-9]/;

export const validatePassword = (password: string, email: string): string[] => {
  const errors: string[] = [];

  if (password.toLowerCase() === email.toLowerCase()) {
    errors.push('La contraseña no puede ser igual al email');
  }

  if (password.length < 8) {
    errors.push('Debe tener al menos 8 caracteres');
  }

  if (password.length > 50) {
    errors.push('No puede tener más de 50 caracteres');
  }

  if (!HAS_LETTER.test(password)) {
    errors.push('Debe contener al menos una letra');
  }

  if (!HAS_NUMBER.test(password)) {
    errors.push('Debe contener al menos un número');
  }

  if (!VALID_CHARS.test(password)) {
    errors.push(
      'Solo se permiten caracteres del alfabeto inglés, números y símbolos básicos (sin espacios)'
    );
  }

  if (NUMERIC_SEQUENCES.test(password)) {
    errors.push('No puede contener secuencias numéricas (12345)');
  }

  if (LETTER_SEQUENCES.test(password)) {
    errors.push('No puede contener secuencias de letras consecutivas (ABCDEF)');
  }

  return errors;
};

export const getPasswordValidation = (
  password: string,
  email: string
): PasswordValidation => {
  const trimmedPassword = password.trim();
  const hasContent = trimmedPassword.length > 0;

  return {
    length: trimmedPassword.length >= 8 && trimmedPassword.length <= 50,
    hasLetter: hasContent && HAS_LETTER.test(trimmedPassword),
    hasNumber: hasContent && HAS_NUMBER.test(trimmedPassword),
    notEqualToEmail:
      hasContent && trimmedPassword.toLowerCase() !== email.toLowerCase(),
    validChars: hasContent && VALID_CHARS.test(trimmedPassword),
    noNumericSequence: hasContent && !NUMERIC_SEQUENCES.test(trimmedPassword),
    noLetterSequence: hasContent && !LETTER_SEQUENCES.test(trimmedPassword),
  };
};

export const isValidEmail = (email: string): boolean => {
  return email.includes('@') && email.includes('.');
};

export const isPasswordValid = (validation: PasswordValidation): boolean => {
  return Object.values(validation).every(Boolean);
};
