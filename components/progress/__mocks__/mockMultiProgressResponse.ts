// TODO: Eliminar este mock cuando el backend esté disponible
export const mockMultiProgressResponse = {
  // TODO: Eliminar este mock cuando el backend esté disponible
  Success: true,
  Data: [
    {
      Period: { From: '2025-09-01', To: '2025-09-07', Days: 7 },
      Adherence: {
        AdherencePct: 85,
        CompletedDays: 6,
        TargetDays: 7,
        Sessions: 8,
        CurrentStreak: 4,
      },
      Exercises: {
        DistinctExercises: 10,
        TotalSeries: 40,
        TotalReps: 600,
        TopExercises: [
          {
            ExerciseId: 1,
            Name: 'Sentadilla',
            Sessions: 4,
            Series: 12,
            Reps: 180,
          },
          {
            ExerciseId: 2,
            Name: 'Press banca',
            Sessions: 3,
            Series: 9,
            Reps: 135,
          },
        ],
        UnderusedExercises: [
          {
            ExerciseId: 3,
            Name: 'Dominadas',
            Sessions: 1,
            Series: 2,
            Reps: 20,
          },
        ],
        NewExercises: [
          {
            ExerciseId: 4,
            Name: 'Peso muerto',
            Sessions: 1,
            Series: 3,
            Reps: 45,
          },
        ],
      },
      Muscles: {
        Distribution: {
          Pierna: 40,
          Glúteo: 20,
          Espalda: 10,
          Pecho: 10,
          Brazo: 10,
          Core: 10,
        },
        Dominant: ['Pierna', 'Glúteo'],
        Underworked: ['Trapecio'],
        BalanceIndex: 0.8,
        Alerts: ['Desbalance tren inferior/superior'],
      },
      Objectives: {
        Planned: { fuerza: 10, resistencia: 8 },
        Executed: { fuerza: 8, resistencia: 7 },
        Gaps: [{ Objective: 'fuerza', Planned: 10, Executed: 8, Gap: 2 }],
      },
      Discipline: {
        ConsistencyIndex: 0.9,
        CommonStartHour: '07:00',
        ScheduleRegularity: 'Alta',
      },
      Suggestions: [
        {
          Title: 'Hidrátate más',
          Description: 'Bebe al menos 2L de agua al día.',
        },
        {
          Title: 'Varía tus ejercicios',
          Description: 'Incluye nuevos movimientos para evitar estancamiento.',
        },
      ],
      Time: { TotalMinutes: 320, AvgPerSession: 40 },
      GeneratedAt: '2025-09-08T10:00:00Z',
    },
    {
      Period: { From: '2025-08-25', To: '2025-08-31', Days: 7 },
      Adherence: {
        AdherencePct: 70,
        CompletedDays: 5,
        TargetDays: 7,
        Sessions: 6,
        CurrentStreak: 2,
      },
      Exercises: {
        DistinctExercises: 8,
        TotalSeries: 30,
        TotalReps: 450,
        TopExercises: [
          {
            ExerciseId: 1,
            Name: 'Sentadilla',
            Sessions: 3,
            Series: 9,
            Reps: 135,
          },
        ],
        UnderusedExercises: [
          {
            ExerciseId: 5,
            Name: 'Fondos',
            Sessions: 1,
            Series: 2,
            Reps: 20,
          },
        ],
        NewExercises: [
          {
            ExerciseId: 6,
            Name: 'Remo',
            Sessions: 1,
            Series: 2,
            Reps: 30,
          },
        ],
      },
      Muscles: {
        Distribution: {
          Pierna: 30,
          Glúteo: 15,
          Espalda: 20,
          Pecho: 15,
          Brazo: 10,
          Core: 10,
        },
        Dominant: ['Espalda'],
        Underworked: ['Glúteo'],
        BalanceIndex: 0.7,
        Alerts: [],
      },
      Objectives: {
        Planned: { fuerza: 8, resistencia: 7 },
        Executed: { fuerza: 6, resistencia: 6 },
        Gaps: [{ Objective: 'fuerza', Planned: 8, Executed: 6, Gap: 2 }],
      },
      Discipline: {
        ConsistencyIndex: 0.7,
        CommonStartHour: '19:00',
        ScheduleRegularity: 'Media',
      },
      Suggestions: [
        {
          Title: 'Mejora tu descanso',
          Description: 'Intenta dormir 8 horas.',
        },
      ],
      Time: { TotalMinutes: 250, AvgPerSession: 35 },
      GeneratedAt: '2025-09-01T10:00:00Z',
    },
  ],
  History: [
    { Date: '2025-08-25', AdherencePct: 70, Sessions: 6 },
    { Date: '2025-09-01', AdherencePct: 85, Sessions: 8 },
  ],
};
