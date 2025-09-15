import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import ScreenWrapper from '@/components/layout/ScreenWrapper';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';

interface CreatePostScreenProps {
  onClose?: () => void;
}

const CREATE_POST_CONSTANTS = {
  TITLE: 'Crear Publicación',
  PLACEHOLDER: '¿Qué estás pensando?',
  CANCEL_BUTTON: 'Cancelar',
  PUBLISH_BUTTON: 'Publicar',
  MAX_CHARACTERS: 500,
};

export default function CreatePostScreen({ onClose }: CreatePostScreenProps) {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const colorScheme = useColorScheme();

  const isValidPost = content.trim().length > 0 && content.length <= CREATE_POST_CONSTANTS.MAX_CHARACTERS;

  const handleCancel = () => {
    const closeAction = onClose || (() => router.back());
    closeAction();
  };

  const handlePublish = async () => {
    if (!isValidPost) return;

    setIsLoading(true);
    try {
      // Simular creación de post
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const closeAction = onClose || (() => router.back());
      Alert.alert('Éxito', 'Tu publicación ha sido creada exitosamente', [
        { text: 'OK', onPress: closeAction },
      ]);
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
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ 
            fontSize: 24, 
            fontWeight: 'bold',
            color: colorScheme === 'dark' ? '#FFFFFF' : '#000000'
          }}>
            {CREATE_POST_CONSTANTS.TITLE}
          </Text>
        </View>

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
            placeholderTextColor={colorScheme === 'dark' ? '#888888' : '#666666'}
            multiline
            value={content}
            onChangeText={setContent}
            maxLength={CREATE_POST_CONSTANTS.MAX_CHARACTERS}
          />
        </View>

        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between',
          marginTop: 20 
        }}>
          <TouchableOpacity 
            style={{
              backgroundColor: colorScheme === 'dark' ? '#333333' : '#F0F0F0',
              padding: 12,
              borderRadius: 8,
              flex: 1,
              marginRight: 10,
            }}
            onPress={handleCancel}
          >
            <Text style={{ 
              textAlign: 'center',
              color: colorScheme === 'dark' ? '#FFFFFF' : '#000000'
            }}>
              {CREATE_POST_CONSTANTS.CANCEL_BUTTON}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: isValidPost ? '#007AFF' : '#CCCCCC',
              padding: 12,
              borderRadius: 8,
              flex: 1,
              marginLeft: 10,
            }}
            onPress={handlePublish}
            disabled={!isValidPost || isLoading}
          >
            <Text style={{ 
              textAlign: 'center',
              color: '#FFFFFF'
            }}>
              {isLoading ? 'Publicando...' : CREATE_POST_CONSTANTS.PUBLISH_BUTTON}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}