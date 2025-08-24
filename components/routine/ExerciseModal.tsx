import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  TouchableOpacity,
  Animated,
  Vibration,
  Platform,
} from 'react-native';
import { View, Text } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import Button from '@/components/common/Button';
import type { RoutineDay } from '@/models/RoutineDay';
import motivationalPhrases from '@/utils/motivationalPhrases.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeRoutineExerciseModalStyles } from './styles/exerciseModal';

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
  const styles = useThemedStyles(makeRoutineExerciseModalStyles);
  const [isExecuting, setIsExecuting] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));
  const [fadeAnim] = useState(new Animated.Value(0));

  // Frase motivacional aleatoria
  const [motivationalPhrase, setMotivationalPhrase] = useState<{
    text: string;
  }>({ text: '¡Tú puedes!' });
  useEffect(() => {
    if (visible) {
      if (motivationalPhrases.length === 0) {
        setMotivationalPhrase({ text: '¡Tú puedes!' });
      } else {
        const randomIndex = Math.floor(
          Math.random() * motivationalPhrases.length
        );
        setMotivationalPhrase(motivationalPhrases[randomIndex]);
      }
    }
  }, [visible]); // Cambiar frase cada vez que se abra el modal

  // Animación de pulso continuo
  const startPulseAnimation = () => {
    setIsExecuting(true);
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
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
  };

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

  const handleStartSet = () => {
    if (!exercise) return;

    // Vibración leve al iniciar
    Vibration.vibrate(50);
    startPulseAnimation();
  };

  const handleFinishSet = () => {
    if (!exercise) return;

    // Evitar agregar sets si ya está completo
    if (completedSets >= exercise.Sets) {
      stopPulseAnimation();
      return;
    }

    stopPulseAnimation();

    // Doble vibración al terminar (en web algunos navegadores no soportan patrón)
    try {
      if (Platform.OS === 'web') {
        Vibration.vibrate(50);
      } else {
        Vibration.vibrate([0, 50, 100, 50]);
      }
    } catch {}

    // Calcular siguiente progreso antes de disparar actualización externa
    const nextCompleted = Math.min(completedSets + 1, exercise.Sets);
    onMarkSet(exercise.Id);

    // Persistir progreso (AsyncStorage en nativo, localStorage en web)
    const key = `exercise_${exercise.Id}_progress`;
    const payload = JSON.stringify({
      exerciseId: exercise.Id,
      completedSets: nextCompleted,
      lastCompleted: new Date().toISOString(),
    });
    (async () => {
      try {
        if (typeof window !== 'undefined' && 'localStorage' in window) {
          window.localStorage.setItem(key, payload);
        } else {
          await AsyncStorage.setItem(key, payload);
        }
      } catch {
        // silencioso: persistencia no crítica
      }
    })();
  };

  // Limpiar animaciones al cerrar
  useEffect(() => {
    if (!visible) {
      stopPulseAnimation();
    }
  }, [visible, stopPulseAnimation]);

  if (!exercise) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalBackdrop}>
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
            Sets: {exercise.Sets} • Reps: {exercise.Repetitions}
          </Text>

          <Text style={styles.progressText}>
            Progreso: {completedSets}/{exercise.Sets} sets completados
          </Text>

          {/* Área de animación y frase motivacional */}
          <View style={styles.animationContainer}>
            <Animated.View
              style={[
                styles.pulseCircle,
                { transform: [{ scale: pulseAnim }] },
                isExecuting ? styles.pulseBgExecuting : styles.pulseBgIdle,
              ]}
            >
              <FontAwesome
                name={isExecuting ? 'heartbeat' : 'play'}
                size={40}
                color={styles.pulseIcon.color as string}
              />
            </Animated.View>

            {/* Frase motivacional */}
            <Animated.View
              style={[styles.phraseContainer, { opacity: fadeAnim }]}
            >
              <Text style={styles.motivationalText}>
                {motivationalPhrase.text}
              </Text>
            </Animated.View>
          </View>

          {/* Botones de acción */}
          <View style={styles.buttonContainer}>
            {!isExecuting ? (
              <>
                <Button
                  title="Iniciar Set"
                  onPress={handleStartSet}
                  style={styles.startButton}
                />
                <View style={styles.buttonRow}>
                  <Button
                    title="Deshacer Set"
                    onPress={() => onUndoSet(exercise.Id)}
                    variant="secondary"
                    style={styles.halfButton}
                  />
                  <Button
                    title="Completar Ejercicio"
                    onPress={() => onMarkExercise(exercise.Id)}
                    style={styles.halfButton}
                  />
                </View>
              </>
            ) : (
              <Button
                title="Terminar Set"
                onPress={handleFinishSet}
                style={styles.finishButton}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

// styles via makeRoutineExerciseModalStyles

export default ExerciseModal;
