import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Text } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { UI_CONSTANTS } from '@/constants/AppConstants';
import {
  BranchApiService as BranchService,
  CreateBranchRequest,
} from '@/services/branchServiceNew';
import { authService } from '@/services/authService';
import { Step1, Step2, Step3 } from './steps';

interface AddBranchFormProps {
  onComplete: (branchId: string) => void;
  onCancel: () => void;
}

export default function AddBranchForm({
  onComplete,
  onCancel,
}: AddBranchFormProps) {
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

  const handleFormDataChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
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
        Alert.alert(
          'Error',
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
        Alert.alert('Éxito', 'Sede creada correctamente');
      } else {
        Alert.alert('Error', response.Message || 'Error al crear la sede');
      }
    } catch {
      Alert.alert('Error', 'Error al crear la sede');
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
      {[1, 2, 3].map(step => (
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
            onFormDataChange={handleFormDataChange}
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
  return <Step3 branchId={branchId} onMediaUpload={() => {}} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
          <FontAwesome name='times' size={24} color='#FFFFFF' />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agregar Sede</Text>
        <View style={styles.placeholder} />
      </View>

      {renderStepIndicator()}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderCurrentStep()}
      </ScrollView>

      <View style={styles.footer}>
        {currentStep > 1 && (
          <TouchableOpacity style={styles.backButton} onPress={handleBackStep}>
            <Text style={styles.backButtonText}>Atrás</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.nextButton, isLoading && styles.nextButtonDisabled]}
          onPress={handleNextStep}
          disabled={isLoading}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === 3 ? 'Finalizar' : 'Siguiente'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: UI_CONSTANTS.SPACING.LG,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  cancelButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: UI_CONSTANTS.SPACING.LG,
    paddingHorizontal: UI_CONSTANTS.SPACING.XL,
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#555555',
  },
  stepCircleActive: {
    backgroundColor: Colors.dark.tint,
    borderColor: Colors.dark.tint,
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#888888',
  },
  stepNumberActive: {
    color: '#FFFFFF',
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: '#333333',
    marginHorizontal: 8,
  },
  stepLineActive: {
    backgroundColor: Colors.dark.tint,
  },
  content: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: UI_CONSTANTS.SPACING.LG,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#555555',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.dark.tint,
  },
  nextButtonDisabled: {
    backgroundColor: '#555555',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
