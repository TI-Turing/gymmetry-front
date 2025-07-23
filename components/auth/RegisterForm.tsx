import React, { useState, useEffect } from 'react';
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
import { apiService } from '@/services/apiService';
import { useAuthContext } from '@/components/auth/AuthContext';
import { commonStyles } from './styles/common';

interface RegisterFormProps {
  onRegister: (userData: any) => void;
  onSwitchToLogin: () => void;
}

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

export default function RegisterForm({ onRegister, onSwitchToLogin }: RegisterFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(false);
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    email: '',
    password: '',
  });
  const colorScheme = useColorScheme();
  const authContext = useAuthContext();

  useEffect(() => {
    authContext.setIsInRegisterFlow(true);
    authContext.setCurrentStep(currentStep);
    
    
    return () => {
      authContext.setIsInRegisterFlow(false);
      authContext.setOnSkip(undefined);
    };
  }, [currentStep]);

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
  }, [currentStep]);

  const handleSkipToWelcome = () => {
    if (registrationData.token) {
      apiService.setAuthToken(registrationData.token);
    }
    
    setShowWelcomeScreen(true);
  };

  const stepTitles = [
    'Credenciales',
    'Datos básicos',
    'Información personal',
    'Datos fitness',
    'Perfil',
  ];

  const handleStep1Next = (data: { email: string; password: string; userId?: string; token?: string }) => {
    setRegistrationData(prev => ({ ...prev, ...data }));
    
    if (data.token) {
      apiService.setAuthToken(data.token);
    }
    
    setCurrentStep(1);
  };

  const handleStep2Next = (data: { firstName: string; lastName: string; phone?: string; birthDate?: string }) => {
    setRegistrationData(prev => ({ ...prev, ...data }));
    setCurrentStep(2);
  };

  const handleStep2Skip = () => {
    handleSkipToWelcome();
  };

  const handleStep3Next = (data: {
    eps?: string;
    country?: string;
    region?: string;
    city?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
    address?: string;
  }) => {
    setRegistrationData(prev => ({ ...prev, ...data }));
    setCurrentStep(3);
  };

  const handleStep3Skip = () => {
    handleSkipToWelcome();
  };

  const handleStep4Next = (data: {
    fitnessGoal?: string;
    healthRestrictions?: string;
    additionalInfo?: string;
  }) => {
    setRegistrationData(prev => ({ ...prev, ...data }));
    setCurrentStep(4);
  };

  const handleStep4Skip = () => {
    handleSkipToWelcome();
  };

  const handleStep5Next = (data: {
    username?: string;
    profileImage?: string;
  }) => {
    const finalData = { ...registrationData, ...data };
    setRegistrationData(finalData);
    setShowWelcomeScreen(true);
  };

  const handleStep5Skip = () => {
    handleSkipToWelcome();
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
    // El botón back ahora se maneja en el layout
  };

  const renderCurrentStep = () => {
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
  };

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
        onContinue={() => {
          onRegister(registrationData);
        }}
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
              >
                <FontAwesome
                  name="chevron-left"
                  size={20}
                  color="white"
                />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity 
            style={commonStyles.skipButtonRegister}
            onPress={() => {
              switch (currentStep) {
                case 1:
                  handleStep2Skip();
                  break;
                case 2:
                  handleStep3Skip();
                  break;
                case 3:
                  handleStep4Skip();
                  break;
                case 4:
                  handleStep5Skip();
                  break;
                default:
                  break;
              }
            }}
            disabled={currentStep === 0}
          >
            <Text style={[
              commonStyles.headerButtonText, 
              { 
                color: currentStep === 0 ? 'transparent' : 'white' 
              }
            ]}>
              {currentStep === 0 ? '' : 'Omitir'}
            </Text>
          </TouchableOpacity>
        </View>

        <StepsBar
          currentStep={currentStep}
          totalSteps={stepTitles.length}
          stepTitles={stepTitles}
        />
        {renderCurrentStep()}
      </View>
    </KeyboardAvoidingView>
  );
}
