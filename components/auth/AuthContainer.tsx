import React, { useState } from 'react';
import { Alert } from 'react-native';
import { View } from '../Themed';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { User } from './types';

interface AuthContainerProps {
  onAuthSuccess: (user: User) => void;
  onBack?: () => void;
}

export default function AuthContainer({
  onAuthSuccess,
  onBack,
}: AuthContainerProps) {
  const [isLogin, setIsLogin] = useState(true);

  const switchToRegister = () => setIsLogin(false);
  const switchToLogin = () => setIsLogin(true);

  const handleLogin = async (email: string, password: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const user: User = {
        id: 1,
        email,
        firstName: 'Usuario',
        lastName: 'Demo',
        avatar: null,
      };

      Alert.alert(
        '¡Bienvenido!',
        `Has iniciado sesión exitosamente como ${email}`,
        [{ text: 'Continuar', onPress: () => onAuthSuccess(user) }]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo iniciar sesión. Intenta nuevamente.');
    }
  };

  const handleRegister = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const user: User = {
        id: Date.now(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        avatar: null,
      };

      Alert.alert(
        '¡Cuenta creada!',
        `Bienvenido ${userData.firstName} ${userData.lastName}. Tu cuenta ha sido creada exitosamente.`,
        [{ text: 'Continuar', onPress: () => onAuthSuccess(user) }]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'No se pudo completar el registro. Intenta nuevamente.'
      );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {isLogin ? (
        <LoginForm
          onLogin={handleLogin}
          onSwitchToRegister={switchToRegister}
        />
      ) : (
        <RegisterForm
          onRegister={handleRegister}
          onSwitchToLogin={switchToLogin}
        />
      )}
    </View>
  );
}
