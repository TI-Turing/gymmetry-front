import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { View } from '../Themed';
import { useColorScheme } from '../useColorScheme';
import Colors from '@/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import StepsBar from './StepsBar';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import { apiService } from '@/services/apiService';

interface RegisterFormProps {
  onRegister: (userData: any) => void;
  onSwitchToLogin: () => void;
  onBack?: () => void;
}

interface RegistrationData {
  // Step 1
  email: string;
  password: string;
  userId?: string;
  token?: string;
  // Step 2
  firstName?: string;
  lastName?: string;
  phone?: string;
  birthDate?: string;
  // Step 3
  eps?: string;
  country?: string;
  region?: string;
  city?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  address?: string;
  // Step 4
  fitnessGoal?: string;
  healthRestrictions?: string;
  additionalInfo?: string;
}

export default function RegisterForm({ onRegister, onSwitchToLogin, onBack }: RegisterFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    email: '',
    password: '',
  });
  const colorScheme = useColorScheme();

  const stepTitles = [
    'Credenciales',
    'Datos básicos',
    'Información personal',
    'Datos fitness',
  ];

  const handleStep1Next = (data: { email: string; password: string; userId?: string; token?: string }) => {
    setRegistrationData(prev => ({ ...prev, ...data }));
    
    // Si recibimos un token, guardarlo en el servicio API
    if (data.token) {
      console.log('🔑 [REGISTER FORM] Token recibido, configurando para futuras peticiones...');
      apiService.setAuthToken(data.token);
      console.log('✅ [REGISTER FORM] Token configurado en apiService');
    } else {
      console.log('⚠️ [REGISTER FORM] No se recibió token del Step 1');
    }
    
    setCurrentStep(1);
  };

  const handleStep2Next = (data: { firstName: string; lastName: string; phone?: string; birthDate?: string }) => {
    setRegistrationData(prev => ({ ...prev, ...data }));
    setCurrentStep(2);
  };

  const handleStep2Skip = () => {
    setCurrentStep(2);
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

  const handleStep4Next = (data: {
    fitnessGoal?: string;
    healthRestrictions?: string;
    additionalInfo?: string;
  }) => {
    const finalData = { ...registrationData, ...data };
    onRegister(finalData);
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else if (onBack) {
      onBack();
    }
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
            userId={registrationData.userId!}
            onNext={handleStep2Next}
            onSkip={handleStep2Skip}
            initialData={{
              firstName: registrationData.firstName || '',
              lastName: registrationData.lastName || '',
              phone: registrationData.phone,
              birthDate: registrationData.birthDate,
            }}
          />
        );
      case 2:
        return (
          <Step3
            userId={registrationData.userId!}
            onNext={handleStep3Next}
            initialData={{
              eps: registrationData.eps,
              country: registrationData.country,
              region: registrationData.region,
              city: registrationData.city,
              emergencyContact: registrationData.emergencyContact,
              emergencyPhone: registrationData.emergencyPhone,
              address: registrationData.address,
            }}
          />
        );
      case 3:
        return (
          <Step4
            userId={registrationData.userId!}
            onNext={handleStep4Next}
            initialData={{
              fitnessGoal: registrationData.fitnessGoal,
              healthRestrictions: registrationData.healthRestrictions,
              additionalInfo: registrationData.additionalInfo,
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.topSection}>
        <TouchableOpacity style={styles.backButton} onPress={handlePrevious}>
          <FontAwesome 
            name="arrow-left" 
            size={24} 
            color={Colors[colorScheme].text} 
          />
        </TouchableOpacity>
      </View>

      <StepsBar
        currentStep={currentStep}
        totalSteps={4}
        stepTitles={stepTitles}
      />

      {renderCurrentStep()}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    paddingTop: 50,
    paddingLeft: 10,
    paddingBottom: 10,
  },
  backButton: {
    padding: 10,
    alignSelf: 'flex-start',
  },
});
