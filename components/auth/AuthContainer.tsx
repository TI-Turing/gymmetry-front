import React, { useState } from 'react';
import { Alert } from 'react-native';
import { View } from '../Themed';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { User } from './types';
import { authService } from '@/services/authService';
import { CustomAlert } from './CustomAlert';

interface AuthContainerProps {
  onAuthSuccess: (user: User) => void;
  onBack?: () => void;
}

export default function AuthContainer({
  onAuthSuccess,
  onBack,
}: AuthContainerProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error'>('error');
  const [isLoading, setIsLoading] = useState(false);

  const showAlert = (message: string, type: 'success' | 'error' = 'error') => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
    // Auto-ocultar después de 5 segundos para errores, 3 para éxito
    const timeout = type === 'error' ? 5000 : 3000;
    setTimeout(() => {
      setAlertVisible(false);
    }, timeout);
  };

  const switchToRegister = () => setIsLogin(false);
  const switchToLogin = () => setIsLogin(true);

  const handleLogin = async (email: string, password: string) => {
    // Prevenir múltiples llamadas simultáneas
    if (isLoading) {
      return { Success: false, error: 'Operación en progreso' };
    }

    // Validaciones adicionales
    if (!email?.trim() || !password?.trim()) {
      showAlert('Por favor completa todos los campos');
      return { Success: false, error: 'Campos incompletos' };
    }

    setIsLoading(true);
    try {
      const response = await authService.login({
        userNameOrEmail: email.trim(),
        password: password,
      });

      // Verificar que la respuesta tenga la estructura esperada
      if (!response || typeof response.Success !== 'boolean') {
        showAlert('Error en la respuesta del servidor');
        return { Success: false, error: 'Respuesta malformada' };
      }

      if (response.Success) {
        // Login exitoso
        const userData = authService.getUserData();
        if (userData) {
          const user: User = {
            id: parseInt(userData.userId),
            email: userData.email,
            firstName: userData.userName.split(' ')[0] || 'Usuario',
            lastName: userData.userName.split(' ')[1] || '',
            avatar: null,
          };

          showAlert(
            `¡Bienvenido ${user.firstName}! Has iniciado sesión exitosamente.`,
            'success'
          );

          // Llamar onAuthSuccess después de mostrar el mensaje
          setTimeout(() => {
            onAuthSuccess(user);
          }, 1500);

          return { Success: true };
        } else {
          // No se pudieron obtener los datos del usuario
          showAlert('Error al obtener los datos del usuario');
          return {
            Success: false,
            error: 'Error al obtener los datos del usuario',
          };
        }
      } else {
        // Login falló - mostrar mensaje del servidor
        const errorMessage = response.Message || 'Credenciales incorrectas';
        showAlert(errorMessage);
        return { Success: false, error: errorMessage };
      }
    } catch (error: any) {
      // Determinar el tipo de error
      let errorMessage =
        'Error de conexión. Verifica tu conexión a internet e intenta nuevamente.';

      if (error?.response) {
        // Error del servidor
        if (error.response.status === 401) {
          errorMessage = 'Credenciales incorrectas';
        } else if (error.response.status === 500) {
          errorMessage = 'Error del servidor. Intenta más tarde.';
        } else if (error.response.data?.Message) {
          errorMessage = error.response.data.Message;
        }
      } else if (error?.message?.includes('Network')) {
        errorMessage = 'Sin conexión a internet. Verifica tu conexión.';
      } else if (error?.code === 'TIMEOUT') {
        errorMessage = 'Tiempo de espera agotado. Intenta nuevamente.';
      }

      showAlert(errorMessage);
      return { Success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
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
    } catch (_error) {
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
          showAlert={showAlert}
        />
      ) : (
        <RegisterForm
          onRegister={handleRegister}
          onSwitchToLogin={switchToLogin}
        />
      )}

      <CustomAlert
        visible={alertVisible}
        title={alertType === 'success' ? 'Éxito' : 'Error'}
        message={alertMessage}
        type={alertType}
        onClose={() => {
          setAlertVisible(false);
        }}
      />
    </View>
  );
}
