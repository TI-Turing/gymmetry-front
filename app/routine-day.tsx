import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View as RNView, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { View, Text } from '@/components/Themed';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import ScreenWrapper from '@/components/layout/ScreenWrapper';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ExerciseModal from '@/components/routineDay/ExerciseModal';
import type { RoutineDay } from '@/models/RoutineDay';
import { routineDayService } from '@/services';

type ExerciseProgress = {
  completedSets: number;
  isCompleted: boolean;
};

const MOCK_TEMPLATE_ID = 'mock-template-123';

function getTodayDayNumber() {
  const d = new Date().getDay(); // 0 (Sun) - 6 (Sat)
  return d === 0 ? 7 : d; // 1-7 (Mon=1 ... Sun=7)
}

const makeMockRoutineForToday = (): RoutineDay[] => {
  const today = getTodayDayNumber();
  const nowIso = new Date().toISOString();
  const base = {
    CreatedAt: nowIso,
    UpdatedAt: null,
    DeletedAt: null,
    Ip: null,
    IsActive: true,
    RoutineTemplateId: MOCK_TEMPLATE_ID,
    RoutineTemplate: {} as any,
  } as const;
  // Cada item representa un ejercicio del día actual
  return [
    {
      ...base,
      Id: 'rd-1',
      DayNumber: today,
      Name: 'Press de banca',
      Sets: 4,
      Repetitions: '12',
      Notes: null,
      ExerciseId: 'ex-press-banca',
      Exercise: null,
    },
    {
      ...base,
      Id: 'rd-2',
      DayNumber: today,
      Name: 'Aperturas con mancuernas',
      Sets: 3,
      Repetitions: '12-12-10',
      Notes: null,
      ExerciseId: 'ex-aperturas',
      Exercise: null,
    },
    {
      ...base,
      Id: 'rd-3',
      DayNumber: today,
      Name: 'Fondos en paralelas',
      Sets: 3,
      Repetitions: '10',
      Notes: null,
      ExerciseId: 'ex-fondos',
      Exercise: null,
    },
    {
      ...base,
      Id: 'rd-4',
      DayNumber: today,
      Name: 'Extensión de tríceps en polea',
      Sets: 4,
      Repetitions: '12',
      Notes: null,
      ExerciseId: 'ex-triceps-polea',
      Exercise: null,
    },
  ];
};

export default function RoutineDayScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exercises, setExercises] = useState<RoutineDay[]>([]);
  const [progressById, setProgressById] = useState<Record<string, ExerciseProgress>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedExercise = useMemo(
    () => exercises.find(e => e.Id === selectedId) || null,
    [selectedId, exercises]
  );

  const overallProgress = useMemo(() => {
    if (exercises.length === 0) return 0;
    const completed = exercises.filter(e => progressById[e.Id]?.isCompleted).length;
    return Math.round((completed / exercises.length) * 100);
  }, [exercises, progressById]);

  useEffect(() => {
    const fetchToday = async () => {
      setLoading(true);
      setError(null);
      try {
        const today = getTodayDayNumber();
        const templateId = MOCK_TEMPLATE_ID; // En el futuro: id real asignado al usuario

        // Estructura lista para usar el servicio real
        // const resp = await routineDayService.findRoutineDaysByFields({
        //   RoutineTemplateId: templateId,
        //   DayNumber: today,
        // });
        // const data = resp.Data ?? [];

        // Por ahora, datos mock
        const data = makeMockRoutineForToday();

        // Inicializar progreso por ejercicio
        const initialProgress: Record<string, ExerciseProgress> = {};
        data.forEach(d => {
          initialProgress[d.Id] = { completedSets: 0, isCompleted: false };
        });
        setProgressById(initialProgress);
        setExercises(data);
      } catch (_e) {
        setError('No se pudo cargar la rutina de hoy');
      } finally {
        setLoading(false);
      }
    };
    fetchToday();
  }, []);

  const onMarkSet = (exerciseId: string) => {
    setProgressById(prev => {
      const curr = prev[exerciseId] || { completedSets: 0, isCompleted: false };
      const maxSets = exercises.find(e => e.Id === exerciseId)?.Sets ?? 0;
      const nextCompleted = Math.min(curr.completedSets + 1, maxSets);
      return {
        ...prev,
        [exerciseId]: {
          completedSets: nextCompleted,
          isCompleted: nextCompleted >= maxSets,
        },
      };
    });
  };

  const onUndoSet = (exerciseId: string) => {
    setProgressById(prev => {
      const curr = prev[exerciseId] || { completedSets: 0, isCompleted: false };
      const maxSets = exercises.find(e => e.Id === exerciseId)?.Sets ?? 0;
      const nextCompleted = Math.max(curr.completedSets - 1, 0);
      return {
        ...prev,
        [exerciseId]: {
          completedSets: nextCompleted,
          isCompleted: nextCompleted >= maxSets,
        },
      };
    });
  };

  const onMarkExercise = (exerciseId: string) => {
    setProgressById(prev => {
      const maxSets = exercises.find(e => e.Id === exerciseId)?.Sets ?? 0;
      return {
        ...prev,
        [exerciseId]: { completedSets: maxSets, isCompleted: true },
      };
    });
  };

  const renderItem = ({ item }: { item: RoutineDay }) => {
    const prog = progressById[item.Id] || { completedSets: 0, isCompleted: false };
    const percent = item.Sets > 0 ? Math.round((prog.completedSets / item.Sets) * 100) : 0;
    return (
      <TouchableOpacity
        onPress={() => setSelectedId(item.Id)}
        style={[styles.card, prog.isCompleted && styles.cardCompleted]}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.Name}</Text>
          {prog.isCompleted ? (
            <FontAwesome name="check-circle" size={20} color="#4CAF50" />
          ) : (
            <Text style={styles.cardMeta}>{prog.completedSets}/{item.Sets} sets</Text>
          )}
        </View>
        <Text style={styles.cardSub}>Reps: {item.Repetitions}</Text>
        <View style={styles.progressBar}>
          <RNView style={[styles.progressFill, { width: `${percent}%` }]} />
        </View>
        <Text style={styles.progressText}>{percent}%</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenWrapper
      headerTitle="Rutina de Hoy"
      showBackButton
      onPressBack={() => router.back()}
      backgroundColor="#121212"
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Progreso global */}
        <View style={styles.overall}>
          <Text style={styles.overallLabel}>Progreso</Text>
          <View style={styles.progressBar}>
            <RNView style={[styles.progressFill, { width: `${overallProgress}%` }]} />
          </View>
          <Text style={styles.progressText}>{overallProgress}%</Text>
        </View>

        {/* Lista de ejercicios */}
        <View style={styles.content}>
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <Text style={styles.error}>{error}</Text>
          ) : (
            <FlatList
              data={exercises}
              keyExtractor={(it) => it.Id}
              renderItem={renderItem}
              scrollEnabled={false}
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 8 }}
            />
          )}
        </View>
      </ScrollView>

      {/* Modal de ejercicio */}
      <ExerciseModal
        visible={!!selectedId}
        exercise={selectedExercise}
        completedSets={selectedExercise ? (progressById[selectedExercise.Id]?.completedSets ?? 0) : 0}
        onClose={() => setSelectedId(null)}
        onMarkSet={(exerciseId: string) => onMarkSet(exerciseId)}
        onUndoSet={(exerciseId: string) => onUndoSet(exerciseId)}
        onMarkExercise={(exerciseId: string) => onMarkExercise(exerciseId)}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  overall: { padding: 16, gap: 8 },
  overallLabel: { color: '#B0B0B0' },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#2A2A2A',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: '#FF6B35' },
  progressText: { color: '#FFFFFF', marginTop: 4 },
  content: { flex: 1 },
  error: { color: 'red', paddingHorizontal: 16 },
  card: {
    backgroundColor: '#1D1D1D',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  cardCompleted: { borderColor: '#4CAF50', borderWidth: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  cardMeta: { color: '#B0B0B0' },
  cardSub: { color: '#B0B0B0', marginTop: 6 },
});
