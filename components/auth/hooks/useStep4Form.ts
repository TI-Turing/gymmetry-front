import { useState, useCallback } from 'react';
import { Step4Data } from '../types';
import { userAPI } from '@/services/apiExamples';
import { handleApiError } from '../utils/api';

interface UseStep4FormProps {
  userId: string;
  initialData?: Step4Data;
  onNext: (data: Step4Data) => void;
}

interface UseStep4FormReturn {
  // State
  fitnessGoal: string;
  healthRestrictions: string;
  additionalInfo: string;
  rh: string;
  isLoading: boolean;
  
  // Handlers
  setFitnessGoal: (value: string) => void;
  setHealthRestrictions: (value: string) => void;
  setAdditionalInfo: (value: string) => void;
  setRh: (value: string) => void;
  handleNext: () => Promise<void>;
}

export const useStep4Form = ({ 
  userId, 
  initialData, 
  onNext 
}: UseStep4FormProps): UseStep4FormReturn => {
  const [fitnessGoal, setFitnessGoal] = useState(initialData?.fitnessGoal || '');
  const [healthRestrictions, setHealthRestrictions] = useState(initialData?.healthRestrictions || '');
  const [additionalInfo, setAdditionalInfo] = useState(initialData?.additionalInfo || '');
  const [rh, setRh] = useState(initialData?.rh || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = useCallback(async () => {
    setIsLoading(true);
    
    const stepData: Step4Data = {
      fitnessGoal: fitnessGoal || undefined,
      healthRestrictions: healthRestrictions || undefined,
      additionalInfo: additionalInfo.trim() || undefined,
      rh: rh || undefined,
    };
    
    try {
      const updateData = {
        ...(stepData.fitnessGoal && { fitnessGoal: stepData.fitnessGoal }),
        ...(stepData.healthRestrictions && { physicalExceptions: stepData.healthRestrictions }),
        ...(stepData.additionalInfo && { additionalInfo: stepData.additionalInfo }),
        ...(stepData.rh && { RH: stepData.rh }),
      };
      
      const response = await userAPI.updateUser(userId, updateData);
      
      if (!response.Success) {
        throw new Error(response.Message || 'Error al actualizar usuario');
      }
      
      onNext(stepData);
    } catch (error: any) {
      const errorMessage = handleApiError(error);
      console.error('❌ [STEP 4] Error:', errorMessage);
      // Continuar aunque falle la API para no bloquear el flujo
      onNext(stepData);
    } finally {
      setIsLoading(false);
    }
  }, [fitnessGoal, healthRestrictions, additionalInfo, rh, userId, onNext]);

  return {
    fitnessGoal,
    healthRestrictions,
    additionalInfo,
    rh,
    isLoading,
    setFitnessGoal,
    setHealthRestrictions,
    setAdditionalInfo,
    setRh,
    handleNext,
  };
};
