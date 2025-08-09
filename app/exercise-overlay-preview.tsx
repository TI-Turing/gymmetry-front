import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
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
            tags = JSON.parse(exercise.TagsMuscle) as Record<string, number>;
          } catch {
            tags = {};
          }
        }
        if (!tags || Object.keys(tags).length === 0) {
          tags = {
            Dorsal: 0.0,
            'Glúteos': 0.0,
            Isquiotibiales: 0.0,
            Pantorrillas: 0.0,
            'Sóleo': 0.0,
            Trapecio: 0.1,
            'Tríceps': 0.0,
            'Serrato anterior': 0.0,
            'Bíceps': 0.8,
            'Cuádriceps': 0.0,
            Deltoides: 0.2,
            Dorsales: 0.0,
            Oblicuos: 0.1,
            'Pectoral mayor': 0.0,
            'Recto abdominal': 0.1,
          } as any;
        }
        const overlay = mapTagsToOverlayOpacities(tags);
        if (!cancelled) {
          setOverlayOpacities(overlay);
          setError(null);
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
    <View style={{ flex: 1, padding: 16 }}>
      {error ? <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text> : null}
      <Text style={{ marginBottom: 8 }}>Preview overlays para ejercicio {TARGET_ID}</Text>
      <View style={{ height: '70%' }}>
        <BodyMusclesDiagram palette="mono" width="100%" height="100%" overlayOpacities={overlayOpacities} />
      </View>
    </View>
  );
}
