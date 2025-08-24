import { useState, useCallback } from 'react';
import type { Exercise } from '@/models/Exercise';
import { DraftRoutine, DraftRoutineDay } from './RoutineBuilderTypes';

// Mapeo día número -> nombre
export const DAY_LABELS: Record<number, string> = {
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
  7: 'Domingo',
};

export function useRoutineBuilder() {
  const [selectedDays, setSelectedDays] = useState<number[]>([]); // días elegidos
  const [days, setDays] = useState<DraftRoutineDay[]>([]); // definición por día
  const [name, setName] = useState('');
  const [comments, setComments] = useState('');
  const [gymId, setGymId] = useState<string | null>(null);

  const toggleDay = useCallback((dayNumber: number) => {
    setSelectedDays((prev) => {
      if (prev.includes(dayNumber)) {
        // Quitar día y sus ejercicios
        setDays((d) => d.filter((x) => x.dayNumber !== dayNumber));
        return prev.filter((d) => d !== dayNumber);
      } else {
        // Añadir día con estructura vacía
        setDays((d) => [
          ...d,
          { dayNumber, name: DAY_LABELS[dayNumber], exercises: [] },
        ]);
        return [...prev, dayNumber].sort((a, b) => a - b);
      }
    });
  }, []);

  const addExerciseToDay = useCallback(
    (dayNumber: number, exercise: Exercise) => {
      setDays((prev) =>
        prev.map((d) =>
          d.dayNumber === dayNumber
            ? {
                ...d,
                exercises: [
                  ...d.exercises,
                  { exercise, sets: 3, repsOrTime: '12', notes: '' },
                ],
              }
            : d
        )
      );
    },
    []
  );

  const updateDayExercise = useCallback(
    (
      dayNumber: number,
      index: number,
      patch: Partial<{ sets: number; repsOrTime: string; notes: string }>
    ) => {
      setDays((prev) =>
        prev.map((d) =>
          d.dayNumber === dayNumber
            ? {
                ...d,
                exercises: d.exercises.map((ex, i) =>
                  i === index ? { ...ex, ...patch } : ex
                ),
              }
            : d
        )
      );
    },
    []
  );

  const removeDayExercise = useCallback((dayNumber: number, index: number) => {
    setDays((prev) =>
      prev.map((d) =>
        d.dayNumber === dayNumber
          ? {
              ...d,
              exercises: d.exercises.filter((_, i) => i !== index),
            }
          : d
      )
    );
  }, []);

  const buildDraft = useCallback(
    (): DraftRoutine => ({
      meta: { name, comments, gymId },
      days: days.filter((d) => selectedDays.includes(d.dayNumber)),
    }),
    [name, comments, gymId, days, selectedDays]
  );

  return {
    selectedDays,
    days,
    name,
    setName,
    comments,
    setComments,
    gymId,
    setGymId,
    toggleDay,
    addExerciseToDay,
    updateDayExercise,
    removeDayExercise,
    buildDraft,
  };
}
