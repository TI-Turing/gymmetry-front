// __tests__/utils/formatUtils.test.ts
import {
  formatCurrency,
  formatDateToDisplay,
  formatDateForBackend,
  formatTimeAgo,
  formatNumber,
  capitalizeFirst,
  truncateText,
  formatFileSize,
  formatPercentage,
  capitalizeWords,
  parseDisplayDate,
  formatPhoneDisplay,
  formatPhoneForBackend,
  removeAccents,
  slugify,
} from '../../utils/formatUtils';

describe('Format Utils', () => {
  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(6000)).toBe('$6,000');
      expect(formatCurrency(1000000)).toBe('$1,000,000');
      expect(formatCurrency(0)).toBe('$0');
    });

    it('should handle negative values', () => {
      expect(formatCurrency(-500)).toBe('-$500');
    });

    it('should handle decimal values', () => {
      expect(formatCurrency(99.99)).toBe('$99.99');
    });
  });

  describe('formatDateToDisplay', () => {
    it('should format date to DD/MM/YYYY', () => {
      const date = new Date('2025-09-15T10:30:00');
      expect(formatDateToDisplay(date)).toBe('15/09/2025');
    });

    it('should handle date strings', () => {
      const result = formatDateToDisplay('2025-09-15');
      expect(result).toBe('15/09/2025');
    });

    it('should handle invalid dates', () => {
      expect(formatDateToDisplay('invalid')).toBe('');
    });
  });

  describe('formatDateForBackend', () => {
    it('should format date to YYYY-MM-DD', () => {
      const date = new Date('2025-09-15T10:30:00');
      expect(formatDateForBackend(date)).toBe('2025-09-15');
    });

    it('should handle date strings', () => {
      const result = formatDateForBackend('2025-09-15');
      expect(result).toBe('2025-09-15');
    });
  });

  describe('formatTimeAgo', () => {
    it('should format recent times', () => {
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      const result = formatTimeAgo(fiveMinutesAgo);
      expect(result).toMatch(/hace \d+ minutos?/);
    });

    it('should format hours ago', () => {
      const now = new Date();
      const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
      const result = formatTimeAgo(twoHoursAgo);
      expect(result).toMatch(/hace \d+ horas?/);
    });
  });

  describe('formatNumber', () => {
    it('should format numbers with commas', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1234567)).toBe('1,234,567');
    });

    it('should handle zero', () => {
      expect(formatNumber(0)).toBe('0');
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(1024)).toBe('1.00 KB');
      expect(formatFileSize(1048576)).toBe('1.00 MB');
      expect(formatFileSize(500)).toBe('500.00 B');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentages', () => {
      expect(formatPercentage(0.5)).toBe('50%');
      expect(formatPercentage(0.75)).toBe('75%');
      expect(formatPercentage(1)).toBe('100%');
    });

    it('should handle decimals', () => {
      expect(formatPercentage(0.333, 1)).toBe('33.3%');
    });
  });

  describe('capitalizeFirst', () => {
    it('should capitalize first letter', () => {
      expect(capitalizeFirst('hello')).toBe('Hello');
      expect(capitalizeFirst('world')).toBe('World');
    });

    it('should handle empty strings', () => {
      expect(capitalizeFirst('')).toBe('');
      expect(capitalizeFirst('a')).toBe('A');
    });
  });

  describe('capitalizeWords', () => {
    it('should capitalize all words', () => {
      expect(capitalizeWords('hello world')).toBe('Hello World');
      expect(capitalizeWords('the quick brown fox')).toBe(
        'The Quick Brown Fox'
      );
    });
  });

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const longText = 'This is a very long text that should be truncated';
      expect(truncateText(longText, 20)).toBe('This is a very long...');
    });

    it('should not truncate short text', () => {
      const shortText = 'Short text';
      expect(truncateText(shortText, 20)).toBe('Short text');
    });
  });

  describe('parseDisplayDate', () => {
    it('should parse DD/MM/YYYY format', () => {
      const result = parseDisplayDate('15/09/2025');
      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2025);
      expect(result?.getMonth()).toBe(8); // September is month 8 (0-based)
      expect(result?.getDate()).toBe(15);
    });

    it('should return null for invalid dates', () => {
      expect(parseDisplayDate('invalid')).toBeNull();
      expect(parseDisplayDate('')).toBeNull();
    });
  });

  describe('formatPhoneDisplay', () => {
    it('should format Colombian phone numbers', () => {
      const result = formatPhoneDisplay('3001234567', 'CO');
      expect(result).toMatch(/300 123 4567|\+57 300 123 4567/);
    });
  });

  describe('formatPhoneForBackend', () => {
    it('should clean phone numbers', () => {
      expect(formatPhoneForBackend('300 123 4567')).toBe('3001234567');
      expect(formatPhoneForBackend('+57 300 123 4567')).toBe('573001234567');
    });
  });

  describe('removeAccents', () => {
    it('should remove accents from text', () => {
      expect(removeAccents('José María')).toBe('Jose Maria');
      expect(removeAccents('Niño')).toBe('Nino');
    });
  });

  describe('slugify', () => {
    it('should create URL-friendly slugs', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('José María González')).toBe('jose-maria-gonzalez');
    });
  });
});
