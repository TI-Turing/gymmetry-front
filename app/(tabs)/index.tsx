import React, { useMemo } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
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

type DayStatus = 'completed' | 'failed' | 'rest';

function HomeScreen() {
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
    return acc + week.days.filter(day => day.status !== 'rest').length;
  }, 0);

  const completedDays = disciplineData.reduce((acc, week) => {
    return acc + week.days.filter(day => day.status === 'completed').length;
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
    return todayRoutine.routineName ? `Hoy: ${todayRoutine.routineName}` : undefined;
  }, [todayRoutine.routineName]);

  return (
    <ScreenWrapper
      headerTitle="Rutina"
      headerSubtitle={headerSubtitle}
      backgroundColor="#121212"
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
    <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
          <Text style={{ color: '#B0B0B0', marginBottom: 8 }}>
            Navegación de depuración
          </Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
      <Button title='Abrir RoutineExercise - Detalle' onPress={handleOpenRoutineExerciseDetail} />
          </View>
        </View>

        {/* Espacio extra para el botón flotante */}
        <View style={styles.spacer} />
      </ScrollView>

      {/* Botón Flotante */}
      <FloatingActionButton
        onPress={handleFloatingButtonPress}
        icon='play'
        backgroundColor='#FF6B35'
      />

  {/* Fin navegación de depuración */}

      {/* Componente de Alertas */}
      <AlertComponent />
    </ScreenWrapper>
  );
}

export default withWebLayout(HomeScreen, { defaultTab: 'index' });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  spacer: {
    height: 80, // Espacio para el botón flotante
  },
});
