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
import { useI18n } from '@/i18n';

export default function GymStep1({
  onNext,
  onBack: _onBack,
  initialData,
  isLoading = false,
}: GymStepProps<GymStep1Data>) {
  const { showError, AlertComponent } = useCustomAlert();
  const { styles, colors } = useThemedStyles(makeGymStepsStyles);
  const { t } = useI18n();

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
      newErrors.name = t('gym_name_required');
    }
    if (!formData.email.trim()) {
      newErrors.email = t('email_required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('email_invalid');
    }
    if (!formData.phone.trim()) {
      newErrors.phone = t('phone_required');
    }
    if (!formData.nit.trim()) {
      newErrors.nit = t('nit_required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateForm()) {
      showError(t('complete_required_fields'));
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
        showError(response.Message || t('registration_error'));
      }
    } catch {
      showError(t('connection_error_retry'));
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
            <Text style={styles.headerTitle}>{t('gym_step1_title')}</Text>
            <Text style={styles.headerSubtitle}>{t('gym_step1_subtitle')}</Text>
          </View>

          {/* Formulario */}
          <View style={styles.form}>
            <FormInput
              label={t('gym_name_label')}
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              error={errors.name}
            />

            <FormInput
              label={t('corporate_email_label')}
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <FormInput
              label={t('main_phone_label')}
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              keyboardType="phone-pad"
              error={errors.phone}
            />

            <FormInput
              label={t('nit_label')}
              value={formData.nit}
              onChangeText={(value) => handleInputChange('nit', value)}
              error={errors.nit}
            />
          </View>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <FontAwesome name="info-circle" size={20} color={colors.tint} />
            <Text style={styles.infoText}>{t('gym_step1_info')}</Text>
          </View>
        </ScrollView>

        {/* Botones */}
        <View style={styles.buttonContainer}>
          <Button
            title={loading ? t('loading_registering_gym') : t('save_continue')}
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
