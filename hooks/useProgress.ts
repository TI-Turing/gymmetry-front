import type { MultiProgressReportRequest } from '@/dto/Progress/MultiProgressReportRequest';
import type { MultiProgressData } from '@/dto/Progress/MultiProgressHistoryResponse';
import { useEffect, useMemo, useRef, useState } from 'react';
import { progressReportService } from '@/services';
import type { ProgressReportRequest, ProgressSummaryResponse } from '@/dto';
import { queryCache } from '@/utils/queryCache';
import type { ApiResponse } from '@/dto/common/ApiResponse';

// Hook para el endpoint multi-periodo
export function useMultiProgressSummary(
  req: MultiProgressReportRequest,
  opts?: { enabled?: boolean; cacheTtlMs?: number; retries?: number }
) {
  const enabled = opts?.enabled ?? true;
  const reqKey = useMemo(() => {
    return JSON.stringify({
      UserId: req.UserId,
      Periods: req.Periods,
      IncludeHistory: req.IncludeHistory,
      Timezone: req.Timezone,
    });
  }, [req.UserId, req.Periods, req.IncludeHistory, req.Timezone]);
  const key = useMemo(() => `multi-progress-summary:${reqKey}`, [reqKey]);

  // Usamos el tipo importado para múltiples períodos
  const getInitialData = () => {
    const cached =
      queryCache.get<
        import('@/dto/common/ApiResponse').ApiResponse<MultiProgressData>
      >(key);
    return cached?.Data ?? undefined;
  };
  const [data, setData] = useState<MultiProgressData | undefined>(() => {
    const initial = getInitialData();
    return initial;
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const [failureCount, setFailureCount] = useState<number>(0);
  const abortRef = useRef<AbortController | null>(null);

  // Circuit breaker: después de 3 fallos consecutivos, esperar 5 minutos
  const isCircuitOpen = failureCount >= 3;
  const circuitCooldownMs = 5 * 60 * 1000; // 5 minutos

  // Auto-reset del circuit breaker después del cooldown
  useEffect(() => {
    if (isCircuitOpen && failureCount >= 3) {
      const timer = setTimeout(() => {
        setFailureCount(0);
      }, circuitCooldownMs);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isCircuitOpen, failureCount, circuitCooldownMs]);

  useEffect(() => {
    const unsub = queryCache.subscribe(key, () => {
      const cached =
        queryCache.get<
          import('@/dto/common/ApiResponse').ApiResponse<MultiProgressData>
        >(key);
      setData(cached?.Data ?? undefined);
    });
    return () => unsub();
  }, [key]);

  useEffect(() => {
    if (!enabled) return;

    // Circuit breaker: si hay muchos fallos, no hacer más requests
    if (isCircuitOpen) {
      setError(
        `Servicio temporalmente no disponible. Reintentando en ${Math.ceil(
          circuitCooldownMs / 60000
        )} minutos.`
      );
      return;
    }

    let mounted = true;
    const controller = new AbortController();
    abortRef.current?.abort();
    abortRef.current = controller;
    const exec = async () => {
      setLoading(true);
      setError(undefined);
      try {
        const resp = await progressReportService.getMultiSummary(req, {
          signal: controller.signal,
          retries: Math.min(opts?.retries ?? DEFAULT_RETRIES, 1), // Máximo 1 reintento
          retryDelayMs: DEFAULT_RETRY_DELAY,
        });
        if (!mounted) return;
        if (resp?.Success && resp.Data) {
          queryCache.set(key, resp, opts?.cacheTtlMs ?? 60_000);
          setData(resp.Data); // resp.Data ya tiene la estructura correcta
          // Resetear contador de fallos en caso de éxito
          setFailureCount(0);
        } else {
          setFailureCount((prev) => prev + 1);
          setError(resp?.Message || 'No se pudo cargar el resumen multi');
        }
      } catch (e) {
        if (!mounted) return;
        const err = e as { name?: string; message?: string };
        if (err?.name === 'CanceledError') return;
        setFailureCount((prev) => prev + 1);
        setError(err?.message || 'Error de red');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    exec();
    return () => {
      mounted = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    key,
    enabled,
    opts?.cacheTtlMs,
    opts?.retries,
    reqKey,
    isCircuitOpen,
    circuitCooldownMs,
  ]);

  const refetch = () => queryCache.invalidate(key);

  return { data, loading, error, refetch };
}

const DEFAULT_RETRIES = 2;
const DEFAULT_RETRY_DELAY = 600;

const buildRequest = (
  partial: Partial<ProgressReportRequest>
): ProgressReportRequest => {
  const tz =
    partial.Timezone ||
    Intl.DateTimeFormat().resolvedOptions().timeZone ||
    'America/Bogota';
  if (!partial.StartDate || !partial.EndDate) {
    const end = new Date();
    const start = new Date(end);
    start.setDate(end.getDate() - 29); // últimos 30 días
    const fmt = (d: Date) => d.toISOString().slice(0, 10);
    return {
      UserId: partial.UserId || '',
      StartDate: fmt(start),
      EndDate: fmt(end),
      Timezone: tz,
      IncludeAssessments: partial.IncludeAssessments ?? true,
      ComparePreviousPeriod: partial.ComparePreviousPeriod ?? true,
      MinCompletionForAdherence: partial.MinCompletionForAdherence ?? 30,
      TopExercises: partial.TopExercises ?? 10,
    };
  }
  return {
    UserId: partial.UserId || '',
    StartDate: partial.StartDate,
    EndDate: partial.EndDate,
    Timezone: tz,
    IncludeAssessments: partial.IncludeAssessments ?? true,
    ComparePreviousPeriod: partial.ComparePreviousPeriod ?? true,
    MinCompletionForAdherence: partial.MinCompletionForAdherence ?? 30,
    TopExercises: partial.TopExercises ?? 10,
  };
};

export function useProgressSummary(
  reqPartial: Partial<ProgressReportRequest>,
  opts?: { enabled?: boolean; cacheTtlMs?: number; retries?: number }
) {
  const enabled = opts?.enabled ?? true;

  const req = useMemo(() => buildRequest(reqPartial), [reqPartial]);

  const key = useMemo(() => {
    return `progress_summary_${req.UserId}_${req.StartDate}_${req.EndDate}_${req.Timezone}`;
  }, [req]);

  const [data, setData] = useState<ProgressSummaryResponse | undefined>(() =>
    queryCache.get<ProgressSummaryResponse>(key)
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const [failureCount, setFailureCount] = useState<number>(0);
  const abortRef = useRef<AbortController | null>(null);

  // Circuit breaker: después de 3 fallos consecutivos, esperar 5 minutos
  const isCircuitOpen = failureCount >= 3;
  const circuitCooldownMs = 5 * 60 * 1000; // 5 minutos

  // Auto-reset del circuit breaker después del cooldown
  useEffect(() => {
    if (isCircuitOpen && failureCount >= 3) {
      const timer = setTimeout(() => {
        setFailureCount(0);
      }, circuitCooldownMs);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isCircuitOpen, failureCount, circuitCooldownMs]);

  useEffect(() => {
    const unsub = queryCache.subscribe(key, () => {
      setData(queryCache.get<ProgressSummaryResponse>(key));
    });
    return () => unsub();
  }, [key]);

  useEffect(() => {
    if (!enabled) return;

    // Circuit breaker: si hay muchos fallos, no hacer más requests
    if (isCircuitOpen) {
      setError(
        `Servicio temporalmente no disponible. Reintentando en ${Math.ceil(
          circuitCooldownMs / 60000
        )} minutos.`
      );
      return;
    }

    let mounted = true;
    const controller = new AbortController();
    abortRef.current?.abort();
    abortRef.current = controller;
    const exec = async () => {
      setLoading(true);
      setError(undefined);
      try {
        const resp: ApiResponse<ProgressSummaryResponse> =
          await progressReportService.getSummary(req, {
            signal: controller.signal,
            retries: Math.min(opts?.retries ?? DEFAULT_RETRIES, 1), // Máximo 1 reintento
            retryDelayMs: DEFAULT_RETRY_DELAY,
          });
        if (!mounted) return;
        if (resp?.Success && resp.Data) {
          const data = resp.Data;
          queryCache.set(key, data, opts?.cacheTtlMs ?? 60_000);
          setData(data);
          // Resetear contador de fallos en caso de éxito
          setFailureCount(0);
        } else {
          setFailureCount((prev) => prev + 1);
          setError(resp?.Message || 'No se pudo cargar el resumen');
        }
      } catch (e) {
        if (!mounted) return;
        const err = e as { name?: string; message?: string };
        if (err?.name === 'CanceledError') return;
        setFailureCount((prev) => prev + 1);
        setError(err?.message || 'Error de red');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    exec();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, [
    key,
    enabled,
    opts?.cacheTtlMs,
    opts?.retries,
    req,
    isCircuitOpen,
    circuitCooldownMs,
    failureCount,
  ]);

  const refetch = () => queryCache.invalidate(key);

  return { data, loading, error, refetch };
}
