import React, { useState } from 'react';
import { View } from '../Themed';
import LoginForm from './LoginForm';
import RegisterForm, { RegisterData } from './RegisterForm';
import { User } from './types';
import { authService } from '@/services/authService';
import { CustomAlert } from '@/components/common/CustomAlert';
import { LoginRequest } from '@/dto/auth/requests';
import { useAuth } from '@/contexts/AuthContext';

interface AuthContainerProps {
  onAuthSuccess: (user: User) => void;
  onBack?: () => void;
}

export default function AuthContainer({
  onAuthSuccess,
  onBack: _onBack,
}: AuthContainerProps) {
  const auth = useAuth();
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

  const handleLogin = async ({ userNameOrEmail, password }: LoginRequest) => {
    // Prevenir múltiples llamadas simultáneas
    if (isLoading) {
      return { Success: false, error: 'Operación en progreso' };
    }

    // Validaciones adicionales
    if (!userNameOrEmail?.trim() || !password?.trim()) {
      showAlert('Por favor completa todos los campos');
      return { Success: false, error: 'Campos incompletos' };
    }

    setIsLoading(true);
    try {
      const success = await auth.login(userNameOrEmail.trim(), password);

      if (success) {
        // Login exitoso
        const userData = auth.userData || (await authService.getUserData());
        if (userData) {
          const user: User = {
            id: parseInt(userData.id),
            email: userData.email,
            firstName: 'Usuario', // Valor por defecto, se puede obtener del backend más tarde
            lastName: '',
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
      }

      // Login falló
      const errorMessage = 'Credenciales incorrectas';
      showAlert(errorMessage);
      return { Success: false, error: errorMessage };
    } catch (error: unknown) {
      // Determinar el tipo de error
      let errorMessage =
        'Error de conexión. Verifica tu conexión a internet e intenta nuevamente.';
      const err = error as {
        response?: { status?: number; data?: { Message?: string } };
        message?: string;
        code?: string;
      };
      if (err?.response) {
        // Error del servidor
        if (err.response.status === 401) {
          errorMessage = 'Credenciales incorrectas';
        } else if (err.response.status === 500) {
          errorMessage = 'Error del servidor. Intenta más tarde.';
        } else if (err.response.data?.Message) {
          errorMessage = err.response.data.Message;
        }
      } else if (err?.message?.includes('Network')) {
        errorMessage = 'Sin conexión a internet. Verifica tu conexión.';
      } else if (err?.code === 'TIMEOUT') {
        errorMessage = 'Tiempo de espera agotado. Intenta nuevamente.';
      }

      showAlert(errorMessage);
      return { Success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (userData: RegisterData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const user: User = {
        id: Date.now(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        avatar: null,
      };

      showAlert(
        `Bienvenido ${userData.firstName} ${userData.lastName}. Tu cuenta ha sido creada exitosamente.`,
        'success'
      );
      setTimeout(() => onAuthSuccess(user), 1200);
    } catch (_error) {
      showAlert('No se pudo completar el registro. Intenta nuevamente.');
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
