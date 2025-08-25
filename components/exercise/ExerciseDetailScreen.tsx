import React, { useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  View as RNView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import ScreenWrapper from '@/components/layout/ScreenWrapper';
import { Text } from '@/components/Themed';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { exerciseService } from '@/services/exerciseService';
import type { Exercise } from '@/models/Exercise';
import BodyMusclesDiagram from '@/components/body/BodyMusclesDiagram';
import { mapTagsToOverlayOpacities } from '@/components/body/overlayMapping';
import { normalizeCollection } from '@/utils';

export default function ExerciseDetailScreen() {
  const params = useLocalSearchParams<{ exerciseId?: string }>();
  const initialId = params?.exerciseId ? String(params.exerciseId) : '';

  const [query, setQuery] = useState('');
  const [_exerciseId, _setExerciseId] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState<Exercise | null>(null);
  const [results, setResults] = useState<Exercise[]>([]);
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const [overlayOpacities, setOverlayOpacities] = useState<
    Record<string, number>
  >({});
  const [muscleTags01, setMuscleTags01] = useState<Record<string, number>>({});

  const fetchById = async (id: string) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await exerciseService.getExerciseById(id);
      const ex = (res?.Data || null) as Exercise | null;
      setCurrent(ex);
      // Parsear TagsMuscle y preparar overlays
      let tags: Record<string, number> = {};
      try {
        const raw = (ex as unknown as { TagsMuscle?: unknown })?.TagsMuscle;
        if (raw) {
          if (typeof raw === 'string') tags = JSON.parse(raw);
          else if (typeof raw === 'object')
            tags = raw as Record<string, number>;
        }
      } catch {}
      setMuscleTags01(tags);
      setOverlayOpacities(mapTagsToOverlayOpacities(tags));
    } catch (e) {
      setError('No se pudo cargar el ejercicio');
    } finally {
      setLoading(false);
    }
  };

  // Cargar por id inicial
  useEffect(() => {
    if (initialId) {
      fetchById(initialId);
    }
  }, [initialId]);

  // Búsqueda con debounce por nombre (o cualquier campo)
  useEffect(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    if (!query || query.trim().length < 2) {
      setResults([]);
      return;
    }
    const t = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const body = { Name: query.trim() } as Record<string, unknown>; // contains-match según contrato
        const res = await exerciseService.findExercisesByFields(body);
        const arr = res?.Success ? normalizeCollection<Exercise>(res.Data) : [];
        setResults(arr as Exercise[]);
      } catch {
        setError('Error en la búsqueda');
      } finally {
        setLoading(false);
      }
    }, 350);
    setDebounceTimer(t);
    return () => clearTimeout(t);
  }, [query, debounceTimer]);

  // Derivar datos del gráfico (ordenado desc, valores 0..10)
  const muscleChartData = useMemo(() => {
    const entries = Object.entries(muscleTags01 || {});
    const normalize01 = (v: unknown) => {
      const n = Number(v);
      if (!isFinite(n)) return 0;
      if (n > 1 && n <= 10) return Math.max(0, Math.min(1, n / 10));
      return Math.max(0, Math.min(1, n));
    };
    const mapped = entries
      .map(([label, v]) => {
        const v01 = normalize01(v);
        return { label, value01: v01, value10: v01 * 10 };
      })
      .filter((d) => d.value10 > 0);
    mapped.sort((a, b) => b.value10 - a.value10);
    return mapped;
  }, [muscleTags01]);

  return (
    <ScreenWrapper
      headerTitle={current?.Name || 'Detalle de ejercicio'}
      showBackButton
      onPressBack={() => router.back()}
      backgroundColor="#1A1A1A"
    >
      <ScrollView
        style={{ paddingHorizontal: 16 }}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Input búsqueda en tiempo real */}
        <RNView style={{ marginTop: 12, marginBottom: 4 }}>
          <Text style={styles.label}>Buscar ejercicio</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Nombre del ejercicio"
            placeholderTextColor="#888"
            style={styles.searchInput}
          />
        </RNView>

        {/* Sugerencias bajo el buscador */}
        {results.length > 0 && (
          <RNView style={styles.suggestionsCard}>
            {results.map((ex) => (
              <TouchableOpacity
                key={ex.Id}
                onPress={() => {
                  setCurrent(ex);
                  try {
                    let tags: Record<string, number> = {};
                    const raw = (ex as unknown as { TagsMuscle?: unknown })
                      ?.TagsMuscle;
                    if (raw) {
                      if (typeof raw === 'string') tags = JSON.parse(raw);
                      else if (typeof raw === 'object')
                        tags = raw as Record<string, number>;
                    }
                    setMuscleTags01(tags);
                    setOverlayOpacities(mapTagsToOverlayOpacities(tags));
                  } catch {}
                  setQuery('');
                  setResults([]);
                }}
                style={styles.suggestionRow}
              >
                <Text style={styles.suggestionTitle}>{ex.Name}</Text>
              </TouchableOpacity>
            ))}
          </RNView>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <Text style={{ color: '#FF6B35' }}>{error}</Text>
        ) : current ? (
          <RNView style={{ gap: 12 }}>
            {/* Card de título/descripción */}
            <RNView style={styles.headerCard}>
              <Text style={styles.exerciseName}>{current.Name}</Text>
              {current.Description && (
                <Text style={styles.exerciseDesc}>{current.Description}</Text>
              )}
              {(() => {
                const catName = (
                  current as unknown as { CategoryExercise?: { Name?: string } }
                )?.CategoryExercise?.Name;
                if (catName || current.CategoryExerciseId) {
                  return (
                    <Text style={styles.metaText}>
                      Categoría: {catName ?? current.CategoryExerciseId}
                    </Text>
                  );
                }
                return null;
              })()}
              {Boolean(
                (current as unknown as { MuscleGroup?: string })?.MuscleGroup
              ) && (
                <Text style={styles.metaText}>
                  {'Grupo muscular: '}
                  {
                    (current as unknown as { MuscleGroup?: string })
                      ?.MuscleGroup
                  }
                </Text>
              )}
            </RNView>

            {/* Diagrama de músculos */}
            <RNView style={{ height: 420 }}>
              <BodyMusclesDiagram
                palette="mono"
                width="100%"
                height="100%"
                overlayOpacities={overlayOpacities}
              />
            </RNView>

            {/* Gráfico 0–10 por músculo */}
            <RNView style={styles.chartCard}>
              <Text style={styles.sectionTitle}>
                Enfoque por músculo (0–10)
              </Text>
              {muscleChartData.length === 0 ? (
                <Text style={styles.muted}>Sin datos para mostrar.</Text>
              ) : (
                muscleChartData.map(({ label, value10 }, idx) => (
                  <RNView key={label + idx} style={styles.barRow}>
                    <RNView style={styles.barHeader}>
                      <Text style={styles.barLabel}>{label}</Text>
                      <Text style={styles.barValue}>{Math.round(value10)}</Text>
                    </RNView>
                    <RNView style={styles.barTrack}>
                      <RNView
                        style={[
                          styles.barFill,
                          { width: `${(value10 / 10) * 100}%` },
                        ]}
                      />
                    </RNView>
                  </RNView>
                ))
              )}
              <RNView style={styles.scaleRow}>
                {[0, 2, 4, 6, 8, 10].map((tick) => (
                  <Text key={tick} style={styles.scaleTick}>
                    {tick}
                  </Text>
                ))}
              </RNView>
            </RNView>
          </RNView>
        ) : (
          <Text style={{ color: '#B0B0B0' }}>
            Ingresa un nombre o selecciona un resultado para ver el detalle.
          </Text>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  label: { color: '#B0B0B0', marginBottom: 6 },
  searchInput: {
    backgroundColor: '#1E1E1E',
    color: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  suggestionsCard: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  suggestionRow: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  suggestionTitle: { color: '#FFF', fontWeight: '600' },
  suggestionSub: { color: '#AAA', fontSize: 12, marginTop: 2 },
  headerCard: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
  },
  exerciseName: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  exerciseDesc: { color: '#B0B0B0', marginTop: 6 },
  metaText: { color: '#AAA', marginTop: 6 },
  chartCard: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    padding: 14,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  muted: { color: '#AAA' },
  barRow: { marginBottom: 10 },
  barHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  barLabel: { color: '#DDD' },
  barValue: { color: '#FFF', fontWeight: '700' },
  barTrack: {
    height: 10,
    backgroundColor: '#2A2A2A',
    borderRadius: 6,
    overflow: 'hidden',
  },
  barFill: { height: '100%', backgroundColor: '#FF6B35', borderRadius: 6 },
  scaleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  scaleTick: { color: '#888', fontSize: 12 },
});
