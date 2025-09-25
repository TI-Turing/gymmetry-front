import { useMemo } from 'react';
import { useAppState, useHomeState } from '@/contexts/AppStateContext';
import { formatDateToLocal } from '@/utils/dashboardTransformers';
import type { HomeStateDto } from '@/dto/appState/AppStateOverviewResponse';
// Tipos compatibles con los componentes existentes
export type DayStatus = 'completed' | 'failed' | 'rest';
export interface DisciplineData {
  week: number;
  days: {
    day: string;
    status: DayStatus;
    date?: string;
  }[];
}
export interface PlanInfoData {
  startDate: string; // dd/mm/yyyy
  endDate: string; // dd/mm/yyyy
  currentGym: string;
  progress: number;
}
export interface TodayRoutineData {
  routineName: string;
  hasAttended: boolean;
}
// Interfaz compatible con useDashboardData para mantener compatibilidad
export interface DashboardData {
  discipline: {
    data: DisciplineData[];
    completionPercentage: number;
  } | null;
  planInfo: PlanInfoData | null;
  todayRoutine: TodayRoutineData | null;
  detailedProgress: {
    planData: {
      dayNumber: number;
      percentage: number;
      status: 'success' | 'fail' | 'rest';
    }[];
    monthData: {
      dayNumber: number;
      percentage: number;
      status: 'success' | 'fail' | 'rest';
    }[];
    hasActivePlan: boolean;
  } | null;
}
export interface DashboardState {
  data: DashboardData;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}
/**
 * Hook adaptador que transforma los datos del contexto AppState
 * al formato esperado por los componentes existentes del dashboard
 */
export const useHomeDashboardAdapter = (): DashboardState => {
  const { isBootstrapping, bootstrapError, refreshAll } = useAppState();
  const homeData = useHomeState();
  // Transformar datos del contexto al formato legacy
  const transformedData = useMemo((): DashboardData => {
    if (!homeData) {
      return {
        discipline: null,
        planInfo: null,
        todayRoutine: null,
        detailedProgress: null,
      };
    }
    // Transformar datos de disciplina - por ahora datos simplificados
    const discipline = homeData.Discipline
      ? {
          data: generateDisciplineData(homeData.Discipline),
          completionPercentage: homeData.Discipline.CompletionPercentage,
        }
      : null;
    // Transformar datos del plan
    const planInfo = homeData.PlanInfo
      ? {
          startDate: formatDateToLocal(homeData.PlanInfo.StartDate),
          endDate: formatDateToLocal(homeData.PlanInfo.EndDate),
          currentGym: 'Gimnasio no especificado', // TODO: Obtener del contexto
          progress: homeData.PlanInfo.ProgressPercentage,
        }
      : null;
    // Transformar datos de rutina de hoy
    const todayRoutine = homeData.TodayRoutine
      ? {
          routineName: homeData.TodayRoutine.RoutineName,
          hasAttended: homeData.TodayRoutine.HasTrainedToday,
        }
      : null;
    // Transformar datos de progreso detallado - datos simplificados por ahora
    const detailedProgress = homeData.DetailedProgress
      ? {
          planData: generateProgressData(30),
          monthData: generateProgressData(new Date().getDate()),
          hasActivePlan: homeData.PlanInfo?.IsActive || false,
        }
      : null;
    return {
      discipline,
      planInfo,
      todayRoutine,
      detailedProgress,
    };
  }, [homeData]);
  return {
    data: transformedData,
    loading: isBootstrapping,
    error: bootstrapError,
    refetch: refreshAll,
  };
};
// Helper functions para generar datos compatibles
function generateDisciplineData(
  disciplineDto: HomeStateDto['Discipline']
): DisciplineData[] {
  // Generar datos de disciplina para las últimas 4 semanas
  const weeks = [];
  const today = new Date();
  for (let weekIndex = 3; weekIndex >= 0; weekIndex--) {
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - weekIndex * 7 - today.getDay() + 1);
    const days = [];
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + dayIndex);
      const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
      const isRestDay = dayIndex === 0 || dayIndex === 6; // Domingos y sábados
      const isCompleted =
        Math.random() < disciplineDto.CompletionPercentage / 100;
      days.push({
        day: dayNames[dayIndex],
        status: isRestDay
          ? ('rest' as const)
          : isCompleted
            ? ('completed' as const)
            : ('failed' as const),
        date: date.toISOString().split('T')[0],
      });
    }
    weeks.push({
      week: 4 - weekIndex,
      days,
    });
  }
  return weeks;
}
function generateProgressData(totalDays: number) {
  return Array.from({ length: totalDays }, (_, index) => ({
    dayNumber: index + 1,
    percentage: Math.round(Math.random() * 100),
    status: (Math.random() > 0.3
      ? 'success'
      : Math.random() > 0.5
        ? 'fail'
        : 'rest') as 'success' | 'fail' | 'rest',
  }));
}
