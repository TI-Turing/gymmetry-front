import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { View, Text } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import Button from '@/components/common/Button';
import { GymStepProps, GymStep5Data } from '../types';
import { GymService } from '@/services/gymService';
import { GymStyles } from '../styles/GymStyles';
import Colors from '@/constants/Colors';
import { useCustomAlert } from '@/components/common/CustomAlert';

export default function GymStep5({
  gymId,
  onNext,
  onBack,
  initialData,
}: GymStepProps<GymStep5Data> & { gymId: string }) {
  const { showAlert, AlertComponent } = useCustomAlert();
  const [formData, setFormData] = useState<GymStep5Data>({
    Id: gymId,
    logo: initialData?.logo || null,
    coverImage: initialData?.coverImage || null,
    galleryImages: initialData?.galleryImages || [],
    videos: initialData?.videos || [],
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSelectLogo = () => {
    // Placeholder para selección de logo
    showAlert('info', 'Funcionalidad', 'Selección de logo en desarrollo');
  };

  const handleSelectCoverImage = () => {
    // Placeholder para selección de imagen de portada
    showAlert(
      'info',
      'Funcionalidad',
      'Selección de imagen de portada en desarrollo'
    );
  };

  const handleAddGalleryImage = () => {
    // Placeholder para agregar imágenes a la galería
    showAlert(
      'info',
      'Funcionalidad',
      'Agregar imágenes a la galería en desarrollo'
    );
  };

  const handleAddVideo = () => {
    // Placeholder para agregar videos
    showAlert('info', 'Funcionalidad', 'Agregar videos en desarrollo');
  };

  const handleFinish = async () => {
    setIsLoading(true);
    try {
      await GymService.updateGymStep(formData);

      onNext(formData);
    } catch (_error) {
      showAlert(
        'error',
        'Error',
        'No se pudo guardar la información multimedia'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      style={GymStyles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={GymStyles.step5Header}>
        <FontAwesome name='camera' size={40} color={Colors.dark.tint} />
        <Text style={GymStyles.step5Title}>Multimedia</Text>
        <Text style={GymStyles.step5Subtitle}>
          Agrega imágenes y videos para mostrar tu gimnasio (opcional)
        </Text>
      </View>

      <View style={GymStyles.step5Form}>
        {/* Logo */}
        <View style={GymStyles.step5Section}>
          <Text style={GymStyles.step5SectionTitle}>Logo del Gimnasio</Text>
          <TouchableOpacity
            style={GymStyles.uploadBox}
            onPress={handleSelectLogo}
          >
            {formData.logo ? (
              <View style={GymStyles.uploadedItem}>
                <FontAwesome
                  name='check-circle'
                  size={24}
                  color={Colors.dark.tint}
                />
                <Text style={GymStyles.uploadedText}>Logo seleccionado</Text>
              </View>
            ) : (
              <View style={GymStyles.uploadPlaceholder}>
                <FontAwesome name='plus' size={24} color={Colors.dark.tint} />
                <Text style={GymStyles.uploadText}>Seleccionar Logo</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Imagen de Portada */}
        <View style={GymStyles.step5Section}>
          <Text style={GymStyles.step5SectionTitle}>Imagen de Portada</Text>
          <TouchableOpacity
            style={GymStyles.uploadBox}
            onPress={handleSelectCoverImage}
          >
            {formData.coverImage ? (
              <View style={GymStyles.uploadedItem}>
                <FontAwesome
                  name='check-circle'
                  size={24}
                  color={Colors.dark.tint}
                />
                <Text style={GymStyles.uploadedText}>
                  Imagen de portada seleccionada
                </Text>
              </View>
            ) : (
              <View style={GymStyles.uploadPlaceholder}>
                <FontAwesome name='plus' size={24} color={Colors.dark.tint} />
                <Text style={GymStyles.uploadText}>
                  Seleccionar Imagen de Portada
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Galería de Imágenes */}
        <View style={GymStyles.step5Section}>
          <Text style={GymStyles.step5SectionTitle}>Galería de Imágenes</Text>
          <TouchableOpacity
            style={GymStyles.uploadBox}
            onPress={handleAddGalleryImage}
          >
            <View style={GymStyles.uploadPlaceholder}>
              <FontAwesome
                name='picture-o'
                size={24}
                color={Colors.dark.tint}
              />
              <Text style={GymStyles.uploadText}>
                Agregar Imágenes ({formData.galleryImages.length})
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Videos */}
        <View style={GymStyles.step5Section}>
          <Text style={GymStyles.step5SectionTitle}>Videos</Text>
          <TouchableOpacity
            style={GymStyles.uploadBox}
            onPress={handleAddVideo}
          >
            <View style={GymStyles.uploadPlaceholder}>
              <FontAwesome
                name='video-camera'
                size={24}
                color={Colors.dark.tint}
              />
              <Text style={GymStyles.uploadText}>
                Agregar Videos ({formData.videos.length})
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={GymStyles.step5InfoContainer}>
          <FontAwesome name='info-circle' size={16} color='#B0B0B0' />
          <Text style={GymStyles.step5InfoText}>
            Todos los archivos multimedia son opcionales. Podrás agregarlos más
            tarde desde tu perfil.
          </Text>
        </View>
      </View>

      <View style={GymStyles.step5ButtonContainer}>
        <Button
          title='Finalizar Registro'
          onPress={handleFinish}
          loading={isLoading}
          style={GymStyles.finishButton}
        />
      </View>
      <AlertComponent />
    </ScrollView>
  );
}
