import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import {
  BranchApiService as BranchService,
  CreateBranchRequest,
} from '@/services/branchServiceNew';
import { authService } from '@/services/authService';
import { Step1, Step2, Step3 } from './steps';
import { useCustomAlert } from '@/components/common/CustomAlert';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeGymStepsStyles } from '@/components/gym/styles/gymSteps';

interface AddBranchFormProps {
  onComplete: (branchId: string) => void;
  onCancel: () => void;
}

export default function AddBranchForm({
  onComplete,
  onCancel,
}: AddBranchFormProps) {
  const { styles, colors } = useThemedStyles(makeGymStepsStyles);
  const { showAlert, showError, showSuccess, AlertComponent } =
    useCustomAlert();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [branchId, setBranchId] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Datos del formulario
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    cityId: '00000000-0000-0000-0000-000000000000', // Por ahora valores fijos
    regionId: '00000000-0000-0000-0000-000000000000',
    gymId: authService.getGymId() || '',
    accessMethodId: '',
    adminUserId: '',
  });

  const handleFormDataChange = (field: string, value: unknown) => {
    const v = typeof value === 'string' ? value : String(value ?? '');
    setFormData((prev) => ({ ...prev, [field]: v }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre de la sede es obligatorio';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'La dirección es obligatoria';
    }

    if (!formData.accessMethodId) {
      newErrors.accessMethodId = 'Debes seleccionar un método de acceso';
    }

    if (!formData.adminUserId) {
      newErrors.adminUserId = 'Debes seleccionar un administrador principal';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = async () => {
    if (currentStep === 1) {
      if (!validateStep1()) {
        showAlert(
          'warning',
          'Formulario incompleto',
          'Por favor completa todos los campos obligatorios'
        );
        return;
      }
      await createBranch();
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      onComplete(branchId);
    }
  };

  const createBranch = async () => {
    setIsLoading(true);
    try {
      const createRequest: CreateBranchRequest = {
        name: formData.name,
        address: formData.address,
        cityId: formData.cityId,
        regionId: formData.regionId,
        gymId: formData.gymId,
        accessMethodId: formData.accessMethodId,
      };

      const response = await BranchService.createBranch(createRequest);

      if (response.Success) {
        setBranchId(response.Data || '');
        setCurrentStep(2);
        showSuccess('Sede creada correctamente');
      } else {
        showError(response.Message || 'Error al crear la sede');
      }
    } catch {
      showError('Error al crear la sede');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3].map((step) => (
        <View key={step} style={styles.stepIndicatorContainer}>
          <View
            style={[
              styles.stepCircle,
              currentStep >= step && styles.stepCircleActive,
            ]}
          >
            <Text
              style={[
                styles.stepNumber,
                currentStep >= step && styles.stepNumberActive,
              ]}
            >
              {step}
            </Text>
          </View>
          {step < 3 && (
            <View
              style={[
                styles.stepLine,
                currentStep > step && styles.stepLineActive,
              ]}
            />
          )}
        </View>
      ))}
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1
            formData={formData}
            onFormDataChange={(field: string, value: string) =>
              handleFormDataChange(field, value)
            }
            errors={errors}
          />
        );
      case 2:
        return (
          <Step2
            branchId={branchId}
            formData={formData}
            onFormDataChange={handleFormDataChange}
          />
        );
      case 3:
        return <Step3 branchId={branchId} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={{ padding: 8 }}>
          <FontAwesome name="times" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agregar Sede</Text>
        <View style={{ width: 40 }} />
      </View>

      {renderStepIndicator()}

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {renderCurrentStep()}
      </ScrollView>

      <View style={styles.footer}>
        {currentStep > 1 && (
          <TouchableOpacity style={styles.backButton} onPress={handleBackStep}>
            <Text style={styles.backButtonText}>Atrás</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.nextButton, isLoading && { opacity: 0.6 }]}
          onPress={handleNextStep}
          disabled={isLoading}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === 3 ? 'Finalizar' : 'Siguiente'}
          </Text>
        </TouchableOpacity>
      </View>
      <AlertComponent />
    </View>
  );
}
// Reutilizamos la fábrica de estilos de los pasos del gimnasio para consistencia visual
// y soporte claro/oscuro.
