import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import RegisterForm from '@/components/auth/RegisterForm';
import { AuthProvider } from '@/components/auth/AuthContext';

export default function RegisterPage() {
  const handleRegister = (userData: any) => {
    // Aquí iría tu lógica post-registro
    // Navegar a la app principal o pantalla de bienvenida
    router.replace('/(tabs)');
  };

  const handleSwitchToLogin = () => {
    router.push('/login' as any);
  };

  return (
    <AuthProvider>
      <View style={{ flex: 1 }}>
        <RegisterForm 
          onRegister={handleRegister}
          onSwitchToLogin={handleSwitchToLogin}
        />
      </View>
    </AuthProvider>
  );
}
