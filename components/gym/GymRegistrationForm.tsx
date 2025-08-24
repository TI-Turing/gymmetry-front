import React, { useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import FormInput from '@/components/common/FormInput';
import Button from '@/components/common/Button';
import { GymRegistrationFormData, GymRegistrationFormProps } from './types';
import { useCustomAlert } from '@/components/common/CustomAlert';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeGymRegistrationFormStyles } from './styles/gymRegistrationForm';

export default function GymRegistrationForm({
  onSubmit,
  onCancel,
}: GymRegistrationFormProps) {
  const styles = useThemedStyles(makeGymRegistrationFormStyles);
  const { showAlert, AlertComponent } = useCustomAlert();
  const [formData, setFormData] = useState<GymRegistrationFormData>({
    name: '',
    nit: '',
    email: '',
    countryId: '',
    gymPlanSelectedId: '',
    gymTypeId: '',
    instagram: '',
    facebook: '',
    website: '',
    slogan: '',
    phone: '',
    country: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (
    field: keyof GymRegistrationFormData,
    value: string
  ) => {
    setFormData((prev: GymRegistrationFormData) => ({
      ...prev,
      [field]: value,
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[field as string]) {
      setErrors((prev: { [key: string]: string }) => ({
        ...prev,
        [field as string]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Campos requeridos
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del gimnasio es requerido';
    }
    if (!formData.nit.trim()) {
      newErrors.nit = 'El NIT es requerido';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    }
    if (!formData.country.trim()) {
      newErrors.country = 'El país es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    } else {
      showAlert(
        'warning',
        'Formulario incompleto',
        'Por favor completa todos los campos requeridos'
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onCancel}>
          <FontAwesome name="arrow-left" size={20} color={styles.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Registrar Gimnasio</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Información Básica */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Básica</Text>

          <FormInput
            label="Nombre del Gimnasio *"
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            error={errors.name}
          />

          <FormInput
            label="NIT *"
            value={formData.nit}
            onChangeText={(value) => handleInputChange('nit', value)}
            error={errors.nit}
          />

          <FormInput
            label="Email *"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />

          <FormInput
            label="Teléfono de Contacto *"
            value={formData.phone}
            onChangeText={(value) => handleInputChange('phone', value)}
            keyboardType="phone-pad"
            error={errors.phone}
          />

          <FormInput
            label="País *"
            value={formData.country}
            onChangeText={(value) => handleInputChange('country', value)}
            error={errors.country}
          />

          <FormInput
            label="Slogan"
            value={formData.slogan}
            onChangeText={(value) => handleInputChange('slogan', value)}
            multiline
            numberOfLines={2}
          />
        </View>

        {/* Información Digital */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Presencia Digital</Text>

          <FormInput
            label="Sitio Web"
            value={formData.website}
            onChangeText={(value) => handleInputChange('website', value)}
            keyboardType="url"
            autoCapitalize="none"
          />

          <FormInput
            label="Instagram"
            value={formData.instagram}
            onChangeText={(value) => handleInputChange('instagram', value)}
            autoCapitalize="none"
          />

          <FormInput
            label="Facebook"
            value={formData.facebook}
            onChangeText={(value) => handleInputChange('facebook', value)}
            autoCapitalize="none"
          />
        </View>

        {/* Nota informativa */}
        <View style={styles.infoCard}>
          <FontAwesome
            name="info-circle"
            size={20}
            color={styles.colors.tint}
          />
          <Text style={styles.infoText}>
            Una vez registrado, nuestro equipo revisará la información y te
            contactaremos para completar el proceso de verificación.
          </Text>
        </View>

        {/* Botones */}
        <View style={styles.buttonContainer}>
          <Button
            title="Registrar Gimnasio"
            onPress={handleSubmit}
            style={styles.submitButton}
          />
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <AlertComponent />
    </KeyboardAvoidingView>
  );
}
