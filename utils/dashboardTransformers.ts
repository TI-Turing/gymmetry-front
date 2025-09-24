import { Daily } from '@/models/Daily';
import { Plan } from '@/models/Plan';
import { RoutineDay } from '@/models/RoutineDay';
import { RoutineAssigned } from '@/models/RoutineAssigned';

// Tipos para la interfaz de usuario
export type DayStatus = 'completed' | 'failed' | 'rest';

export interface DisciplineData {
  week: number;
  days: {
    day: string;
    status: DayStatus;
    date?: string; // Para debugging/tracking
  }[];
}

export interface PlanInfoData {
  startDate: string; // Formato dd/mm/yyyy
  endDate: string; // Formato dd/mm/yyyy
  currentGym: string;
  progress: number; // Porcentaje 0-100
}

export interface TodayRoutineData {
  routineName: string;
  hasAttended: boolean;
}

/**
 * Formatea una fecha UTC del backend al formato dd/mm/yyyy local
 */
export const formatDateToLocal = (utcDateString: string): string => {
  try {
    const date = new Date(utcDateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Error formatting date:', utcDateString, error);
    return 'Fecha inválida';
  }
};

/**
 * Obtiene el número de día de la semana (1 = Lunes, 7 = Domingo)
 */
export const getDayOfWeek = (date: Date = new Date()): number => {
  const jsDay = date.getDay(); // 0 = Domingo, 6 = Sábado
  return jsDay === 0 ? 7 : jsDay; // Convertir a 1-7 donde 1 = Lunes
};

/**
 * Obtiene las fechas de inicio y fin de una semana (domingo a sábado)
 */
export const getWeekBounds = (date: Date): { start: Date; end: Date } => {
  const jsDay = date.getDay(); // 0 = Domingo
  const start = new Date(date);
  start.setDate(date.getDate() - jsDay);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
};

/**
 * Obtiene las 4 semanas anteriores (incluyendo la actual) para el análisis de disciplina
 */
export const getLast4WeeksBounds = (): {
  start: Date;
  end: Date;
  weekNumber: number;
}[] => {
  const today = new Date();
  const weeks: {
    start: Date;
    end: Date;
    weekNumber: number;
  }[] = [];
  
  for (let i = 3; i >= 0; i--) {
    const weekDate = new Date(today);
    weekDate.setDate(today.getDate() - i * 7);
    const bounds = getWeekBounds(weekDate);
    weeks.push({
      ...bounds,
      weekNumber: 4 - i,
    });
  }
  
  return weeks;
};

/**
 * Transforma los registros Daily en datos de disciplina para 4 semanas
 */
export const transformDisciplineData = (
  dailyRecords: Daily[],
  routineDays: RoutineDay[]
): DisciplineData[] => {
  const weeks = getLast4WeeksBounds();
  const dayLabels = ['L', 'M', 'X', 'J', 'V', 'S', 'D']; // Lunes a Domingo
  
  // Crear mapa de días de rutina activos (1-7 donde existe RoutineDay)
  const activeDays = new Set(routineDays.map((rd) => rd.DayNumber));
  
  // Debug: Log de días activos
  // eslint-disable-next-line no-console
  console.log('🔍 DEBUG - Días activos en rutina:', Array.from(activeDays));
  // eslint-disable-next-line no-console
  console.log(
    '🔍 DEBUG - RoutineDays:',
    routineDays.map((rd) => ({ day: rd.DayNumber, name: rd.Name }))
  );
  
  return weeks.map((week) => {
    const weekDays = [];
    
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      // Ajustar para empezar en lunes: domingo=0, lunes=1, entonces lunes sería dayOffset=1
      // Pero queremos que lunes sea dayOffset=0, entonces: (dayOffset + 1) % 7
      // Si dayOffset=0 (lunes), (0+1)%7=1 ❌
      // Mejor: empezar desde lunes del week.start
      const mondayOfWeek = new Date(week.start);
      mondayOfWeek.setDate(week.start.getDate() + 1); // week.start es domingo, +1 = lunes
      
      const currentDate = new Date(mondayOfWeek);
      currentDate.setDate(mondayOfWeek.getDate() + dayOffset);
      
      const dayNumber = getDayOfWeek(currentDate);
      const dayLabel = dayLabels[dayOffset];
      
      // Debug: Log detallado por día
      if (dayLabel === 'L') {
        // Solo log para Lunes
        // eslint-disable-next-line no-console
        console.log(
          `🔍 DEBUG - Lunes: dayOffset=${dayOffset}, dayNumber=${dayNumber}, currentDate=${currentDate.toISOString().split('T')[0]}, isActive=${activeDays.has(dayNumber)}`
        );
      }
      
      // Buscar Daily para este día
      const dailyForDay = dailyRecords.find((daily) => {
        const dailyDate = new Date(daily.StartDate);
        return (
          dailyDate.getDate() === currentDate.getDate() &&
          dailyDate.getMonth() === currentDate.getMonth() &&
          dailyDate.getFullYear() === currentDate.getFullYear()
        );
      });
      
      let status: DayStatus;
      
      if (!activeDays.has(dayNumber)) {
        // Día de descanso (no hay RoutineDay para este día)
        status = 'rest';
        if (dayLabel === 'L') {
          // eslint-disable-next-line no-console
          console.log(
            `🔍 DEBUG - Lunes marcado como REST porque no está en activeDays`
          );
        }
      } else if (dailyForDay) {
        // Hay registro Daily, evaluar completación
        status = dailyForDay.Percentage > 30 ? 'completed' : 'failed';
        if (dayLabel === 'L') {
          // eslint-disable-next-line no-console
          console.log(
            `🔍 DEBUG - Lunes con Daily: percentage=${dailyForDay.Percentage}, status=${status}`
          );
        }
      } else {
        // Día de entrenamiento pero sin registro = failed
        status = 'failed';
        if (dayLabel === 'L') {
          // eslint-disable-next-line no-console
          console.log(
            `🔍 DEBUG - Lunes SIN Daily: status=failed (sin registro de entrenamiento)`
          );
        }
      }
      
      weekDays.push({
        day: dayLabel,
        status,
        date: currentDate.toISOString().split('T')[0], // Para debugging
      });
      
      // Debug final para lunes
      if (dayLabel === 'L') {
        // eslint-disable-next-line no-console
        console.log(`🔍 DEBUG - Lunes FINAL: status=${status}`);
      }
    }
    
    return {
      week: week.weekNumber,
      days: weekDays,
    };
  });
};

/**
 * Calcula el progreso de un plan basado en días calendario
 */
export const calculatePlanProgress = (plan: Plan): number => {
  try {
    const startDate = new Date(plan.StartDate);
    const endDate = new Date(plan.EndDate);
    const today = new Date();
    
    // Si el plan no ha comenzado
    if (today < startDate) return 0;
    
    // Si el plan ya terminó
    if (today > endDate) return 100;
    
    const totalDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const daysPassed = Math.ceil(
      (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    return Math.min(Math.round((daysPassed / totalDays) * 100), 100);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Error calculating plan progress:', error);
    return 0;
  }
};

/**
 * Transforma un Plan en PlanInfoData
 */
export const transformPlanInfo = (
  plan: Plan,
  gymName: string
): PlanInfoData => {
  return {
    startDate: formatDateToLocal(plan.StartDate),
    endDate: formatDateToLocal(plan.EndDate),
    currentGym: gymName,
    progress: calculatePlanProgress(plan),
  };
};

/**
 * Determina la rutina de hoy basada en el día de la semana
 */
export const getTodayRoutineName = (
  routineAssigned: RoutineAssigned,
  routineDays: RoutineDay[]
): string => {
  const today = getDayOfWeek();
  
  // Buscar RoutineDay para el día actual
  const todayRoutine = routineDays.find((rd) => rd.DayNumber === today);
  
  if (todayRoutine) {
    return (
      todayRoutine.Name ||
      `Día ${today} - ${routineAssigned.RoutineTemplate?.Name || 'Rutina'}`
    );
  }
  
  return 'Día de descanso';
};

/**
 * Verifica si el usuario completó entrenamiento hoy
 */
export const hasAttendedToday = (dailyRecords: Daily[]): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayDaily = dailyRecords.find((daily) => {
    const dailyDate = new Date(daily.StartDate);
    dailyDate.setHours(0, 0, 0, 0);
    return dailyDate.getTime() === today.getTime();
  });
  
  return todayDaily ? todayDaily.Percentage > 30 : false;
};

/**
 * Transforma datos de rutina en TodayRoutineData
 */
export const transformTodayRoutine = (
  routineAssigned: RoutineAssigned | null,
  routineDays: RoutineDay[],
  dailyRecords: Daily[]
): TodayRoutineData => {
  if (!routineAssigned) {
    return {
      routineName: 'Sin rutina asignada',
      hasAttended: false,
    };
  }
  
  return {
    routineName: getTodayRoutineName(routineAssigned, routineDays),
    hasAttended: hasAttendedToday(dailyRecords),
  };
};

/**
 * Utilidad para normalizar arrays del backend que pueden venir con $values
 */
export const normalizeArray = <T>(raw: unknown): T[] => {
  if (Array.isArray(raw)) return raw;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyRaw = raw as any;
  return anyRaw?.$values ?? [];
};