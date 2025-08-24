import React, { useEffect, useState, useCallback } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  View as RNView,
} from 'react-native';
import { View, Text } from '@/components/Themed';
import ScreenWrapper from '@/components/layout/ScreenWrapper';
import { useRoutineBuilder, DAY_LABELS } from './useRoutineBuilder';
import {
  exerciseService,
  routineTemplateService,
  routineDayService,
} from '@/services';
import type { Exercise } from '@/models/Exercise';
import { authService } from '@/services/authService';
import { router } from 'expo-router';
// Eliminamos modal: usaremos selector embebido
import EmbeddedExerciseSelector from './EmbeddedExerciseSelector';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeRoutineBuilderStyles } from './styles/routineBuilder';

// Estilos tematizados
const useStyles = () => useThemedStyles(makeRoutineBuilderStyles);

const RoutineBuilderScreen: React.FC = () => {
  const {
    selectedDays,
    days,
    name,
    setName,
    comments,
    setComments,
    toggleDay,
    addExerciseToDay,
    updateDayExercise,
    removeDayExercise,
    buildDraft,
  } = useRoutineBuilder();

  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [loadingExercises, setLoadingExercises] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectingDay, setSelectingDay] = useState<number | null>(null);
  const styles = useStyles();

  // Cargar ejercicios
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingExercises(true);
      try {
        const resp = await exerciseService.getAllExercises();
        if (mounted && resp?.Success && Array.isArray(resp.Data)) {
          setAllExercises(resp.Data);
        }
      } catch (e: any) {
        if (mounted) setError('Error cargando ejercicios');
      } finally {
        if (mounted) setLoadingExercises(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const openPicker = (dayNumber: number) => {
    setSelectingDay(dayNumber);
  };

  const handleSelectExercise = (exercise: Exercise) => {
    if (selectingDay != null) {
      addExerciseToDay(selectingDay, exercise);
      setSelectingDay(null);
    }
  };

  const handleSave = useCallback(async () => {
    setError(null);
    setSuccess(null);
    const draft = buildDraft();
    if (!draft.meta.name.trim()) {
      setError('Nombre requerido');
      return;
    }
    if (draft.days.length === 0) {
      setError('Selecciona al menos un día');
      return;
    }

    setSaving(true);
    try {
      const user = await authService.getUserData();
      const addTemplateReq: any = {
        Name: draft.meta.name.trim(),
        Comments: draft.meta.comments?.trim() || '',
        GymId: draft.meta.gymId || '',
        Author_UserId: user?.id || null,
        UserId: user?.id || null,
        Premium: true, // forzamos premium
      };
      const tplResp =
        await routineTemplateService.addRoutineTemplate(addTemplateReq);
      if (!tplResp?.Success || !tplResp.Data?.Id)
        throw new Error('No se pudo crear la rutina');
      const templateId = tplResp.Data.Id;

      // Crear cada ejercicio/día como RoutineDay (AddRoutineDayRequest)
      for (const day of draft.days) {
        for (const ex of day.exercises) {
          const rdReq: any = {
            DayNumber: day.dayNumber,
            Name: day.name,
            Sets: ex.sets,
            Repetitions: ex.repsOrTime,
            Notes: ex.notes || null,
            RoutineTemplateId: templateId,
            ExerciseId: (ex.exercise as any).Id,
          };
          const rdResp = await routineDayService.addRoutineDay(rdReq);
          if (!rdResp?.Success) throw new Error('Error creando día de rutina');
        }
      }

      setSuccess('Rutina creada correctamente');
    } catch (e: any) {
      setError(e.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  }, [buildDraft]);

  return (
    <ScreenWrapper
      headerTitle="Crear Rutina"
      showBackButton
      onPressBack={() => router.back()}
    >
      <ScrollView style={styles.container}>
        {error && <Text style={styles.error}>{error}</Text>}
        {success && <Text style={styles.success}>{success}</Text>}

        <View style={styles.card}>
          <Text style={styles.title}>Datos Generales</Text>
          <Text style={styles.subtitle}>Nombre</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Ej: Hipertrofia Full Body"
            placeholderTextColor={styles.subtitle.color as string}
            style={[styles.input, { marginBottom: 12 }]}
          />
          <Text style={styles.subtitle}>Comentarios</Text>
          <TextInput
            value={comments}
            onChangeText={setComments}
            placeholder="Notas generales de la rutina"
            placeholderTextColor={styles.subtitle.color as string}
            multiline
            style={[styles.input, { minHeight: 90 }]}
          />
          <Text style={styles.premiumNote}>
            Esta rutina se guardará como Premium
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Días de la Semana</Text>
          <View style={styles.daysWrap}>
            {Object.entries(DAY_LABELS).map(([num, label]) => {
              const n = Number(num);
              const active = selectedDays.includes(n);
              return (
                <TouchableOpacity
                  key={num}
                  onPress={() => toggleDay(n)}
                  style={[styles.pill, active && styles.pillActive]}
                >
                  <Text style={styles.pillText}>{label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {days
          .filter((d) => selectedDays.includes(d.dayNumber))
          .map((day) => (
            <View key={day.dayNumber} style={styles.card}>
              <Text style={[styles.title, { fontSize: 16 }]}>{day.name}</Text>
              {day.exercises.length > 0 &&
                day.exercises.map((ex, i) => (
                  <RNView key={i} style={styles.item}>
                    <Text style={styles.itemTitle}>
                      {(ex.exercise as any).Name}
                    </Text>
                    <RNView style={styles.row}>
                      <RNView style={styles.col1}>
                        <Text style={[styles.subtitle, { fontSize: 12 }]}>
                          Sets
                        </Text>
                        <TextInput
                          keyboardType="number-pad"
                          value={String(ex.sets)}
                          onChangeText={(v) =>
                            updateDayExercise(day.dayNumber, i, {
                              sets: Number(v) || 0,
                            })
                          }
                          style={styles.inputSmall}
                        />
                      </RNView>
                      <RNView style={styles.col2}>
                        <Text style={[styles.subtitle, { fontSize: 12 }]}>
                          Reps/Tiempo
                        </Text>
                        <TextInput
                          value={ex.repsOrTime}
                          onChangeText={(v) =>
                            updateDayExercise(day.dayNumber, i, {
                              repsOrTime: v,
                            })
                          }
                          placeholder="Ej: 12, 12-10-8, 30s, 30s/lado"
                          placeholderTextColor={styles.subtitle.color as string}
                          style={styles.inputSmall}
                        />
                      </RNView>
                    </RNView>
                    <Text
                      style={[styles.subtitle, { fontSize: 12, marginTop: 8 }]}
                    >
                      Notas
                    </Text>
                    <TextInput
                      value={ex.notes}
                      onChangeText={(v) =>
                        updateDayExercise(day.dayNumber, i, { notes: v })
                      }
                      placeholder="Notas opcionales"
                      placeholderTextColor={styles.subtitle.color as string}
                      multiline
                      style={styles.notes}
                    />
                    <TouchableOpacity
                      onPress={() => removeDayExercise(day.dayNumber, i)}
                      style={styles.removeExercise}
                    >
                      <Text style={styles.removeExerciseText}>
                        Eliminar ejercicio
                      </Text>
                    </TouchableOpacity>
                  </RNView>
                ))}

              <RNView style={{ marginTop: 4 }}>
                {selectingDay === day.dayNumber ? (
                  <EmbeddedExerciseSelector
                    dayName={day.name}
                    onCancel={() => setSelectingDay(null)}
                    onAdd={handleSelectExercise}
                  />
                ) : (
                  <TouchableOpacity
                    onPress={() => openPicker(day.dayNumber)}
                    style={styles.addBtn}
                  >
                    <Text style={styles.addBtnText}>Agregar ejercicio</Text>
                  </TouchableOpacity>
                )}
                {day.exercises.length === 0 &&
                  selectingDay !== day.dayNumber && (
                    <Text style={styles.emptyText}>Sin ejercicios aún.</Text>
                  )}
              </RNView>
            </View>
          ))}

        <TouchableOpacity
          disabled={saving}
          onPress={handleSave}
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
        >
          {saving && (
            <ActivityIndicator
              color={styles.saveBtnText.color as string}
              style={styles.spinner}
            />
          )}
          <Text style={styles.saveBtnText}>Guardar Rutina</Text>
        </TouchableOpacity>
      </ScrollView>
      {/* Modal removido, selector embebido inline */}
    </ScreenWrapper>
  );
};

export default RoutineBuilderScreen;
