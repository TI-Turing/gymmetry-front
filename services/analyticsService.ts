import { apiService } from './apiService';
import type { ApiResponse } from './apiService';
import type { AnalyticsSummaryRequest, AnalyticsSummaryResponse } from '@/dto';
import { dailyService } from './dailyService';
import { routineDayService } from './routineDayService';
import { authService } from './authService';

const base = '/analytics';

export const analyticsService = {
  async getSummary(
    req: AnalyticsSummaryRequest
  ): Promise<ApiResponse<AnalyticsSummaryResponse>> {
    // Convención: POST a /analytics/summary con body tipado
    return apiService.post(`${base}/summary`, req);
  },

  // Mock local para desarrollo si el backend aún no está listo
  async getSummaryMock(
    _: AnalyticsSummaryRequest
  ): Promise<ApiResponse<AnalyticsSummaryResponse>> {
    const totalWorkouts = 18;
    const totalCalories = 5400;
    const totalMins = 18 * 42; // promedio 42 min
    const data: AnalyticsSummaryResponse = {
      TotalWorkouts: totalWorkouts,
      TotalCalories: totalCalories,
      TotalDurationMinutes: totalMins,
      AvgDurationMinutes: Math.round(totalMins / Math.max(1, totalWorkouts)),
      DaysAdvanced: 16,
      DaysExpected: 20,
      CurrentStreakDays: 4,
      LongestStreakDays: 9,
      CurrentWeightKg: 75.2,
      WeightChangeKg: -2.1,
      RoutineUsage: [
        {
          RoutineTemplateId: 'rt-1',
          RoutineTemplateName: 'Full Body A',
          DaysUsed: 7,
          DaysAssigned: 8,
          UsagePercent: 87.5,
        },
        {
          RoutineTemplateId: 'rt-2',
          RoutineTemplateName: 'Push/Pull/Legs',
          DaysUsed: 6,
          DaysAssigned: 9,
          UsagePercent: 66.7,
        },
        {
          RoutineTemplateId: 'rt-3',
          RoutineTemplateName: 'Cardio HIIT',
          DaysUsed: 5,
          DaysAssigned: 10,
          UsagePercent: 50.0,
        },
      ],
      WeekdayDiscipline: [
        { Weekday: 1, DaysTrained: 4 },
        { Weekday: 2, DaysTrained: 3 },
        { Weekday: 3, DaysTrained: 3 },
        { Weekday: 4, DaysTrained: 4 },
        { Weekday: 5, DaysTrained: 3 },
        { Weekday: 6, DaysTrained: 1 },
        { Weekday: 0, DaysTrained: 0 },
      ],
      BranchAttendance: [
        {
          BranchId: 'b1',
          BranchName: 'Sede Centro',
          Visits: 10,
          Percent: 55.6,
        },
        { BranchId: 'b2', BranchName: 'Sede Norte', Visits: 6, Percent: 33.3 },
        { BranchId: 'b3', BranchName: 'Sede Sur', Visits: 2, Percent: 11.1 },
      ],
    };
    return { Success: true, Message: 'OK', Data: data, StatusCode: 200 };
  },

  async getSummaryFromDaily(
    req: AnalyticsSummaryRequest
  ): Promise<ApiResponse<AnalyticsSummaryResponse>> {
    try {
      // 1) Obtener dailies por usuario y rango (sin horas en filtros)
      const payload: Record<string, any> = {
        UserId: req.UserId,
        StartDate: req.StartDate,
        EndDate: req.EndDate,
      };
      const dResp = await dailyService.findDailiesByFields(payload);
      let dailies: any[] = [];
      if (dResp?.Success && dResp.Data) {
        const raw: any = dResp.Data as any;
        dailies = Array.isArray(raw) ? raw : raw?.$values || [];
      }

      // Normalizar fecha sin horas y filtrar inclusivo
      const inRange = (iso: string) => {
        const d = (iso || '').slice(0, 10);
        return d >= req.StartDate && d <= req.EndDate;
      };
      const byDate = new Map<
        string,
        { anyAdvance: boolean; durations: number[]; items: any[] }
      >();
      for (const d of dailies) {
        const dateKey = String(d?.StartDate || '').slice(0, 10);
        if (!inRange(dateKey)) continue;
        const adv = Number(d?.Percentage || 0) > 0;
        const start = new Date(d?.StartDate || '').getTime();
        const end = new Date(d?.EndDate || '').getTime();
        const mins =
          Number.isFinite(start) && Number.isFinite(end) && end > start
            ? Math.round((end - start) / 60000)
            : 0;
        const rec = byDate.get(dateKey) || {
          anyAdvance: false,
          durations: [],
          items: [],
        };
        rec.anyAdvance = rec.anyAdvance || adv;
        rec.durations.push(mins);
        rec.items.push(d);
        byDate.set(dateKey, rec);
      }

      const daysAdvanced = Array.from(byDate.values()).reduce(
        (acc, v) => acc + (v.anyAdvance ? 1 : 0),
        0
      );
      const totalWorkouts = dailies.length;
      const totalDurationMinutes = Array.from(byDate.values()).reduce(
        (acc, v) => acc + v.durations.reduce((a, b) => a + b, 0),
        0
      );
      const avgDuration =
        totalWorkouts > 0
          ? Math.round(totalDurationMinutes / totalWorkouts)
          : 0;

      // 2) Determinar días esperados a partir de RoutineDay de la rutina activa
      // - Intentar obtener RoutineTemplateId activo; si no, inferir desde el primer Daily -> RoutineDayId
      let routineTemplateId: string | null =
        authService.getActiveRoutineTemplateId?.() || null;
      if (!routineTemplateId) {
        const first = dailies.find((x) => Boolean(x?.RoutineDayId));
        if (first?.RoutineDayId) {
          const rd = await routineDayService.getRoutineDay(
            String(first.RoutineDayId)
          );
          if (rd?.Success && rd.Data)
            routineTemplateId = String((rd.Data as any).RoutineTemplateId);
        }
      }

      let schedDays: number[] = [];
      if (routineTemplateId) {
        const rResp = await routineDayService.findRoutineDaysByFields({
          RoutineTemplateId: routineTemplateId,
        });
        let rds: any[] = [];
        if (rResp?.Success && rResp.Data) {
          const raw: any = rResp.Data as any;
          rds = Array.isArray(raw) ? raw : raw?.$values || [];
        }
        const set = new Set<number>();
        for (const r of rds) {
          const dn = Number(r?.DayNumber);
          if (dn >= 1 && dn <= 7) set.add(dn);
        }
        schedDays = Array.from(set.values());
      }

      const countDays = (
        start: string,
        end: string,
        allowed: number[] | null
      ): number => {
        const s = new Date(start + 'T00:00:00');
        const e = new Date(end + 'T00:00:00');
        let c = 0;
        for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
          if (!allowed || allowed.length === 0) {
            c++;
            continue;
          }
          const jsDay = d.getDay(); // 0..6, domingo=0
          const dayNum = jsDay === 0 ? 7 : jsDay; // 1..7, lunes=1
          if (allowed.includes(dayNum)) c++;
        }
        return c;
      };
      const daysExpected = countDays(
        req.StartDate,
        req.EndDate,
        schedDays.length ? schedDays : null
      );

      // 3) Disciplina por día semana a partir de días avanzados
      const wdCounts: Record<number, number> = {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
      };
      for (const [dateKey, rec] of byDate.entries()) {
        if (!rec.anyAdvance) continue;
        const d = new Date(dateKey + 'T00:00:00');
        const w = d.getDay();
        wdCounts[w] = (wdCounts[w] || 0) + 1;
      }
      const WeekdayDiscipline = [0, 1, 2, 3, 4, 5, 6].map((w) => ({
        Weekday: w as 0 | 1 | 2 | 3 | 4 | 5 | 6,
        DaysTrained: wdCounts[w] || 0,
      }));

      // 4) Rachas (current y longest) con días avanzados
      const advancedDates = Array.from(byDate.entries())
        .filter(([_, v]) => v.anyAdvance)
        .map(([k]) => k)
        .sort();
      const asDate = (s: string) => new Date(s + 'T00:00:00');
      let longest = 0;
      let current = 0;
      let prev: Date | null = null;
      for (const s of advancedDates) {
        const d = asDate(s);
        if (!prev) {
          current = 1;
          longest = Math.max(longest, current);
          prev = d;
          continue;
        }
        const diffDays = Math.round((d.getTime() - prev.getTime()) / 86400000);
        if (diffDays === 1) current += 1;
        else current = 1;
        longest = Math.max(longest, current);
        prev = d;
      }
      // current streak hasta el ultimo día avanzado; si hoy está dentro del rango y es consecutivo, se refleja
      const CurrentStreakDays = current;
      const LongestStreakDays = longest;

      const result: AnalyticsSummaryResponse = {
        TotalWorkouts: totalWorkouts,
        TotalCalories: 0, // pendiente de modelo de calorías
        TotalDurationMinutes: totalDurationMinutes,
        AvgDurationMinutes: avgDuration,
        DaysAdvanced: daysAdvanced,
        DaysExpected: daysExpected,
        CurrentStreakDays,
        LongestStreakDays,
        CurrentWeightKg: null,
        WeightChangeKg: null,
        RoutineUsage: [],
        WeekdayDiscipline,
        BranchAttendance: [],
      };
      return { Success: true, Message: 'OK', Data: result, StatusCode: 200 };
    } catch (e) {
      return {
        Success: false,
        Message: 'FAILED',
        Data: undefined as any,
        StatusCode: 500,
      };
    }
  },
};

export default analyticsService;
