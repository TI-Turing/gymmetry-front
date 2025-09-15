// __tests__/constants/Colors.test.ts
import Colors from '../../constants/Colors';

describe('Colors Constants', () => {
  describe('light theme', () => {
    it('should have all required light theme colors', () => {
      expect(Colors.light).toBeDefined();
      expect(Colors.light.text).toBeDefined();
      expect(Colors.light.background).toBeDefined();
      expect(Colors.light.tint).toBeDefined();
      expect(Colors.light.tabIconDefault).toBeDefined();
      expect(Colors.light.tabIconSelected).toBeDefined();
    });

    it('should have valid hex color format for light theme', () => {
      const hexPattern = /^#[0-9A-F]{6}$/i;
      expect(Colors.light.text).toMatch(hexPattern);
      expect(Colors.light.background).toMatch(hexPattern);
      expect(Colors.light.tint).toMatch(hexPattern);
    });
  });

  describe('dark theme', () => {
    it('should have all required dark theme colors', () => {
      expect(Colors.dark).toBeDefined();
      expect(Colors.dark.text).toBeDefined();
      expect(Colors.dark.background).toBeDefined();
      expect(Colors.dark.tint).toBeDefined();
      expect(Colors.dark.tabIconDefault).toBeDefined();
      expect(Colors.dark.tabIconSelected).toBeDefined();
    });

    it('should have valid hex color format for dark theme', () => {
      const hexPattern = /^#[0-9A-F]{6}$/i;
      expect(Colors.dark.text).toMatch(hexPattern);
      expect(Colors.dark.background).toMatch(hexPattern);
      expect(Colors.dark.tint).toMatch(hexPattern);
    });
  });

  describe('theme consistency', () => {
    it('should have same structure for light and dark themes', () => {
      const lightKeys = Object.keys(Colors.light);
      const darkKeys = Object.keys(Colors.dark);
      expect(lightKeys.sort()).toEqual(darkKeys.sort());
    });

    it('should have all color values as strings', () => {
      Object.values(Colors.light).forEach((color) => {
        expect(typeof color).toBe('string');
      });
      Object.values(Colors.dark).forEach((color) => {
        expect(typeof color).toBe('string');
      });
    });
  });

  describe('color accessibility', () => {
    it('should have different text and background colors', () => {
      expect(Colors.light.text).not.toBe(Colors.light.background);
      expect(Colors.dark.text).not.toBe(Colors.dark.background);
    });

    it('should have consistent tint colors across themes', () => {
      expect(Colors.light.tint).toBe(Colors.dark.tint);
    });
  });
});
