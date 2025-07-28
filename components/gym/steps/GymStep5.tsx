import React, { useState } from 'react';
import { StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { View, Text } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import Button from '@/components/common/Button';
import { GymStepProps, GymStep5Data } from '../types';
import { GymService } from '../GymService';

export default function GymStep5({
  gymId,
  onNext,
  onBack,
  initialData,
}: GymStepProps<GymStep5Data> & { gymId: string }) {
  const [formData, setFormData] = useState<GymStep5Data>({
    logo: initialData?.logo || null,
    coverImage: initialData?.coverImage || null,
    galleryImages: initialData?.galleryImages || [],
    videos: initialData?.videos || [],
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSelectLogo = () => {
    // Placeholder para selección de logo
    Alert.alert('Funcionalidad', 'Selección de logo en desarrollo');
  };

  const handleSelectCoverImage = () => {
    // Placeholder para selección de imagen de portada
    Alert.alert(
      'Funcionalidad',
      'Selección de imagen de portada en desarrollo'
    );
  };

  const handleAddGalleryImage = () => {
    // Placeholder para agregar imágenes a la galería
    Alert.alert('Funcionalidad', 'Agregar imágenes a la galería en desarrollo');
  };

  const handleAddVideo = () => {
    // Placeholder para agregar videos
    Alert.alert('Funcionalidad', 'Agregar videos en desarrollo');
  };

  const handleFinish = async () => {
    setIsLoading(true);
    try {
      await GymService.updateGymStep(gymId, {
        logo: formData.logo,
        coverImage: formData.coverImage,
        galleryImages: formData.galleryImages,
        videos: formData.videos,
      });

      onNext(formData);
    } catch (error) {
      console.error('Error updating gym step 5:', error);
      Alert.alert('Error', 'No se pudo guardar la información multimedia');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <FontAwesome name='camera' size={40} color='#9C27B0' />
        <Text style={styles.title}>Multimedia</Text>
        <Text style={styles.subtitle}>
          Agrega imágenes y videos para mostrar tu gimnasio (opcional)
        </Text>
      </View>

      <View style={styles.form}>
        {/* Logo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Logo del Gimnasio</Text>
          <TouchableOpacity style={styles.uploadBox} onPress={handleSelectLogo}>
            {formData.logo ? (
              <View style={styles.uploadedItem}>
                <FontAwesome name='check-circle' size={24} color='#4CAF50' />
                <Text style={styles.uploadedText}>Logo seleccionado</Text>
              </View>
            ) : (
              <View style={styles.uploadPlaceholder}>
                <FontAwesome name='plus' size={24} color='#9C27B0' />
                <Text style={styles.uploadText}>Seleccionar Logo</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Imagen de Portada */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Imagen de Portada</Text>
          <TouchableOpacity
            style={styles.uploadBox}
            onPress={handleSelectCoverImage}
          >
            {formData.coverImage ? (
              <View style={styles.uploadedItem}>
                <FontAwesome name='check-circle' size={24} color='#4CAF50' />
                <Text style={styles.uploadedText}>
                  Imagen de portada seleccionada
                </Text>
              </View>
            ) : (
              <View style={styles.uploadPlaceholder}>
                <FontAwesome name='plus' size={24} color='#9C27B0' />
                <Text style={styles.uploadText}>
                  Seleccionar Imagen de Portada
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Galería de Imágenes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Galería de Imágenes</Text>
          <TouchableOpacity
            style={styles.uploadBox}
            onPress={handleAddGalleryImage}
          >
            <View style={styles.uploadPlaceholder}>
              <FontAwesome name='picture-o' size={24} color='#9C27B0' />
              <Text style={styles.uploadText}>
                Agregar Imágenes ({formData.galleryImages.length})
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Videos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Videos</Text>
          <TouchableOpacity style={styles.uploadBox} onPress={handleAddVideo}>
            <View style={styles.uploadPlaceholder}>
              <FontAwesome name='video-camera' size={24} color='#9C27B0' />
              <Text style={styles.uploadText}>
                Agregar Videos ({formData.videos.length})
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <FontAwesome name='info-circle' size={16} color='#B0B0B0' />
          <Text style={styles.infoText}>
            Todos los archivos multimedia son opcionales. Podrás agregarlos más
            tarde desde tu perfil.
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title='Anterior'
          onPress={onBack}
          variant='outline'
          style={styles.backButton}
        />
        <Button
          title='Finalizar Registro'
          onPress={handleFinish}
          loading={isLoading}
          style={styles.finishButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#B0B0B0',
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  uploadBox: {
    borderWidth: 2,
    borderColor: '#333333',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
  },
  uploadPlaceholder: {
    alignItems: 'center',
  },
  uploadedItem: {
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 14,
    color: '#9C27B0',
    marginTop: 8,
    textAlign: 'center',
  },
  uploadedText: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 8,
    textAlign: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    padding: 15,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#9C27B0',
  },
  infoText: {
    fontSize: 14,
    color: '#B0B0B0',
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 30,
    gap: 15,
  },
  backButton: {
    flex: 1,
  },
  finishButton: {
    flex: 2,
    backgroundColor: '#4CAF50',
  },
});
