import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import AuthContainer from '@/components/auth/AuthContainer';
import { User } from '@/components/auth/types';

export default function RegisterPage() {
  console.log('🚀 RegisterPage renderizada');

  const handleAuthSuccess = (user: User) => {
    console.log('🚀 handleAuthSuccess llamado con:', user);
    // Después del registro exitoso, navegar a la app principal
    router.replace('/(tabs)');
  };

  const handleBack = () => {
    console.log('🚀 handleBack llamado');
    router.back();
  };

  return (
    <View style={{ flex: 1 }}>
      <AuthContainer
        onAuthSuccess={handleAuthSuccess}
        onBack={handleBack}
      />
    </View>
  );
}
