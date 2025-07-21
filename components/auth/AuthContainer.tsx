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

export default function AuthContainer({ onAuthSuccess, onBack }: AuthContainerProps) {
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = async (email: string, password: string) => {
    // Simulamos una llamada de login exitosa
    // En una app real, aquí harías la llamada a tu API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Datos simulados del usuario
    const user = {
      id: 1,
      email,
      firstName: 'Usuario',
      lastName: 'Demo',
      avatar: null,
    };

    Alert.alert(
      '¡Bienvenido!',
      `Has iniciado sesión exitosamente como ${email}`,
      [
        {
          text: 'Continuar',
          onPress: () => onAuthSuccess(user),
        },
      ]
    );
  };

  const handleRegister = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    // Simulamos una llamada de registro exitosa
    // En una app real, aquí harías la llamada a tu API
    await new Promise(resolve => setTimeout(resolve, 1500));

    const user = {
      id: Date.now(),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      avatar: null,
    };

    Alert.alert(
      '¡Cuenta creada!',
      `Bienvenido ${userData.firstName} ${userData.lastName}. Tu cuenta ha sido creada exitosamente.`,
      [
        {
          text: 'Continuar',
          onPress: () => onAuthSuccess(user),
        },
      ]
    );
  };

  const switchToRegister = () => setIsLogin(false);
  const switchToLogin = () => setIsLogin(true);

  return (
    <View style={{ flex: 1 }}>
      {isLogin ? (
        <LoginForm
          onLogin={handleLogin}
          onSwitchToRegister={switchToRegister}
          onBack={onBack}
        />
      ) : (
        <RegisterForm
          onRegister={handleRegister}
          onSwitchToLogin={switchToLogin}
          onBack={onBack}
        />
      )}
    </View>
  );
}
