import { useState, useCallback } from 'react';
import type { ReportSubmission } from '../components/common/ReportModal';

export interface UseReportManagerOptions {
  onReportSubmitted?: (report: ReportSubmission) => void;
  onReportError?: (error: Error) => void;
}

export interface UseReportManagerReturn {
  submitReport: (report: ReportSubmission) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
  clearError: () => void;
}

export function useReportManager({
  onReportSubmitted,
  onReportError,
}: UseReportManagerOptions = {}): UseReportManagerReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitReport = useCallback(
    async (report: ReportSubmission) => {
      setIsSubmitting(true);
      setError(null);

      try {
        // TODO: Implementar llamada real a la API
        // await reportService.submitReport({
        //   contentId: report.contentId,
        //   contentType: report.contentType,
        //   categoryId: report.categoryId,
        //   description: report.description,
        //   anonymous: report.anonymous,
        //   reportedAt: new Date().toISOString(),
        // });

        // Simular delay de red
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Simular éxito (90% del tiempo) o error (10% del tiempo)
        if (Math.random() < 0.1) {
          throw new Error('Error del servidor al procesar el reporte');
        }

        // Notificar éxito
        onReportSubmitted?.(report);
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Error desconocido');
        setError(error.message);
        onReportError?.(error);
        throw error; // Re-throw para que el componente que llama pueda manejarlo
      } finally {
        setIsSubmitting(false);
      }
    },
    [onReportSubmitted, onReportError]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    submitReport,
    isSubmitting,
    error,
    clearError,
  };
}
