import { useState, useCallback } from 'react';
import { Step4Data } from '../types';
import { userService } from '@/services/userService';
import { handleApiError } from '../utils/api';

interface UseStep4FormProps {
  userId: string;
  initialData?: Step4Data;
  onNext: (data: Step4Data) => void;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
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
  onNext,
  showError,
  showSuccess,
}: UseStep4FormProps): UseStep4FormReturn => {
  const [fitnessGoal, setFitnessGoal] = useState(
    initialData?.fitnessGoal || ''
  );
  const [healthRestrictions, setHealthRestrictions] = useState(
    initialData?.healthRestrictions || ''
  );
  const [additionalInfo, setAdditionalInfo] = useState(
    initialData?.additionalInfo || ''
  );
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
      const updateData: any = {
        Id: userId,
        Name: 'Usuario', // Valor temporal
        LastName: 'Usuario', // Valor temporal
        UserName: 'Usuario Usuario', // Valor temporal
        IdEps: null,
        IdGender: null,
        BirthDate: null,
        DocumentTypeId: null,
        Phone: null,
        CountryId: null,
        Address: null,
        CityId: null,
        RegionId: null,
        Rh: stepData.rh || null,
        EmergencyName: null,
        EmergencyPhone: null,
        PhysicalExceptions: stepData.healthRestrictions || null,
        UserTypeId: null,
        PhysicalExceptionsNotes: stepData.additionalInfo || null,
      };

      const response = await userService.updateUser(updateData);

      if (!response.Success) {
        showError(
          response.Message || 'Error al actualizar los datos. Intenta de nuevo.'
        );
        return; // NO permitir avanzar si la API falla
      }

      onNext(stepData);
    } catch (error: any) {
      const errorMessage = handleApiError(error);
      showError(errorMessage);
      // NO avanzar en caso de error
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
