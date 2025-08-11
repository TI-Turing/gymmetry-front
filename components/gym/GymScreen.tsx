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
import { GymService } from '@/services/gymService';

function GymScreen(): React.JSX.Element {
  const { AlertComponent } = useCustomAlert();
  const { gymData, refreshGymData } = usePreload();
  const [isConnectedToGym, setIsConnectedToGym] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [showAddBranchForm, setShowAddBranchForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userGymId, setUserGymId] = useState<string | null>(null);
  const [cachedGym, setCachedGym] = useState<any>(null);
  const [isAdminOwner, setIsAdminOwner] = useState(false);

  // Actualiza datos del usuario y del gym según reglas: GymId -> gym enlazado; si no, verificar dueño
  const updateUserData = async () => {
    const user = await authService.getUserData();
    const currentUserId = user?.id ?? null;
    const currentUserGymId = (user?.gymId ?? null) as string | null;

    let currentCachedGym: any = null;
    let adminOwner = false;

    if (currentUserGymId) {
      currentCachedGym = await GymService.getCachedGymById?.(currentUserGymId);
    } else if (currentUserId) {
      try {
        const res = await GymService.findGymsByFields?.({ fields: { Owner_UserId: currentUserId } } as any);
        if (res?.Success && Array.isArray(res.Data) && res.Data.length > 0) {
          currentCachedGym = res.Data[0];
          adminOwner = true;
        }
      } catch {}
    }

    setUserGymId(currentUserGymId);
    setCachedGym(currentCachedGym);
    setIsAdminOwner(adminOwner);
    logger.debug('GymScreen.updateUserData', { currentUserGymId, adminOwner, hasCachedGym: !!currentCachedGym });
  };

  // Debe mostrar GymInfo si (tiene GymId o es dueño) y hay datos
  const hasGym = Boolean(userGymId || isAdminOwner) && Boolean(cachedGym || gymData);

  useEffect(() => {
    updateUserData();
  }, []);

  useEffect(() => {
    const checkGymStatus = async () => {
      if ((userGymId || isAdminOwner) && !cachedGym && !gymData) {
        await refreshGymData();
      }
      setIsLoading(false);
    };
    checkGymStatus();
  }, [userGymId, isAdminOwner, cachedGym, gymData, refreshGymData]);

  // Handler para conexión a gimnasio
  const handleGymConnection = (connected: boolean) => {
    setIsConnectedToGym(connected);
  };

  const handleRegisterGym = () => setShowRegistrationForm(true);

  const handleRegistrationSubmit = async (data: GymCompleteData) => {
    try {
      setIsLoading(true);

      // Cerrar el formulario de registro
      setShowRegistrationForm(false);

      // Refrescar la información del usuario para obtener el gymId actualizado
      const userRefreshed = await authService.refreshUserData();
      console.log('User refreshed:', userRefreshed);
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
    await updateUserData();
    await refreshGymData();
  };

  const handleAddBranch = () => setShowAddBranchForm(true);

  const handleBranchFormComplete = (_branchId: string) => {
    setShowAddBranchForm(false);
    refreshGymData();
  };

  const handleBranchFormCancel = () => setShowAddBranchForm(false);

  return (
    <>
      {Platform.OS !== 'web' && <MobileHeader />}
      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text>Cargando...</Text>
          </View>
        ) : showAddBranchForm ? (
          <AddBranchForm onComplete={handleBranchFormComplete} onCancel={handleBranchFormCancel} />
        ) : hasGym ? (
          <GymInfoView gym={gymData || cachedGym!} onRefresh={handleRefreshGym} onAddBranch={handleAddBranch} />
        ) : showRegistrationForm ? (
          <GymRegistrationSteps onComplete={handleRegistrationSubmit} onCancel={handleRegistrationCancel} />
        ) : isConnectedToGym ? (
          <GymConnectedView />
        ) : (
          <NoGymView onConnect={handleGymConnection} onRegisterGym={handleRegisterGym} />
        )}
        <AlertComponent />
      </View>
    </>
  );
}

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

export default withWebLayout(GymScreen, { defaultTab: 'gym' });
