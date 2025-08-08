import React, { useState, useEffect } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { View, Text } from '@/components/Themed';
import { useCustomAlert } from '@/components/common/CustomAlert';
import { usePreload } from '@/contexts/PreloadContext';
import { authService } from '@/services/authService';
import MobileHeader from '@/components/layout/MobileHeader';
import { withWebLayout } from '@/components/layout/withWebLayout';
import { NoGymView, GymConnectedView } from './index';
import { logger } from '@/utils';
import { AddBranchForm } from '@/components/branches';
import GymRegistrationSteps from './GymRegistrationSteps';
import GymInfoView from './GymInfoView';
import { GymCompleteData } from './types';

function GymScreen() {
  const { AlertComponent } = useCustomAlert();
  const { gymData, refreshGymData } = usePreload();
  const [isConnectedToGym, setIsConnectedToGym] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [showAddBranchForm, setShowAddBranchForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userGymId, setUserGymId] = useState<string | null>(null);
  const [cachedGym, setCachedGym] = useState<any>(null);

  // Función para actualizar datos del usuario
  const updateUserData = () => {
    const currentUserGymId = authService.getGymId();
    const { GymService } = require('@/services/gymService');
    const currentCachedGym = GymService.getCachedGym();
    setUserGymId(currentUserGymId);
    setCachedGym(currentCachedGym);
  };

  // Usuario tiene gym si tiene gymId Y (tiene datos en caché O datos en preload)
  const hasGym = userGymId && (cachedGym || gymData);

  useEffect(() => {
    // Actualizar datos del usuario inicialmente
    updateUserData();
  }, []);

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
  //const handleGymConnection = (connected: boolean) => {
    setIsConnectedToGym(connected);
  };

  const handleRegisterGym = () => {
    setShowRegistrationForm(true);
  };

  const handleRegistrationSubmit = async (data: GymCompleteData) => {
    try {
      setIsLoading(true);

      // Cerrar el formulario de registro
      setShowRegistrationForm(false);

      // Refrescar la información del usuario para obtener el gymId actualizado
      const userRefreshed = await authService.refreshUserData();

      if (userRefreshed) {
        // Actualizar el estado local con los nuevos datos del usuario
        updateUserData();

        // Actualizar datos del gym después del registro
        await refreshGymData();
      }

      // TODO: Implementar llamada a la API si es necesario
      logger.debug('Datos de registro del gimnasio:', data);
    } catch (error) {
      logger.error('Error al procesar el registro del gimnasio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistrationCancel = () => {
    setShowRegistrationForm(false);
  };

  const handleRefreshGym = async () => {
    // Actualizar datos del usuario por si hay cambios
    updateUserData();
    // Refrescar datos del gym
    await refreshGymData();
  };

  const handleAddBranch = () => {
    setShowAddBranchForm(true);
  };

  const handleBranchFormComplete = (branchId: string) => {
    setShowAddBranchForm(false);
    refreshGymData(); // Actualizar datos para mostrar la nueva sede
    // TODO: Mostrar mensaje de éxito o navegar a la vista de la sede
  };

  const handleBranchFormCancel = () => {
    setShowAddBranchForm(false);
  };

  return (
    <>
      {Platform.OS !== 'web' && <MobileHeader />}
      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text>Cargando...</Text>
          </View>
        ) : showAddBranchForm ? (
          <AddBranchForm
            onComplete={handleBranchFormComplete}
            onCancel={handleBranchFormCancel}
          />
        ) : hasGym ? (
          <GymInfoView
            gym={gymData || cachedGym!}
            onRefresh={handleRefreshGym}
            onAddBranch={handleAddBranch}
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
