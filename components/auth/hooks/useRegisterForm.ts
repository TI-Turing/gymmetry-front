import { useState, useCallback } from 'react';
import { BackHandler } from 'react-native';
import { apiService } from '@/services/apiService';

interface RegistrationData {
  email: string;
  password: string;
  userId?: string;
  token?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  birthDate?: string;
  genderId?: string;
  eps?: string;
  country?: string;
  region?: string;
  city?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  address?: string;
  documentType?: string;
  documentTypeId?: string;
  countryId?: string;
  fitnessGoal?: string;
  healthRestrictions?: string;
  additionalInfo?: string;
  rh?: string;
  username?: string;
  profileImage?: string;
}

interface UseRegisterFormProps {
  onRegister: (userData: any) => void;
}

export const useRegisterForm = ({ onRegister }: UseRegisterFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(false);
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    email: '',
    password: '',
  });

  const handleSkipToWelcome = useCallback(() => {
    if (registrationData.token) {
      apiService.setAuthToken(registrationData.token);
    }
    setShowWelcomeScreen(true);
  }, [registrationData.token]);

  const handleStep1Next = useCallback(
    (data: {
      email: string;
      password: string;
      userId?: string;
      token?: string;
    }) => {
      setRegistrationData(prev => ({ ...prev, ...data }));

      if (data.token) {
        apiService.setAuthToken(data.token);
      }

      setCurrentStep(1);
    },
    []
  );

  const handleStep2Next = useCallback(
    (data: {
      firstName: string;
      lastName: string;
      phone?: string;
      birthDate?: string;
      genderId?: string;
    }) => {
      setRegistrationData(prev => ({ ...prev, ...data }));
      setCurrentStep(2);
    },
    []
  );

  const handleStep3Next = useCallback(
    (data: {
      eps?: string;
      country?: string;
      region?: string;
      city?: string;
      emergencyContact?: string;
      emergencyPhone?: string;
      address?: string;
      documentType?: string;
      documentTypeId?: string;
      countryId?: string;
    }) => {
      setRegistrationData(prev => ({ ...prev, ...data }));
      setCurrentStep(3);
    },
    []
  );

  const handleStep4Next = useCallback(
    (data: {
      fitnessGoal?: string;
      healthRestrictions?: string;
      additionalInfo?: string;
      rh?: string;
    }) => {
      setRegistrationData(prev => ({ ...prev, ...data }));
      setCurrentStep(4);
    },
    []
  );

  const handleStep5Next = useCallback(
    (data: { username?: string; profileImage?: string }) => {
      const finalData = { ...registrationData, ...data };
      setRegistrationData(finalData);
      setShowWelcomeScreen(true);
    },
    [registrationData]
  );

  const handleWelcomeContinue = useCallback(() => {
    onRegister(registrationData);
  }, [onRegister, registrationData]);

  // Funciones para retroceder
  const handleGoBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  return {
    currentStep,
    showWelcomeScreen,
    registrationData,
    setCurrentStep,
    handleSkipToWelcome,
    handleStep1Next,
    handleStep2Next,
    handleStep3Next,
    handleStep4Next,
    handleStep5Next,
    handleWelcomeContinue,
    handleGoBack,
  };
};
