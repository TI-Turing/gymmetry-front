import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { View, Text } from '@/components/Themed';
import { useCustomAlert } from '@/components/common/CustomAlert';
import { usePreload } from '@/contexts/PreloadContext';
import { authService } from '@/services/authService';
import MobileHeader from '@/components/layout/MobileHeader';
import { withWebLayout } from '@/components/layout/withWebLayout';
import { logger } from '@/utils';
import { AddBranchForm } from '@/components/branches';
import GymRegistrationSteps from './GymRegistrationSteps';
import GymInfoView from './GymInfoView';
import { GymCompleteData } from './types';
import { GymService } from '@/services/gymService';
// Import direct views to avoid potential circular import via index barrel
import NoGymView from './NoGymView';
import GymConnectedView from './GymConnectedView';

function GymScreen(): React.JSX.Element {
  const { AlertComponent } = useCustomAlert();
  const { gymData, refreshGymData } = usePreload();

  const [isConnectedToGym, setIsConnectedToGym] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [showAddBranchForm, setShowAddBranchForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userGymId, setUserGymId] = useState<string | null>(null);
  const [cachedGym, setCachedGym] = useState<any>(null);
  // Owner ahora se infiere solo por tener gymId (roles manejados en authService)

  // Obtiene user.gymId (ya incluye si es owner)
  const updateUserData = async () => {
    const user = await authService.getUserData();
    const currentUserGymId = (user?.gymId ?? null) as string | null;

    let currentCachedGym: any = null;

    if (currentUserGymId) {
      currentCachedGym = await GymService.getCachedGymById?.(currentUserGymId);
    }

    setUserGymId(currentUserGymId);
    setCachedGym(currentCachedGym);
    logger.debug('GymScreen.updateUserData', { currentUserGymId, hasCachedGym: !!currentCachedGym });
  };

  // Mostrar GymInfo si tiene gymId y hay datos
  const hasGym = Boolean(userGymId) && Boolean(cachedGym || gymData);

  useEffect(() => {
    updateUserData();
  }, []);

  useEffect(() => {
    const checkGymStatus = async () => {
    if (userGymId && !cachedGym && !gymData) {
        await refreshGymData();
      }
      setIsLoading(false);
    };
    checkGymStatus();
  }, [userGymId, cachedGym, gymData, refreshGymData]);

  const handleGymConnection = (connected: boolean) => setIsConnectedToGym(connected);
  const handleRegisterGym = () => setShowRegistrationForm(true);

  const handleRegistrationSubmit = async (data: GymCompleteData) => {
    try {
      setIsLoading(true);
      setShowRegistrationForm(false);
      const userRefreshed = await authService.refreshUserData();
      logger.debug('User refreshed:', userRefreshed);
      if (userRefreshed) {
        await updateUserData();
        await refreshGymData();
      }
      logger.debug('Datos de registro del gimnasio:', data);
    } catch (error) {
      logger.error('Error al procesar el registro del gimnasio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistrationCancel = () => setShowRegistrationForm(false);
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
// EOF GymScreen cleaned
