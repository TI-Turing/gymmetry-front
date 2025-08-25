import { normalizeCollection } from '@/utils';

describe('normalizeCollection', () => {
  test('returns same array if input is an array', () => {
    const input = [1, 2, 3];
    expect(normalizeCollection<number>(input)).toEqual([1, 2, 3]);
  });

  test('extracts $values when present in a plain object', () => {
    const input = { $values: [1, 2, 3] } as unknown;
    expect(normalizeCollection<number>(input)).toEqual([1, 2, 3]);
  });

  test('returns empty array when $values is not an array', () => {
    const input = { $values: 'nope' } as unknown;
    expect(normalizeCollection<number>(input)).toEqual([]);
  });

  test('returns empty array on deep nested $values (no deep search)', () => {
    const input = {
      data: {
        result: {
          $values: [{ id: 1 }, { id: 2 }],
        },
      },
    } as unknown;
    const out = normalizeCollection<{ id: number }>(input);
    expect(out).toEqual([]);
  });

  test('returns empty array on null/undefined', () => {
    expect(normalizeCollection<number>(null as unknown)).toEqual([]);
    expect(normalizeCollection<number>(undefined as unknown)).toEqual([]);
  });

  test('returns empty array on non-object/array inputs', () => {
    expect(normalizeCollection<number>(42 as unknown)).toEqual([]);
    expect(normalizeCollection<number>('str' as unknown)).toEqual([]);
    expect(normalizeCollection<number>(true as unknown)).toEqual([]);
  });
});
