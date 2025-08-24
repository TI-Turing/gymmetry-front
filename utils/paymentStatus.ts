export type PaymentLifecycleStatus =
  | 'idle'
  | 'polling'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'cancelled'
  | 'expired'
  | 'error';

export function normalizePaymentStatus(s?: string): PaymentLifecycleStatus {
  if (!s) return 'pending';
  const norm = s.toLowerCase();
  if (['approved', 'success'].includes(norm)) return 'approved';
  if (['rejected', 'failure'].includes(norm)) return 'rejected';
  if (['cancelled', 'canceled'].includes(norm)) return 'cancelled';
  if (['expired', 'expire', 'expirado'].includes(norm)) return 'expired';
  if (['pending', 'in_process', 'inprocess'].includes(norm)) return 'pending';
  return 'pending';
}

export function isExpired(
  expiresAt?: string | null,
  now: number = Date.now()
): boolean {
  if (!expiresAt) return false;
  const ts = new Date(expiresAt).getTime();
  if (Number.isNaN(ts)) return false;
  return now > ts;
}
