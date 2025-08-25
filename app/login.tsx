import React from 'react';
import { router } from 'expo-router';
import AuthContainer from '@/components/auth/AuthContainer';
import ScreenWrapper from '@/components/layout/ScreenWrapper';
import { User } from '@/components/auth/types';

export default function LoginPage() {
  const handleAuthSuccess = (_user: User) => {
    // Después del login exitoso, navegar a la app principal
    router.replace('/(tabs)');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <ScreenWrapper showHeader={false} useSafeArea={true}>
      <AuthContainer onAuthSuccess={handleAuthSuccess} onBack={handleBack} />
    </ScreenWrapper>
  );
}
