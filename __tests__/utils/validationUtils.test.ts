// __tests__/utils/validationUtils.test.ts
import {
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
} from '../../utils/validationUtils';

describe('Validation Utils', () => {
  describe('isValidEmail', () => {
    it('should validate correct email formats', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co')).toBe(true);
      expect(isValidEmail('user+tag@example.org')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('test.domain.com')).toBe(false);
    });

    it('should handle empty strings and null values', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail(' ')).toBe(false);
      expect(isValidEmail(null as string)).toBe(false);
      expect(isValidEmail(undefined as string)).toBe(false);
    });
  });

  describe('getPasswordValidation', () => {
    it('should return detailed password validation', () => {
      const validation = getPasswordValidation('MyPassword123!');
      expect(validation.isValid).toBe(true);
      expect(validation.hasMinLength).toBe(true);
      expect(validation.hasUpperCase).toBe(true);
      expect(validation.hasLowerCase).toBe(true);
      expect(validation.hasNumber).toBe(true);
      expect(validation.hasSpecialChar).toBe(true);
    });

    it('should identify weak passwords', () => {
      const validation = getPasswordValidation('weak');
      expect(validation.isValid).toBe(false);
      expect(validation.hasMinLength).toBe(false);
    });
  });

  describe('isPasswordValid', () => {
    it('should validate strong passwords', () => {
      expect(isPasswordValid('MyPassword123!')).toBe(true);
      expect(isPasswordValid('StrongP@ss1')).toBe(true);
    });

    it('should reject weak passwords', () => {
      expect(isPasswordValid('weak')).toBe(false);
      expect(isPasswordValid('12345678')).toBe(false);
      expect(isPasswordValid('password')).toBe(false);
      expect(isPasswordValid('PASSWORD')).toBe(false);
    });
  });

  describe('isValidPhoneNumber', () => {
    it('should validate Colombian phone numbers', () => {
      expect(isValidPhoneNumber('3001234567')).toBe(true);
      expect(isValidPhoneNumber('300 123 4567')).toBe(true);
      expect(isValidPhoneNumber('+57 300 123 4567')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(isValidPhoneNumber('123')).toBe(false);
      expect(isValidPhoneNumber('abc123456')).toBe(false);
      expect(isValidPhoneNumber('')).toBe(false);
    });
  });

  describe('isValidUsername', () => {
    it('should validate proper usernames', () => {
      expect(isValidUsername('user123')).toBe(true);
      expect(isValidUsername('test_user')).toBe(true);
      expect(isValidUsername('validuser')).toBe(true);
    });

    it('should reject invalid usernames', () => {
      expect(isValidUsername('us')).toBe(false); // too short
      expect(isValidUsername('user@name')).toBe(false); // special chars
      expect(isValidUsername('')).toBe(false);
    });
  });

  describe('isValidName', () => {
    it('should validate proper names', () => {
      expect(isValidName('John Doe')).toBe(true);
      expect(isValidName('María García')).toBe(true);
      expect(isValidName('José')).toBe(true);
    });

    it('should reject invalid names', () => {
      expect(isValidName('J')).toBe(false); // too short
      expect(isValidName('123Name')).toBe(false); // starts with number
      expect(isValidName('')).toBe(false);
    });
  });

  describe('isRequired', () => {
    it('should validate required fields', () => {
      expect(isRequired('value')).toBe(true);
      expect(isRequired('0')).toBe(true);
      expect(isRequired(0)).toBe(true);
      expect(isRequired(false)).toBe(true);
    });

    it('should reject empty values', () => {
      expect(isRequired('')).toBe(false);
      expect(isRequired(' ')).toBe(false);
      expect(isRequired(null)).toBe(false);
      expect(isRequired(undefined)).toBe(false);
    });
  });

  describe('isValidDate', () => {
    it('should validate correct dates', () => {
      expect(isValidDate('2024-01-15')).toBe(true);
      expect(isValidDate('2023-12-31')).toBe(true);
    });

    it('should reject invalid dates', () => {
      expect(isValidDate('invalid-date')).toBe(false);
      expect(isValidDate('2024-13-01')).toBe(false);
      expect(isValidDate('')).toBe(false);
    });
  });

  describe('isValidAge', () => {
    it('should validate age based on birth date', () => {
      const eighteenYearsAgo = new Date();
      eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
      const birthDate = eighteenYearsAgo.toISOString().split('T')[0];

      expect(isValidAge(birthDate, 13)).toBe(true);
    });

    it('should reject underage users', () => {
      const tenYearsAgo = new Date();
      tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);
      const birthDate = tenYearsAgo.toISOString().split('T')[0];

      expect(isValidAge(birthDate, 13)).toBe(false);
    });
  });

  describe('isValidOTP', () => {
    it('should validate OTP codes', () => {
      expect(isValidOTP('123456')).toBe(true);
      expect(isValidOTP('0000')).toBe(true);
      expect(isValidOTP('12345', 5)).toBe(true);
    });

    it('should reject invalid OTP codes', () => {
      expect(isValidOTP('12345')).toBe(false); // wrong length
      expect(isValidOTP('abc123')).toBe(false); // non-numeric
      expect(isValidOTP('')).toBe(false);
    });
  });

  describe('isValidDocumentNumber', () => {
    it('should validate document numbers', () => {
      expect(isValidDocumentNumber('12345678')).toBe(true);
      expect(isValidDocumentNumber('1234567890')).toBe(true);
    });

    it('should reject invalid document numbers', () => {
      expect(isValidDocumentNumber('123')).toBe(false); // too short
      expect(isValidDocumentNumber('abc123')).toBe(false); // non-numeric
      expect(isValidDocumentNumber('')).toBe(false);
    });
  });

  describe('validateField', () => {
    it('should validate fields with custom rules', () => {
      const result = validateField('test@example.com', { email: true });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return errors for invalid fields', () => {
      const result = validateField('', { required: true });
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should validate multiple rules', () => {
      const result = validateField('test@example.com', {
        required: true,
        email: true,
        minLength: 5,
      });
      expect(result.isValid).toBe(true);
    });

    it('should validate with custom function', () => {
      const customValidator = (value: unknown) =>
        typeof value === 'string' && value.includes('test');
      const result = validateField('test123', { custom: customValidator });
      expect(result.isValid).toBe(true);
    });
  });
});
