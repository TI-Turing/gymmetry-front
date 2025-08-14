import React, { useState, useEffect, useMemo } from 'react';
import { Modal, TouchableOpacity, Animated, Vibration, StyleSheet, Platform } from 'react-native';
import { View, Text } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '@/constants/Colors';
import Button from '@/components/common/Button';
import type { RoutineDay } from '@/models/RoutineDay';
import motivationalPhrases from '@/utils/motivationalPhrases.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [isExecuting, setIsExecuting] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));
  const [fadeAnim] = useState(new Animated.Value(0));
  const isCompleted = exercise ? completedSets >= exercise.Sets : false;
  // Próximo set a ejecutar
  const nextSetNumber = exercise ? Math.min(completedSets + 1, exercise.Sets) : 1;

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
  const motivationalPhrase = useMemo(() => {
    if (motivationalPhrases.length === 0) return { text: "¡Tú puedes!" };
    const randomIndex = Math.floor(Math.random() * motivationalPhrases.length);
    return motivationalPhrases[randomIndex];
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

  const stopPulseAnimation = () => {
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
  };

  const handleStartSet = () => {
    if (!exercise) return;
    if (isCompleted) return; // No iniciar si ya terminó todos los sets
    
    // Vibración leve al iniciar
    Vibration.vibrate(50);
    startPulseAnimation();
  };

  const handleFinishSet = () => {
    if (!exercise) return;

    stopPulseAnimation();

    // Doble vibración (algunos navegadores web no soportan patrón, fallback simple)
    try {
      if (Platform.OS === 'web') {
        Vibration.vibrate(50);
      } else {
        Vibration.vibrate([0, 50, 100, 50]);
      }
    } catch {}

    // Calcular progreso siguiente
    const nextCompleted = Math.min(completedSets + 1, exercise.Sets);
    onMarkSet(exercise.Id);

    // Persistir progreso (AsyncStorage nativo / localStorage web)
    const key = `exercise_${exercise.Id}_progress`;
    const payload = JSON.stringify({
      exerciseId: exercise.Id,
      completedSets: nextCompleted,
      lastCompleted: new Date().toISOString(),
    });
    (async () => {
      try {
        if (Platform.OS === 'web' && typeof window !== 'undefined' && 'localStorage' in window) {
          window.localStorage.setItem(key, payload);
        } else {
          await AsyncStorage.setItem(key, payload);
        }
      } catch {
        // Silencioso: persistencia no crítica
      }
    })();

    // Si se completó el último set, cerrar modal
    if (nextCompleted >= exercise.Sets) {
      // pequeño timeout para permitir que el estado padre se actualice antes de cerrar
      setTimeout(() => {
        onClose();
      }, 250);
    }
  };

  // Limpiar animaciones al cerrar
  useEffect(() => {
    if (!visible) {
      stopPulseAnimation();
    }
  }, [visible]);

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
                color={isExecuting ? '#666' : Colors.light.text} 
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
                {
                  transform: [{ scale: pulseAnim }],
                  backgroundColor: isExecuting ? '#FF6B35' : '#333',
                }
              ]}
            >
              <MaterialCommunityIcons
                name="dumbbell"
                size={46}
                color="#FFF"
              />
            </Animated.View>

            {/* Frase motivacional */}
            <Animated.View style={[styles.phraseContainer, { opacity: fadeAnim }]}>
              <Text style={styles.motivationalText}>
                {motivationalPhrase.text}
              </Text>
            </Animated.View>
          </View>

          {/* Botones de acción */}
          <View style={styles.buttonContainer}>
            {isCompleted ? (
              <>
                <Text style={styles.completedText}>Ejercicio completado ✅</Text>
                <Button title="Cerrar" onPress={onClose} variant="secondary" />
              </>
            ) : !isExecuting ? (
              <>
                <Button
                  title={`Iniciar ${getOrdinalEs(nextSetNumber)} set`}
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

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#1D1D1D',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  modalSub: {
    color: '#B0B0B0',
    marginBottom: 12,
    fontSize: 14,
  },
  progressText: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 20,
    textAlign: 'center',
  },
  animationContainer: {
    alignItems: 'center',
    marginVertical: 30,
    height: 180,
    justifyContent: 'center',
  },
  pulseCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  phraseContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  motivationalText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  buttonContainer: {
    gap: 12,
  },
  startButton: {
    backgroundColor: '#ff6300',
  },
  finishButton: {
    backgroundColor: '#FF6B35',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfButton: {
    flex: 1,
  },
  completedText: {
    color: '#ff6300',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 8,
  },
});

export default ExerciseModal;
