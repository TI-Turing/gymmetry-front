import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Modal,
  View as RNView,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { Text } from '@/components/Themed';
import type { Exercise } from '@/models/Exercise';
import ExerciseList from '@/components/exercise/ExerciseList';
import { exerciseService } from '@/services/exerciseService';
import BodyMusclesDiagram from '@/components/body/BodyMusclesDiagram';
import { mapTagsToOverlayOpacities } from '@/components/body/overlayMapping';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (exercise: Exercise) => void;
  dayName?: string;
}

const ExercisePickerModal: React.FC<Props> = ({
  visible,
  onClose,
  onSelect,
  dayName,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<Exercise | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [overlayOpacities, setOverlayOpacities] = useState<
    Record<string, number>
  >({});
  const [muscleTags01, setMuscleTags01] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async (id: string) => {
    setLoadingDetail(true);
    setError(null);
    try {
      const res = await exerciseService.getExerciseById(id);
      const ex = (res?.Data || null) as Exercise | null;
      setDetail(ex);
      // Parse tags for diagram
      let tags: Record<string, number> = {};
      try {
        const rawHolder = ex as unknown as { TagsMuscle?: unknown };
        const raw = rawHolder?.TagsMuscle;
        if (raw) {
          if (typeof raw === 'string') {
            tags = JSON.parse(raw);
          } else if (typeof raw === 'object') {
            const obj = raw as Record<string, unknown>;
            const norm: Record<string, number> = {};
            for (const [k, v] of Object.entries(obj)) {
              const n = Number(v);
              if (Number.isFinite(n)) norm[k] = n;
            }
            tags = norm;
          }
        }
      } catch {}
      setMuscleTags01(tags);
      setOverlayOpacities(mapTagsToOverlayOpacities(tags));
    } catch (e) {
      setError('No se pudo cargar el detalle');
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  // When modal closes reset
  useEffect(() => {
    if (!visible) {
      setSelectedId(null);
      setDetail(null);
      setOverlayOpacities({});
      setMuscleTags01({});
      setError(null);
    }
  }, [visible]);

  const { width } = useWindowDimensions();
  const small = width < 640; // breakpoint para usar vista apilada
  const [showDetail, setShowDetail] = useState(false);

  const detailName = useMemo(() => {
    if (!detail) return '';
    const d = detail as unknown as { Name?: string; name?: string };
    return d.Name || d.name || '';
  }, [detail]);

  const categoryNameOrId = useMemo(() => {
    if (!detail) return null as string | null;
    const d = detail as unknown as {
      CategoryExercise?: { Name?: string } | null;
      CategoryExerciseId?: string | null;
    };
    return d.CategoryExercise?.Name ?? d.CategoryExerciseId ?? null;
  }, [detail]);

  const handlePick = useCallback(
    (ex: unknown) => {
      const r = (ex || {}) as Record<string, unknown>;
      const id: unknown = (r.Id as unknown) ?? (r.id as unknown);
      if (id) {
        setSelectedId(String(id));
        fetchDetail(String(id));
        // En pantallas pequeñas navegamos a detalle
        if (width < 640) setShowDetail(true);
      }
    },
    [fetchDetail, width]
  );

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
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <RNView style={styles.overlay}>
        <RNView style={styles.sheet}>
          <Text style={styles.headerTitle}>
            Seleccionar ejercicio {dayName ? `(${dayName})` : ''}
          </Text>
          <RNView style={[styles.flexArea, small && styles.flexAreaColumn]}>
            {/* Lista */}
            {(!small || (small && !showDetail)) && (
              <RNView style={[styles.leftPane, small && styles.fullPane]}>
                <ExerciseList
                  onSelect={handlePick}
                  enableSearch
                  dark
                  debounceMs={300}
                  containerStyle={styles.listContainer}
                  limit={100}
                />
              </RNView>
            )}
            {/* Detalle */}
            {(!small || (small && showDetail)) && (
              <RNView style={[styles.rightPane, small && styles.fullPane]}>
                {small && showDetail && (
                  <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => setShowDetail(false)}
                  >
                    <Text style={styles.backBtnText}>← Lista</Text>
                  </TouchableOpacity>
                )}
                {selectedId ? (
                  <ScrollView contentContainerStyle={styles.detailScroll}>
                    {loadingDetail ? (
                      <ActivityIndicator color="#FF6B35" />
                    ) : error ? (
                      <Text style={styles.errorText}>{error}</Text>
                    ) : detail ? (
                      <RNView style={{ gap: 12 }}>
                        <RNView style={styles.detailHeaderCard}>
                          <Text style={styles.exerciseName}>{detailName}</Text>
                          {detail.Description && (
                            <Text style={styles.exerciseDesc}>
                              {detail.Description}
                            </Text>
                          )}
                          {categoryNameOrId ? (
                            <Text style={styles.metaText}>
                              Categoría: {categoryNameOrId}
                            </Text>
                          ) : null}
                        </RNView>
                        <RNView style={{ height: 240 }}>
                          <BodyMusclesDiagram
                            palette="mono"
                            width="100%"
                            height="100%"
                            overlayOpacities={overlayOpacities}
                          />
                        </RNView>
                        <RNView style={styles.chartCard}>
                          <Text style={styles.sectionTitle}>
                            Enfoque (0–10)
                          </Text>
                          {muscleChartData.length === 0 ? (
                            <Text style={styles.muted}>Sin datos.</Text>
                          ) : (
                            muscleChartData.map(({ label, value10 }, idx) => (
                              <RNView key={label + idx} style={styles.barRow}>
                                <RNView style={styles.barHeader}>
                                  <Text style={styles.barLabel}>{label}</Text>
                                  <Text style={styles.barValue}>
                                    {Math.round(value10)}
                                  </Text>
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
                        </RNView>
                        <TouchableOpacity
                          style={styles.addButton}
                          onPress={() => {
                            if (detail) {
                              onSelect(detail);
                              onClose();
                            }
                          }}
                        >
                          <Text style={styles.addButtonText}>
                            Agregar a la rutina
                          </Text>
                        </TouchableOpacity>
                      </RNView>
                    ) : (
                      <Text style={styles.muted}>
                        Selecciona un ejercicio para ver el detalle.
                      </Text>
                    )}
                  </ScrollView>
                ) : (
                  <Text style={styles.muted}>Selecciona un ejercicio.</Text>
                )}
              </RNView>
            )}
          </RNView>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>Cerrar</Text>
          </TouchableOpacity>
        </RNView>
      </RNView>
    </Modal>
  );
};

export default ExercisePickerModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    padding: 24,
  },
  sheet: {
    backgroundColor: '#1E1E1E',
    borderRadius: 24,
    maxHeight: '85%',
    padding: 16,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  flexArea: { flexDirection: 'row', gap: 12, flex: 1, minHeight: 420 },
  flexAreaColumn: { flexDirection: 'column' },
  leftPane: { flex: 1 },
  rightPane: {
    flex: 1,
    backgroundColor: '#202020',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  fullPane: { width: '100%' },
  listContainer: { flex: 1 },
  closeBtn: { alignSelf: 'flex-end', marginTop: 4, padding: 8 },
  closeText: { color: '#B0B0B0', fontSize: 12 },
  detailScroll: { paddingBottom: 32 },
  detailHeaderCard: {
    backgroundColor: '#262626',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  exerciseName: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  exerciseDesc: { color: '#B0B0B0', marginTop: 6 },
  metaText: { color: '#AAA', marginTop: 6 },
  chartCard: {
    backgroundColor: '#262626',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  muted: { color: '#888', fontSize: 12 },
  barRow: { marginBottom: 8 },
  barHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  barLabel: { color: '#DDD', fontSize: 12 },
  barValue: { color: '#FFF', fontWeight: '700', fontSize: 12 },
  barTrack: {
    height: 8,
    backgroundColor: '#2A2A2A',
    borderRadius: 5,
    overflow: 'hidden',
  },
  barFill: { height: '100%', backgroundColor: '#FF6B35', borderRadius: 5 },
  errorText: { color: '#FF6B35' },
  addButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  addButtonText: { color: '#FFF', fontWeight: '600' },
  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: 8,
    backgroundColor: '#333',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  backBtnText: { color: '#FFF', fontSize: 12 },
});
