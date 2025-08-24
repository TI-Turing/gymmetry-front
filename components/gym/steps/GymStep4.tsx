import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { View, Text } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import FormInput from '@/components/common/FormInput';
import Button from '@/components/common/Button';
import { GymStepProps, GymStep4Data } from '../types';
import { GymService } from '@/services/gymService';
import { useCustomAlert } from '@/components/common/CustomAlert';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeGymStepsStyles } from '../styles/gymSteps';

export default function GymStep4({
  gymId,
  onNext,
  onBack,
  initialData,
}: GymStepProps<GymStep4Data> & { gymId: string }) {
  const { showAlert, AlertComponent } = useCustomAlert();
  const { styles, colors } = useThemedStyles(makeGymStepsStyles);
  const [formData, setFormData] = useState<GymStep4Data>({
    Id: gymId,
    website: initialData?.website || '',
    instagram: initialData?.instagram || '',
    facebook: initialData?.facebook || '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof GymStep4Data, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateUrl = (url: string): boolean => {
    if (!url.trim()) {
      return true;
    } // URLs son opcionales

    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateForm = (): boolean => {
    if (formData.website && !validateUrl(formData.website)) {
      showAlert('error', 'Error', 'La URL del sitio web no es válida');
      return false;
    }
    if (formData.instagram && !validateUrl(formData.instagram)) {
      showAlert('error', 'Error', 'La URL de Instagram no es válida');
      return false;
    }
    if (formData.facebook && !validateUrl(formData.facebook)) {
      showAlert('error', 'Error', 'La URL de Facebook no es válida');
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await GymService.updateGymStep(formData);

      onNext(formData);
    } catch {
      showAlert(
        'error',
        'Error',
        'No se pudo guardar la información de presencia digital'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <FontAwesome name="globe" size={40} color={colors.tint} />
        <Text style={styles.title}>Presencia Digital</Text>
        <Text style={styles.subtitle}>
          Agrega los enlaces a tus redes sociales y sitio web (opcional)
        </Text>
      </View>

      <View style={styles.form}>
        <FormInput
          label="Sitio Web"
          value={formData.website}
          onChangeText={(value) => handleInputChange('website', value)}
          keyboardType="url"
          autoCapitalize="none"
          icon={<FontAwesome name="globe" size={20} color={colors.tint} />}
        />

        <FormInput
          label="Instagram"
          value={formData.instagram}
          onChangeText={(value) => handleInputChange('instagram', value)}
          keyboardType="url"
          autoCapitalize="none"
          icon={<FontAwesome name="instagram" size={20} color={colors.tint} />}
        />

        <FormInput
          label="Facebook"
          value={formData.facebook}
          onChangeText={(value) => handleInputChange('facebook', value)}
          keyboardType="url"
          autoCapitalize="none"
          icon={<FontAwesome name="facebook" size={20} color={colors.tint} />}
        />

        <View style={styles.infoContainer}>
          <FontAwesome name="info-circle" size={16} color={colors.tint} />
          <Text style={styles.infoText}>
            Todos los campos son opcionales. Puedes agregarlos más tarde.
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Continuar"
          onPress={handleNext}
          loading={isLoading}
          style={styles.nextButton}
        />
      </View>
      <AlertComponent />
    </ScrollView>
  );
}
