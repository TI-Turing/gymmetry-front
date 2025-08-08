import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import AuthContainer from '@/components/auth/AuthContainer';
import { User } from '@/components/auth/types';

export default function RegisterPage() {
  const handleAuthSuccess = (user: User) => {
    // Después del registro exitoso, navegar a la app principal
    router.replace('/(tabs)');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={{ flex: 1 }}>
      <AuthContainer onAuthSuccess={handleAuthSuccess} onBack={handleBack} />
    </View>
  );
}
