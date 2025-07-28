import React, { useState } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { View } from '@/components/Themed';
import { useCustomAlert } from '@/components/common/CustomAlert';
import MobileHeader from '@/components/layout/MobileHeader';
import { withWebLayout } from '@/components/layout/withWebLayout';
import { NoGymView, GymConnectedView } from './index';
import GymRegistrationSteps from './GymRegistrationSteps';
import { GymCompleteData } from './types';

function GymScreen() {
  const { AlertComponent } = useCustomAlert();
  const [isConnectedToGym, setIsConnectedToGym] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

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
    // TODO: Implementar llamada a la API
    // eslint-disable-next-line no-console
    console.log('Datos de registro del gimnasio:', data);
  };

  const handleRegistrationCancel = () => {
    setShowRegistrationForm(false);
  };

  return (
    <>
      {Platform.OS !== 'web' && <MobileHeader />}
      <View style={styles.container}>
        {showRegistrationForm ? (
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
});
