import { useCallback, useEffect, useRef, useState } from 'react';
import { paymentService } from '@/services/paymentService';
import {
  normalizePaymentStatus,
  isExpired,
  PaymentLifecycleStatus as PaymentLifecycleStatusType,
} from '@/utils';

export type PaymentLifecycleStatus = PaymentLifecycleStatusType;

interface UsePaymentStatusOptions {
  intervalMs?: number;
  timeoutMs?: number;
  autoStartId?: string | null;
  onUpdate?: (status: PaymentLifecycleStatus, raw?: unknown) => void;
}

interface UsePaymentStatusResult {
  status: PaymentLifecycleStatus;
  isPolling: boolean;
  rawStatus: unknown;
  error: string | null;
  start: (preferenceId: string) => Promise<void>;
  stop: () => void;
  reset: () => void;
}

// mapStatus ahora se delega a utils.normalizePaymentStatus

export function usePaymentStatus(
  options?: UsePaymentStatusOptions
): UsePaymentStatusResult {
  const {
    intervalMs = 5000,
    timeoutMs = 180000,
    autoStartId,
    onUpdate,
  } = options || {};
  const [status, setStatus] = useState<PaymentLifecycleStatus>('idle');
  const [rawStatus, setRawStatus] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [_currentId, setCurrentId] = useState<string | null>(
    autoStartId || null
  );
  const stopRef = useRef(false);
  const pollingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const stop = useCallback(() => {
    stopRef.current = true;
    pollingRef.current = false;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const reset = useCallback(() => {
    stop();
    setStatus('idle');
    setRawStatus(null);
    setError(null);
    setCurrentId(null);
  }, [stop, setRawStatus, setStatus, setError, setCurrentId]);

  const pollOnce = useCallback(
    async (id: string) => {
      try {
        const resp = await paymentService.getPaymentStatus(id);
        if (!resp.Success) {
          setError(resp.Message || 'Error obteniendo estado de pago');
          setStatus('error');
          onUpdate?.('error', resp);
          return { terminal: true };
        }
        const backendStatusSource =
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          (resp.Data as Record<string, unknown> | undefined)?.status ??
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          (resp.Data as Record<string, unknown> | undefined)?.Status ??
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          (resp.Data as Record<string, unknown> | undefined)?.paymentStatus ??
          '';
        const backendStatus = String(backendStatusSource);
        const mapped = normalizePaymentStatus(backendStatus);
        setRawStatus(resp.Data);
        setStatus(
          mapped === 'pending' && status === 'idle' ? 'polling' : mapped
        );
        onUpdate?.(mapped, resp.Data);
        // Si el backend envía expiresAt, terminar si ya pasó
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const expiresAtIso =
          ((resp.Data as Record<string, unknown> | undefined)?.expiresAt as
            | string
            | undefined) ??
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          ((resp.Data as Record<string, unknown> | undefined)?.ExpiresAt as
            | string
            | undefined);
        if (isExpired(expiresAtIso)) {
          setStatus('expired');
          onUpdate?.('expired', resp.Data);
          return { terminal: true };
        }
        if (['approved', 'rejected', 'cancelled', 'expired'].includes(mapped)) {
          return { terminal: true };
        }
        return { terminal: false };
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Error desconocido';
        setError(message);
        setStatus('error');
        onUpdate?.('error');
        return { terminal: true };
      }
    },
    [onUpdate, status, setRawStatus, setStatus, setError]
  );

  const scheduleNext = useCallback(
    (id: string, startedAt: number) => {
      if (stopRef.current) return;
      const elapsed = Date.now() - startedAt;
      if (elapsed > timeoutMs) {
        stop();
        return;
      }
      timeoutRef.current = setTimeout(async () => {
        const result = await pollOnce(id);
        if (!result.terminal) scheduleNext(id, startedAt);
        else stop();
      }, intervalMs) as unknown as NodeJS.Timeout;
    },
    [intervalMs, timeoutMs, pollOnce, stop]
  );

  const start = useCallback(
    async (id: string) => {
      reset();
      stopRef.current = false;
      setCurrentId(id);
      setStatus('polling');
      pollingRef.current = true;
      const startedAt = Date.now();
      const first = await pollOnce(id);
      if (!first.terminal) scheduleNext(id, startedAt);
    },
    [pollOnce, reset, scheduleNext]
  );

  useEffect(() => {
    if (autoStartId) {
      start(autoStartId).catch(() => undefined);
    }
    return () => {
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    status,
    isPolling: pollingRef.current,
    rawStatus,
    error,
    start,
    stop,
    reset,
  };
}
