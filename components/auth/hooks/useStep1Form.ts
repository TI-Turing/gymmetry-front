import { useState, useCallback, useEffect } from 'react';
import { Step1Data, ApiResponse } from '../types';
import { usePasswordValidation, useFormValidation } from './useValidation';
import { validatePassword } from '../utils/validation';
import { handleApiError } from '../utils/api';
import { userAPI } from '@/services/apiExamples';
import { apiService } from '@/services/apiService';

interface UseStep1FormProps {
  onNext: (data: Step1Data) => void;
  initialData?: { email: string; password: string } | undefined;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
}

interface UseStep1FormReturn {
  // State
  confirmPassword: string;
  showConfirmPassword: boolean;
  isLoading: boolean;
  isFormValid: boolean;
  passwordsMatch: boolean;

  // Email validation
  email: string;
  setEmail: (email: string) => void;
  isEmailValid: boolean;

  // Password validation
  password: string;
  setPassword: (password: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  validation: any;
  isPasswordValid: boolean;

  // Handlers
  setConfirmPassword: (password: string) => void;
  setShowConfirmPassword: (show: boolean) => void;
  handleNext: () => Promise<void>;
}

export const useStep1Form = ({
  onNext,
  initialData,
  showError,
  showSuccess,
}: UseStep1FormProps): UseStep1FormReturn => {
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { email, setEmail, isEmailValid } = useFormValidation();
  const {
    password,
    setPassword,
    showPassword,
    setShowPassword,
    validation,
    isValid: isPasswordValid,
  } = usePasswordValidation(email);

  // Inicializar con datos previos si existen
  useEffect(() => {
    if (initialData) {
      setEmail(initialData.email);
      setPassword(initialData.password);
      setConfirmPassword(initialData.password);
    }
  }, [initialData, setEmail, setPassword]);

  const passwordsMatch = password === confirmPassword;
  const isFormValid =
    isEmailValid &&
    isPasswordValid &&
    passwordsMatch &&
    confirmPassword.length > 0;

  const handleNext = useCallback(async () => {
    if (!isFormValid) {
      let errorMessage = '';

      if (!isEmailValid) {
        errorMessage = 'Por favor ingresa un email válido';
      } else if (!isPasswordValid) {
        const passwordErrors = validatePassword(password, email);
        errorMessage =
          passwordErrors.length > 0
            ? passwordErrors.join('\n')
            : 'La contraseña no cumple los requisitos';
      } else if (!passwordsMatch) {
        errorMessage = 'Las contraseñas no coinciden';
      } else if (confirmPassword.length === 0) {
        errorMessage = 'Por favor confirma tu contraseña';
      }

      showError(errorMessage);
      return;
    }

    setIsLoading(true);

    try {
      const response = (await userAPI.createUser({
        email,
        Password: password,
      })) as ApiResponse;

      if (!response.Success) {
        throw new Error(response.Message || 'Error al crear usuario');
      }

      if (response.Data?.Token) {
        apiService.setAuthToken(response.Data.Token);
      }

      const stepData = {
        email,
        password,
        userId: response.Data?.Id,
        token: response.Data?.Token,
      };

      onNext(stepData);
    } catch (error: any) {
      const errorMessage = handleApiError(error);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [
    isFormValid,
    isEmailValid,
    isPasswordValid,
    passwordsMatch,
    confirmPassword,
    email,
    password,
    onNext,
  ]);

  return {
    confirmPassword,
    showConfirmPassword,
    isLoading,
    isFormValid,
    passwordsMatch,
    email,
    setEmail,
    isEmailValid,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    validation,
    isPasswordValid,
    setConfirmPassword,
    setShowConfirmPassword,
    handleNext,
  };
};
