import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import FormInput from '@/components/common/FormInput';
import Button from '@/components/common/Button';
import GymTypeDropdown from '../GymTypeDropdown';
import { GymStep2Data, GymStepProps, GymType } from '../types';
import { GymService } from '@/services/gymService';
import Colors from '@/constants/Colors';
import { useCustomAlert } from '@/components/common/CustomAlert';
import { GymStyles } from '../styles';

interface GymStep2Props extends GymStepProps<GymStep2Data> {
  gymId: string;
}

export default function GymStep2({
  onNext,
  onBack,
  initialData,
  gymId,
  isLoading = false,
}: GymStep2Props) {
  const { showAlert, AlertComponent } = useCustomAlert();
  const [formData, setFormData] = useState<GymStep2Data>({
    gymTypeId: initialData?.gymTypeId || '',
    slogan: initialData?.slogan || '',
    description: initialData?.description || '',
    Id: initialData?.Id || '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [gymTypes, setGymTypes] = useState<GymType[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(true);

  const loadGymTypes = useCallback(async () => {
    try {
      const response = await GymService.getGymTypes();
      if (response.Success) {
        setGymTypes(response.Data || []);
      } else {
        showAlert(
          'error',
          'Error',
          'No se pudieron cargar los tipos de gimnasio'
        );
      }
    } catch {
      showAlert(
        'error',
        'Error',
        'Error de conexión al cargar tipos de gimnasio'
      );
    } finally {
      setLoadingTypes(false);
    }
  }, [showAlert]);

  useEffect(() => {
    loadGymTypes();
  }, [loadGymTypes]);

  const handleInputChange = (field: keyof GymStep2Data, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.gymTypeId) {
      newErrors.gymTypeId = 'Debes seleccionar un tipo de gimnasio';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateForm()) {
      showAlert(
        'warning',
        'Formulario incompleto',
        'Por favor completa todos los campos requeridos'
      );
      return;
    }
    formData.Id = gymId;
    setLoading(true);
    try {
      await GymService.updateGymStep(formData);
      onNext(formData);
    } catch {
      showAlert('error', 'Error', 'Error al actualizar la información');
    } finally {
      setLoading(false);
    }
  };

  const selectedGymType = Array.isArray(gymTypes)
    ? gymTypes.find(type => type.Id === formData.gymTypeId)
    : null;

  return (
    <KeyboardAvoidingView
      style={GymStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={GymStyles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={GymStyles.scrollContent}
      >
        {/* Header */}
        <View style={GymStyles.header}>
          <Text style={GymStyles.headerTitle}>Tipo y Descripción</Text>
          <Text style={GymStyles.headerSubtitle}>
            Cuéntanos qué tipo de gimnasio es y sus características principales
          </Text>
        </View>

        {/* Tipo de Gimnasio */}
        <View style={GymStyles.section}>
          <GymTypeDropdown
            label='Tipo de Gimnasio *'
            placeholder='Selecciona el tipo de gimnasio'
            options={gymTypes}
            value={formData.gymTypeId}
            onSelect={typeId => handleInputChange('gymTypeId', typeId)}
            error={errors.gymTypeId}
            loading={loadingTypes}
          />
        </View>

        {/* Formulario */}
        <View style={GymStyles.form}>
          <FormInput
            label='Slogan (Opcional)'
            value={formData.slogan}
            onChangeText={value => handleInputChange('slogan', value)}
            multiline
            numberOfLines={2}
          />

          <FormInput
            label='Descripción del Gimnasio *'
            value={formData.description}
            onChangeText={value => handleInputChange('description', value)}
            multiline
            maxLines={6}
            error={errors.description}
          />
        </View>

        {/* Información del tipo seleccionado */}
        {selectedGymType && (
          <View style={GymStyles.infoCard}>
            <FontAwesome
              name='info-circle'
              size={20}
              color={Colors.dark.tint}
            />
            <View style={GymStyles.infoContent}>
              <Text style={GymStyles.infoTitle}>Tipo seleccionado:</Text>
              <Text style={GymStyles.infoText}>{selectedGymType.Name}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Botones */}
      <View style={GymStyles.buttonContainer}>
        <Button
          title={loading ? 'Guardando...' : 'Continuar'}
          onPress={handleNext}
          disabled={loading || isLoading || loadingTypes}
          style={GymStyles.nextButton}
        />
      </View>
      <AlertComponent />
    </KeyboardAvoidingView>
  );
}
