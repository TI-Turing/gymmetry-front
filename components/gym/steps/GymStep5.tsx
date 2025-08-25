import React, { useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { View, Text } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import Button from '@/components/common/Button';
import { GymStepProps, GymStep5Data } from '../types';
import { GymService } from '@/services/gymService';
import { useCustomAlert } from '@/components/common/CustomAlert';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeGymStepsStyles } from '../styles/gymSteps';
import { useI18n } from '@/i18n';

export default function GymStep5({
  gymId,
  onNext,
  onBack: _onBack,
  initialData,
}: GymStepProps<GymStep5Data> & { gymId: string }) {
  const { showAlert, AlertComponent } = useCustomAlert();
  const { styles, colors } = useThemedStyles(makeGymStepsStyles);
  const { t } = useI18n();
  const [formData] = useState<GymStep5Data>({
    Id: gymId,
    logo: initialData?.logo || null,
    coverImage: initialData?.coverImage || null,
    galleryImages: initialData?.galleryImages || [],
    videos: initialData?.videos || [],
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSelectLogo = () => {
    // Placeholder para selección de logo
    showAlert('info', t('functionality'), t('logo_selection_development'));
  };

  const handleSelectCoverImage = () => {
    // Placeholder para selección de imagen de portada
    showAlert(
      'info',
      t('functionality'),
      t('cover_image_selection_development')
    );
  };

  const handleAddGalleryImage = () => {
    // Placeholder para agregar imágenes a la galería
    showAlert('info', t('functionality'), t('gallery_images_development'));
  };

  const handleAddVideo = () => {
    // Placeholder para agregar videos
    showAlert('info', t('functionality'), t('videos_development'));
  };

  const handleFinish = async () => {
    setIsLoading(true);
    try {
      await GymService.updateGymStep(formData);

      onNext(formData);
    } catch (_error) {
      showAlert('error', t('error'), t('error_saving_multimedia'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.step5Header}>
        <FontAwesome name="camera" size={40} color={colors.tint} />
        <Text style={styles.step5Title}>{t('gym_step5_title')}</Text>
        <Text style={styles.step5Subtitle}>{t('gym_step5_subtitle')}</Text>
      </View>

      <View style={styles.step5Form}>
        {/* Logo */}
        <View style={styles.step5Section}>
          <Text style={styles.step5SectionTitle}>{t('gym_logo_section')}</Text>
          <TouchableOpacity style={styles.uploadBox} onPress={handleSelectLogo}>
            {formData.logo ? (
              <View style={styles.uploadedItem}>
                <FontAwesome
                  name="check-circle"
                  size={24}
                  color={colors.tint}
                />
                <Text style={styles.uploadedText}>{t('logo_selected')}</Text>
              </View>
            ) : (
              <View style={styles.uploadPlaceholder}>
                <FontAwesome name="plus" size={24} color={colors.tint} />
                <Text style={styles.uploadText}>{t('select_logo')}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Imagen de Portada */}
        <View style={styles.step5Section}>
          <Text style={styles.step5SectionTitle}>
            {t('cover_image_section')}
          </Text>
          <TouchableOpacity
            style={styles.uploadBox}
            onPress={handleSelectCoverImage}
          >
            {formData.coverImage ? (
              <View style={styles.uploadedItem}>
                <FontAwesome
                  name="check-circle"
                  size={24}
                  color={colors.tint}
                />
                <Text style={styles.uploadedText}>
                  {t('cover_image_selected')}
                </Text>
              </View>
            ) : (
              <View style={styles.uploadPlaceholder}>
                <FontAwesome name="plus" size={24} color={colors.tint} />
                <Text style={styles.uploadText}>{t('select_cover_image')}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Galería de Imágenes */}
        <View style={styles.step5Section}>
          <Text style={styles.step5SectionTitle}>
            {t('gallery_images_section')}
          </Text>
          <TouchableOpacity
            style={styles.uploadBox}
            onPress={handleAddGalleryImage}
          >
            <View style={styles.uploadPlaceholder}>
              <FontAwesome name="picture-o" size={24} color={colors.tint} />
              <Text style={styles.uploadText}>
                {t('add_gallery_images')} ({formData.galleryImages.length})
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Videos */}
        <View style={styles.step5Section}>
          <Text style={styles.step5SectionTitle}>{t('videos_section')}</Text>
          <TouchableOpacity style={styles.uploadBox} onPress={handleAddVideo}>
            <View style={styles.uploadPlaceholder}>
              <FontAwesome name="video-camera" size={24} color={colors.tint} />
              <Text style={styles.uploadText}>
                {t('add_videos')} ({formData.videos.length})
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.step5InfoContainer}>
          <FontAwesome name="info-circle" size={16} color={colors.muted} />
          <Text style={styles.step5InfoText}>{t('multimedia_info')}</Text>
        </View>
      </View>

      <View style={styles.step5ButtonContainer}>
        <Button
          title={t('finish_registration')}
          onPress={handleFinish}
          loading={isLoading}
          style={styles.finishButton}
        />
      </View>
      <AlertComponent />
    </ScrollView>
  );
}
