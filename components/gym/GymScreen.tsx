import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
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
import { GymCompleteData, Gym } from './types';
import { GymService } from '@/services/gymService';
import { useLocalSearchParams } from 'expo-router';
// Import direct views to avoid potential circular import via index barrel
import NoGymView from './NoGymView';
import GymConnectedView from './GymConnectedView';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeGymScreenStyles } from './styles/gymScreen';

function GymScreen(): React.JSX.Element {
  const { styles } = useThemedStyles(makeGymScreenStyles);
  const { gymId: paramGymId } = useLocalSearchParams<{ gymId?: string }>();
  const { AlertComponent } = useCustomAlert();
  const { gymData, refreshGymData } = usePreload();

  const [isConnectedToGym, setIsConnectedToGym] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [showAddBranchForm, setShowAddBranchForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userGymId, setUserGymId] = useState<string | null>(null);
  const [cachedGym, setCachedGym] = useState<Gym | null>(null);
  // Owner ahora se infiere solo por tener gymId (roles manejados en authService)

  // Obtiene gymId desde params o del usuario (si no hay param)
  const updateUserData = async () => {
    const user = await authService.getUserData();
    const targetGymId: string | null =
      (paramGymId as string) ?? ((user?.gymId ?? null) as string | null);

    let currentCachedGym: Gym | null = null;

    if (targetGymId) {
      currentCachedGym = await GymService.getCachedGymById?.(targetGymId);
    }

    setUserGymId(targetGymId);
    setCachedGym(currentCachedGym);
    logger.debug('GymScreen.updateUserData', {
      targetGymId,
      hasCachedGym: !!currentCachedGym,
      fromParam: !!paramGymId,
    });
  };

  // Mostrar GymInfo si tiene gymId y hay datos
  const hasGym = Boolean(userGymId) && Boolean(cachedGym || gymData);

  useEffect(() => {
    updateUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramGymId]);

  useEffect(() => {
    const checkGymStatus = async () => {
      if (userGymId && !cachedGym && !gymData) {
        await refreshGymData();
      }
      setIsLoading(false);
    };
    checkGymStatus();
  }, [userGymId, cachedGym, gymData, refreshGymData]);

  const handleGymConnection = (connected: boolean) =>
    setIsConnectedToGym(connected);
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
    // Si es un gym por parámetro, usamos el servicio directo; si no, contexto
    if (paramGymId) {
      await GymService.updateCacheFromObserver(paramGymId as string);
      const refreshed = await GymService.getCachedGymById(paramGymId as string);
      setCachedGym(refreshed);
    } else {
      await refreshGymData();
    }
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
          <AddBranchForm
            onComplete={handleBranchFormComplete}
            onCancel={handleBranchFormCancel}
          />
        ) : hasGym ? (
          <GymInfoView
            gym={(gymData as Gym) || (cachedGym as Gym)}
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
// EOF GymScreen cleaned
