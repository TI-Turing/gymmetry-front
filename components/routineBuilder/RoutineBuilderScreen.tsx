import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { ScrollView, TouchableOpacity, ActivityIndicator, TextInput, View as RNView } from 'react-native';
import { View, Text } from '@/components/Themed';
import ScreenWrapper from '@/components/layout/ScreenWrapper';
import { useRoutineBuilder, DAY_LABELS } from './useRoutineBuilder';
import { exerciseService, routineTemplateService, routineDayService } from '@/services';
import type { Exercise } from '@/models/Exercise';
import { authService } from '@/services/authService';
import { router } from 'expo-router';
// Eliminamos modal: usaremos selector embebido
import EmbeddedExerciseSelector from './EmbeddedExerciseSelector';

// Estilos rápidos locales (se podría mover a un styles.ts independiente si crece)
const cardStyle = { backgroundColor: '#1F1F1F', padding: 16, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#333' } as const;
const pill = { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: '#262626', margin: 4 } as const;

const RoutineBuilderScreen: React.FC = () => {
  const {
    selectedDays, days,
    name, setName,
    comments, setComments,
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
      } catch (e:any) {
        if (mounted) setError('Error cargando ejercicios');
      } finally {
        if (mounted) setLoadingExercises(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const openPicker = (dayNumber: number) => { setSelectingDay(dayNumber); };

  const handleSelectExercise = (exercise: Exercise) => {
    if (selectingDay != null) {
      addExerciseToDay(selectingDay, exercise);
      setSelectingDay(null);
    }
  };

  const handleSave = useCallback(async () => {
    setError(null); setSuccess(null);
    const draft = buildDraft();
    if (!draft.meta.name.trim()) { setError('Nombre requerido'); return; }
    if (draft.days.length === 0) { setError('Selecciona al menos un día'); return; }

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
      const tplResp = await routineTemplateService.addRoutineTemplate(addTemplateReq);
      if (!tplResp?.Success || !tplResp.Data?.Id) throw new Error('No se pudo crear la rutina');
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
    } catch (e:any) {
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
      backgroundColor="#1A1A1A"
    >
      <ScrollView style={{ padding:16 }}>
        {error && <Text style={{ color:'#FF6B35', marginBottom:12 }}>{error}</Text>}
        {success && <Text style={{ color:'#4CAF50', marginBottom:12 }}>{success}</Text>}

        <View style={cardStyle}>
          <Text style={{ fontSize:18, fontWeight:'600', marginBottom:8 }}>Datos Generales</Text>
          <Text style={{ color:'#B0B0B0', marginBottom:4 }}>Nombre</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Ej: Hipertrofia Full Body"
            placeholderTextColor="#666"
            style={{ backgroundColor:'#262626', color:'#FFF', padding:12, borderRadius:8, marginBottom:12 }}
          />
          <Text style={{ color:'#B0B0B0', marginBottom:4 }}>Comentarios</Text>
          <TextInput
            value={comments}
            onChangeText={setComments}
            placeholder="Notas generales de la rutina"
            placeholderTextColor="#666"
            multiline
            style={{ backgroundColor:'#262626', color:'#FFF', padding:12, borderRadius:8, minHeight:90 }}
          />
          <Text style={{ marginTop:12, color:'#FFB347', fontSize:12 }}>Esta rutina se guardará como Premium</Text>
        </View>

        <View style={cardStyle}>
          <Text style={{ fontSize:18, fontWeight:'600', marginBottom:8 }}>Días de la Semana</Text>
          <View style={{ flexDirection:'row', flexWrap:'wrap' }}>
            {Object.entries(DAY_LABELS).map(([num,label]) => {
              const n = Number(num);
              const active = selectedDays.includes(n);
              return (
                <TouchableOpacity
                  key={num}
                  onPress={() => toggleDay(n)}
                  style={{ ...pill, backgroundColor: active ? '#FF6B35' : '#262626' }}
                >
                  <Text style={{ color:'#FFF', fontWeight:'600', fontSize:12 }}>{label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

  {days.filter(d => selectedDays.includes(d.dayNumber)).map(day => (
          <View key={day.dayNumber} style={cardStyle}>
            <Text style={{ fontSize:16, fontWeight:'600', marginBottom:8 }}>{day.name}</Text>
            {day.exercises.length > 0 && day.exercises.map((ex, i) => (
              <RNView key={i} style={{ backgroundColor:'#262626', padding:12, borderRadius:12, marginBottom:12 }}>
                <Text style={{ color:'#FFF', fontWeight:'600', marginBottom:4 }}>{(ex.exercise as any).Name}</Text>
                <RNView style={{ flexDirection:'row', gap:8 }}>
                  <RNView style={{ flex:1 }}>
                    <Text style={{ color:'#B0B0B0', fontSize:12 }}>Sets</Text>
                    <TextInput
                      keyboardType="number-pad"
                      value={String(ex.sets)}
                      onChangeText={v => updateDayExercise(day.dayNumber, i, { sets: Number(v) || 0 })}
                      style={{ backgroundColor:'#1F1F1F', color:'#FFF', padding:8, borderRadius:8 }}
                    />
                  </RNView>
                  <RNView style={{ flex:2 }}>
                    <Text style={{ color:'#B0B0B0', fontSize:12 }}>Reps/Tiempo</Text>
                    <TextInput
                      value={ex.repsOrTime}
                      onChangeText={v => updateDayExercise(day.dayNumber, i, { repsOrTime: v })}
                      placeholder="Ej: 12, 12-10-8, 30s, 30s/lado"
                      placeholderTextColor="#666"
                      style={{ backgroundColor:'#1F1F1F', color:'#FFF', padding:8, borderRadius:8 }}
                    />
                  </RNView>
                </RNView>
                <Text style={{ color:'#B0B0B0', fontSize:12, marginTop:8 }}>Notas</Text>
                <TextInput
                  value={ex.notes}
                  onChangeText={v => updateDayExercise(day.dayNumber, i, { notes: v })}
                  placeholder="Notas opcionales"
                  placeholderTextColor="#666"
                  multiline
                  style={{ backgroundColor:'#1F1F1F', color:'#FFF', padding:8, borderRadius:8, minHeight:60 }}
                />
                <TouchableOpacity onPress={() => removeDayExercise(day.dayNumber, i)} style={{ marginTop:8 }}>
                  <Text style={{ color:'#FF6B35', fontSize:12 }}>Eliminar ejercicio</Text>
                </TouchableOpacity>
              </RNView>
            ))}

            <RNView style={{ marginTop:4 }}>
              {selectingDay === day.dayNumber ? (
                <EmbeddedExerciseSelector
                  dayName={day.name}
                  onCancel={() => setSelectingDay(null)}
                  onAdd={handleSelectExercise}
                />
              ) : (
                <TouchableOpacity onPress={() => openPicker(day.dayNumber)} style={{ ...pill, backgroundColor:'#333', alignSelf:'flex-start' }}>
                  <Text style={{ color:'#FFF', fontSize:12, fontWeight:'600' }}>Agregar ejercicio</Text>
                </TouchableOpacity>
              )}
              {day.exercises.length === 0 && selectingDay !== day.dayNumber && (
                <Text style={{ color:'#666', fontSize:12, marginTop:4 }}>Sin ejercicios aún.</Text>
              )}
            </RNView>
          </View>
        ))}

        <TouchableOpacity
          disabled={saving}
          onPress={handleSave}
          style={{ backgroundColor: saving ? '#444' : '#FF6B35', padding:16, borderRadius:30, alignItems:'center', marginBottom:48 }}
        >
          {saving && <ActivityIndicator color="#FFF" style={{ marginRight:8, position:'absolute', left:24 }} />}
          <Text style={{ color:'#FFF', fontWeight:'600', fontSize:16 }}>Guardar Rutina</Text>
        </TouchableOpacity>
      </ScrollView>
  {/* Modal removido, selector embebido inline */}
    </ScreenWrapper>
  );
};

export default RoutineBuilderScreen;
