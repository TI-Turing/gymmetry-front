import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  const handleLogin = (email: string, password: string) => {
    // Aquí iría tu lógica de autenticación
    // Después del login exitoso, navegar a la app principal
    router.replace('/(tabs)');
  };

  const handleSwitchToRegister = () => {
    router.push('/register' as any);
  };

  return (
    <View style={{ flex: 1 }}>
      <LoginForm
        onLogin={handleLogin}
        onSwitchToRegister={handleSwitchToRegister}
      />
    </View>
  );
}
