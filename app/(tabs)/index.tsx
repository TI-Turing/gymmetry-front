import React, { useMemo } from 'react';
import { ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useCustomAlert } from '@/components/common/CustomAlert';
import DisciplineConsistency from '@/components/home/DisciplineConsistency';
import PlanInfo from '@/components/home/PlanInfo';
import TodayRoutine from '@/components/home/TodayRoutine';
import FloatingActionButton from '@/components/home/FloatingActionButton';
import ScreenWrapper from '@/components/layout/ScreenWrapper';
import { withWebLayout } from '@/components/layout/withWebLayout';
import { router } from 'expo-router';
import Button from '@/components/common/Button';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeHomeStyles } from './styles/home';

type DayStatus = 'completed' | 'failed' | 'rest';

function HomeScreen() {
  const styles = useThemedStyles(makeHomeStyles);
  const { showSuccess, AlertComponent } = useCustomAlert();

  // Datos de prueba para disciplina y consistencia
  const disciplineData = [
    {
      week: 1,
      days: [
        { day: 'L', status: 'completed' as DayStatus },
        { day: 'M', status: 'completed' as DayStatus },
        { day: 'X', status: 'failed' as DayStatus },
        { day: 'J', status: 'completed' as DayStatus },
        { day: 'V', status: 'completed' as DayStatus },
        { day: 'S', status: 'rest' as DayStatus },
        { day: 'D', status: 'rest' as DayStatus },
      ],
    },
    {
      week: 2,
      days: [
        { day: 'L', status: 'completed' as DayStatus },
        { day: 'M', status: 'failed' as DayStatus },
        { day: 'X', status: 'completed' as DayStatus },
        { day: 'J', status: 'failed' as DayStatus },
        { day: 'V', status: 'completed' as DayStatus },
        { day: 'S', status: 'rest' as DayStatus },
        { day: 'D', status: 'rest' as DayStatus },
      ],
    },
    {
      week: 3,
      days: [
        { day: 'L', status: 'failed' as DayStatus },
        { day: 'M', status: 'completed' as DayStatus },
        { day: 'X', status: 'completed' as DayStatus },
        { day: 'J', status: 'failed' as DayStatus },
        { day: 'V', status: 'completed' as DayStatus },
        { day: 'S', status: 'rest' as DayStatus },
        { day: 'D', status: 'rest' as DayStatus },
      ],
    },
    {
      week: 4,
      days: [
        { day: 'L', status: 'completed' as DayStatus },
        { day: 'M', status: 'completed' as DayStatus },
        { day: 'X', status: 'completed' as DayStatus },
        { day: 'J', status: 'completed' as DayStatus },
        { day: 'V', status: 'completed' as DayStatus },
        { day: 'S', status: 'rest' as DayStatus },
        { day: 'D', status: 'rest' as DayStatus },
      ],
    },
  ];

  // Calcular porcentaje de cumplimiento
  const totalWorkoutDays = disciplineData.reduce((acc, week) => {
    return acc + week.days.filter((day) => day.status !== 'rest').length;
  }, 0);

  const completedDays = disciplineData.reduce((acc, week) => {
    return acc + week.days.filter((day) => day.status === 'completed').length;
  }, 0);

  const completionPercentage = Math.round(
    (completedDays / totalWorkoutDays) * 100
  );

  // Datos de prueba para el plan actual
  const planInfo = {
    startDate: '15 Jul 2025',
    endDate: '15 Oct 2025',
    currentGym: 'Smart Fit - Plaza Central',
    progress: 35, // Progreso calculado basado en días transcurridos
  };

  // Datos de prueba para la rutina de hoy
  const todayRoutine = {
    routineName: 'Push Day - Pecho y Tríceps',
    hasAttended: false, // Cambiar a true para ver el estado completado
  };

  const handleFloatingButtonPress = () => {
    router.push('/routine-day');
  };

  const handleRoutinePress = () => {
    router.push('/routine-day-detail');
  };

  const handleOpenRoutineExerciseDetail = () => {
    router.push('/routine-exercise-detail');
  };

  const headerSubtitle = useMemo(() => {
    return todayRoutine.routineName
      ? `Hoy: ${todayRoutine.routineName}`
      : undefined;
  }, [todayRoutine.routineName]);

  return (
    <ScreenWrapper
      headerTitle="Gymmetry"
      backgroundColor={styles.colors.background}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Sección 1: Disciplina y Consistencia */}
        <DisciplineConsistency
          data={disciplineData}
          completionPercentage={completionPercentage}
        />

        {/* Sección 2: Información del Plan Actual */}
        <PlanInfo
          startDate={planInfo.startDate}
          endDate={planInfo.endDate}
          currentGym={planInfo.currentGym}
          progress={planInfo.progress}
        />

        {/* Sección 3: Rutina de Hoy */}
        <TodayRoutine
          routineName={todayRoutine.routineName}
          hasAttended={todayRoutine.hasAttended}
          onPress={handleRoutinePress}
          showTitle={false}
        />

        {/* Acceso directo a RoutineExercise - Detalle */}
        <View style={styles.debugSection}>
          <Text style={styles.debugLabel}>Navegación de depuración</Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Button
              title="Abrir RoutineExercise - Detalle"
              onPress={handleOpenRoutineExerciseDetail}
            />
          </View>
        </View>

        {/* Espacio extra para el botón flotante */}
        <View style={styles.spacer} />
      </ScrollView>

      {/* Botón Flotante */}
      <FloatingActionButton
        onPress={handleFloatingButtonPress}
        icon="play"
        backgroundColor={styles.colors.tint}
      />

      {/* Fin navegación de depuración */}

      {/* Componente de Alertas */}
      <AlertComponent />
    </ScreenWrapper>
  );
}

export default withWebLayout(HomeScreen, { defaultTab: 'index' });
