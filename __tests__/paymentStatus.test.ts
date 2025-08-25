// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { normalizePaymentStatus, isExpired } from '../utils/paymentStatus';

describe('paymentStatus utils', () => {
  test('normalizePaymentStatus maps common aliases', () => {
    expect(normalizePaymentStatus('APPROVED')).toBe('approved');
    expect(normalizePaymentStatus('success')).toBe('approved');
    expect(normalizePaymentStatus('rejected')).toBe('rejected');
    expect(normalizePaymentStatus('failure')).toBe('rejected');
    expect(normalizePaymentStatus('canceled')).toBe('cancelled');
    expect(normalizePaymentStatus('expired')).toBe('expired');
    expect(normalizePaymentStatus('in_process')).toBe('pending');
    expect(normalizePaymentStatus(undefined)).toBe('pending');
  });

  test('isExpired evaluates timestamps', () => {
    const now = new Date('2024-01-01T12:00:00Z').getTime();
    expect(isExpired('2023-12-31T23:59:59Z', now)).toBe(true);
    expect(isExpired('2024-01-02T00:00:00Z', now)).toBe(false);
    expect(isExpired(undefined, now)).toBe(false);
    expect(isExpired('invalid-date', now)).toBe(false);
  });
});
