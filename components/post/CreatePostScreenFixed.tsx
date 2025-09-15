import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { ScreenWrapper } from '@/components/common/ScreenWrapper';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { createPostScreenStyles } from './styles/CreatePostScreenStyles';

interface CreatePostScreenProps {
  onClose?: () => void;
}

const CREATE_POST_CONSTANTS = {
  TITLE: 'Crear Publicación',
  PLACEHOLDER: '¿Qué estás pensando?',
  CHARACTERS_REMAINING: 'caracteres restantes',
  SELECT_IMAGE: 'Seleccionar Imagen',
  SELECT_VIDEO: 'Seleccionar Video',
  CANCEL_BUTTON: 'Cancelar',
  PUBLISH_BUTTON: 'Publicar',
  MAX_CHARACTERS: 500,
};

export const CreatePostScreen: React.FC<CreatePostScreenProps> = ({
  onClose,
}) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mediaSelected, setMediaSelected] = useState(false);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themed = useThemedStyles(createPostScreenStyles);

  const charactersRemaining = CREATE_POST_CONSTANTS.MAX_CHARACTERS - content.length;
  const isValidPost = content.trim().length > 0 && content.length <= CREATE_POST_CONSTANTS.MAX_CHARACTERS;

  const handleSelectImage = () => {
    setMediaSelected(true);
    setMediaType('image');
  };

  const handleSelectVideo = () => {
    setMediaSelected(true);
    setMediaType('video');
  };

  const handleCancel = () => {
    const closeAction = onClose || (() => router.back());
    closeAction();
  };

  const handlePublish = async () => {
    if (!isValidPost) return;

    setIsLoading(true);
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const closeAction = onClose || (() => router.back());
      Alert.alert(
        'Éxito',
        'Tu publicación ha sido creada exitosamente',
        [{ text: 'OK', onPress: closeAction }]
      );
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
    <ScreenWrapper>
      <ScrollView style={themed.container}>
        <View style={themed.header}>
          <Text style={themed.title}>{CREATE_POST_CONSTANTS.TITLE}</Text>
        </View>

        <View style={themed.contentContainer}>
          <TextInput
            style={themed.textInput}
            placeholder={CREATE_POST_CONSTANTS.PLACEHOLDER}
            placeholderTextColor={
              colorScheme === 'dark' ? '#888888' : '#666666'
            }
            multiline
            value={content}
            onChangeText={setContent}
            maxLength={CREATE_POST_CONSTANTS.MAX_CHARACTERS}
          />

          <View style={themed.characterCount}>
            <Text
              style={[
                themed.characterCountText,
                charactersRemaining < 50 && themed.characterCountWarning,
              ]}
            >
              {charactersRemaining}{' '}
              {CREATE_POST_CONSTANTS.CHARACTERS_REMAINING}
            </Text>
          </View>

          {mediaSelected && (
            <View style={themed.mediaPreview}>
              <Text style={themed.mediaPreviewText}>
                {mediaType === 'image'
                  ? '🖼️ Imagen seleccionada'
                  : '🎥 Video seleccionado'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setMediaSelected(false);
                  setMediaType(null);
                }}
              >
                <FontAwesome
                  name="times"
                  size={20}
                  color={colorScheme === 'dark' ? '#FFFFFF' : '#000000'}
                />
              </TouchableOpacity>
            </View>
          )}

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
        </View>

        <View style={themed.footer}>
          <TouchableOpacity style={themed.cancelButton} onPress={handleCancel}>
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
      </ScrollView>
    </ScreenWrapper>
  );
};