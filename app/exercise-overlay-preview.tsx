import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import BodyMusclesDiagram from '@/components/body/BodyMusclesDiagram';
import { exerciseService } from '@/services/exerciseService';
import type { Exercise } from '@/models/Exercise';
import { mapTagsToOverlayOpacities } from '@/components/body/overlayMapping';

const TARGET_ID = 'C1A5BC8E-E264-4B32-A902-D25EEECF35B9';

export default function ExerciseOverlayPreviewScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overlayOpacities, setOverlayOpacities] = useState<Record<string, number>>({});

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const res = await exerciseService.getExerciseById(TARGET_ID);
  const exercise = res.Data as Exercise | null;
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
  const overlay = mapTagsToOverlayOpacities(tags);
        if (!cancelled) {
          setOverlayOpacities(overlay);
          setError(exercise ? null : 'Ejercicio no encontrado o sin datos');
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Error cargando ejercicio');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
        {error ? <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text> : null}
        <Text style={{ marginBottom: 8 }}>Preview overlays para ejercicio {TARGET_ID}</Text>
        <View style={{ height: 420 }}>
          <BodyMusclesDiagram palette="mono" width="100%" height="100%" overlayOpacities={overlayOpacities} />
        </View>
      </ScrollView>
    </View>
  );
}
