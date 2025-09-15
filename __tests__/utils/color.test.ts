// __tests__/utils/color.test.ts
import { withAlpha } from '../../utils/color';

describe('Color Utils', () => {
  describe('withAlpha', () => {
    it('should add alpha to hex color', () => {
      const result = withAlpha('#FF0000', 0.5);
      expect(result).toBe('#80FF0000');
    });

    it('should handle 3-digit hex colors', () => {
      const result = withAlpha('#F00', 0.8);
      expect(result).toBe('#CCFF0000');
    });

    it('should handle RGB colors', () => {
      const result = withAlpha('rgb(255, 0, 0)', 0.5);
      expect(result).toBe('rgba(255, 0, 0, 0.5)');
    });
  });
});
