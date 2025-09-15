// __tests__/constants/AppConstants.test.ts
import {
  APP_CONSTANTS,
  UI_CONSTANTS,
  VALIDATION_CONSTANTS,
  API_CONSTANTS,
} from '../../constants/AppConstants';

describe('AppConstants', () => {
  describe('APP_CONSTANTS', () => {
    it('should have app name defined', () => {
      expect(APP_CONSTANTS.NAME).toBeDefined();
      expect(typeof APP_CONSTANTS.NAME).toBe('string');
      expect(APP_CONSTANTS.NAME.length).toBeGreaterThan(0);
    });

    it('should have version defined', () => {
      expect(APP_CONSTANTS.VERSION).toBeDefined();
      expect(typeof APP_CONSTANTS.VERSION).toBe('string');
      expect(APP_CONSTANTS.VERSION).toMatch(/^\d+\.\d+\.\d+/);
    });

    it('should have support email defined', () => {
      expect(APP_CONSTANTS.SUPPORT_EMAIL).toBeDefined();
      expect(typeof APP_CONSTANTS.SUPPORT_EMAIL).toBe('string');
      expect(APP_CONSTANTS.SUPPORT_EMAIL).toContain('@');
    });
  });

  describe('UI_CONSTANTS', () => {
    it('should have border radius values', () => {
      expect(UI_CONSTANTS.BORDER_RADIUS).toBeDefined();
      expect(typeof UI_CONSTANTS.BORDER_RADIUS.SMALL).toBe('number');
      expect(UI_CONSTANTS.BORDER_RADIUS.SMALL).toBeGreaterThan(0);
    });

    it('should have spacing values', () => {
      expect(UI_CONSTANTS.SPACING).toBeDefined();
      expect(typeof UI_CONSTANTS.SPACING.XS).toBe('number');
      expect(UI_CONSTANTS.SPACING.XS).toBeGreaterThan(0);
    });
  });

  describe('VALIDATION_CONSTANTS', () => {
    it('should have password rules', () => {
      expect(VALIDATION_CONSTANTS.PASSWORD).toBeDefined();
      expect(typeof VALIDATION_CONSTANTS.PASSWORD.MIN_LENGTH).toBe('number');
      expect(VALIDATION_CONSTANTS.PASSWORD.MIN_LENGTH).toBeGreaterThan(0);
    });
  });

  describe('API_CONSTANTS', () => {
    it('should have timeout defined', () => {
      expect(API_CONSTANTS.TIMEOUT).toBeDefined();
      expect(typeof API_CONSTANTS.TIMEOUT).toBe('number');
      expect(API_CONSTANTS.TIMEOUT).toBeGreaterThan(0);
    });
  });

  describe('Constants Structure', () => {
    it('should have all main constant groups defined', () => {
      expect(APP_CONSTANTS).toBeDefined();
      expect(UI_CONSTANTS).toBeDefined();
      expect(VALIDATION_CONSTANTS).toBeDefined();
      expect(API_CONSTANTS).toBeDefined();
    });

    it('should not have undefined or null values for defined constants', () => {
      const definedConstants = Object.entries(APP_CONSTANTS).filter(
        ([, value]) => value !== undefined
      );

      definedConstants.forEach(([_key, value]) => {
        expect(value).not.toBeNull();
        expect(value).not.toBeUndefined();

        if (typeof value === 'string') {
          expect(value.length).toBeGreaterThan(0);
        }
      });
    });
  });
});
