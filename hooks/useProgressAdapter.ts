import { useMemo } from 'react';
import { useAppState, useProgressState } from '@/contexts/AppStateContext';
import type { ProgressSummaryResponse } from '@/dto/Progress/ProgressSummaryResponse';

export interface ProgressAdapterState {
  data: ProgressSummaryResponse | undefined;
  loading: boolean;
  error: string | undefined;
  refetch: () => Promise<void>;
}

/**
 * Hook adaptador que transforma los datos del contexto AppState
 * al formato esperado por el componente ProgressDashboard existente
 */
export const useProgressAdapter = (progressRequest: {
  UserId: string;
  StartDate: string;
  EndDate: string;
  [key: string]: unknown;
}): ProgressAdapterState => {
  const { isBootstrapping, bootstrapError, refreshAll } = useAppState();
  const progressStateData = useProgressState();

  const adaptedData = useMemo((): ProgressAdapterState => {
    if (!progressStateData || !progressRequest.UserId) {
      return {
        data: undefined,
        loading: isBootstrapping,
        error: bootstrapError || undefined,
        refetch: refreshAll,
      };
    }

    // Transformar datos del contexto al formato ProgressSummaryResponse
    const adaptedProgressData: ProgressSummaryResponse = {
      Period: {
        From: progressRequest.StartDate,
        To: progressRequest.EndDate,
        Days: calculateDaysBetween(
          progressRequest.StartDate,
          progressRequest.EndDate
        ),
      },
      Adherence: {
        TargetDays: 20, // Basado en datos del contexto
        Sessions: progressStateData.Summary.WorkoutsSummary,
        CompletedDays: progressStateData.Summary.WorkoutsSummary,
        AdherencePct: progressStateData.Summary.AdherencePercentage,
        CurrentStreak: 5, // TODO: Obtener del contexto cuando esté disponible
        MaxStreak: 10, // TODO: Obtener del contexto cuando esté disponible
        ByWeekday: generateWeekdayBreakdown(),
        BranchAttendance: [],
      },
      Execution: {
        AvgCompletion: 85, // TODO: Obtener del contexto
        StdevCompletion: 15,
        BestSessions: [],
        LowCompletionSessions: [],
        Series: [],
      },
      Time: {
        TotalMinutes: progressStateData.Summary.TotalMinutes,
        AvgPerSession:
          progressStateData.Summary.TotalMinutes /
          Math.max(progressStateData.Summary.WorkoutsSummary, 1),
        MaxSession: 120,
        MinSession: 30,
      },
      Exercises: {
        DistinctExercises: 10,
        TotalReps: 1000, // TODO: Obtener del contexto
        TotalSeries: 200,
        TopExercises: [],
        UnderusedExercises: [],
        MissingPlanned: [],
        NewExercises: [],
        PersonalRecords: [],
      },
      Objectives: {
        Planned: {},
        Executed: {},
        Gaps: [],
      },
      Muscles: {
        Distribution: progressStateData.Summary.MuscleDistribution,
        Dominant: progressStateData.Summary.DominantMuscles,
        Underworked: progressStateData.Summary.UnderworkedMuscles,
        BalanceIndex: progressStateData.Summary.BalanceIndex,
        Alerts: [],
      },
      Discipline: {
        ConsistencyIndex: progressStateData.Summary.BalanceIndex,
        CommonStartHour: null,
        ScheduleRegularity: 80,
      },
      Suggestions: [
        'Mantén la consistencia en tus entrenamientos',
        'Considera aumentar la intensidad gradualmente',
        'Asegúrate de descansar adecuadamente',
      ],
      GeneratedAt: new Date().toISOString(),
    };

    return {
      data: adaptedProgressData,
      loading: isBootstrapping,
      error: bootstrapError || undefined,
      refetch: refreshAll,
    };
  }, [
    progressStateData,
    progressRequest,
    isBootstrapping,
    bootstrapError,
    refreshAll,
  ]);

  return adaptedData;
};

// Helper functions
function calculateDaysBetween(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function generateWeekdayBreakdown() {
  return Array.from({ length: 7 }, (_, index) => ({
    Weekday: index,
    Done: Math.floor(Math.random() * 5),
    Expected: 4,
  }));
}
