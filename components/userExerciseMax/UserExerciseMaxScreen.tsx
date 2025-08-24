import React, { useEffect, useState } from 'react';
import { ScrollView, View as RNView, StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import ScreenWrapper from '@/components/layout/ScreenWrapper';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import Button from '@/components/common/Button';
import type { Exercise } from '@/models/Exercise';
import type { UserExerciseMax } from '@/models/UserExerciseMax';
import { authService, userExerciseMaxService } from '@/services';
import ExercisePickerModal from '@/components/routineBuilder/ExercisePickerModal';
import UserExerciseMaxModal from './UserExerciseMaxModal';

function formatDate(iso?: string | null) {
  if (!iso) return '—';
  const d = new Date(iso);
  return isFinite(d.getTime()) ? d.toLocaleDateString() : '—';
}

const UserExerciseMaxScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const [items, setItems] = useState<UserExerciseMax[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const loadData = async (exerciseId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const user = await authService.getUserData();
      const body: any = { UserId: user?.id || '' };
      if (exerciseId) body.ExerciseId = exerciseId;
      const resp = await userExerciseMaxService.findUserExerciseMaxesByFields(body);
      let arr: any[] = [];
      if (resp?.Success && resp.Data) {
        const raw: any = resp.Data as any;
        arr = Array.isArray(raw) ? raw : (raw?.$values || []);
      }
      arr.sort((a: UserExerciseMax, b: UserExerciseMax) => {
        const ta = new Date(a.AchievedAt || a.CreatedAt).getTime();
        const tb = new Date(b.AchievedAt || b.CreatedAt).getTime();
        return (tb || 0) - (ta || 0);
      });
      setItems(arr as UserExerciseMax[]);
    } catch {
      setError('No se pudieron cargar tus RM');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(exercise?.Id); }, [exercise?.Id]);

  const openCreate = () => {
    if (!exercise) { setPickerOpen(true); return; }
    setModalOpen(true);
  };

  return (
    <ScreenWrapper headerTitle='RM' showBackButton={false}>
      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
        <View style={{ paddingTop: 12, paddingBottom: 12 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: Colors[colorScheme].text }}>Tus RM</Text>
          <Text style={{ color: Colors[colorScheme].text + 'B3' }}>Registra y consulta tus pesos máximos por ejercicio</Text>
        </View>
        {error && <Text style={{ color: Colors[colorScheme].tint, marginBottom: 12 }}>{error}</Text>}
        <RNView style={{ flexDirection: 'row', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          <Button title={exercise ? `Filtro: ${exercise.Name}` : 'Filtrar por ejercicio'} variant='outline' onPress={() => setPickerOpen(true)} size='small' />
          {exercise && <Button title='Quitar filtro' variant='secondary' size='small' onPress={() => setExercise(null)} />}
          <Button title='Registrar RM' onPress={openCreate} />
        </RNView>
        <View style={[styles.card, { borderColor: Colors[colorScheme].text + '22', borderWidth: 1 }]}>
          {loading && <Text style={{ color: Colors[colorScheme].text + 'B3' }}>Cargando...</Text>}
          {!loading && items.length === 0 && (
            <Text style={{ color: Colors[colorScheme].text + 'B3' }}>Sin registros</Text>
          )}
          {!loading && items.map((it) => (
            <View key={it.Id} style={[styles.row, { borderColor: Colors[colorScheme].text + '22' }]}>
              <Text style={{ color: Colors[colorScheme].text }}>
                {formatDate(it.AchievedAt || it.CreatedAt)} · {(it as any).Exercise?.Name || exercise?.Name || 'Ejercicio'}
              </Text>
              <Text style={{ color: Colors[colorScheme].text, fontWeight: '700' }}>{it.WeightKg} kg</Text>
            </View>
          ))}
        </View>
        <View style={{ height: 80 }} />
      </ScrollView>
      <ExercisePickerModal
        visible={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(ex) => { setExercise(ex); setPickerOpen(false); }}
      />
      {exercise && (
        <UserExerciseMaxModal
          visible={modalOpen}
          onClose={() => setModalOpen(false)}
          exercise={exercise}
          onSaved={() => { setModalOpen(false); loadData(exercise.Id); }}
        />
      )}
    </ScreenWrapper>
  );
};

export default UserExerciseMaxScreen;

const styles = StyleSheet.create({
  card: { backgroundColor: '#1E1E1E', borderRadius: 12, padding: 12 },
  row: { paddingVertical: 10, borderTopWidth: 1 },
});
