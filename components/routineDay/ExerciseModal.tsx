import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import {
  Modal,
  TouchableOpacity,
  Animated,
  Vibration,
  Platform,
  Pressable,
} from 'react-native';
import { View, Text } from '@/components/Themed';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '@/components/common/Button';
import type { RoutineDay } from '@/models/RoutineDay';
import motivationalPhrases from '@/utils/motivationalPhrases.json';
import { router } from 'expo-router';
import {
  getItem as rsGetItem,
  setItem as rsSetItem,
  getJSON as rsGetJSON,
  setJSON as rsSetJSON,
  keyExerciseReps,
  keyExerciseProgress,
} from '@/utils/routineStorage';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { scheduleLocalNotificationAsync } from '@/utils/localNotifications';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { useColorScheme } from '@/components/useColorScheme';
import { makeExerciseModalStyles } from './styles/exerciseModal';
import { useI18n } from '@/i18n';
import { AdMobBanner } from '@/components/ad';

interface ExerciseModalProps {
  visible: boolean;
  exercise: RoutineDay | null;
  onClose: () => void;
  onMarkSet: (exerciseId: string) => void;
  onUndoSet: (exerciseId: string) => void;
  onMarkExercise: (exerciseId: string) => void;
  completedSets: number;
}

const ExerciseModal: React.FC<ExerciseModalProps> = ({
  visible,
  exercise,
  onClose,
  onMarkSet,
  onUndoSet,
  onMarkExercise,
  completedSets,
}) => {
  const { t } = useI18n();
  const colorScheme = useColorScheme();
  const styles = useThemedStyles(makeExerciseModalStyles);
  const { settings } = useAppSettings();
  const tintColor = Colors[colorScheme].tint;
  const [isExecuting, setIsExecuting] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));
  const [fadeAnim] = useState(new Animated.Value(0));
  const isCompleted = exercise ? completedSets >= exercise.Sets : false;
  // Próximo set a ejecutar
  const nextSetNumber = exercise
    ? Math.min(completedSets + 1, exercise.Sets)
    : 1;

  // Sistema de conteo automático de repeticiones
  const [currentReps, setCurrentReps] = useState<number>(0);
  const repsTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer para ejercicios de tiempo
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [timerRemaining, setTimerRemaining] = useState<number>(0);
  const [timerPhase, setTimerPhase] = useState<'on' | 'off' | 'prep' | null>(
    null
  );
  const timerPhaseRef = useRef<'on' | 'off' | 'prep' | null>(null);
  const [wasStopped, setWasStopped] = useState<boolean>(false);
  const [cyclesTotal, setCyclesTotal] = useState<number>(1);
  const [cyclesLeft, setCyclesLeft] = useState<number>(1);
  const cyclesLeftRef = useRef<number>(1);
  const [soundCues, setSoundCues] = useState<boolean>(true);
  const [prepSeconds, setPrepSeconds] = useState<number>(10);

  // Cargar preferencia de sonido
  useEffect(() => {
    (async () => {
      try {
        const raw = await rsGetItem('@sound_cues_enabled');
        if (raw != null) setSoundCues(raw === '1' || raw === 'true');
      } catch {}
    })();
  }, []);

  // Cargar segundos de preparación
  useEffect(() => {
    (async () => {
      try {
        const raw = await rsGetItem('@prep_seconds');
        const val = raw == null ? 10 : Math.max(0, parseInt(raw, 10) || 0);
        setPrepSeconds(val);
      } catch {}
    })();
  }, []);

  const saveSoundPref = async (val: boolean) => {
    try {
      await rsSetItem('@sound_cues_enabled', val ? '1' : '0');
    } catch {}
  };

  // Parsear especificación de tiempo
  const timeSpec = useMemo(() => {
    const raw = String(exercise?.Repetitions || '')
      .trim()
      .toLowerCase();
    if (!raw)
      return null as null | {
        mode: 'single' | 'interval';
        on: number;
        off?: number;
        cycles?: number;
        perLabel?: string;
      };
    // Xs ON / Ys OFF x N (opcional multiplicador de ciclos)
    const intervalMatch = raw.match(
      /^(\d+)\s*s\s*on\s*\/\s*(\d+)\s*s\s*off(?:\s*[x×]\s*(\d+))?$/i
    );
    if (intervalMatch) {
      const on = parseInt(intervalMatch[1], 10);
      const off = parseInt(intervalMatch[2], 10);
      const cyc = intervalMatch[3] ? parseInt(intervalMatch[3], 10) : 1;
      const cycles = !isNaN(cyc) && cyc > 0 ? cyc : 1;
      if (!isNaN(on) && !isNaN(off))
        return { mode: 'interval', on, off, cycles };
    }
    // Xm o Xs exacto (con o sin espacios)
    const singleExact = raw.match(/^(\d+)\s*([ms])$/i);
    if (singleExact) {
      const val = parseInt(singleExact[1], 10);
      const unit = singleExact[2];
      if (!isNaN(val)) {
        const on = unit === 'm' ? val * 60 : val;
        return { mode: 'single', on, cycles: 1 };
      }
    }
    // Patrón general: encontrar número+unidad en cualquier parte y soportar "por ..." después del tiempo (ej: "30s por lado")
    const generic = raw.match(/(\d+)\s*([ms])\b/i);
    if (generic) {
      const val = parseInt(generic[1], 10);
      const unit = generic[2].toLowerCase();
      if (!isNaN(val)) {
        const on = unit === 'm' ? val * 60 : val;
        // Si aparece "por" DESPUÉS del match, interpretamos que es por lado/pierna/brazo => 2 ciclos
        const afterIdx = (generic.index ?? 0) + generic[0].length;
        const rest = raw.slice(afterIdx);
        const hasPorAfter = rest.indexOf('por') !== -1; // coincide con "por lado", "por pierna", etc.
        let perLabel: string | undefined;
        if (hasPorAfter) {
          const m = rest.match(/\bpor\s+(lado|pierna|brazo)\b/);
          perLabel = m && m[1] ? m[1] : 'lado';
        }
        const cycles = hasPorAfter ? 2 : 1;
        return { mode: 'single', on, cycles, perLabel };
      }
    }
    return null;
  }, [exercise?.Repetitions]);

  const clearTimer = React.useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = () => {
    if (!timeSpec) return;
    setWasStopped(false);
    // Configurar fase inicial y tiempo restante
    setTimerPhase('on');
    timerPhaseRef.current = 'on';
    setTimerRemaining(timeSpec.on);
    // Configurar ciclos
    const total = timeSpec.cycles || 1;
    setCyclesTotal(total);
    setCyclesLeft(total);
    cyclesLeftRef.current = total;
    setIsExecuting(true);
    // Iniciar animación visual también
    startPulseAnimation();
    // Intervalo de 1s
    clearTimer();
    const PREP_SECONDS = Math.max(0, prepSeconds);
    timerRef.current = setInterval(() => {
      setTimerRemaining((prev) => {
        const next = Math.max(prev - 1, 0);
        if (next > 0) return next;
        // Fase terminó
        if (timeSpec.mode === 'interval') {
          const phase = timerPhaseRef.current;
          if (phase === 'on') {
            // Cambiar a OFF
            setTimerPhase('off');
            timerPhaseRef.current = 'off';
            if (soundCues) {
              try {
                if (Platform.OS === 'web') Vibration.vibrate(30);
                else Vibration.vibrate([0, 40]);
              } catch {}
            }
            return timeSpec.off || 0;
          }
          if (phase === 'off') {
            // Terminó OFF: cerrar ciclo
            const remaining = Math.max((cyclesLeftRef.current || 1) - 1, 0);
            setCyclesLeft(remaining);
            cyclesLeftRef.current = remaining;
            if (remaining > 0) {
              // Intervalo de preparación antes del siguiente ciclo
              setTimerPhase('prep');
              timerPhaseRef.current = 'prep';
              if (soundCues) {
                try {
                  if (Platform.OS === 'web') Vibration.vibrate(20);
                  else Vibration.vibrate([0, 20]);
                } catch {}
              }
              return PREP_SECONDS;
            }
            // Sin más ciclos, avisar fin de intervalo si corresponde
            if (settings.trainingNotificationsEnabled) {
              scheduleLocalNotificationAsync(
                {
                  title: 'Intervalo finalizado',
                  body: 'Buen trabajo. Continúa con el siguiente ejercicio.',
                },
                undefined,
                { settings }
              ).catch(() => undefined);
            }
          }
          if (phase === 'prep') {
            // Termina preparación, arrancar siguiente ON
            setTimerPhase('on');
            timerPhaseRef.current = 'on';
            if (soundCues) {
              try {
                if (Platform.OS === 'web') Vibration.vibrate(30);
                else Vibration.vibrate([0, 40]);
              } catch {}
            }
            return timeSpec.on;
          }
          // No quedan ciclos: finalizar
        }
        // Modo single con múltiples ciclos (p. ej. "30s por lado")
        if (timeSpec.mode === 'single') {
          const phase = timerPhaseRef.current;
          if (phase === 'on') {
            const remaining = Math.max((cyclesLeftRef.current || 1) - 1, 0);
            setCyclesLeft(remaining);
            cyclesLeftRef.current = remaining;
            if (remaining > 0) {
              // Preparación entre ciclos
              setTimerPhase('prep');
              timerPhaseRef.current = 'prep';
              if (soundCues) {
                try {
                  if (Platform.OS === 'web') Vibration.vibrate(20);
                  else Vibration.vibrate([0, 20]);
                } catch {}
              }
              return PREP_SECONDS;
            }
            // Último ciclo completado
            if (settings.trainingNotificationsEnabled) {
              scheduleLocalNotificationAsync(
                {
                  title: 'Ciclo completado',
                  body: timeSpec.perLabel
                    ? `Cambiar de ${timeSpec.perLabel}`
                    : 'Siguiente paso listo',
                },
                undefined,
                { settings }
              ).catch(() => undefined);
            }
          } else if (phase === 'prep') {
            // Termina preparación, arrancar siguiente ciclo
            setTimerPhase('on');
            timerPhaseRef.current = 'on';
            if (soundCues) {
              try {
                if (Platform.OS === 'web') Vibration.vibrate(30);
                else Vibration.vibrate([0, 40]);
              } catch {}
            }
            return timeSpec.on;
          }
        }
        // Finalizó el conteo completo (single sin ciclos restantes o interval sin ciclos restantes)
        clearTimer();
        setTimerPhase(null);
        timerPhaseRef.current = null;
        stopPulseAnimation();
        if (soundCues) {
          try {
            if (Platform.OS === 'web') Vibration.vibrate(80);
            else Vibration.vibrate([0, 100, 60, 100]);
          } catch {}
        }
        // Marcar set completado automáticamente (ejercicios de tiempo no tienen reps)
        // Defer para evitar actualizar el padre durante el render de este componente
        setTimeout(() => {
          commitFinishSet(0);
        }, 0);
        return 0;
      });
    }, 1000);
  };

  const stopTimer = () => {
    clearTimer();
    setWasStopped(true);
    setTimerPhase(null);
    timerPhaseRef.current = null;
    setTimerRemaining(0);
    stopPulseAnimation();
    setIsExecuting(false);
  };

  // Ordinales en español (forma apocopada donde aplica: primer, tercer) hasta 20
  const getOrdinalEs = (n: number) => {
    const map: Record<number, string> = {
      1: 'primer',
      2: 'segundo',
      3: 'tercer',
      4: 'cuarto',
      5: 'quinto',
      6: 'sexto',
      7: 'séptimo',
      8: 'octavo',
      9: 'noveno',
      10: 'décimo',
      11: 'undécimo',
      12: 'duodécimo',
      13: 'decimotercer',
      14: 'decimocuarto',
      15: 'decimoquinto',
      16: 'decimosexto',
      17: 'decimoséptimo',
      18: 'decimoctavo',
      19: 'decimonoveno',
      20: 'vigésimo',
    };
    return map[n] || `${n}º`;
  };

  // Frase motivacional aleatoria
  const [motivationalPhrase, setMotivationalPhrase] = useState<{
    text: string;
  }>({ text: '¡Tú puedes!' });
  useEffect(() => {
    const pick = () => {
      if (motivationalPhrases.length === 0) return { text: '¡Tú puedes!' };
      const randomIndex = Math.floor(
        Math.random() * motivationalPhrases.length
      );
      return motivationalPhrases[randomIndex] as { text: string };
    };
    setMotivationalPhrase(pick());
  }, [visible]);

  // Animación de pulso continuo
  const startPulseAnimation = useCallback(() => {
    setIsExecuting(true);
    const maxScale = timeSpec ? 1.15 : 1.3; // reducir escala cuando se muestra cronómetro
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: maxScale,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Mostrar frase motivacional
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, pulseAnim, timeSpec]);

  const stopPulseAnimation = useCallback(() => {
    setIsExecuting(false);
    pulseAnim.stopAnimation();
    Animated.timing(pulseAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // Ocultar frase motivacional
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, pulseAnim]);

  // Calcular intervalo adaptativo según el set actual (más lento en sets finales)
  const getRepInterval = () => {
    if (!exercise) return 2500; // Default 2.5s por rep
    const progress = completedSets / exercise.Sets; // 0 a 1
    // Sets iniciales: 2s, sets medios: 2.5s, sets finales: 3.5s
    const baseInterval = 2000 + progress * 1500; // 2000ms a 3500ms
    return Math.round(baseInterval);
  };

  // Iniciar contador automático de repeticiones
  const startRepsCounter = () => {
    if (!exercise) return;
    setCurrentReps(0);
    setIsExecuting(true);

    const targetReps =
      Number.parseInt(
        String(exercise.Repetitions || '0').replace(/\D/g, ''),
        10
      ) || 10;
    const interval = getRepInterval();

    // Limpiar timer previo si existe
    if (repsTimerRef.current) {
      clearInterval(repsTimerRef.current);
      repsTimerRef.current = null;
    }

    repsTimerRef.current = setInterval(() => {
      setCurrentReps((prev) => {
        // Auto-incremento hasta el target, pero no detener (usuario puede exceder)
        if (prev < targetReps) {
          return prev + 1;
        }
        return prev; // Mantener en el target, botones manuales pueden aumentar
      });
    }, interval);
  };

  // Detener contador de repeticiones
  const stopRepsCounter = () => {
    if (repsTimerRef.current) {
      clearInterval(repsTimerRef.current);
      repsTimerRef.current = null;
    }
  };

  const handleStartSet = () => {
    if (!exercise) return;
    if (isCompleted) return; // No iniciar si ya terminó todos los sets

    // Vibración leve al iniciar
    Vibration.vibrate(50);

    if (timeSpec) {
      // Ejercicios basados en tiempo (mantener lógica original)
      startTimer();
    } else {
      // Ejercicios basados en repeticiones (nuevo sistema)
      startPulseAnimation();
      startRepsCounter();
    }
  };

  const handleFinishSet = async () => {
    if (!exercise) return;
    stopPulseAnimation();
    stopRepsCounter();

    try {
      if (Platform.OS === 'web') Vibration.vibrate(50);
      else Vibration.vibrate([0, 50, 100, 50]);
    } catch {}

    // Guardar repeticiones automáticamente (sin modal)
    await commitFinishSet(currentReps);
  };

  const commitFinishSet = async (repsCompleted: number) => {
    if (!exercise) return;
    
    // Detener ejecución (volver a mostrar botón de iniciar)
    setIsExecuting(false);
    
    const nextCompleted = Math.min(completedSets + 1, exercise.Sets);

    // Guardar reps realizadas por set
    const repsKey = keyExerciseReps(exercise.Id);
    try {
      const stored = await rsGetJSON<{ sets?: number[] }>(repsKey);
      const arr = Array.isArray(stored?.sets) ? [...stored!.sets] : [];
      const idx = nextCompleted - 1; // índice del set recién completado
      const val = Math.max(0, repsCompleted);
      arr[idx] = val;
      await rsSetJSON(repsKey, { sets: arr });
    } catch {}

    // Actualizar progreso de sets
    // Defer para evitar el warning de React sobre actualizar otro componente durante el render
    setTimeout(() => onMarkSet(exercise.Id), 0);
    const progKey = keyExerciseProgress(exercise.Id);
    const progPayload = {
      exerciseId: exercise.Id,
      completedSets: nextCompleted,
      lastCompleted: new Date().toISOString(),
    };
    try {
      await rsSetJSON(progKey, progPayload);
    } catch {}

    // Cerrar si fue el último set
    if (nextCompleted >= exercise.Sets) {
      setTimeout(() => {
        onClose();
      }, 250);
    }
  };

  // Limpiar animaciones y timers al cerrar
  useEffect(() => {
    if (!visible) {
      stopPulseAnimation();
      stopRepsCounter();
      clearTimer();
      setTimerPhase(null);
      timerPhaseRef.current = null;
      setIsExecuting(false);
      setCurrentReps(0);
    }
  }, [visible, stopPulseAnimation, clearTimer]);

  if (!exercise) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalBackdrop}>
        {/* Área clickeable fuera del modal para cerrar */}
        <Pressable
          style={styles.backdropOverlay}
          onPress={() => {
            if (!isExecuting) onClose();
          }}
          disabled={isExecuting}
        />

        {/* Banner AdMob en parte superior del backdrop */}
        <View
          style={{
            position: 'absolute',
            top: 40,
            alignSelf: 'center',
            zIndex: 10,
            width: '92%',
          }}
        >
          <AdMobBanner size="ADAPTIVE_BANNER" />
        </View>

        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{exercise.Name}</Text>
            <TouchableOpacity onPress={onClose} disabled={isExecuting}>
              <FontAwesome
                name="times"
                size={22}
                color={
                  isExecuting
                    ? (styles.closeIconDisabled.color as string)
                    : (styles.closeIcon.color as string)
                }
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.modalSub}>
            {t('sets')}: {exercise.Sets} • {t('reps')}: {exercise.Repetitions} ·{' '}
            <Text
              style={[styles.linkText]}
              onPress={() => {
                const eid =
                  exercise.ExerciseId ?? exercise.Exercise?.Id ?? null;
                if (eid) {
                  router.push({
                    pathname: '/exercise-detail',
                    params: { exerciseId: String(eid) },
                  });
                }
              }}
            >
              Ver detalle
            </Text>
          </Text>

          <Text style={styles.progressText}>
            Progreso: {completedSets}/{exercise.Sets} sets completados
          </Text>

          {/* Área de animación y frase motivacional */}
          <View
            style={[
              styles.animationContainer,
              {
                height: timeSpec
                  ? (timeSpec.cycles || 1) > 1
                    ? 300
                    : 240
                  : 180,
              },
            ]}
          >
            <Animated.View
              style={[
                styles.pulseCircle,
                timeSpec ? styles.pulseCircleAbsolute : null,
                isExecuting ? styles.pulseBgExecuting : styles.pulseBgIdle,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <MaterialCommunityIcons
                name="dumbbell"
                size={46}
                color={styles.pulseIcon.color as string}
              />
            </Animated.View>

            {/* Cronómetro para ejercicios de tiempo */}
            {timeSpec && (
              <View
                style={[
                  {
                    alignItems: 'center',
                    zIndex: 2,
                    marginTop: (timeSpec.cycles || 1) > 1 ? 140 : 120,
                  },
                  styles.timerPanel,
                ]}
              >
                <Text style={[styles.timerLabel, { marginBottom: 6 }]}>
                  {timerPhase
                    ? timerPhase === 'on'
                      ? t('timer_on')
                      : timerPhase === 'off'
                        ? t('timer_off')
                        : t('timer_prep')
                    : wasStopped
                      ? t('timer_stopped')
                      : ''}
                </Text>
                <Text style={styles.timerTime}>
                  {(() => {
                    const t = timerRemaining;
                    const mm = Math.floor(t / 60);
                    const ss = t % 60;
                    return mm > 0
                      ? `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`
                      : `${String(ss).padStart(2, '0')}`;
                  })()}
                </Text>
                {(timeSpec.cycles || 1) > 1 && (
                  <Text style={[styles.timerSubLabel, { marginTop: 6 }]}>
                    Ciclo{' '}
                    {Math.max(
                      cyclesTotal -
                        cyclesLeft +
                        (timerPhaseRef.current ? 0 : 0),
                      1
                    )}
                    /{cyclesTotal}
                  </Text>
                )}
                {timeSpec.mode === 'single' && (timeSpec.cycles || 1) > 1 && (
                  <Text style={[styles.timerSubLabel, { marginTop: 2 }]}>
                    {(() => {
                      const base = timeSpec.perLabel || 'lado';
                      const label =
                        String(base).charAt(0).toUpperCase() +
                        String(base).slice(1);
                      const curr = Math.max(cyclesTotal - cyclesLeft + 1, 1);
                      return `${label} ${curr}/${cyclesTotal}`;
                    })()}
                  </Text>
                )}
              </View>
            )}

            {/* Frase motivacional */}
            <Animated.View
              style={[
                styles.phraseContainer,
                { opacity: fadeAnim, zIndex: 2, marginTop: timeSpec ? 8 : 0 },
              ]}
            >
              <Text style={styles.motivationalText}>
                {motivationalPhrase.text}
              </Text>
            </Animated.View>
          </View>

          {/* Botones de acción */}
          <View style={styles.buttonContainer}>
            {/* Toggle sonido */}
            {/* {timeSpec && (
              <View style={styles.controlRow}>
                <Text style={[styles.controlLabel, { marginRight: 8 }]}>
                  Sonido
                </Text>
                <Switch
                  value={soundCues}
                  onValueChange={(v) => {
                    setSoundCues(v);
                    saveSoundPref(v);
                  }}
                  thumbColor={
                    soundCues
                      ? (styles.startButton.backgroundColor as string)
                      : (styles.thumbOff.color as string)
                  }
                  ios_backgroundColor={
                    styles.switchIosBg.backgroundColor as string
                  }
                />
              </View>
            )} */}
            {isCompleted ? (
              <>
                <Text style={styles.completedText}>Ejercicio completado</Text>
                <Button title="Cerrar" onPress={onClose} variant="secondary" />
              </>
            ) : !isExecuting ? (
              <>
                <Button
                  title={
                    timeSpec && wasStopped
                      ? t('restart_timer')
                      : `${t('start_set').replace('{ordinal}', getOrdinalEs(nextSetNumber))}`
                  }
                  onPress={handleStartSet}
                  style={styles.startButton}
                />
                <View style={styles.buttonRow}>
                  <Button
                    title={t('undo_set_exercise')}
                    onPress={() => onUndoSet(exercise.Id)}
                    variant="secondary"
                    style={styles.halfButton}
                  />
                  <Button
                    title={t('complete_exercise')}
                    onPress={() => onMarkExercise(exercise.Id)}
                    style={styles.halfButton}
                  />
                </View>
              </>
            ) : timeSpec ? (
              <Button
                title={t('stop')}
                onPress={stopTimer}
                variant="secondary"
                style={styles.finishButton}
                textStyle={styles.buttonOnTintText}
              />
            ) : (
              <View style={styles.repCounterContainer}>
                <Text style={styles.repCounterLabel}>
                  {t('reps_completed')}
                </Text>
                <View style={styles.repControlRow}>
                  <TouchableOpacity
                    onPress={() =>
                      setCurrentReps((prev) => Math.max(0, prev - 1))
                    }
                    style={styles.repButton}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="remove-circle"
                      size={56}
                      color={tintColor}
                    />
                  </TouchableOpacity>

                  <Text style={styles.repCounterText}>{currentReps}</Text>

                  <TouchableOpacity
                    onPress={() => setCurrentReps((prev) => prev + 1)}
                    style={styles.repButton}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="add-circle" size={56} color={tintColor} />
                  </TouchableOpacity>
                </View>

                <Button
                  title={t('finish_set')}
                  onPress={handleFinishSet}
                  style={styles.finishButton}
                />
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

// styles via makeExerciseModalStyles

export default ExerciseModal;
