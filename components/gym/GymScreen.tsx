import React, { useEffect, useState } from 'react';
import { View, Text } from '@/components/Themed';
import { useCustomAlert } from '@/components/common/CustomAlert';
import { useGymAdapter } from '@/hooks/useGymAdapter';
import { authService } from '@/services/authService';
import ScreenWrapper from '@/components/layout/ScreenWrapper';
import { withWebLayout } from '@/components/layout/withWebLayout';
import { logger } from '@/utils';
import { AddBranchForm } from '@/components/branches';
import GymRegistrationSteps from './GymRegistrationSteps';
import GymInfoView from './GymInfoView';
import { GymCompleteData, Gym } from './types';
import { useLocalSearchParams } from 'expo-router';
// Import direct views to avoid potential circular import via index barrel
import NoGymView from './NoGymView';
import GymConnectedView from './GymConnectedView';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeGymScreenStyles } from './styles/gymScreen';
import { useI18n } from '@/i18n';

function GymScreen(): React.JSX.Element {
  const { styles, colors } = useThemedStyles(makeGymScreenStyles);
  const { gymId: _paramGymId } = useLocalSearchParams<{ gymId?: string }>();
  const { AlertComponent } = useCustomAlert();
  const {
    gymData,
    isConnectedToGym: contextConnected,
    refreshGymData,
  } = useGymAdapter();
  const { t } = useI18n();

  const [isConnectedToGym, setIsConnectedToGym] = useState(contextConnected);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [showAddBranchForm, setShowAddBranchForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Usar datos del contexto directamente
  const hasGym = Boolean(gymData);

  useEffect(() => {
    // Simplificar: usar datos del contexto
    setIsLoading(false);
  }, [gymData]);

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
    try {
      await refreshGymData();
    } catch (error) {
      logger.error('Error refreshing gym data:', error);
    }
  };
  const handleAddBranch = () => setShowAddBranchForm(true);
  const handleBranchFormComplete = (_branchId: string) => {
    setShowAddBranchForm(false);
    refreshGymData();
  };
  const handleBranchFormCancel = () => setShowAddBranchForm(false);

  const handleBackFromRegistration = () => {
    setShowRegistrationForm(false);
  };

  return (
    <ScreenWrapper
      headerTitle="Gymmetry"
      backgroundColor={colors.background}
      showBackButton={showRegistrationForm}
      onPressBack={
        showRegistrationForm ? handleBackFromRegistration : undefined
      }
    >
      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text>{t('loading')}</Text>
          </View>
        ) : showAddBranchForm ? (
          <AddBranchForm
            onComplete={handleBranchFormComplete}
            onCancel={handleBranchFormCancel}
          />
        ) : hasGym ? (
          <GymInfoView
            gym={gymData as Gym}
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
    </ScreenWrapper>
  );
}
export default withWebLayout(GymScreen, { defaultTab: 'gym' });
// EOF GymScreen cleaned
