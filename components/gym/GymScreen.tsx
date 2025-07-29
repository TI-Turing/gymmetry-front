import React, { useState, useEffect } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { View, Text } from '@/components/Themed';
import { useCustomAlert } from '@/components/common/CustomAlert';
import { usePreload } from '@/contexts/PreloadContext';
import { authService } from '@/services/authService';
import MobileHeader from '@/components/layout/MobileHeader';
import { withWebLayout } from '@/components/layout/withWebLayout';
import { NoGymView, GymConnectedView } from './index';
import GymRegistrationSteps from './GymRegistrationSteps';
import GymInfoView from './GymInfoView';
import { GymCompleteData } from './types';

function GymScreen() {
  const { AlertComponent } = useCustomAlert();
  const { gymData, refreshGymData } = usePreload();
  const [isConnectedToGym, setIsConnectedToGym] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar si el usuario tiene un gym asignado
  const userGymId = authService.getGymId();
  const cachedGym = authService.getCachedGym();

  // Usuario tiene gym si tiene gymId Y (tiene datos en caché O datos en preload)
  const hasGym = userGymId && (cachedGym || gymData);

  useEffect(() => {
    const checkGymStatus = async () => {
      if (userGymId && !cachedGym && !gymData) {
        // Si tiene gymId pero no datos en caché, intentar cargar
        await refreshGymData();
      }
      setIsLoading(false);
    };

    checkGymStatus();
  }, [userGymId, cachedGym, gymData, refreshGymData]);

  // Debug: Descomenta para ver el estado
  // console.log('Debug GymScreen:', {
  //   userGymId,
  //   hasGymData: !!gymData,
  //   hasCachedGym: !!cachedGym,
  //   hasGym,
  //   isLoading,
  // });

  const handleGymConnection = (connected: boolean) => {
    setIsConnectedToGym(connected);
  };

  const handleRegisterGym = () => {
    setShowRegistrationForm(true);
  };

  const handleRegistrationSubmit = (data: GymCompleteData) => {
    // Aquí se implementará la lógica para enviar los datos a la API
    // Por ahora, mostrar una alerta de éxito y volver a la vista anterior
    setShowRegistrationForm(false);
    // Actualizar datos del gym después del registro
    refreshGymData();
    // TODO: Implementar llamada a la API
    // eslint-disable-next-line no-console
    console.log('Datos de registro del gimnasio:', data);
  };

  const handleRegistrationCancel = () => {
    setShowRegistrationForm(false);
  };

  const handleRefreshGym = () => {
    refreshGymData();
  };

  return (
    <>
      {Platform.OS !== 'web' && <MobileHeader />}
      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text>Cargando...</Text>
          </View>
        ) : hasGym ? (
          <GymInfoView
            gym={gymData || cachedGym!}
            onRefresh={handleRefreshGym}
          />
        ) : showRegistrationForm ? (
          <GymRegistrationSteps
            onComplete={handleRegistrationSubmit}
            onCancel={handleRegistrationCancel}
          />
        ) : isConnectedToGym ? (
          <GymConnectedView />
        ) : (
          <NoGymView
            onConnect={handleGymConnection}
            onRegisterGym={handleRegisterGym}
          />
        )}
        <AlertComponent />
      </View>
    </>
  );
}

export default withWebLayout(GymScreen, { defaultTab: 'gym' });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
});
