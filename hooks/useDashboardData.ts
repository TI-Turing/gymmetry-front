import { useEffect, useState } from 'react';
import { authService } from '@/services/authService';
import { dailyService } from '@/services/dailyService';
import { planService } from '@/services/planService';
import { routineAssignedService } from '@/services/routineAssignedService';
import { routineDayService } from '@/services/routineDayService';
import { gymService } from '@/services/gymService';
import {
  transformDisciplineData,
  transformPlanInfo,
  transformTodayRoutine,
  transformDetailedProgressData,
  transformCurrentMonthProgressData,
  normalizeArray,
  DisciplineData,
  PlanInfoData,
  TodayRoutineData,
  getLast4WeeksBounds,
} from '@/utils/dashboardTransformers';
import type { Daily } from '@/models/Daily';
import type { Plan } from '@/models/Plan';
import type { RoutineAssigned } from '@/models/RoutineAssigned';
import type { RoutineDay } from '@/models/RoutineDay';
import type { Gym } from '@/models/Gym';

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

export const useDashboardData = (): DashboardState => {
  const [data, setData] = useState<DashboardData>({
    discipline: null,
    planInfo: null,
    todayRoutine: null,
    detailedProgress: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // 1. Obtener datos del usuario autenticado
      const userData = await authService.getUserData();
      if (!userData?.id) {
        throw new Error('Usuario no autenticado');
      }

      // 2. Llamadas en paralelo para optimizar
      const [
        dailyResponse,
        planResponse,
        routineAssignedResponse,
        gymResponse,
      ] = await Promise.all([
        // Obtener Daily records de las últimas 4 semanas
        dailyService.findDailiesByFields({ UserId: userData.id }),
        // Obtener plan activo del usuario
        planService.findPlansByFields({
          fields: { UserId: userData.id, IsActive: true },
        }),
        // Obtener rutina asignada activa
        routineAssignedService.findRoutineAssignedsByFields({
          UserId: userData.id,
          IsActive: true,
        }),
        // Obtener datos del gimnasio si está disponible
        userData.gymId
          ? gymService.getGymById(userData.gymId)
          : Promise.resolve(null),
      ]);

      // 3. Normalizar y validar respuestas
      const dailyRecords = dailyResponse?.Success
        ? normalizeArray<Daily>(dailyResponse.Data)
        : [];

      const plans = planResponse?.Success
        ? normalizeArray<Plan>(planResponse.Data)
        : [];
      const activePlan = plans.find((p) => p.IsActive) || null;

      const routineAssigneds = routineAssignedResponse?.Success
        ? normalizeArray<RoutineAssigned>(routineAssignedResponse.Data)
        : [];
      const activeRoutine = routineAssigneds.find((r) => r.IsActive) || null;

      const gym = gymResponse?.Success ? (gymResponse.Data as Gym) : null;

      // 4. Obtener RoutineDays si hay rutina activa
      let routineDays: RoutineDay[] = [];
      if (activeRoutine?.RoutineTemplate?.Id) {
        const routineDaysResponse =
          await routineDayService.findRoutineDaysByFields({
            RoutineTemplateId: activeRoutine.RoutineTemplate.Id,
            IsActive: true,
          });
        
        if (routineDaysResponse?.Success) {
          routineDays = normalizeArray<RoutineDay>(routineDaysResponse.Data);
        }
      }

      // 5. Filtrar Daily records por fechas de las últimas 4 semanas
      const weeks = getLast4WeeksBounds();
      const startDate = weeks[0].start;
      const endDate = weeks[weeks.length - 1].end;
      
      const recentDailies = dailyRecords.filter((daily) => {
        const dailyDate = new Date(daily.StartDate);
        return dailyDate >= startDate && dailyDate <= endDate;
      });

      // 6. Transformar datos
      const disciplineData = transformDisciplineData(
        recentDailies,
        routineDays
      );
      
      // Calcular porcentaje de cumplimiento
      const totalWorkoutDays = disciplineData.reduce((acc, week) => {
        return acc + week.days.filter((day) => day.status !== 'rest').length;
      }, 0);

      const completedDays = disciplineData.reduce((acc, week) => {
        return (
          acc + week.days.filter((day) => day.status === 'completed').length
        );
      }, 0);

      const completionPercentage =
        totalWorkoutDays > 0
          ? Math.round((completedDays / totalWorkoutDays) * 100)
          : 0;

      const planInfo = activePlan
        ? transformPlanInfo(activePlan, gym?.Name || 'Gimnasio no especificado')
        : null;

      const todayRoutine = transformTodayRoutine(
        activeRoutine,
        routineDays,
        recentDailies
      );

      // Generar datos detallados de progreso
      const planData = activePlan
        ? transformDetailedProgressData(activePlan, dailyRecords, routineDays)
        : [];
      
      const monthData = transformCurrentMonthProgressData(dailyRecords, routineDays);

      // 7. Actualizar estado
      setData({
        discipline: {
          data: disciplineData,
          completionPercentage,
        },
        planInfo,
        todayRoutine,
        detailedProgress: {
          planData,
          monthData,
          hasActivePlan: !!activePlan,
        },
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      // eslint-disable-next-line no-console
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async (): Promise<void> => {
    await fetchDashboardData();
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
  };
};