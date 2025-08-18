// Tipos auxiliares para el constructor de rutinas
import type { Exercise } from '@/models/Exercise';

export interface DraftRoutineMeta {
  name: string;
  comments: string;
  gymId: string | null; // Puede venir del contexto del usuario o selección futura
}

export interface DraftRoutineDayExercise {
  exercise: Exercise;           // Ejercicio base
  sets: number;                 // Número de sets
  repsOrTime: string;           // Texto libre: "12", "12-10-8", "30s", "30s/lado"
  notes?: string;               // Notas opcionales
}

export interface DraftRoutineDay {
  dayNumber: number;            // 1 (Lunes) .. 7 (Domingo) – se usará convención 1-7
  name: string;                 // Etiqueta mostrada ("Lunes", etc.)
  exercises: DraftRoutineDayExercise[];
}

export interface DraftRoutine {
  meta: DraftRoutineMeta;
  days: DraftRoutineDay[];      // Sólo días seleccionados por el usuario
}
