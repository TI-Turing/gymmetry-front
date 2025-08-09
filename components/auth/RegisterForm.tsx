import React, { memo, useCallback, useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
} from 'react-native';
import { Text, View } from '../Themed';
// import Colors from '@/constants/Colors';
import StepsBar from './steps/StepsBar';
import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
import Step3 from './steps/Step3';
import Step4 from './steps/Step4';
import Step5 from './steps/Step5';
import { WelcomeScreen } from '../home';
import { useAuthContext } from '@/components/auth/AuthContext';
import { commonStyles } from './styles/common';
import { useRegisterForm } from './hooks/useRegisterForm';
import { SkipButton } from './SkipButton';
import { useCustomAlert } from '@/components/common/CustomAlert';

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

const RegisterForm = memo<RegisterFormProps>(
  ({ onRegister, onSwitchToLogin }) => {
  // Refs para snapshots de cada paso
  const step2Ref = useRef<any>(null);
  const step3Ref = useRef<any>(null);
  const step4Ref = useRef<any>(null);
  const step5Ref = useRef<any>(null);

    // const colorScheme = useColorScheme();
    const authContext = useAuthContext();
    const { showError, showSuccess, AlertComponent } = useCustomAlert();

    const {
      currentStep,
      showWelcomeScreen,
      registrationData,
      // setCurrentStep,
    patchRegistrationData,
      handleSkipToWelcome,
      handleStep1Next,
      handleStep2Next,
      handleStep3Next,
      handleStep4Next,
      handleStep5Next,
      handleWelcomeContinue,
      handleGoBack,
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

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );
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

    // Atrás con preservación de estado
    const handleBackPreservingState = useCallback(() => {
      try {
        if (currentStep === 1 && step2Ref.current?.snapshot) {
          patchRegistrationData(step2Ref.current.snapshot());
        } else if (currentStep === 2 && step3Ref.current?.snapshot) {
          patchRegistrationData(step3Ref.current.snapshot());
        } else if (currentStep === 3 && step4Ref.current?.snapshot) {
          patchRegistrationData(step4Ref.current.snapshot());
        } else if (currentStep === 4 && step5Ref.current?.snapshot) {
          patchRegistrationData(step5Ref.current.snapshot());
        }
      } catch {}
      handleGoBack();
    }, [currentStep, patchRegistrationData, handleGoBack]);

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
              showError={showError}
              showSuccess={showSuccess}
            />
          );
        case 1:
          return (
            <Step2
              ref={step2Ref}
              userId={registrationData.userId || ''}
              onNext={handleStep2Next}
              initialData={{
                firstName: registrationData.firstName || '',
                lastName: registrationData.lastName || '',
                phone: registrationData.phone,
                birthDate: registrationData.birthDate,
                genderId: registrationData.genderId,
                phoneVerified: registrationData.phoneVerified,
              }}
            />
          );
        case 2:
          return (
            <Step3
              ref={step3Ref}
              userId={registrationData.userId || ''}
              onNext={handleStep3Next}
              onBack={handleBackPreservingState}
              initialData={{
                eps: registrationData.eps || '',
                epsId: registrationData.epsId,
                country: registrationData.country || '',
                countryId: registrationData.countryId,
                region: registrationData.region || '',
                regionId: registrationData.regionId,
                city: registrationData.city || '',
                cityId: registrationData.cityId,
                emergencyContact: registrationData.emergencyContact || '',
                emergencyPhone: registrationData.emergencyPhone || '',
                address: registrationData.address || '',
                documentType: registrationData.documentType || '',
                documentTypeId: registrationData.documentTypeId,
                documentNumber: registrationData.documentNumber,
              }}
            />
          );
        case 3:
          return (
            <Step4
              ref={step4Ref}
              userId={registrationData.userId || ''}
              onNext={handleStep4Next}
              onBack={handleBackPreservingState}
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
              ref={step5Ref}
              userId={registrationData.userId || ''}
              onNext={handleStep5Next}
              onBack={handleBackPreservingState}
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
                  accessibilityLabel='Volver'
                  accessibilityRole='button'
                >
                  <Text style={[commonStyles.headerButtonText, { color: 'white' }]}>Atrás</Text>
                </TouchableOpacity>
              )}
              {currentStep >= 2 && (
                <TouchableOpacity
                  onPress={handleBackPreservingState}
                  accessibilityLabel='Volver al paso anterior'
                  accessibilityRole='button'
                >
                  <Text style={[commonStyles.headerButtonText, { color: 'white' }]}>Atrás</Text>
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
          {renderCurrentStep()}
          <AlertComponent />
        </View>
      </KeyboardAvoidingView>
    );
  }
);

RegisterForm.displayName = 'RegisterForm';

export default RegisterForm;
