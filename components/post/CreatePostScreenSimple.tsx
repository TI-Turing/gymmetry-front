import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import ScreenWrapper from '@/components/layout/ScreenWrapper';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';
import { CustomAlert } from '@/components/common/CustomAlert';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { feedService, authService } from '@/services';
import { validateMultipleMediaFiles, MEDIA_LIMITS } from '@/utils/mediaUtils';

// Constante para el tamaño máximo de imagen (500KB)
const MAX_IMAGE_SIZE_KB = 500;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_KB * 1024;

interface CreatePostScreenProps {
  onClose?: () => void;
  onPostCreated?: () => void | Promise<void>;
}

const CREATE_POST_CONSTANTS = {
  TITLE: 'Crear Publicación',
  PLACEHOLDER: '¿Qué estás pensando?',
  CANCEL_BUTTON: 'Cancelar',
  PUBLISH_BUTTON: 'Publicar',
  MAX_CHARACTERS: 500,
};

/**
 * Comprime una imagen hasta que sea menor o igual a 500KB
 */
async function compressImageToMaxSize(
  uri: string,
  maxSizeBytes: number
): Promise<{ uri: string; width: number; height: number }> {
  let quality = 0.9; // Calidad inicial
  let compressedImage = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 1920 } }], // Redimensionar a máximo 1920px de ancho
    { compress: quality, format: ImageManipulator.SaveFormat.JPEG }
  );

  // Si la imagen sigue siendo muy grande, reducir calidad iterativamente
  let attempts = 0;
  const maxAttempts = 5;

  while (compressedImage.uri && attempts < maxAttempts && quality > 0.1) {
    // Verificar tamaño aproximado basado en dimensiones
    // (cada intento reduce calidad y dimensiones)
    const estimatedSize =
      (compressedImage.width * compressedImage.height * quality) / 4;

    if (estimatedSize <= maxSizeBytes) {
      break; // Imagen probablemente dentro del límite
    }

    // Reducir calidad para siguiente intento
    quality -= 0.15;
    compressedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: Math.floor(1920 * (quality + 0.3)) } }],
      {
        compress: Math.max(quality, 0.1),
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );
    attempts++;
  }

  return compressedImage;
}

export default function CreatePostScreen({
  onClose,
  onPostCreated,
}: CreatePostScreenProps) {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<
    ImagePicker.ImagePickerAsset[]
  >([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    type: 'success' as 'success' | 'error' | 'warning' | 'info',
    title: '',
    message: '',
  });

  const router = useRouter();
  const colorScheme = useColorScheme();

  const isValidPost =
    content.trim().length > 0 &&
    content.length <= CREATE_POST_CONSTANTS.MAX_CHARACTERS;

  const handleCancel = () => {
    const closeAction = onClose || (() => router.back());
    closeAction();
  };

  const showCustomAlert = (
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message: string
  ) => {
    setAlertConfig({ type, title, message });
    setShowAlert(true);
  };

  const handlePublish = async () => {
    if (!isValidPost) return;

    setIsLoading(true);
    try {
      // Obtener datos del usuario
      const userData = await authService.getUserData();
      if (!userData?.id) {
        showCustomAlert(
          'error',
          'Error',
          'No se pudo obtener la información del usuario'
        );
        return;
      }

      let response;

      // Si NO hay archivos multimedia, usar endpoint simple
      if (selectedMedia.length === 0) {
        const requestData = {
          UserId: userData.id,
          Title: null,
          Description: content.trim(),
          Media: null,
          MediaType: null,
          FileName: null,
          Id: '',
          FeedId: '',
          ContentType: null,
          Hashtag: null,
          IsAnonymous: false,
        };
        console.log(
          '🔍 [CreatePost] Enviando feed sin multimedia:',
          requestData
        );
        response = await feedService.createFeed(requestData);
        console.log('🔍 [CreatePost] Respuesta del backend:', response);
      } else {
        // Si HAY archivos multimedia, validar y usar endpoint con media
        const mediaForValidation = selectedMedia.map((media) => ({
          type:
            media.type === 'video' ? ('video' as const) : ('image' as const),
          mimeType: media.mimeType,
          fileSize: media.fileSize,
          fileName: media.fileName || undefined,
          uri: media.uri,
        }));

        const validation = await validateMultipleMediaFiles(mediaForValidation);
        if (!validation.isValid) {
          showCustomAlert(
            'error',
            'Archivos no válidos',
            validation.errors.join('\n')
          );
          return;
        }

        // Crear FormData
        const formData = new FormData();
        formData.append('description', content.trim());
        formData.append('userId', userData.id);
        formData.append('isAnonymous', 'false');

        // Procesar y comprimir archivos
        for (let i = 0; i < selectedMedia.length; i++) {
          const media = selectedMedia[i];

          if (media.type === 'image') {
            try {
              // Comprimir imagen a máximo 500KB
              const compressedImage = await compressImageToMaxSize(
                media.uri,
                MAX_IMAGE_SIZE_BYTES
              );

              // En React Native, FormData puede recibir directamente el objeto con uri
              const fileToUpload = {
                uri: compressedImage.uri,
                type: media.mimeType || 'image/jpeg',
                name: media.fileName || `image_${i}.jpg`,
              } as unknown as Blob;
              formData.append('files', fileToUpload);
            } catch (error) {
              showCustomAlert(
                'error',
                'Error de archivo',
                `No se pudo procesar la imagen ${media.fileName}`
              );
              return;
            }
          } else {
            // Para videos, mismo formato (sin compresión)
            try {
              const fileToUpload = {
                uri: media.uri,
                type: media.mimeType || 'video/mp4',
                name: media.fileName || `video_${i}.mp4`,
              } as unknown as Blob;
              formData.append('files', fileToUpload);
            } catch (error) {
              showCustomAlert(
                'error',
                'Error de archivo',
                `No se pudo procesar el video ${media.fileName}`
              );
              return;
            }
          }
        }

        // Enviar con multimedia
        response = await feedService.createFeedWithMedia(formData);
      }

      if (response?.Success) {
        // Llamar callback para refrescar el feed
        if (onPostCreated) {
          await onPostCreated();
        }

        const closeAction = onClose || (() => router.back());
        showCustomAlert(
          'success',
          'Éxito',
          'Tu publicación ha sido creada exitosamente'
        );
        setTimeout(closeAction, 2000);
      } else {
        showCustomAlert(
          'error',
          'Error',
          response?.Message || 'No se pudo crear la publicación'
        );
      }
    } catch (error) {
      showCustomAlert(
        'error',
        'Error',
        'No se pudo crear la publicación. Inténtalo de nuevo.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handler para abrir galería directamente
  const handleSelectMedia = async () => {
    try {
      // Solicitar permisos
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        showCustomAlert(
          'warning',
          'Permisos requeridos',
          'Se necesitan permisos para acceder a la galería'
        );
        return;
      }

      // Abrir galería directamente
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: 5,
      });

      if (!result.canceled && result.assets) {
        // Validar límites básicos antes de seleccionar
        if (result.assets.length > MEDIA_LIMITS.MAX_FILES_PER_POST) {
          showCustomAlert(
            'warning',
            'Demasiados archivos',
            `Máximo ${MEDIA_LIMITS.MAX_FILES_PER_POST} archivos por publicación`
          );
          return;
        }

        setSelectedMedia(result.assets);
      }
    } catch (error) {
      showCustomAlert(
        'error',
        'Error',
        'No se pudieron seleccionar los archivos'
      );
    }
  };

  // Componente para el botón de publicar (solo derecha)
  const PublishButton = () => (
    <TouchableOpacity
      style={{
        backgroundColor: isValidPost ? '#007AFF' : '#999999',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        minWidth: 80,
      }}
      onPress={handlePublish}
      disabled={!isValidPost || isLoading}
    >
      <Text
        style={{
          color: '#FFFFFF',
          fontSize: 16,
          fontWeight: '600',
          textAlign: 'center',
        }}
      >
        {isLoading ? 'Publicando...' : CREATE_POST_CONSTANTS.PUBLISH_BUTTON}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper
      headerTitle={CREATE_POST_CONSTANTS.TITLE}
      hideMenuButton={true}
      showBackButton={true}
      onPressBack={handleCancel}
      headerRightComponent={<PublishButton />}
    >
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <View style={{ marginBottom: 20 }}>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: colorScheme === 'dark' ? '#444444' : '#CCCCCC',
              borderRadius: 8,
              padding: 16,
              minHeight: 120,
              textAlignVertical: 'top',
              color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
              backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#FFFFFF',
            }}
            placeholder={CREATE_POST_CONSTANTS.PLACEHOLDER}
            placeholderTextColor={
              colorScheme === 'dark' ? '#888888' : '#666666'
            }
            multiline
            value={content}
            onChangeText={setContent}
            maxLength={CREATE_POST_CONSTANTS.MAX_CHARACTERS}
          />
        </View>

        {/* Botón de multimedia unificado */}
        <View
          style={{
            paddingVertical: 16,
            borderTopWidth: 1,
            borderTopColor: colorScheme === 'dark' ? '#333333' : '#EEEEEE',
            marginTop: 16,
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 24,
              paddingVertical: 14,
              backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#F8F8F8',
              borderRadius: 25,
              justifyContent: 'center',
              minWidth: 180,
            }}
            onPress={handleSelectMedia}
          >
            <Text style={{ fontSize: 20, marginRight: 8 }}>�</Text>
            <Text
              style={{
                color: colorScheme === 'dark' ? '#FFFFFF' : '#333333',
                fontSize: 16,
                fontWeight: '500',
              }}
            >
              Fotos/Videos
            </Text>
          </TouchableOpacity>
        </View>

        {/* Contador de caracteres */}
        <View style={{ alignItems: 'flex-end', marginTop: 8 }}>
          <Text
            style={{
              color: colorScheme === 'dark' ? '#888888' : '#666666',
              fontSize: 12,
            }}
          >
            {content.length}/{CREATE_POST_CONSTANTS.MAX_CHARACTERS}
          </Text>
        </View>

        {/* Preview de archivos multimedia seleccionados */}
        {selectedMedia.length > 0 && (
          <View style={{ marginTop: 16 }}>
            <Text
              style={{
                color: colorScheme === 'dark' ? '#FFFFFF' : '#333333',
                fontSize: 16,
                fontWeight: '600',
                marginBottom: 12,
              }}
            >
              Archivos seleccionados ({selectedMedia.length})
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                {selectedMedia.map((media, index) => (
                  <View key={index} style={{ position: 'relative' }}>
                    <Image
                      source={{ uri: media.uri }}
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: 8,
                        backgroundColor:
                          colorScheme === 'dark' ? '#2A2A2A' : '#F0F0F0',
                      }}
                      resizeMode="cover"
                    />
                    {/* Indicador de tipo de archivo */}
                    {media.type === 'video' && (
                      <View
                        style={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          borderRadius: 12,
                          paddingHorizontal: 6,
                          paddingVertical: 2,
                        }}
                      >
                        <Text
                          style={{
                            color: '#FFFFFF',
                            fontSize: 10,
                            fontWeight: '600',
                          }}
                        >
                          📹
                        </Text>
                      </View>
                    )}
                    {/* Botón para eliminar archivo */}
                    <TouchableOpacity
                      style={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        backgroundColor: '#FF3B30',
                        borderRadius: 12,
                        width: 24,
                        height: 24,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onPress={() => {
                        const newMedia = selectedMedia.filter(
                          (_, i) => i !== index
                        );
                        setSelectedMedia(newMedia);
                      }}
                    >
                      <Text
                        style={{
                          color: '#FFFFFF',
                          fontSize: 12,
                          fontWeight: 'bold',
                        }}
                      >
                        ×
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}
      </ScrollView>

      {/* Alert personalizado */}
      <CustomAlert
        visible={showAlert}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={() => setShowAlert(false)}
      />
    </ScreenWrapper>
  );
}
