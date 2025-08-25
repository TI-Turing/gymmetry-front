import React, { useState } from 'react';
import { ScrollView, View as RNView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import ScreenWrapper from '@/components/layout/ScreenWrapper';
import { Text } from '@/components/Themed';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import type { RoutineDay } from '@/models/RoutineDay';
import { routineDayService } from '@/services';

function getWeekdayNameEs(dayNum: number) {
  const names = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];
  return names[(dayNum - 1) % 7];
}

export default function RoutineTemplateDaysScreen() {
  const params = useLocalSearchParams<{ templateId?: string }>();
  const templateId = params?.templateId ? String(params.templateId) : null;

  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataByDay, setDataByDay] = useState<Record<number, RoutineDay[]>>({});

  const fetchDay = React.useCallback(
    async (dayNumber: number) => {
      if (!templateId) return;
      setLoading(true);
      setError(null);
      try {
        const body: Record<string, unknown> = {
          RoutineTemplateId: templateId,
          DayNumber: dayNumber,
        };
        const resp = await routineDayService.findRoutineDaysByFields(body);
        let extracted: unknown[] = [];
        if (resp?.Success && resp?.Data) {
          const raw: unknown = resp.Data as unknown;
          if (Array.isArray(raw)) extracted = raw as unknown[];
          else if (
            typeof raw === 'object' &&
            raw !== null &&
            Array.isArray((raw as { $values?: unknown[] }).$values)
          )
            extracted = (raw as { $values: unknown[] }).$values;
        }
        const filtered = (extracted as RoutineDay[]).filter(
          (d) =>
            Number(
              (d as unknown as { DayNumber?: number | string }).DayNumber
            ) === dayNumber
        );
        setDataByDay((prev) => ({ ...prev, [dayNumber]: filtered }));
      } catch (e) {
        setError('No se pudo cargar los ejercicios del día');
      } finally {
        setLoading(false);
      }
    },
    [templateId]
  );

  React.useEffect(() => {
    if (!templateId) return;
    fetchDay(1);
  }, [templateId, fetchDay]);

  // fetchDay definido arriba con useCallback

  const days = [1, 2, 3, 4, 5, 6, 7];
  const exercises = dataByDay[selectedDay] || [];

  return (
    <ScreenWrapper
      headerTitle="Días de la rutina"
      showBackButton
      onPressBack={() => router.back()}
      backgroundColor="#1A1A1A"
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        style={{ paddingHorizontal: 16 }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 12 }}
          contentContainerStyle={{ gap: 8 }}
        >
          {days.map((d) => {
            const active = d === selectedDay;
            return (
              <TouchableOpacity
                key={d}
                onPress={() => {
                  setSelectedDay(d);
                  if (!dataByDay[d]) fetchDay(d);
                }}
                style={{
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                  borderRadius: 14,
                  backgroundColor: active ? '#FF6B35' : '#1E1E1E',
                  borderWidth: 1,
                  borderColor: active ? '#FF6B35' : '#333',
                }}
              >
                <Text
                  style={{
                    color: active ? '#FFF' : '#AAA',
                    fontSize: 13,
                    fontWeight: '600',
                    letterSpacing: 0.5,
                  }}
                >
                  {['L', 'M', 'X', 'J', 'V', 'S', 'D'][d - 1]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <RNView style={{ marginTop: 16 }}>
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <Text style={{ color: '#FF6B35' }}>{error}</Text>
          ) : exercises.length === 0 ? (
            <Text style={{ color: '#B0B0B0' }}>
              Sin ejercicios configurados para {getWeekdayNameEs(selectedDay)}.
            </Text>
          ) : (
            <RNView>
              {exercises.map((ex) => (
                <TouchableOpacity
                  key={ex.Id}
                  onPress={() => {
                    const exu = ex as unknown as {
                      ExerciseId?: unknown;
                      Exercise?: { Id?: unknown };
                    };
                    const eid =
                      (typeof exu.ExerciseId === 'string'
                        ? exu.ExerciseId
                        : undefined) ||
                      (typeof exu.Exercise?.Id === 'string'
                        ? exu.Exercise.Id
                        : undefined);
                    if (eid)
                      router.push({
                        pathname: '/exercise-detail',
                        params: { exerciseId: String(eid) },
                      });
                  }}
                  style={{
                    backgroundColor: '#1D1D1D',
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: 12,
                  }}
                >
                  <Text
                    style={{ color: '#FFF', fontSize: 16, fontWeight: '600' }}
                  >
                    {ex.Exercise?.Name || ex.Name}
                  </Text>
                  <Text style={{ color: '#B0B0B0', marginTop: 6 }}>
                    Reps: {ex.Repetitions} • Sets: {ex.Sets}
                  </Text>
                </TouchableOpacity>
              ))}
            </RNView>
          )}
        </RNView>

        <RNView style={{ marginTop: 8 }}>
          <Button
            title={`Ir a ${getWeekdayNameEs(selectedDay)} en Rutina de Hoy`}
            variant="secondary"
            onPress={() =>
              router.push({
                pathname: '/routine-day',
                params: { day: String(selectedDay) },
              })
            }
          />
        </RNView>
      </ScrollView>
    </ScreenWrapper>
  );
}
