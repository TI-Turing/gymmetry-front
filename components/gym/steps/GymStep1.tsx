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
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeGymStepsStyles } from '../styles/gymSteps';

export default function GymStep1({
  onNext,
  onBack: _onBack,
  initialData,
  isLoading = false,
}: GymStepProps<GymStep1Data>) {
  const { showError, AlertComponent } = useCustomAlert();
  const { styles, colors } = useThemedStyles(makeGymStepsStyles);

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
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors((prev) => ({
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
      const payload = {
        Name: formData.name,
        Email: formData.email,
        Nit: formData.nit,
        CountryId: 'CO',
        Owner_UserId: userId,
      };
      const response = await GymService.registerGym(payload);
      if (response.Success && response.Data) {
        // Pasar los datos junto con gymId y owner_UserId al siguiente paso
        // Enviar datos del paso 1 con identificadores válidos para el siguiente paso
        onNext({
          ...formData,
          // Persistimos owner_UserId proveniente de AsyncStorage
          owner_UserId: userId,
          // El id del gimnasio se persiste externamente para pasos siguientes
        });
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
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Información Básica</Text>
            <Text style={styles.headerSubtitle}>
              Comencemos con los datos principales de tu gimnasio
            </Text>
          </View>

          {/* Formulario */}
          <View style={styles.form}>
            <FormInput
              label="Nombre del Gimnasio *"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              error={errors.name}
            />

            <FormInput
              label="Email Corporativo *"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <FormInput
              label="Teléfono Principal *"
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              keyboardType="phone-pad"
              error={errors.phone}
            />

            <FormInput
              label="NIT o Identificación Tributaria *"
              value={formData.nit}
              onChangeText={(value) => handleInputChange('nit', value)}
              error={errors.nit}
            />
          </View>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <FontAwesome name="info-circle" size={20} color={colors.tint} />
            <Text style={styles.infoText}>
              Esta información será verificada por nuestro equipo. Asegúrate de
              que sea correcta y esté actualizada.
            </Text>
          </View>
        </ScrollView>

        {/* Botones */}
        <View style={styles.buttonContainer}>
          <Button
            title={loading ? 'Registrando...' : 'Continuar'}
            onPress={handleNext}
            disabled={loading || isLoading}
            style={styles.nextButton}
          />
        </View>
      </KeyboardAvoidingView>
      <AlertComponent />
    </>
  );
}
