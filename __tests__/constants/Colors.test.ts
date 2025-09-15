// __tests__/constants/Colors.test.ts
import { Colors } from '../../constants/Colors';

describe('Colors Constants', () => {
  describe('light theme', () => {
    it('should have all required light theme colors', () => {
      expect(Colors.light).toBeDefined();
      expect(Colors.light.text).toBeDefined();
      expect(Colors.light.background).toBeDefined();
      expect(Colors.light.tint).toBeDefined();
      expect(Colors.light.icon).toBeDefined();
      expect(Colors.light.tabIconDefault).toBeDefined();
      expect(Colors.light.tabIconSelected).toBeDefined();
    });

    it('should have valid color values for light theme', () => {
      // Test that colors are strings and have hash format or rgb format
      expect(typeof Colors.light.text).toBe('string');
      expect(typeof Colors.light.background).toBe('string');
      expect(typeof Colors.light.tint).toBe('string');

      // Colors should be either hex format (#123456) or color names
      const colorRegex = /^(#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}|[a-zA-Z]+)$/;
      expect(colorRegex.test(Colors.light.text)).toBe(true);
      expect(colorRegex.test(Colors.light.background)).toBe(true);
    });

    it('should have contrast between text and background', () => {
      // Basic check that text and background are different
      expect(Colors.light.text).not.toBe(Colors.light.background);
    });
  });

  describe('dark theme', () => {
    it('should have all required dark theme colors', () => {
      expect(Colors.dark).toBeDefined();
      expect(Colors.dark.text).toBeDefined();
      expect(Colors.dark.background).toBeDefined();
      expect(Colors.dark.tint).toBeDefined();
      expect(Colors.dark.icon).toBeDefined();
      expect(Colors.dark.tabIconDefault).toBeDefined();
      expect(Colors.dark.tabIconSelected).toBeDefined();
    });

    it('should have valid color values for dark theme', () => {
      expect(typeof Colors.dark.text).toBe('string');
      expect(typeof Colors.dark.background).toBe('string');
      expect(typeof Colors.dark.tint).toBe('string');

      const colorRegex = /^(#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}|[a-zA-Z]+)$/;
      expect(colorRegex.test(Colors.dark.text)).toBe(true);
      expect(colorRegex.test(Colors.dark.background)).toBe(true);
    });

    it('should have contrast between text and background', () => {
      expect(Colors.dark.text).not.toBe(Colors.dark.background);
    });
  });

  describe('theme consistency', () => {
    it('should have same structure in both themes', () => {
      const lightKeys = Object.keys(Colors.light).sort();
      const darkKeys = Object.keys(Colors.dark).sort();

      expect(lightKeys).toEqual(darkKeys);
    });

    it('should have different values between themes for key colors', () => {
      // Text and background should be inverted between themes typically
      expect(Colors.light.text).not.toBe(Colors.dark.text);
      expect(Colors.light.background).not.toBe(Colors.dark.background);
    });

    it('should maintain tint color consistency or appropriate variation', () => {
      // Tint might be the same or different, just check it exists
      expect(Colors.light.tint).toBeDefined();
      expect(Colors.dark.tint).toBeDefined();
    });
  });

  describe('accessibility considerations', () => {
    it('should have distinct icon states', () => {
      // Default and selected tab icons should be different
      expect(Colors.light.tabIconDefault).not.toBe(
        Colors.light.tabIconSelected
      );
      expect(Colors.dark.tabIconDefault).not.toBe(Colors.dark.tabIconSelected);
    });

    it('should define icon color', () => {
      expect(Colors.light.icon).toBeDefined();
      expect(Colors.dark.icon).toBeDefined();
      expect(typeof Colors.light.icon).toBe('string');
      expect(typeof Colors.dark.icon).toBe('string');
    });
  });

  describe('color format validation', () => {
    const getAllColors = (theme: typeof Colors.light) => {
      return Object.values(theme);
    };

    it('should have no empty color values in light theme', () => {
      const lightColors = getAllColors(Colors.light);
      lightColors.forEach((color) => {
        expect(color).toBeTruthy();
        expect(color.length).toBeGreaterThan(0);
      });
    });

    it('should have no empty color values in dark theme', () => {
      const darkColors = getAllColors(Colors.dark);
      darkColors.forEach((color) => {
        expect(color).toBeTruthy();
        expect(color.length).toBeGreaterThan(0);
      });
    });

    it('should not have undefined or null colors', () => {
      const allColors = [
        ...getAllColors(Colors.light),
        ...getAllColors(Colors.dark),
      ];

      allColors.forEach((color) => {
        expect(color).not.toBeUndefined();
        expect(color).not.toBeNull();
      });
    });
  });
});
