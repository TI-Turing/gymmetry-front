import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  const { login } = useAuth();

  const handleLogin = async (userNameOrEmail: string, password: string) => {
    const success = await login(userNameOrEmail, password);
    if (success) {
      // Después del login exitoso, navegar a la app principal
      router.replace('/(tabs)');
    }
    // Si falla, LoginForm manejará el error
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
