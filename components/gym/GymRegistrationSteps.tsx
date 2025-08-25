import React, { useState } from 'react';
import { View } from '@/components/Themed';
import StepsBar from '@/components/auth/steps/StepsBar';
import GymStep1 from './steps/GymStep1';
import GymStep2 from './steps/GymStep2';
import GymStep3 from './steps/GymStep3';
import GymStep4 from './steps/GymStep4';
import GymStep5 from './steps/GymStep5';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeGymStepsStyles } from './styles/gymSteps';
import {
  GymRegistrationStepsProps,
  GymCompleteData,
  GymStep1Data,
  GymStep2Data,
  GymStep3Data,
  GymStep4Data,
  GymStep5Data,
} from './types';
import { useI18n } from '@/i18n';

const TOTAL_STEPS = 5;

export default function GymRegistrationSteps({
  onComplete,
  onCancel,
}: GymRegistrationStepsProps) {
  const { styles } = useThemedStyles(makeGymStepsStyles);
  const { t } = useI18n();
  const [currentStep, setCurrentStep] = useState(0);
  const [gymData, setGymData] = useState<Partial<GymCompleteData>>({});
  const [gymId, setGymId] = useState<string>('');

  const STEP_TITLES = [
    t('gym_step_basic_info'),
    t('gym_step_type_description'),
    t('gym_step_location'),
    t('gym_step_digital_presence'),
    t('gym_step_multimedia'),
  ];

  const handleStep1Complete = (data: GymStep1Data & { gymId?: string }) => {
    if (data.gymId) {
      setGymId(data.gymId);
    }
    setGymData((prev) => ({ ...prev, ...data }));
    setCurrentStep(1);
  };

  const handleStep2Complete = (data: GymStep2Data) => {
    setGymData((prev) => ({ ...prev, ...data }));
    setCurrentStep(2);
  };

  const handleStep3Complete = (data: GymStep3Data) => {
    setGymData((prev) => ({ ...prev, ...data }));
    setCurrentStep(3);
  };

  const handleStep4Complete = (data: GymStep4Data) => {
    setGymData((prev) => ({ ...prev, ...data }));
    setCurrentStep(4);
  };

  const handleStep5Complete = (data: GymStep5Data) => {
    const completeData = { ...gymData, ...data } as GymCompleteData;
    onComplete(completeData);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onCancel();
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <GymStep1
            onNext={handleStep1Complete}
            onBack={handleBack}
            initialData={gymData}
          />
        );
      case 1:
        return (
          <GymStep2
            gymId={gymId}
            onNext={handleStep2Complete}
            onBack={handleBack}
            initialData={gymData}
          />
        );
      case 2:
        return (
          <GymStep3
            gymId={gymId}
            onNext={handleStep3Complete}
            onBack={handleBack}
            initialData={gymData}
          />
        );
      case 3:
        return (
          <GymStep4
            gymId={gymId}
            onNext={handleStep4Complete}
            onBack={handleBack}
            initialData={gymData}
          />
        );
      case 4:
        return (
          <GymStep5
            gymId={gymId}
            onNext={handleStep5Complete}
            onBack={handleBack}
            initialData={gymData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Barra de progreso */}
      <View style={styles.stepsContainer}>
        <StepsBar
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          stepTitles={STEP_TITLES}
        />
      </View>

      {/* Contenido del paso actual */}
      <View style={{ flex: 1 }}>{renderCurrentStep()}</View>
    </View>
  );
}
