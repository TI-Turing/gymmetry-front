import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import ScreenWrapper from '@/components/layout/ScreenWrapper';
import { useColorScheme } from '@/components/useColorScheme';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import stylesFn from './createPostStyles';

const CREATE_POST_CONSTANTS = {
  TITLE: 'Crear Publicación',
  PLACEHOLDER_TEXT: '¿Qué está pasando?',
  PLACEHOLDER_TITLE: 'Título (opcional)',
  PUBLISH_BUTTON: 'Publicar',
  CANCEL_BUTTON: 'Cancelar',
  MAX_CHARACTERS: 500,
  CHARACTERS_REMAINING: 'caracteres restantes',
  SELECT_IMAGE: 'Seleccionar imagen',
  SELECT_VIDEO: 'Seleccionar video',
  REMOVE_MEDIA: 'Quitar media',
} as const;

interface CreatePostScreenProps {
  onClose?: () => void;
}

export default function CreatePostScreen({ onClose }: CreatePostScreenProps) {
  const themed = useThemedStyles(stylesFn);
  const colorScheme = useColorScheme();
  const placeholderColor = colorScheme === 'dark' ? '#AAAAAA' : '#666666';

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const charactersRemaining =
    CREATE_POST_CONSTANTS.MAX_CHARACTERS - content.length;
  const isValidPost = content.trim().length > 0 && charactersRemaining >= 0;

  const handleCancel = () => {
    const closeAction = onClose || (() => router.back());

    if (title.trim() || content.trim() || selectedMedia) {
      Alert.alert(
        'Descartar cambios',
        '¿Estás seguro de que quieres descartar esta publicación?',
        [
          { text: 'Continuar editando', style: 'cancel' },
          { text: 'Descartar', style: 'destructive', onPress: closeAction },
        ]
      );
    } else {
      closeAction();
    }
  };

  const handleSelectImage = () => {
    // TODO: Implementar selección de imagen
    Alert.alert(
      'Próximamente',
      'La selección de imágenes estará disponible pronto'
    );
  };

  const handleSelectVideo = () => {
    // TODO: Implementar selección de video
    Alert.alert(
      'Próximamente',
      'La selección de videos estará disponible pronto'
    );
  };

  const handleRemoveMedia = () => {
    setSelectedMedia(null);
    setMediaType(null);
  };

  const handlePublish = async () => {
    if (!isValidPost) return;

    setIsLoading(true);
    try {
      // TODO: Implementar creación de post usando postService
      // Post creation logic will be implemented here

      const closeAction = onClose || (() => router.back());
      // Cerrar inmediatamente sin mostrar alert de éxito
      closeAction();
    } catch (error) {
      Alert.alert(
        'Error',
        'No se pudo crear la publicación. Inténtalo de nuevo.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper
      headerTitle={CREATE_POST_CONSTANTS.TITLE}
      showBackButton={true}
      onPressBack={handleCancel}
    >
      <KeyboardAvoidingView
        style={themed.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={themed.content} showsVerticalScrollIndicator={false}>
          {/* Título opcional */}
          <View style={themed.inputContainer}>
            <TextInput
              style={themed.titleInput}
              placeholder={CREATE_POST_CONSTANTS.PLACEHOLDER_TITLE}
              placeholderTextColor={placeholderColor}
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
          </View>

          {/* Contenido del post */}
          <View style={themed.inputContainer}>
            <TextInput
              style={themed.contentInput}
              placeholder={CREATE_POST_CONSTANTS.PLACEHOLDER_TEXT}
              placeholderTextColor={placeholderColor}
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
              maxLength={CREATE_POST_CONSTANTS.MAX_CHARACTERS}
            />

            <View style={themed.characterCount}>
              <Text
                style={[
                  themed.characterCountText,
                  charactersRemaining < 0 && themed.characterCountError,
                ]}
              >
                {charactersRemaining}{' '}
                {CREATE_POST_CONSTANTS.CHARACTERS_REMAINING}
              </Text>
            </View>
          </View>

          {/* Media preview */}
          {selectedMedia && (
            <View style={themed.mediaPreview}>
              <View style={themed.mediaContainer}>
                <Text style={themed.mediaText}>
                  {mediaType === 'image'
                    ? '🖼️ Imagen seleccionada'
                    : '🎥 Video seleccionado'}
                </Text>
                <TouchableOpacity onPress={handleRemoveMedia}>
                  <MaterialIcons name="close" size={24} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Media selection buttons */}
          <View style={themed.mediaButtons}>
            <TouchableOpacity
              style={themed.mediaButton}
              onPress={handleSelectImage}
            >
              <FontAwesome
                name="image"
                size={20}
                color={colorScheme === 'dark' ? '#FFFFFF' : '#000000'}
              />
              <Text style={themed.mediaButtonText}>
                {CREATE_POST_CONSTANTS.SELECT_IMAGE}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={themed.mediaButton}
              onPress={handleSelectVideo}
            >
              <FontAwesome
                name="video-camera"
                size={20}
                color={colorScheme === 'dark' ? '#FFFFFF' : '#000000'}
              />
              <Text style={themed.mediaButtonText}>
                {CREATE_POST_CONSTANTS.SELECT_VIDEO}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Action buttons */}
        <View style={themed.actionButtons}>
          <TouchableOpacity
            style={themed.cancelButton}
            onPress={handleCancel}
            disabled={isLoading}
          >
            <Text style={themed.cancelButtonText}>
              {CREATE_POST_CONSTANTS.CANCEL_BUTTON}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              themed.publishButton,
              !isValidPost && themed.publishButtonDisabled,
            ]}
            onPress={handlePublish}
            disabled={!isValidPost || isLoading}
          >
            <Text
              style={[
                themed.publishButtonText,
                !isValidPost && themed.publishButtonTextDisabled,
              ]}
            >
              {isLoading
                ? 'Publicando...'
                : CREATE_POST_CONSTANTS.PUBLISH_BUTTON}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
