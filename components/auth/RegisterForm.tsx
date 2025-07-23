import React, { useState, useEffect, memo, useCallback, useMemo } from 'react';
import {
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
} from 'react-native';
import { View, Text } from '../Themed';
import { useColorScheme } from '../useColorScheme';
import Colors from '@/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import StepsBar from './StepsBar';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';
import { WelcomeScreen } from '../home';
import { useAuthContext } from '@/components/auth/AuthContext';
import { commonStyles } from './styles/common';
import { useRegisterForm } from './hooks/useRegisterForm';
import { SkipButton } from './SkipButton';

interface RegisterFormProps {
  onRegister: (userData: any) => void;
  onSwitchToLogin: () => void;
}

const stepTitles = [
  'Credenciales',
  'Datos básicos', 
  'Información personal',
  'Datos fitness',
  'Perfil',
];

const RegisterForm = memo<RegisterFormProps>(({ onRegister, onSwitchToLogin }) => {
  const colorScheme = useColorScheme();
  const authContext = useAuthContext();
  
  const {
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
  } = useRegisterForm({ onRegister });

  useEffect(() => {
    authContext.setIsInRegisterFlow(true);
    authContext.setCurrentStep(currentStep);
    
    return () => {
      authContext.setIsInRegisterFlow(false);
      authContext.setOnSkip(undefined);
    };
  }, [currentStep, authContext]);

  // Manejar el botón físico del dispositivo (Android)
  useEffect(() => {
    const backAction = () => {
      if (currentStep > 0) {
        handleSkipToWelcome();
        return true; 
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [currentStep, handleSkipToWelcome]);

  const handleSkipForCurrentStep = useCallback(() => {
    switch (currentStep) {
      case 1:
      case 2:
      case 3:
      case 4:
        handleSkipToWelcome();
        break;
      default:
        break;
    }
  }, [currentStep, handleSkipToWelcome]);

  const renderCurrentStep = useMemo(() => {
    switch (currentStep) {
      case 0:
        return (
          <Step1
            onNext={handleStep1Next}
            initialData={{
              email: registrationData.email,
              password: registrationData.password,
            }}
          />
        );
      case 1:
        return (
          <Step2
            userId={registrationData.userId || ''}
            onNext={handleStep2Next}
            initialData={{
              firstName: registrationData.firstName || '',
              lastName: registrationData.lastName || '',
              phone: registrationData.phone,
              birthDate: registrationData.birthDate,
              genderId: registrationData.genderId,
            }}
          />
        );
      case 2:
        return (
          <Step3
            userId={registrationData.userId || ''}
            onNext={handleStep3Next}
            initialData={{
              eps: registrationData.eps || '',
              country: registrationData.country || '',
              region: registrationData.region || '',
              city: registrationData.city || '',
              emergencyContact: registrationData.emergencyContact || '',
              emergencyPhone: registrationData.emergencyPhone || '',
              address: registrationData.address || '',
              documentType: registrationData.documentType || '',
              documentTypeId: registrationData.documentTypeId,
              countryId: registrationData.countryId,
            }}
          />
        );
      case 3:
        return (
          <Step4
            userId={registrationData.userId || ''}
            onNext={handleStep4Next}
            initialData={{
              fitnessGoal: registrationData.fitnessGoal || '',
              healthRestrictions: registrationData.healthRestrictions || '',
              additionalInfo: registrationData.additionalInfo || '',
              rh: registrationData.rh || '',
            }}
          />
        );
      case 4:
        return (
          <Step5
            userId={registrationData.userId || ''}
            onNext={handleStep5Next}
            initialData={{
              username: registrationData.username || '',
              profileImage: registrationData.profileImage || '',
            }}
          />
        );
      default:
        return null;
    }
  }, [
    currentStep,
    registrationData,
    handleStep1Next,
    handleStep2Next,
    handleStep3Next,
    handleStep4Next,
    handleStep5Next,
  ]);

  // Si debemos mostrar la pantalla de bienvenida
  if (showWelcomeScreen) {
    return (
      <WelcomeScreen
        userData={{
          email: registrationData.email,
          firstName: registrationData.firstName,
          lastName: registrationData.lastName,
          username: registrationData.username,
        }}
        onContinue={handleWelcomeContinue}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={commonStyles.registerFormContainer}
    >
      <View style={commonStyles.registerFormContainer}>
        {/* Header */}
        <View style={commonStyles.registerFormHeader}>
          <View style={commonStyles.backButton}>
            {currentStep === 0 && (
              <TouchableOpacity 
                onPress={onSwitchToLogin}
                accessibilityLabel="Volver al inicio de sesión"
                accessibilityRole="button"
              >
                <FontAwesome
                  name="chevron-left"
                  size={20}
                  color="white"
                />
              </TouchableOpacity>
            )}
          </View>

          <SkipButton 
            currentStep={currentStep} 
            onSkip={handleSkipForCurrentStep} 
          />
        </View>

        <StepsBar
          currentStep={currentStep}
          totalSteps={stepTitles.length}
          stepTitles={stepTitles}
        />
        {renderCurrentStep}
      </View>
    </KeyboardAvoidingView>
  );
});

RegisterForm.displayName = 'RegisterForm';

export default RegisterForm;
