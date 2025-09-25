import { DetailedDayData } from '@/components/home/DetailedProgressModal';

// Tipos para los parámetros
interface DailyDataItem {
  date?: string;
  Date?: string;
  completionPercentage?: number;
  CompletionPercentage?: number;
}

interface RoutineDayItem {
  dayOfWeek?: number;
  DayOfWeek?: number;
}

interface _PlanDataItem {
  gym?: { name?: string };
  Gym?: { Name?: string };
}

// Función para calcular el período completo del plan (desde fecha de pago)
export const generatePlanPeriodData = (
  planStartDate: string,
  planEndDate: string,
  dailyData: DailyDataItem[],
  routineDays: RoutineDayItem[]
): DetailedDayData[] => {
  const result: DetailedDayData[] = [];
  const start = new Date(planStartDate);
  const end = new Date(planEndDate);

  // Array de días de la semana para mapear
  const daysOfWeek = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

  // Iterar día por día desde inicio hasta fin del plan
  const currentDate = new Date(start);
  while (currentDate <= end) {
    const dayOfMonth = currentDate.getDate();
    const dayOfWeekIndex = currentDate.getDay();
    const dayOfWeek = daysOfWeek[dayOfWeekIndex];
    const dateString = currentDate.toISOString().split('T')[0];

    // Buscar si hay datos de daily para este día
    const dailyForDay = dailyData.find((daily) => {
      const dateValue = daily.date || daily.Date;
      if (!dateValue) return false;
      const dailyDate = new Date(dateValue);
      return dailyDate.toISOString().split('T')[0] === dateString;
    });

    // Determinar si es día de rutina o descanso
    const isRestDay = !routineDays.some((rd) => {
      const routineDay = rd.dayOfWeek || rd.DayOfWeek;
      return routineDay === dayOfWeekIndex + 1; // Los días en BD van 1-7
    });

    let status: 'completed' | 'failed' | 'rest';
    let percentage = 0;

    if (isRestDay) {
      status = 'rest';
      percentage = 0;
    } else if (dailyForDay) {
      // Hay datos de entrenamiento para este día
      const completion =
        dailyForDay.completionPercentage ||
        dailyForDay.CompletionPercentage ||
        0;
      percentage = Math.round(completion);
      status = percentage >= 80 ? 'completed' : 'failed';
    } else {
      // Es día de rutina pero no hay datos (no entrenó)
      status = 'failed';
      percentage = 0;
    }

    result.push({
      dayOfMonth,
      dayOfWeek,
      status,
      percentage,
      date: dateString,
    });

    // Avanzar al siguiente día
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return result;
};

// Función para formatear fechas para mostrar
export const formatDisplayDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

// Función para obtener el nombre del gym desde los datos
export const getGymNameFromPlan = (planData: unknown): string => {
  const data = planData as Record<string, unknown>;
  const gym = data?.gym as Record<string, unknown>;
  const Gym = data?.Gym as Record<string, unknown>;
  return (gym?.name as string) || (Gym?.Name as string) || 'Mi Gimnasio';
};
