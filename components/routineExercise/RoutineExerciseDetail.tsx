import React, { useMemo, useState } from 'react';
import { ScrollView } from 'react-native';
import FormInput from '../common/FormInput';
import { Text, View } from '@/components/Themed';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { exerciseService } from '@/services';
import BodyMusclesDiagram from '@/components/body/BodyMusclesDiagram';

import { mapTagsToOverlayOpacities } from '@/components/body/overlayMapping';
import type { Exercise } from '@/models/Exercise';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeRoutineExerciseDetailStyles } from './styles/routineExerciseDetail';

export function RoutineExerciseDetail() {
  const styles = useThemedStyles(makeRoutineExerciseDetailStyles);
  const [id, setId] = useState('');
  const [item, setItem] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [overlayOpacities, setOverlayOpacities] = useState<
    Record<string, number>
  >({});
  // Nuevos: mantener los tags crudos (0..1) para el gráfico 0..10
  const [muscleTags01, setMuscleTags01] = useState<Record<string, number>>({});

  const DEFAULT_EXERCISE_ID = 'C1A5BC8E-E264-4B32-A902-D25EEECF35B9';

  const fetchOne = async () => {
    setLoading(true);
    setError(null);
    try {
      const targetId = id?.trim() || DEFAULT_EXERCISE_ID;
      const res = await exerciseService.getExerciseById(targetId);
      const exercise = res.Data as Exercise | null;
      setItem(exercise);
      let tags: Record<string, number> = {};
      if (exercise?.TagsMuscle) {
        try {
          if (typeof exercise.TagsMuscle === 'string') {
            tags = JSON.parse(exercise.TagsMuscle) as Record<string, number>;
          } else if (typeof exercise.TagsMuscle === 'object') {
            tags = exercise.TagsMuscle as any;
          }
        } catch {
          tags = {};
        }
      }

      // No usar datos mock; mostrar solo lo que venga del backend
      setMuscleTags01(tags);
      const overlay = mapTagsToOverlayOpacities(tags);
      setOverlayOpacities(overlay);
    } catch (_e) {
      setError('Error al consultar');
    } finally {
      setLoading(false);
    }
  };

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
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>RoutineExercise - Detalle</Text>
        <FormInput label="Id" value={id} onChangeText={setId} />
        <Button title="Consultar" onPress={fetchOne} />
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            {!item && !error ? (
              <Text style={styles.error}>
                Ejercicio no encontrado o sin datos
              </Text>
            ) : null}
            {item ? (
              <View style={styles.card}>
                {(() => {
                  const ex = item as Exercise;
                  return (
                    <>
                      <Text style={styles.exerciseName}>{ex?.Name}</Text>
                      {!!ex?.Description && (
                        <Text style={styles.exerciseDesc}>
                          {ex.Description}
                        </Text>
                      )}
                    </>
                  );
                })()}
              </View>
            ) : null}

            {/* Diagrama de músculos arriba */}
            <View style={{ height: 420, marginTop: 12 }}>
              <BodyMusclesDiagram
                palette="mono"
                width="100%"
                height="100%"
                overlayOpacities={overlayOpacities}
              />
            </View>

            {/* Gráfico 0–10 por músculo debajo del diagrama */}
            <View style={styles.chartCard}>
              <Text style={styles.sectionTitle}>
                Enfoque por músculo (0–10)
              </Text>
              {muscleChartData.length === 0 ? (
                <Text style={styles.muted}>Sin datos para mostrar.</Text>
              ) : (
                muscleChartData.map(({ label, value10 }, idx) => (
                  <View key={label + idx} style={styles.barRow}>
                    <View style={styles.barHeader}>
                      <Text style={styles.barLabel}>{label}</Text>
                      <Text style={styles.barValue}>{Math.round(value10)}</Text>
                    </View>
                    <View style={styles.barTrack}>
                      <View
                        style={[
                          styles.barFill,
                          { width: `${(value10 / 10) * 100}%` },
                        ]}
                      />
                    </View>
                  </View>
                ))
              )}
              <View style={styles.scaleRow}>
                {[0, 2, 4, 6, 8, 10].map((tick) => (
                  <Text key={tick} style={styles.scaleTick}>
                    {tick}
                  </Text>
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
// styles provided by makeRoutineExerciseDetailStyles via useThemedStyles
