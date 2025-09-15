// __tests__/utils/securityUtils.test.ts
import {
  sanitizeContent,
  sanitizeText,
  isValidContent,
  sanitizeTitle,
  isValidTitle,
} from '../../utils/securityUtils';

describe('Security Utils', () => {
  describe('sanitizeContent', () => {
    it('should remove dangerous HTML tags', () => {
      const maliciousContent =
        '<script>alert("xss")</script><p>Safe content</p>';
      const sanitized = sanitizeContent(maliciousContent);
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toContain('Safe content');
    });

    it('should preserve safe HTML tags', () => {
      const safeContent = '<p>Hello <strong>world</strong></p>';
      const sanitized = sanitizeContent(safeContent);
      expect(sanitized).toContain('<p>');
      expect(sanitized).toContain('<strong>');
      expect(sanitized).toContain('Hello world');
    });

    it('should handle empty strings', () => {
      expect(sanitizeContent('')).toBe('');
      expect(sanitizeContent('   ')).toBe('   ');
    });

    it('should remove javascript: URLs', () => {
      const maliciousUrl = '<a href="javascript:alert(1)">Click me</a>';
      const sanitized = sanitizeContent(maliciousUrl);
      expect(sanitized).not.toContain('javascript:');
    });
  });

  describe('sanitizeText', () => {
    it('should remove all HTML tags', () => {
      const htmlContent = '<p>Hello <strong>world</strong></p>';
      const sanitized = sanitizeText(htmlContent);
      expect(sanitized).toBe('Hello world');
      expect(sanitized).not.toContain('<');
      expect(sanitized).not.toContain('>');
    });

    it('should handle script tags', () => {
      const maliciousContent = '<script>alert("xss")</script>Hello';
      const sanitized = sanitizeText(maliciousContent);
      expect(sanitized).toBe('Hello');
      expect(sanitized).not.toContain('script');
    });

    it('should preserve text content', () => {
      const plainText = 'Hello world!';
      const sanitized = sanitizeText(plainText);
      expect(sanitized).toBe('Hello world!');
    });

    it('should handle empty strings', () => {
      expect(sanitizeText('')).toBe('');
      expect(sanitizeText('   ')).toBe('   ');
    });
  });

  describe('isValidContent', () => {
    it('should validate safe content', () => {
      expect(isValidContent('<p>Hello world</p>')).toBe(true);
      expect(isValidContent('Plain text content')).toBe(true);
      expect(isValidContent('<strong>Bold text</strong>')).toBe(true);
    });

    it('should reject dangerous content', () => {
      expect(isValidContent('<script>alert("xss")</script>')).toBe(false);
      expect(isValidContent('<iframe src="evil.com"></iframe>')).toBe(false);
      expect(isValidContent('<img onerror="alert(1)" src="x">')).toBe(false);
    });

    it('should handle empty content', () => {
      expect(isValidContent('')).toBe(true);
      expect(isValidContent('   ')).toBe(true);
    });
  });

  describe('sanitizeTitle', () => {
    it('should remove HTML tags from titles', () => {
      const titleWithHtml = '<p>My Title</p>';
      const sanitized = sanitizeTitle(titleWithHtml);
      expect(sanitized).toBe('My Title');
      expect(sanitized).not.toContain('<');
    });

    it('should trim whitespace', () => {
      const titleWithSpaces = '  My Title  ';
      const sanitized = sanitizeTitle(titleWithSpaces);
      expect(sanitized).toBe('My Title');
    });

    it('should handle special characters appropriately', () => {
      const titleWithSpecial = 'Title & Subtitle';
      const sanitized = sanitizeTitle(titleWithSpecial);
      expect(sanitized).toContain('Title');
      expect(sanitized).toContain('Subtitle');
    });

    it('should handle empty titles', () => {
      expect(sanitizeTitle('')).toBe('');
      expect(sanitizeTitle('   ')).toBe('');
    });
  });

  describe('isValidTitle', () => {
    it('should validate proper titles', () => {
      expect(isValidTitle('My Valid Title')).toBe(true);
      expect(isValidTitle('Title with 123 numbers')).toBe(true);
      expect(isValidTitle('Title & Subtitle')).toBe(true);
    });

    it('should reject titles that are too short', () => {
      expect(isValidTitle('')).toBe(false);
      expect(isValidTitle('a')).toBe(false);
      expect(isValidTitle('ab')).toBe(false);
    });

    it('should reject titles that are too long', () => {
      const longTitle = 'a'.repeat(201); // Assuming max length is 200
      expect(isValidTitle(longTitle)).toBe(false);
    });

    it('should reject titles with dangerous content', () => {
      expect(isValidTitle('<script>alert("xss")</script>')).toBe(false);
      expect(isValidTitle('Title with <iframe></iframe>')).toBe(false);
    });

    it('should handle whitespace-only titles', () => {
      expect(isValidTitle('   ')).toBe(false);
      expect(isValidTitle('\t\n')).toBe(false);
    });
  });
});
