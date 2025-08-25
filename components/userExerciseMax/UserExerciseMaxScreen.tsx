import React, { useEffect, useState } from 'react';
import { ScrollView, View as RNView, StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import ScreenWrapper from '@/components/layout/ScreenWrapper';
import Colors from '@/constants/Colors';
import Button from '@/components/common/Button';
import type { Exercise } from '@/models/Exercise';
import type { UserExerciseMax } from '@/models/UserExerciseMax';
import { authService, userExerciseMaxService } from '@/services';
import { normalizeCollection } from '@/utils';
import ExercisePickerModal from '@/components/routineBuilder/ExercisePickerModal';
import UserExerciseMaxModal from './UserExerciseMaxModal';
import { useThemedStyles } from '@/hooks/useThemedStyles';

function formatDate(iso?: string | null) {
  if (!iso) return '—';
  const d = new Date(iso);
  return isFinite(d.getTime()) ? d.toLocaleDateString() : '—';
}

const UserExerciseMaxScreen: React.FC = () => {
  const getExerciseName = (it: unknown, fallback?: string | null): string => {
    const ex = (it as unknown as { Exercise?: { Name?: string } }).Exercise;
    return ex?.Name || fallback || 'Ejercicio';
  };
  const styles = useThemedStyles((theme) => {
    const pal = Colors[theme];
    return StyleSheet.create({
      screen: { flex: 1 },
      headerWrap: { paddingTop: 12, paddingBottom: 12 },
      headerTitle: { fontSize: 24, fontWeight: 'bold', color: pal.text },
      headerSub: { color: pal.text + 'B3' },
      error: { color: pal.tint, marginBottom: 12 },
      actions: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
        flexWrap: 'wrap' as const,
      },
      card: {
        backgroundColor: pal.card,
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: pal.border,
      },
      row: { paddingVertical: 10, borderTopWidth: 1, borderColor: pal.border },
      rowText: { color: pal.text },
      rowWeight: { color: pal.text, fontWeight: '700' },
      subtle: { color: pal.text + 'B3' },
    });
  });
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
      const body: { UserId: string; ExerciseId?: string } = {
        UserId: String(user?.id || ''),
      };
      if (exerciseId) body.ExerciseId = exerciseId;
      const resp =
        await userExerciseMaxService.findUserExerciseMaxesByFields(body);
      const arr = resp?.Success
        ? normalizeCollection<UserExerciseMax>(resp.Data as unknown)
        : [];
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

  useEffect(() => {
    loadData(exercise?.Id);
  }, [exercise?.Id]);

  const openCreate = () => {
    if (!exercise) {
      setPickerOpen(true);
      return;
    }
    setModalOpen(true);
  };

  return (
    <ScreenWrapper headerTitle="RM" showBackButton={false}>
      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
        <View style={styles.headerWrap}>
          <Text style={styles.headerTitle}>Tus RM</Text>
          <Text style={styles.headerSub}>
            Registra y consulta tus pesos máximos por ejercicio
          </Text>
        </View>
        {error && <Text style={styles.error}>{error}</Text>}
        <RNView style={styles.actions}>
          <Button
            title={
              exercise ? `Filtro: ${exercise.Name}` : 'Filtrar por ejercicio'
            }
            variant="outline"
            onPress={() => setPickerOpen(true)}
            size="small"
          />
          {exercise && (
            <Button
              title="Quitar filtro"
              variant="secondary"
              size="small"
              onPress={() => setExercise(null)}
            />
          )}
          <Button title="Registrar RM" onPress={openCreate} />
        </RNView>
        <View style={styles.card}>
          {loading && <Text style={styles.subtle}>Cargando...</Text>}
          {!loading && items.length === 0 && (
            <Text style={styles.subtle}>Sin registros</Text>
          )}
          {!loading &&
            items.map((it) => (
              <View key={it.Id} style={styles.row}>
                <Text style={styles.rowText}>
                  {formatDate(it.AchievedAt || it.CreatedAt)} ·{' '}
                  {getExerciseName(it, exercise?.Name)}
                </Text>
                <Text style={styles.rowWeight}>{it.WeightKg} kg</Text>
              </View>
            ))}
        </View>
        <View style={{ height: 80 }} />
      </ScrollView>
      <ExercisePickerModal
        visible={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(ex) => {
          setExercise(ex);
          setPickerOpen(false);
        }}
      />
      {exercise && (
        <UserExerciseMaxModal
          visible={modalOpen}
          onClose={() => setModalOpen(false)}
          exercise={exercise}
          onSaved={() => {
            setModalOpen(false);
            loadData(exercise.Id);
          }}
        />
      )}
    </ScreenWrapper>
  );
};

export default UserExerciseMaxScreen;

// estilos locales intencionalmente vacíos
