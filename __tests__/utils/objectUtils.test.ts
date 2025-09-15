// __tests__/utils/objectUtils.test.ts
import {
  filterEmptyFields,
  hasValidValue,
  normalizeCollection,
} from '../../utils/objectUtils';

describe('Object Utils', () => {
  describe('filterEmptyFields', () => {
    it('should remove empty string fields', () => {
      const input = {
        name: 'John',
        email: '',
        phone: '123456789',
        address: '',
      };
      const result = filterEmptyFields(input);
      expect(result).toEqual({
        name: 'John',
        phone: '123456789',
      });
    });

    it('should remove null and undefined fields', () => {
      const input = {
        name: 'John',
        email: null,
        phone: undefined,
        age: 25,
      };
      const result = filterEmptyFields(input);
      expect(result).toEqual({
        name: 'John',
        age: 25,
      });
    });

    it('should preserve zero and false values', () => {
      const input = {
        name: 'John',
        age: 0,
        isActive: false,
        score: 0,
        empty: '',
      };
      const result = filterEmptyFields(input);
      expect(result).toEqual({
        name: 'John',
        age: 0,
        isActive: false,
        score: 0,
      });
    });

    it('should preserve arrays and objects', () => {
      const input = {
        name: 'John',
        hobbies: ['reading', 'coding'],
        address: {
          street: '123 Main St',
          city: 'New York',
        },
        empty: '',
      };
      const result = filterEmptyFields(input);
      expect(result).toEqual({
        name: 'John',
        hobbies: ['reading', 'coding'],
        address: {
          street: '123 Main St',
          city: 'New York',
        },
      });
    });

    it('should handle empty objects', () => {
      const result = filterEmptyFields({});
      expect(result).toEqual({});
    });

    it('should handle objects with all empty fields', () => {
      const input = {
        empty1: '',
        empty2: null,
        empty3: undefined,
      };
      const result = filterEmptyFields(input);
      expect(result).toEqual({});
    });
  });

  describe('hasValidValue', () => {
    it('should return true for valid values', () => {
      expect(hasValidValue('hello')).toBe(true);
      expect(hasValidValue(123)).toBe(true);
      expect(hasValidValue(true)).toBe(true);
      expect(hasValidValue(false)).toBe(true);
      expect(hasValidValue(0)).toBe(true);
      expect(hasValidValue([])).toBe(true);
      expect(hasValidValue({})).toBe(true);
    });

    it('should return false for invalid values', () => {
      expect(hasValidValue('')).toBe(false);
      expect(hasValidValue(null)).toBe(false);
      expect(hasValidValue(undefined)).toBe(false);
    });

    it('should handle whitespace strings', () => {
      expect(hasValidValue('   ')).toBe(false);
      expect(hasValidValue('\t\n')).toBe(false);
      expect(hasValidValue(' hello ')).toBe(true);
    });
  });

  describe('normalizeCollection', () => {
    it('should return array as-is if input is already an array', () => {
      const input = [1, 2, 3];
      const result = normalizeCollection(input);
      expect(result).toEqual([1, 2, 3]);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should extract $values from .NET response object', () => {
      const input = {
        $values: [
          { id: 1, name: 'Item 1' },
          { id: 2, name: 'Item 2' },
        ],
      };
      const result = normalizeCollection(input);
      expect(result).toEqual([
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ]);
    });

    it('should return empty array for null/undefined input', () => {
      expect(normalizeCollection(null)).toEqual([]);
      expect(normalizeCollection(undefined)).toEqual([]);
    });

    it('should return empty array for non-array, non-object input', () => {
      expect(normalizeCollection('string')).toEqual([]);
      expect(normalizeCollection(123)).toEqual([]);
      expect(normalizeCollection(true)).toEqual([]);
    });

    it('should return empty array for object without $values', () => {
      const input = {
        data: [1, 2, 3],
        count: 3,
      };
      const result = normalizeCollection(input);
      expect(result).toEqual([]);
    });

    it('should handle nested $values structure', () => {
      const input = {
        $values: [
          {
            id: 1,
            items: {
              $values: ['item1', 'item2'],
            },
          },
        ],
      };
      const result = normalizeCollection(input);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
      expect(result[0].items.$values).toEqual(['item1', 'item2']);
    });

    it('should work with TypeScript generics', () => {
      interface TestItem {
        id: number;
        name: string;
      }

      const input = {
        $values: [
          { id: 1, name: 'Item 1' },
          { id: 2, name: 'Item 2' },
        ],
      };
      const result = normalizeCollection<TestItem>(input);
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[0].name).toBe('Item 1');
    });
  });
});
