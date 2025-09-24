import React from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
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
import { useDashboardData } from '@/hooks/useDashboardData';
import { makeHomeStyles } from './styles/home';

function HomeScreen() {
  const styles = useThemedStyles(makeHomeStyles);
  const { showSuccess: _showSuccess, AlertComponent } = useCustomAlert();
  const { data, loading, error, refetch } = useDashboardData();

  const handleFloatingButtonPress = () => {
    router.push('/routine-day');
  };

  const handleRoutinePress = () => {
    router.push('/routine-day-detail');
  };

  // Se elimina el subtítulo bajo el header que mostraba "Hoy: <rutina>"

  // Mostrar loading
  if (loading) {
    return (
      <ScreenWrapper
        headerTitle="Gymmetry"
        backgroundColor={styles.colors.background}
      >
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={styles.colors.tint} />
          <Text style={styles.loadingText}>Cargando datos...</Text>
        </View>
        <AlertComponent />
      </ScreenWrapper>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <ScreenWrapper
        headerTitle="Gymmetry"
        backgroundColor={styles.colors.background}
      >
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Error al cargar datos</Text>
          <Text style={styles.errorSubtext}>{error}</Text>
          <Button
            title="Reintentar"
            onPress={refetch}
            style={styles.retryButton}
          />
        </View>
        <AlertComponent />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      headerTitle="Gymmetry"
      backgroundColor={styles.colors.background}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: 12 }]}
      >
        {/* Sección 1: Disciplina y Consistencia */}
        {data.discipline ? (
          <DisciplineConsistency
            data={data.discipline.data}
            completionPercentage={data.discipline.completionPercentage}
          />
        ) : (
          <View style={styles.emptySection}>
            <Text style={styles.emptyText}>
              No hay datos de disciplina disponibles
            </Text>
          </View>
        )}

        {/* Sección 2: Información del Plan Actual */}
        {data.planInfo ? (
          <PlanInfo
            startDate={data.planInfo.startDate}
            endDate={data.planInfo.endDate}
            currentGym={data.planInfo.currentGym}
            progress={data.planInfo.progress}
          />
        ) : (
          <View style={styles.emptySection}>
            <Text style={styles.emptyText}>No tienes un plan activo</Text>
            <Text style={styles.emptySubtext}>
              Contacta con tu gimnasio para activar un plan
            </Text>
          </View>
        )}

        {/* Sección 3: Rutina de Hoy */}
        {data.todayRoutine ? (
          <TodayRoutine
            routineName={data.todayRoutine.routineName}
            hasAttended={data.todayRoutine.hasAttended}
            onPress={handleRoutinePress}
            showTitle={false}
          />
        ) : (
          <View style={styles.emptySection}>
            <Text style={styles.emptyText}>No hay rutina asignada</Text>
            <Text style={styles.emptySubtext}>
              Solicita una rutina a tu entrenador
            </Text>
          </View>
        )}

        {/* Espacio extra para el botón flotante */}
        <View style={styles.spacer} />
      </ScrollView>

      {/* Botón Flotante */}
      <FloatingActionButton
        onPress={handleFloatingButtonPress}
        icon="play"
        backgroundColor={styles.colors.tint}
      />

      {/* Componente de Alertas */}
      <AlertComponent />
    </ScreenWrapper>
  );
}

export default withWebLayout(HomeScreen, { defaultTab: 'index' });
