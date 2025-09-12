import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useMultiProgressSummary } from '../../hooks/useProgress';
import { useMemo } from 'react';
import ProgressTabBar from './ProgressTabBar';
import ProgressSummaryTab from './ProgressSummaryTab';
import ProgressExercisesTab from './ProgressExercisesTab';
import ProgressObjectivesTab from './ProgressObjectivesTab';
import ProgressMusclesTab from './ProgressMusclesTab';
import ProgressDisciplineTab from './ProgressDisciplineTab';
import ProgressSuggestionsTab from './ProgressSuggestionsTab';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { ProgressSummaryResponse } from '../../dto/Progress/ProgressSummaryResponse';
import { useAuth } from '../../contexts/AuthContext';
import styles from './styles';

const TABS = [
  'Resumen',
  'Ejercicios',
  'Objetivos',
  'Músculos',
  'Disciplina',
  'Sugerencias',
] as const;

type TabKey = (typeof TABS)[number];

// Calcular período dinámicamente: fecha actual menos 3 meses
const getDefaultPeriod = () => {
  const today = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(today.getMonth() - 3);

  const fromDate = threeMonthsAgo.toISOString().split('T')[0]; // YYYY-MM-DD
  const toDate = today.toISOString().split('T')[0]; // YYYY-MM-DD

  // Calcular días entre fechas
  const diffTime = today.getTime() - threeMonthsAgo.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return { From: fromDate, To: toDate, Days: diffDays };
};

export const ProgressTabs: React.FC = () => {
  const [tab, setTab] = useState<TabKey>('Resumen');
  const [periodIdx, setPeriodIdx] = useState(0); // Para seleccionar periodo
  const themed = useThemedStyles(styles);
  const { user } = useAuth();

  // Usar el userId del usuario autenticado
  const req = useMemo(
    () => ({
      UserId: user?.id || '', // Usar el ID del usuario autenticado
      Periods: [getDefaultPeriod()], // Período dinámico de 3 meses
      IncludeHistory: true,
      Timezone: 'America/Bogota',
    }),
    [user?.id]
  );
  // Solo hacer la petición si hay usuario autenticado
  const { data, loading, error, refetch } = useMultiProgressSummary(req, {
    enabled: !!user?.id, // Solo habilitado si hay userId
  });

  const periods: ProgressSummaryResponse[] = Array.isArray(data?.Periods)
    ? data.Periods
    : [];
  const current: ProgressSummaryResponse | undefined =
    periods[periodIdx] || undefined;

  // Mostrar estado de carga o error si no hay usuario
  if (!user?.id) {
    return (
      <View style={themed.container}>
        <Text style={themed.errorText}>
          Debes iniciar sesión para ver tu progreso
        </Text>
      </View>
    );
  }

  if (loading && periods.length === 0) {
    return (
      <View style={themed.container}>
        <Text style={themed.loadingText}>Cargando progreso...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={themed.container}>
        <Text style={themed.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!current && !loading) {
    return (
      <View style={themed.container}>
        <Text style={themed.errorText}>
          No hay datos de progreso disponibles para este período
        </Text>
      </View>
    );
  }

  return (
    <View style={themed.container}>
      {/* Selector de periodo (simple) */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginBottom: 8,
        }}
      >
        {periods.map((p, idx) => (
          <Text
            key={idx}
            style={{
              marginHorizontal: 8,
              fontWeight: periodIdx === idx ? 'bold' : 'normal',
              textDecorationLine: periodIdx === idx ? 'underline' : 'none',
              color: periodIdx === idx ? '#2196F3' : '#888',
            }}
            onPress={() => setPeriodIdx(idx)}
          >
            {p.Period?.From} - {p.Period?.To}
          </Text>
        ))}
      </View>
      <ProgressTabBar
        tabs={TABS}
        selected={tab}
        onSelect={(t: string) => setTab((t as TabKey) || 'Resumen')}
      />
      {tab === 'Resumen' && (
        <ProgressSummaryTab
          data={current}
          loading={loading}
          error={error ? new Error(error) : null}
          onRefresh={refetch}
        />
      )}
      {tab === 'Ejercicios' && (
        <ProgressExercisesTab
          data={current?.Exercises}
          loading={loading}
          error={error ? new Error(error) : null}
          onRefresh={refetch}
        />
      )}
      {tab === 'Objetivos' && (
        <ProgressObjectivesTab
          data={current?.Objectives}
          loading={loading}
          error={error ? new Error(error) : null}
          onRefresh={refetch}
        />
      )}
      {tab === 'Músculos' && (
        <ProgressMusclesTab
          data={current?.Muscles}
          loading={loading}
          error={error ? new Error(error) : null}
          onRefresh={refetch}
        />
      )}
      {tab === 'Disciplina' && (
        <ProgressDisciplineTab
          data={current?.Discipline}
          loading={loading}
          error={error ? new Error(error) : null}
          onRefresh={refetch}
        />
      )}
      {tab === 'Sugerencias' && (
        <ProgressSuggestionsTab
          data={current?.Suggestions}
          loading={loading}
          error={error ? new Error(error) : null}
          onRefresh={refetch}
        />
      )}
    </View>
  );
};
