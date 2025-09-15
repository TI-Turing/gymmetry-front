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
import { createStyles } from './styles/create-post.styles';
import { useI18n } from '@/hooks/useI18n';

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

export default function CreatePostScreen() {
  const { t } = useI18n();
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const charactersRemaining = CREATE_POST_CONSTANTS.MAX_CHARACTERS - content.length;
  const isValidPost = content.trim().length > 0 && charactersRemaining >= 0;

  const handleCancel = () => {
    if (title.trim() || content.trim() || selectedMedia) {
      Alert.alert(
        'Descartar cambios',
        '¿Estás seguro de que quieres descartar esta publicación?',
        [
          { text: 'Continuar editando', style: 'cancel' },
          { text: 'Descartar', style: 'destructive', onPress: () => router.back() },
        ]
      );
    } else {
      router.back();
    }
  };

  const handleSelectImage = () => {
    // TODO: Implementar selección de imagen
    Alert.alert('Próximamente', 'La selección de imágenes estará disponible pronto');
  };

  const handleSelectVideo = () => {
    // TODO: Implementar selección de video
    Alert.alert('Próximamente', 'La selección de videos estará disponible pronto');
  };

  const handleRemoveMedia = () => {
    setSelectedMedia(null);
    setMediaType(null);
  };

  const handlePublish = async () => {
    if (!isValidPost) return;

    setIsLoading(true);
    try {
      // TODO: Implementar creación de post
      console.log('Crear post:', { title, content, selectedMedia, mediaType });
      
      Alert.alert(
        'Éxito',
        'Tu publicación ha sido creada exitosamente',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Error al crear post:', error);
      Alert.alert('Error', 'No se pudo crear la publicación. Inténtalo de nuevo.');
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
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Título opcional */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.titleInput}
              placeholder={CREATE_POST_CONSTANTS.PLACEHOLDER_TITLE}
              placeholderTextColor={styles.placeholderColor.color}
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
          </View>

          {/* Contenido del post */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.contentInput}
              placeholder={CREATE_POST_CONSTANTS.PLACEHOLDER_TEXT}
              placeholderTextColor={styles.placeholderColor.color}
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
              maxLength={CREATE_POST_CONSTANTS.MAX_CHARACTERS}
            />
            
            <View style={styles.characterCount}>
              <Text
                style={[
                  styles.characterCountText,
                  charactersRemaining < 0 && styles.characterCountError,
                ]}
              >
                {charactersRemaining} {CREATE_POST_CONSTANTS.CHARACTERS_REMAINING}
              </Text>
            </View>
          </View>

          {/* Media preview */}
          {selectedMedia && (
            <View style={styles.mediaPreview}>
              <View style={styles.mediaContainer}>
                <Text style={styles.mediaText}>
                  {mediaType === 'image' ? '🖼️ Imagen seleccionada' : '🎥 Video seleccionado'}
                </Text>
                <TouchableOpacity onPress={handleRemoveMedia}>
                  <MaterialIcons name="close" size={24} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Media selection buttons */}
          <View style={styles.mediaButtons}>
            <TouchableOpacity style={styles.mediaButton} onPress={handleSelectImage}>
              <FontAwesome name="image" size={20} color={styles.mediaButtonText.color} />
              <Text style={styles.mediaButtonText}>{CREATE_POST_CONSTANTS.SELECT_IMAGE}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.mediaButton} onPress={handleSelectVideo}>
              <FontAwesome name="video-camera" size={20} color={styles.mediaButtonText.color} />
              <Text style={styles.mediaButtonText}>{CREATE_POST_CONSTANTS.SELECT_VIDEO}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Action buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
            disabled={isLoading}
          >
            <Text style={styles.cancelButtonText}>{CREATE_POST_CONSTANTS.CANCEL_BUTTON}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.publishButton, !isValidPost && styles.publishButtonDisabled]}
            onPress={handlePublish}
            disabled={!isValidPost || isLoading}
          >
            <Text
              style={[
                styles.publishButtonText,
                !isValidPost && styles.publishButtonTextDisabled,
              ]}
            >
              {isLoading ? 'Publicando...' : CREATE_POST_CONSTANTS.PUBLISH_BUTTON}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}