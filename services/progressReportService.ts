import type { MultiProgressReportRequest } from '@/dto/Progress/MultiProgressReportRequest';
import { apiService } from './apiService';
import type {
  ProgressReportRequest,
  ProgressSummaryResponse,
  ExercisesDetailResponse,
  ObjectivesDetailResponse,
  MusclesDetailResponse,
  SuggestionsResponse,
  DisciplineDetailResponse,
} from '@/dto';

const base = '/progress';

export const progressReportService = {
  // Nuevo endpoint multi-periodo
  async getMultiSummary(
    _req: MultiProgressReportRequest,
    _opts?: { signal?: AbortSignal; retries?: number; retryDelayMs?: number }
  ) {
    return await apiService.post<
      import('@/dto/Progress/MultiProgressHistoryResponse').MultiProgressHistoryResponse
    >(`${base}/summary/multi`, _req, { signal: _opts?.signal });
  },
  async getSummary(
    req: ProgressReportRequest,
    opts?: { signal?: AbortSignal; retries?: number; retryDelayMs?: number }
  ) {
    const retries = Math.max(0, opts?.retries ?? 0);
    let attempt = 0;
    // simple retry en errores de red/5xx
    // no reintenta en 4xx
    // respeta AbortSignal
    while (true) {
      try {
        return await apiService.post<ProgressSummaryResponse>(
          `${base}/summary`,
          req,
          { signal: opts?.signal }
        );
      } catch (e) {
        const err = e as unknown as { response?: { status?: number } } & {
          name?: string;
          message?: string;
        };
        const status = err?.response?.status as number | undefined;
        const isAbort =
          err?.name === 'CanceledError' || err?.message === 'canceled';
        const retriable = !status || (status >= 500 && status < 600);
        if (isAbort) throw e;
        if (attempt >= retries || !retriable) throw e;
        const delay = Math.min(
          10000,
          (opts?.retryDelayMs ?? 500) * (attempt + 1)
        );
        await new Promise((r) => setTimeout(r, delay));
        attempt++;
      }
    }
  },
  async getExercisesDetail(req: ProgressReportRequest) {
    return apiService.post<ExercisesDetailResponse>(`${base}/exercises`, req);
  },
  async getObjectivesDetail(req: ProgressReportRequest) {
    return apiService.post<ObjectivesDetailResponse>(`${base}/objectives`, req);
  },
  async getMusclesDetail(req: ProgressReportRequest) {
    return apiService.post<MusclesDetailResponse>(`${base}/muscles`, req);
  },
  async getSuggestions(req: ProgressReportRequest) {
    return apiService.post<SuggestionsResponse>(`${base}/suggestions`, req);
  },
  async getDisciplineDetail(req: ProgressReportRequest) {
    return apiService.post<DisciplineDetailResponse>(`${base}/discipline`, req);
  },
};

export default progressReportService;
