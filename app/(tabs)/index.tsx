import React from 'react';
import { StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useCustomAlert } from '@/components/auth/CustomAlert';
import DisciplineConsistency from '@/components/home/DisciplineConsistency';
import PlanInfo from '@/components/home/PlanInfo';
import TodayRoutine from '@/components/home/TodayRoutine';
import FloatingActionButton from '@/components/home/FloatingActionButton';

type DayStatus = 'completed' | 'failed' | 'rest';

export default function HomeScreen() {
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
    showSuccess('¡Accediendo a la rutina de hoy!', {
      confirmText: 'Continuar',
      onConfirm: () => {
        // Aquí navegarías a la pantalla de rutina
      },
    });
  };

  const handleRoutinePress = () => {
    showSuccess('Abriendo rutina detallada', {
      confirmText: 'Ver Rutina',
      onConfirm: () => {
        // Navegación a rutina detallada
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>¡Hola! 👋</Text>
          <Text style={styles.headerSubtitle}>¿Listo para entrenar hoy?</Text>
        </View>

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
        />

        {/* Espacio extra para el botón flotante */}
        <View style={styles.spacer} />
      </ScrollView>

      {/* Botón Flotante */}
      <FloatingActionButton
        onPress={handleFloatingButtonPress}
        icon='play'
        backgroundColor='#FF6B35'
      />

      {/* Componente de Alertas */}
      <AlertComponent />
    </SafeAreaView>
  );
}

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
  header: {
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#B0B0B0',
  },
  spacer: {
    height: 80, // Espacio para el botón flotante
  },
});
