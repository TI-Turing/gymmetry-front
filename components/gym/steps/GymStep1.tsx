import React, { useState } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import FormInput from '@/components/common/FormInput';
import Button from '@/components/common/Button';
import { useCustomAlert } from '@/components/common/CustomAlert';
import { GymStep1Data, GymStepProps } from '../types';
import { GymService } from '@/services/gymService';
import Colors from '@/constants/Colors';
import { GymStyles } from '../styles';

export default function GymStep1({
  onNext,
  onBack,
  initialData,
  isLoading = false,
}: GymStepProps<GymStep1Data>) {
  const { showError, AlertComponent } = useCustomAlert();

  const [formData, setFormData] = useState<GymStep1Data>({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    nit: initialData?.nit || '',
    owner_UserId: initialData?.owner_UserId || '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof GymStep1Data, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del gimnasio es requerido';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    }
    if (!formData.nit.trim()) {
      newErrors.nit = 'El NIT es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateForm()) {
      showError('Por favor completa todos los campos requeridos');
      return;
    }
    setLoading(true);
    try {
      // Obtener userId del almacenamiento local
      const userId = (await AsyncStorage.getItem('@user_id')) || '';
      // Registrar gimnasio inicial y obtener ID
      const payload = { ...formData, owner_UserId: userId };
      const response = await GymService.registerGym(payload);
      if (response.Success && response.Data) {
        AsyncStorage.setItem('GYM_DATA_KEY', response.Data);
        // Pasar los datos junto con gymId y owner_UserId al siguiente paso
        onNext({
          ...formData,
          gymId: response.Data,
          owner_UserId: userId,
        } as any);
      } else {
        showError(response.Message || 'Error al registrar el gimnasio');
      }
    } catch {
      showError('Error de conexión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
            <Text style={GymStyles.headerTitle}>Información Básica</Text>
            <Text style={GymStyles.headerSubtitle}>
              Comencemos con los datos principales de tu gimnasio
            </Text>
          </View>

          {/* Formulario */}
          <View style={GymStyles.form}>
            <FormInput
              label='Nombre del Gimnasio *'
              value={formData.name}
              onChangeText={value => handleInputChange('name', value)}
              error={errors.name}
            />

            <FormInput
              label='Email Corporativo *'
              value={formData.email}
              onChangeText={value => handleInputChange('email', value)}
              keyboardType='email-address'
              autoCapitalize='none'
              error={errors.email}
            />

            <FormInput
              label='Teléfono Principal *'
              value={formData.phone}
              onChangeText={value => handleInputChange('phone', value)}
              keyboardType='phone-pad'
              error={errors.phone}
            />

            <FormInput
              label='NIT o Identificación Tributaria *'
              value={formData.nit}
              onChangeText={value => handleInputChange('nit', value)}
              error={errors.nit}
            />
          </View>

          {/* Info Card */}
          <View style={GymStyles.infoCard}>
            <FontAwesome
              name='info-circle'
              size={20}
              color={Colors.dark.tint}
            />
            <Text style={GymStyles.infoText}>
              Esta información será verificada por nuestro equipo. Asegúrate de
              que sea correcta y esté actualizada.
            </Text>
          </View>
        </ScrollView>

        {/* Botones */}
        <View style={GymStyles.buttonContainer}>
          <Button
            title={loading ? 'Registrando...' : 'Continuar'}
            onPress={handleNext}
            disabled={loading || isLoading}
            style={GymStyles.nextButton}
          />
        </View>
      </KeyboardAvoidingView>
      <AlertComponent />
    </>
  );
}
