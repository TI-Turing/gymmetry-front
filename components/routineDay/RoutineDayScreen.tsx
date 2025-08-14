import React, { useEffect, useMemo, useState, useRef } from 'react';
import { StyleSheet, View as RNView, FlatList, TouchableOpacity, TouchableWithoutFeedback, ScrollView, Animated, Vibration, Platform, Share, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import motivationalPhrases from '@/utils/motivationalPhrases.json';
import { View, Text } from '@/components/Themed';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import ScreenWrapper from '@/components/layout/ScreenWrapper';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ExerciseModal from '@/components/routineDay/ExerciseModal';
import Button from '@/components/common/Button';
import type { RoutineDay } from '@/models/RoutineDay';
import { routineDayService } from '@/services';
import { routineTemplateService } from '@/services';
import { authService } from '@/services/authService';
import ConfirmationModal from '@/components/common/ConfirmationModal';

type ExerciseProgress = {
  completedSets: number;
  isCompleted: boolean;
};

function getTodayDayNumber() {
  const d = new Date().getDay(); // 0 (Sun) - 6 (Sat)
  return d === 0 ? 7 : d; // 1-7 (Mon=1 ... Sun=7)
}

function getWeekdayNameEs(dayNum: number) {
  const names = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
  return names[(dayNum - 1) % 7];
}

export default function RoutineDayScreen() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exercises, setExercises] = useState<RoutineDay[]>([]);
  const [progressById, setProgressById] = useState<Record<string, ExerciseProgress>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [celebrateAnim] = useState(new Animated.Value(0));
  const [finalPhrase, setFinalPhrase] = useState<string | null>(null);
  const completionTriggeredRef = React.useRef(false);
  const [summaryVisible, setSummaryVisible] = useState(false); // Placeholder
  const [showFinishOptions, setShowFinishOptions] = useState(false);
  const [routineFinishedMode, setRoutineFinishedMode] = useState<null | 'partial' | 'full'>(null);
  const [confirmResetVisible, setConfirmResetVisible] = useState(false);
  const [routineTemplateName, setRoutineTemplateName] = useState<string | null>(null);
  const [routineTemplateDesc, setRoutineTemplateDesc] = useState<string | null>(null);
  const [showTemplateInfo, setShowTemplateInfo] = useState(false);
  const todayNumber = useMemo(() => getTodayDayNumber(), []);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(todayNumber);
  const progressLoadedRef = useRef(false); // para evitar guardar inmediatamente tras la carga inicial
  const hasAnyProgress = useMemo(() => {
    return Object.values(progressById).some(p => p.completedSets > 0 || p.isCompleted);
  }, [progressById]);

  const selectedExercise = useMemo(
    () => exercises.find(e => e.Id === selectedId) || null,
    [selectedId, exercises]
  );

  const overallProgress = useMemo(() => {
    if (exercises.length === 0) return 0;
    let totalSets = 0;
    let doneSets = 0;
    for (const ex of exercises) {
      const sets = ex.Sets || 0;
      totalSets += sets;
      const prog = progressById[ex.Id];
      if (prog) {
        doneSets += Math.min(prog.completedSets, sets);
      }
    }
    if (totalSets === 0) return 0;
    return Math.round((doneSets / totalSets) * 100);
  }, [exercises, progressById]);

  // Orden y etiquetas de categorías
  const CATEGORY_ORDER: { id: string; label: string }[] = [
    { id: 'E779339F-36BB-4EF8-9135-CF36BE4C4B07', label: 'Calentamiento' },
    { id: 'D9507CD0-1EDA-4D4D-A408-13FF76C14D88', label: 'Cardio' },
    { id: 'BC9D888F-4612-4BBB-ABEC-FF1EE76D129A', label: 'Ejercicio principal (compuesto)' },
    { id: '6C60B74C-F83A-4AF9-ABD3-BB929D9FAE6A', label: 'Funcional' },
    { id: '9F9F94D0-7CD1-48E9-81A7-86AA503CA685', label: 'Aislado (focalizado)' },
    { id: '642FC19F-500F-47AE-A81B-1303AC978D9D', label: 'Estiramiento' },
  ];

  const normalizeCatId = (id?: string | null) => (id || '').trim().toUpperCase();

  const groupedSections = useMemo(() => {
    if (!exercises || exercises.length === 0) return [] as { key: string; label: string; items: RoutineDay[] }[];
    const map: Record<string, RoutineDay[]> = {};
    // usar IDs normalizados como claves
    CATEGORY_ORDER.forEach(({ id }) => { map[normalizeCatId(id)] = []; });
    const uncategorized: RoutineDay[] = [];
    let unmatchedDebug: { exId: string; rawCat: string | null }[] = [];
    exercises.forEach(ex => {
      const raw = ex.Exercise?.CategoryExerciseId || null;
      const norm = normalizeCatId(raw);
      if (norm && map[norm]) {
        map[norm].push(ex);
      } else {
        uncategorized.push(ex);
        unmatchedDebug.push({ exId: ex.Id, rawCat: raw });
      }
    });
  // Debug removido
    // Ordenar cada grupo alfabéticamente por nombre de ejercicio (fallback RoutineDay.Name)
    const sortFn = (a: RoutineDay, b: RoutineDay) => {
      const n1 = (a.Exercise?.Name || a.Name || '').toLocaleLowerCase();
      const n2 = (b.Exercise?.Name || b.Name || '').toLocaleLowerCase();
      return n1.localeCompare(n2);
    };
    Object.keys(map).forEach(k => map[k].sort(sortFn));
    uncategorized.sort(sortFn);
    const sections = CATEGORY_ORDER
      .map(c => ({ key: c.id, label: c.label, items: map[normalizeCatId(c.id)] }))
      .filter(s => s.items.length > 0);
    if (uncategorized.length > 0) sections.push({ key: 'otros', label: 'Otros', items: uncategorized });
    return sections;
  }, [exercises, CATEGORY_ORDER]);

  const categoryLabelById = useMemo(() => {
    const map: Record<string,string> = {};
    CATEGORY_ORDER.forEach(c => { map[normalizeCatId(c.id)] = c.label; });
    return map;
  }, [CATEGORY_ORDER]);

  // Animación y efectos al completar 100%
  useEffect(() => {
    if (overallProgress === 100) {
      celebrateAnim.setValue(0);
      Animated.timing(celebrateAnim, { toValue: 1, duration: 900, useNativeDriver: true }).start();
      if (!completionTriggeredRef.current) {
        completionTriggeredRef.current = true;
        if (Array.isArray(motivationalPhrases) && motivationalPhrases.length > 0) {
          const pick = motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)];
          if (pick?.text) setFinalPhrase(pick.text as string);
        }
        try { if (Platform.OS === 'web') Vibration.vibrate(80); else Vibration.vibrate([0,120,80,120,200]); } catch {}
      }
    }
  }, [overallProgress]);

  // Marcar rutina completa manualmente
  const openFinishOptions = () => {
    if (overallProgress === 100 || routineFinishedMode) return;
    setShowFinishOptions(true);
  };

  const finalizePartial = () => {
    setShowFinishOptions(false);
    setRoutineFinishedMode('partial');
    if (!finalPhrase && Array.isArray(motivationalPhrases) && motivationalPhrases.length) {
      const pick = motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)];
      if (pick?.text) setFinalPhrase(pick.text as string);
    }
    try {
      if (Platform.OS === 'web') Vibration.vibrate(40); else Vibration.vibrate([0,60,40]);
    } catch {}
  };

  const finalizeFull = () => {
    setShowFinishOptions(false);
    if (routineFinishedMode === 'full') return;
    setProgressById(prev => {
      const updated: Record<string, ExerciseProgress> = { ...prev };
      exercises.forEach(ex => {
        updated[ex.Id] = { completedSets: ex.Sets, isCompleted: true };
      });
      return updated;
    });
    setRoutineFinishedMode('full');
  };

  const resetProgress = () => {
    if (!hasAnyProgress) return;
    setConfirmResetVisible(true);
  };

  const performReset = async () => {
    setConfirmResetVisible(false);
    setProgressById(prev => {
      const updated: Record<string, ExerciseProgress> = { ...prev };
      exercises.forEach(ex => {
        updated[ex.Id] = { completedSets: 0, isCompleted: false };
      });
      return updated;
    });
    setRoutineFinishedMode(null);
    setFinalPhrase(null);
    completionTriggeredRef.current = false;
    celebrateAnim.setValue(0);
    try {
      for (const ex of exercises) {
        const key = `exercise_${ex.Id}_progress`;
        if (Platform.OS === 'web' && typeof window !== 'undefined' && 'localStorage' in window) {
          window.localStorage.removeItem(key);
        } else {
          await AsyncStorage.removeItem(key);
        }
      }
    } catch {}
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Entrenamiento completado 💪 #Gymmetry',
      });
    } catch {}
  };

  const handleShowSummary = () => {
    setSummaryVisible(true);
  };

  useEffect(() => {
    const fetchForDay = async (dayNum: number) => {
      setLoading(true);
      setError(null);
      try {
        let templateId = authService.getActiveRoutineTemplateId();
        if (!templateId) {
          try {
            const stored = await AsyncStorage.getItem('@active_routine_template_id');
            if (stored) templateId = stored;
          } catch {}
        }
        if (!templateId) {
          setExercises([]);
          setError('No tienes una rutina activa configurada.');
          return;
        }

  const body = { RoutineTemplateId: templateId, DayNumber: dayNum } as any;
  // debug request body removido
        let all: RoutineDay[] = [];
        try {
          const resp = await routineDayService.findRoutineDaysByFields(body);
          // Normalizar posibles formas .NET ($values)
          let extracted: any[] = [];
          if (resp?.Success && resp?.Data) {
            if (Array.isArray(resp.Data)) {
              extracted = resp.Data;
            } else if ((resp.Data as any).$values && Array.isArray((resp.Data as any).$values)) {
              extracted = (resp.Data as any).$values;
            }
          }
          // debug response removido
          all = extracted as any;
    } catch (e) {
      // error silencioso
        }

        try {
          const tplResp = await routineTemplateService.getRoutineTemplate(templateId);
          if (tplResp?.Success && tplResp.Data) {
            setRoutineTemplateName(tplResp.Data.Name);
            setRoutineTemplateDesc(tplResp.Data.Comments || null);
          } else {
            setRoutineTemplateName(null);
          }
        } catch { setRoutineTemplateName(null); }

  // El backend ya debería filtrar por DayNumber, pero filtramos por seguridad.
        const data = all.filter(d => Number((d as any).DayNumber) === dayNum);
        if (data.length === 0) {
          // debug de días disponibles removido
          setError('No hay ejercicios configurados para hoy en tu rutina.');
        }

        const loadedProgress: Record<string, ExerciseProgress> = {};
        for (const d of data) {
          const key = `exercise_${d.Id}_progress`;
          let persisted: any = null;
          try {
            if (Platform.OS === 'web' && typeof window !== 'undefined' && 'localStorage' in window) {
              const raw = window.localStorage.getItem(key);
              if (raw) persisted = JSON.parse(raw);
            } else {
              const raw = await AsyncStorage.getItem(key);
              if (raw) persisted = JSON.parse(raw);
            }
          } catch {}
          const completedSets = Math.min(
            typeof persisted?.completedSets === 'number' ? persisted.completedSets : 0,
            d.Sets || 0
          );
          loadedProgress[d.Id] = {
            completedSets,
            isCompleted: completedSets >= (d.Sets || 0),
          };
        }
        setProgressById(loadedProgress);
        setExercises(data);
        progressLoadedRef.current = true;
      } catch (_e) {
        setError('No se pudo cargar la rutina de hoy');
      } finally {
        setLoading(false);
      }
    };
    fetchForDay(selectedDayNumber);
  }, [selectedDayNumber]);

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

  // Persistir cada cambio de progreso (incluye deshacer y completar ejercicio) 
  useEffect(() => {
    if (!progressLoadedRef.current) return; // saltar hasta que la carga inicial termine
    (async () => {
      for (const ex of exercises) {
        const prog = progressById[ex.Id];
        const key = `exercise_${ex.Id}_progress`;
        try {
          if (!prog || prog.completedSets === 0) {
            // Si no hay avance, limpiar (opcional)
            if (Platform.OS === 'web' && typeof window !== 'undefined' && 'localStorage' in window) {
              window.localStorage.removeItem(key);
            } else {
              await AsyncStorage.removeItem(key);
            }
            continue;
          }
          const payload = JSON.stringify({
            exerciseId: ex.Id,
            completedSets: prog.completedSets,
            lastCompleted: new Date().toISOString(),
          });
          if (Platform.OS === 'web' && typeof window !== 'undefined' && 'localStorage' in window) {
            window.localStorage.setItem(key, payload);
          } else {
            await AsyncStorage.setItem(key, payload);
          }
        } catch {
          // silencioso
        }
      }
    })();
  }, [progressById, exercises]);

  const renderItem = ({ item }: { item: RoutineDay }) => {
    const prog = progressById[item.Id] || { completedSets: 0, isCompleted: false };
    const percent = item.Sets > 0 ? Math.round((prog.completedSets / item.Sets) * 100) : 0;
    return (
      <TouchableOpacity
        onPress={() => setSelectedId(item.Id)}
        style={[styles.card, prog.isCompleted && styles.cardCompleted]}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.Exercise?.Name || item.Name}</Text>
          {prog.isCompleted ? (
            <FontAwesome name="check-circle" size={20} color="#4CAF50" />
          ) : (
            <Text style={styles.cardMeta}>{prog.completedSets}/{item.Sets} sets</Text>
          )}
        </View>
  {/* Etiqueta de categoría temporal removida */}
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
  <ScrollView contentContainerStyle={{ paddingBottom: 160 }}>
        {/* Encabezado de la plantilla activa */}
        <View style={styles.templateHeaderWrapper}>
          {routineTemplateName && (
            <View style={styles.templateHeaderRow}>
              <View style={{ flex:1 }}>
                <Text style={styles.templateTitle} numberOfLines={2}>{routineTemplateName}</Text>
                <Text style={styles.weekdayLabel}>
                  {getWeekdayNameEs(selectedDayNumber)}
                  {selectedDayNumber !== todayNumber && (
                    <Text style={{ color:'#AAA' }}> (Hoy: {getWeekdayNameEs(todayNumber)})</Text>
                  )}
                </Text>
              </View>
              <TouchableOpacity onPress={() => routineTemplateDesc && setShowTemplateInfo(true)} disabled={!routineTemplateDesc} style={styles.infoButton}>
                <FontAwesome name="info-circle" size={20} color={routineTemplateDesc ? '#FF6B35' : '#555'} />
              </TouchableOpacity>
            </View>
          )}
          {!routineTemplateName && !loading && (
            <Text style={styles.templateTitleFallback}>Rutina activa no identificada</Text>
          )}
          {/* Selector de día */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }} contentContainerStyle={{ gap: 8 }}>
            {['L','M','X','J','V','S','D'].map((lbl, idx) => {
              const dayVal = idx + 1; // 1-7
              const active = dayVal === selectedDayNumber;
              return (
                <TouchableOpacity
                  key={dayVal}
                  onPress={() => setSelectedDayNumber(dayVal)}
                  style={[styles.dayChip, active && styles.dayChipActive]}
                  disabled={loading || dayVal === selectedDayNumber}
                >
                  <Text style={[styles.dayChipText, active && styles.dayChipTextActive]}>{lbl}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        {/* Progreso global */}
        <View style={styles.overall}>
          <Text style={styles.overallLabel}>Progreso</Text>
          <View style={styles.progressBar}>
            <RNView style={[styles.progressFill, { width: `${overallProgress}%` }]} />
          </View>
          <Text style={styles.progressText}>{overallProgress}%</Text>
      {(overallProgress === 100 || routineFinishedMode === 'full') && (
            <Animated.View
              style={{
                marginTop: 12,
                padding: 16,
                backgroundColor: '#1E2A1E',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#2F5F2F',
                transform: [
                  {
                    scale: celebrateAnim.interpolate({
                      inputRange: [0, 0.6, 1],
                      outputRange: [0.5, 1.05, 1],
                    }),
                  },
                ],
                opacity: celebrateAnim,
              }}
            >
              <Text style={styles.congratsTitle}>¡Entrenamiento completado! 💪</Text>
              <Text style={styles.congratsSubtitle}>Gran trabajo, mantén la constancia. Marca la diferencia cada día.</Text>
              {finalPhrase && (
                <Text style={styles.finalPhrase}>“{finalPhrase}”</Text>
              )}
              <View style={styles.actionsRow}>
                <Button
                  title="Ver resumen"
                  onPress={handleShowSummary}
                  variant="secondary"
                  style={styles.actionButton}
                />
                <Button
                  title="Compartir"
                  onPress={handleShare}
                  style={styles.actionButton}
                />
              </View>
            </Animated.View>
          )}
          {routineFinishedMode === 'partial' && overallProgress < 100 && (
            <Animated.View
              style={{
                marginTop: 12,
                padding: 16,
                backgroundColor: '#2A2620',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#6A4F2F',
                opacity: 0.95,
              }}
            >
              <Text style={[styles.congratsTitle, { color: '#FFA94D' }]}>Rutina finalizada (avance {overallProgress}%)</Text>
              <Text style={styles.congratsSubtitle}>Buen esfuerzo aunque no hayas terminado todo. La constancia se construye día a día.</Text>
              {finalPhrase && (
                <Text style={styles.finalPhrase}>“{finalPhrase}”</Text>
              )}
              <View style={styles.actionsRow}>
                <Button
                  title="Compartir"
                  onPress={handleShare}
                  style={styles.actionButton}
                />
              </View>
            </Animated.View>
          )}
        </View>

        {/* Lista de ejercicios agrupados por categoría */}
        <View style={styles.content}>
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <View style={{ paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center', paddingVertical: 32 }}>
              <FontAwesome name="calendar-times-o" size={48} color="#666" style={{ marginBottom: 16 }} />
              <Text style={styles.error}>{error}</Text>
              {(error.includes('No tienes una rutina activa') || error.includes('No hay ejercicios configurados')) && (
                <Button
                  title="Explorar rutinas"
                  onPress={() => router.push('/routine-templates')}
                  style={{ marginTop: 16, width: 200 }}
                />
              )}
            </View>
          ) : (
            <>
              {groupedSections.map(section => (
                <View key={section.key} style={{ paddingHorizontal: 16, marginBottom: 4 }}>
                  <View style={styles.catSeparatorWrapper}>
                    <View style={styles.catSeparatorLine} />
                    <Text style={styles.catSeparatorText}>{section.label}</Text>
                    <View style={styles.catSeparatorLine} />
                  </View>
                  <View style={{ marginTop: 6 }}>
                    {section.items.map(item => (
                      <View key={item.Id}>{renderItem({ item })}</View>
                    ))}
                  </View>
                </View>
              ))}
            </>
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

      {/* Modal opciones de finalización */}
      <Modal
        visible={showFinishOptions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFinishOptions(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowFinishOptions(false)}>
          <View style={styles.finishOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.finishCard}>
                <Text style={styles.finishTitle}>¿Cómo prefieres terminar esta rutina?</Text>
                <Text style={styles.finishSubtitle}>Puedes cerrar con tu avance actual o marcar todo como completado.</Text>
                <View style={{ height: 12 }} />
                <Button
                  title="Marcar todo y finalizar"
                  onPress={finalizeFull}
                />
                <Button
                  title="Finalizar con avance actual"
                  onPress={finalizePartial}
                  variant="secondary"
                  style={{ marginBottom: 10 }}
                  disabled={overallProgress < 30}
                />
                {overallProgress < 30 && (
                  <Text style={{ color: '#B05555', fontSize: 12, textAlign: 'center', marginTop: 8 }}>
                    Necesitas al menos 30% de avance para esta opción.
                  </Text>
                )}
                <TouchableOpacity onPress={() => setShowFinishOptions(false)} style={{ marginTop: 14 }}>
                  <Text style={{ textAlign: 'center', color: '#AAA' }}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Overlay info de la rutina */}
      <Modal
        visible={showTemplateInfo}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTemplateInfo(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowTemplateInfo(false)}>
          <View style={styles.infoOverlay}> 
            <TouchableWithoutFeedback>
              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>{routineTemplateName}</Text>
                <ScrollView style={{ maxHeight: 240 }}>
                  <Text style={styles.infoDesc}>{routineTemplateDesc || 'Sin descripción.'}</Text>
                </ScrollView>
                <Button title="Cerrar" onPress={() => setShowTemplateInfo(false)} style={{ marginTop: 16 }} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal de confirmación para reiniciar progreso */}
      <ConfirmationModal
        visible={confirmResetVisible}
        title="Reiniciar progreso"
        message="Perderás el avance registrado en todos los ejercicios. ¿Deseas continuar?"
        confirmLabel="Reiniciar"
        cancelLabel="Cancelar"
        onCancel={() => setConfirmResetVisible(false)}
        onConfirm={performReset}
        destructive
      />

      {/* Barra inferior fija */}
      {!routineFinishedMode && overallProgress < 100 && !loading && !error && (
        <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <View style={styles.bottomBarContent}>
            <Button
              title="Finalizar rutina"
              onPress={openFinishOptions}
              variant="secondary"
              style={styles.bottomBarButton}
            />
            {hasAnyProgress && (
              <Button
                title="Reiniciar"
                onPress={resetProgress}
                variant="secondary"
                style={styles.bottomBarButtonSecondary}
              />
            )}
          </View>
        </View>
      )}
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
  error: { 
    color: '#FF6B35', 
    fontSize: 16, 
    textAlign: 'center', 
    marginBottom: 8,
    lineHeight: 22
  },
  card: {
    backgroundColor: '#1D1D1D',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  cardCompleted: { borderColor: '#4CAF50', borderWidth: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1F1F1F', },
  cardTitle: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  cardMeta: { color: '#B0B0B0' },
  cardSub: { color: '#B0B0B0', marginTop: 6 },
  congratsTitle: { color: '#4CAF50', fontSize: 16, fontWeight: '700', textAlign: 'center', marginBottom: 4 },
  congratsSubtitle: { color: '#B0D8B0', fontSize: 13, textAlign: 'center', lineHeight: 18 },
  finalPhrase: { color: '#E3FFE3', fontSize: 13, textAlign: 'center', marginTop: 10, fontStyle: 'italic', lineHeight: 18 },
  cardCategoryTag: {
    color: '#FFA94D',
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  actionsRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  actionButton: { flex: 1 },
  finishOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 24,
  },
  finishCard: {
    backgroundColor: '#1F1F1F',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  finishTitle: { color: '#FFF', fontSize: 16, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  finishSubtitle: { color: '#B0B0B0', fontSize: 13, textAlign: 'center', lineHeight: 18 },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(18,18,18,0.95)',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#262626',
  },
  bottomBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bottomBarButton: {
    flex: 1,
  },
  bottomBarButtonSecondary: {
    width: 130,
  },
  sectionHeader: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 4,
  },
  templateHeaderWrapper: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 4,
  },
  templateHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  templateTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 22,
  },
  templateTitleFallback: {
    color: '#888',
    fontSize: 16,
    fontStyle: 'italic',
  },
  infoButton: {
    padding: 4,
  },
  infoOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    padding: 28,
  },
  infoCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  infoTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  infoDesc: {
    color: '#CCCCCC',
    fontSize: 14,
    lineHeight: 20,
  },
  weekdayLabel: {
    color: '#FF6B35',
    fontSize: 13,
    marginTop: 4,
    fontWeight: '600',
  },
  dayChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333',
  },
  dayChipActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  dayChipText: {
    color: '#AAA',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  dayChipTextActive: {
    color: '#FFF',
  },
  catSeparatorWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  catSeparatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#2E2E2E',
  },
  catSeparatorText: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
// (No modal real de resumen aún; summaryVisible reservado para futura implementación)
