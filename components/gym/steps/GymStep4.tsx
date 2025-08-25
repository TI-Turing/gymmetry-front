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
import { useI18n } from '@/i18n';

export default function GymStep4({
  gymId,
  onNext,
  onBack: _onBack,
  initialData,
}: GymStepProps<GymStep4Data> & { gymId: string }) {
  const { showAlert, AlertComponent } = useCustomAlert();
  const { styles, colors } = useThemedStyles(makeGymStepsStyles);
  const { t } = useI18n();
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
      showAlert('error', t('error'), t('invalid_website_url'));
      return false;
    }
    if (formData.instagram && !validateUrl(formData.instagram)) {
      showAlert('error', t('error'), t('invalid_instagram_url'));
      return false;
    }
    if (formData.facebook && !validateUrl(formData.facebook)) {
      showAlert('error', t('error'), t('invalid_facebook_url'));
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
      showAlert('error', t('error'), t('error_saving_digital_presence'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <FontAwesome name="globe" size={40} color={colors.tint} />
        <Text style={styles.title}>{t('gym_step4_title')}</Text>
        <Text style={styles.subtitle}>{t('gym_step4_subtitle')}</Text>
      </View>

      <View style={styles.form}>
        <FormInput
          label={t('website_label')}
          value={formData.website}
          onChangeText={(value) => handleInputChange('website', value)}
          keyboardType="url"
          autoCapitalize="none"
          icon={<FontAwesome name="globe" size={20} color={colors.tint} />}
        />

        <FormInput
          label={t('instagram_label')}
          value={formData.instagram}
          onChangeText={(value) => handleInputChange('instagram', value)}
          keyboardType="url"
          autoCapitalize="none"
          icon={<FontAwesome name="instagram" size={20} color={colors.tint} />}
        />

        <FormInput
          label={t('facebook_label')}
          value={formData.facebook}
          onChangeText={(value) => handleInputChange('facebook', value)}
          keyboardType="url"
          autoCapitalize="none"
          icon={<FontAwesome name="facebook" size={20} color={colors.tint} />}
        />

        <View style={styles.infoContainer}>
          <FontAwesome name="info-circle" size={16} color={colors.tint} />
          <Text style={styles.infoText}>{t('digital_presence_info')}</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title={t('continue')}
          onPress={handleNext}
          loading={isLoading}
          style={styles.nextButton}
        />
      </View>
      <AlertComponent />
    </ScrollView>
  );
}
