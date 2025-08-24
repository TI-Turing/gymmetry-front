import React, { useCallback, useMemo, useState } from 'react';
import {
  View as RNView,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  useWindowDimensions,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/Themed';
import ExerciseList from '@/components/exercise/ExerciseList';
import { exerciseService } from '@/services/exerciseService';
import type { Exercise } from '@/models/Exercise';
import BodyMusclesDiagram from '@/components/body/BodyMusclesDiagram';
import { mapTagsToOverlayOpacities } from '@/components/body/overlayMapping';

interface Props {
  dayName: string;
  onCancel: () => void;
  onAdd: (exercise: Exercise) => void;
}

const EmbeddedExerciseSelector: React.FC<Props> = ({
  dayName,
  onCancel,
  onAdd,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<Exercise | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [overlayOpacities, setOverlayOpacities] = useState<
    Record<string, number>
  >({});
  const [muscleTags01, setMuscleTags01] = useState<Record<string, number>>({});
  const [showDiagramFull, setShowDiagramFull] = useState(false);
  const [diagramSide, setDiagramSide] = useState<'front' | 'back'>('front');
  const { width, height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const small = width < 720; // breakpoint sencillo

  const fetchDetail = useCallback(async (id: string) => {
    setLoadingDetail(true);
    setError(null);
    try {
      const res = await exerciseService.getExerciseById(id);
      const ex = (res?.Data || null) as Exercise | null;
      setDetail(ex);
      let tags: Record<string, number> = {};
      try {
        const raw: unknown = (ex as any)?.TagsMuscle;
        if (raw) {
          if (typeof raw === 'string') tags = JSON.parse(raw);
          else if (typeof raw === 'object') tags = raw as any;
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

  const handleSelect = useCallback(
    (ex: unknown) => {
      const id: unknown = (ex as any).Id || (ex as any).id;
      if (id) {
        setSelectedId(String(id));
        fetchDetail(String(id));
      }
    },
    [fetchDetail]
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
        return { label, value10: v01 * 10 };
      })
      .filter((d) => d.value10 > 0);
    mapped.sort((a, b) => b.value10 - a.value10);
    return mapped;
  }, [muscleTags01]);

  return (
    <RNView style={styles.container}>
      <RNView style={styles.headerRow}>
        <Text style={styles.title}>Seleccionar ejercicio ({dayName})</Text>
        <TouchableOpacity onPress={onCancel}>
          <Text style={styles.cancelInline}>Cancelar</Text>
        </TouchableOpacity>
      </RNView>
      <RNView style={[styles.body, small && styles.bodyColumn]}>
        <RNView style={[styles.listPane, small && styles.fullPane]}>
          <ExerciseList
            onSelect={handleSelect}
            enableSearch
            remoteSearch
            remoteMinChars={2}
            dark
            debounceMs={300}
            staticRender
            suggestionStyle
          />
        </RNView>
        <RNView style={[styles.detailPane, small && styles.fullPane]}>
          {selectedId ? (
            <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
              {loadingDetail ? (
                <ActivityIndicator color="#FF6B35" />
              ) : error ? (
                <Text style={styles.error}>{error}</Text>
              ) : detail ? (
                <RNView style={{ gap: 12 }}>
                  <RNView style={styles.detailHeaderCard}>
                    <Text style={styles.exerciseName}>
                      {(detail as any).Name || (detail as any).name}
                    </Text>
                    {detail.Description && (
                      <Text style={styles.exerciseDesc}>
                        {detail.Description}
                      </Text>
                    )}
                    {((detail as any)?.CategoryExercise?.Name ||
                      (detail as any).CategoryExerciseId) && (
                      <Text style={styles.metaText}>
                        Categoría:{' '}
                        {(detail as any)?.CategoryExercise?.Name ??
                          (detail as any).CategoryExerciseId}
                      </Text>
                    )}
                  </RNView>
                  <TouchableOpacity
                    style={styles.inlineDiagramButton}
                    onPress={() => {
                      setDiagramSide('front');
                      setShowDiagramFull(true);
                    }}
                  >
                    <Text style={styles.inlineDiagramButtonText}>
                      Ver grupo muscular trabajado
                    </Text>
                  </TouchableOpacity>
                  <RNView style={styles.chartCard}>
                    <Text style={styles.sectionTitle}>Enfoque (0–10)</Text>
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
                    style={styles.addBtn}
                    onPress={() => detail && onAdd(detail)}
                  >
                    <Text style={styles.addBtnText}>Agregar a la rutina</Text>
                  </TouchableOpacity>
                </RNView>
              ) : (
                <Text style={styles.muted}>
                  Selecciona un ejercicio de la lista.
                </Text>
              )}
            </ScrollView>
          ) : (
            <Text style={styles.muted}>
              Selecciona un ejercicio de la lista.
            </Text>
          )}
        </RNView>
      </RNView>
      <Modal
        visible={showDiagramFull}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <RNView style={styles.modalBackdrop}>
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={() => setShowDiagramFull(false)}
          />
          <RNView style={styles.modalContent} pointerEvents="box-none">
            <TouchableOpacity
              style={styles.rotateBtn}
              onPress={() =>
                setDiagramSide((prev) => (prev === 'front' ? 'back' : 'front'))
              }
              activeOpacity={0.85}
            >
              <Text style={styles.rotateBtnText}>
                {diagramSide === 'front' ? '↻' : '↺'}
              </Text>
            </TouchableOpacity>
            {(() => {
              const aspect = 500 / 700; // w/h del SVG de un lado (más alto que ancho)
              // Como es más alto que ancho, usar toda la altura disponible
              const figHeight = screenHeight;
              const figWidth = figHeight * aspect;

              return (
                <RNView style={StyleSheet.absoluteFillObject}>
                  <BodyMusclesDiagram
                    palette="mono"
                    width="100%"
                    height="100%"
                    overlayOpacities={overlayOpacities}
                    side={diagramSide}
                  />
                </RNView>
              );
            })()}
            <Text style={styles.tapToClose}>Toca para cerrar</Text>
          </RNView>
        </RNView>
      </Modal>
    </RNView>
  );
};

export default EmbeddedExerciseSelector;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 18,
    padding: 16,
    marginTop: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  cancelInline: { color: '#FF6B35', fontSize: 12, fontWeight: '600' },
  body: { flexDirection: 'row', gap: 12 },
  bodyColumn: { flexDirection: 'column' },
  listPane: { flex: 1 },
  detailPane: {
    flex: 1,
    backgroundColor: '#202020',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    minHeight: 260,
  },
  fullPane: { width: '100%' },
  error: { color: '#FF6B35' },
  detailHeaderCard: {
    backgroundColor: '#262626',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  exerciseName: { color: '#FFF', fontSize: 15, fontWeight: '700' },
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
  addBtn: {
    backgroundColor: '#FF6B35',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  addBtnText: { color: '#FFF', fontWeight: '600' },
  inlineDiagramButton: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  inlineDiagramButtonText: {
    color: '#FF6B35',
    fontWeight: '600',
    fontSize: 12,
  },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)' },
  modalContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalDiagramWrapper: { alignItems: 'center', justifyContent: 'center' },
  tapToClose: {
    marginTop: 12,
    color: '#BBB',
    fontSize: 12,
    textAlign: 'center',
    width: '100%',
  },
  rotateBtn: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#FF6B35',
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 6,
    elevation: 10,
  },
  rotateBtnText: { color: '#FFF', fontSize: 22, fontWeight: '700' },
});
