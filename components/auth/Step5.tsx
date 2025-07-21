import React, { useState } from 'react';
import { TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { Text, View } from '../Themed';
import { useColorScheme } from '../useColorScheme';
import Colors from '@/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { userAPI } from '@/services/apiExamples';

// Imports locales
import { Step5Data } from './types';
import { handleApiError } from './utils/api';
import { commonStyles } from './styles/common';

interface Step5Props {
  userId: string;
  onNext: (data: Step5Data) => void;
  initialData?: Step5Data;
}

export default function Step5({ userId, onNext, initialData }: Step5Props) {
  const [username, setUsername] = useState(initialData?.username || '');
  const [profileImage, setProfileImage] = useState<string | null>(initialData?.profileImage || null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const colorScheme = useColorScheme();

  // Función para redimensionar imagen a 2MP
  const resizeImageTo2MP = async (uri: string): Promise<string> => {
    // 2MP = 2,000,000 pixels
    // Para mantener proporción, usamos ~1414x1414 como referencia (1414*1414 ≈ 2MP)
    const maxDimension = 1414;
    
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [
        {
          resize: {
            width: maxDimension,
            height: maxDimension,
          },
        },
      ],
      {
        compress: 0.8, // Calidad del 80%
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );
    
    return result.uri;
  };

  const pickImage = async () => {
    try {
      // Solicitar permisos
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisos necesarios', 'Necesitamos permisos para acceder a tus fotos');
        return;
      }

      setIsUploadingImage(true);

      // Abrir galería
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Imagen cuadrada
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const selectedImage = result.assets[0];
        
        // Redimensionar imagen a 2MP
        const resizedUri = await resizeImageTo2MP(selectedImage.uri);
        setProfileImage(resizedUri);
        
        console.log('✅ [STEP 5] Imagen seleccionada y redimensionada');
      }
    } catch (error) {
      console.error('❌ [STEP 5] Error al seleccionar imagen:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const takePhoto = async () => {
    try {
      // Solicitar permisos
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisos necesarios', 'Necesitamos permisos para usar la cámara');
        return;
      }

      setIsUploadingImage(true);

      // Abrir cámara
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1], // Imagen cuadrada
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const takenPhoto = result.assets[0];
        
        // Redimensionar imagen a 2MP
        const resizedUri = await resizeImageTo2MP(takenPhoto.uri);
        setProfileImage(resizedUri);
        
        console.log('✅ [STEP 5] Foto tomada y redimensionada');
      }
    } catch (error) {
      console.error('❌ [STEP 5] Error al tomar foto:', error);
      Alert.alert('Error', 'No se pudo tomar la foto');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Seleccionar foto de perfil',
      'Elige una opción',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Tomar foto', onPress: takePhoto },
        { text: 'Elegir de galería', onPress: pickImage },
      ]
    );
  };

  const handleNext = async () => {
    setIsLoading(true);

    const stepData: Step5Data = {
      username: username.trim() || undefined,
      profileImage: profileImage || undefined,
    };
    
    try {
      // Por ahora solo pasamos los datos sin hacer llamada a la API
      // ya que los tipos del API no incluyen estos campos
      console.log('✅ [STEP 5] Datos del paso 5:', stepData);
      onNext(stepData);
    } catch (error: any) {
      const errorMessage = handleApiError(error);
      console.error('❌ [STEP 5] Error:', errorMessage);
      // Continuar aunque falle para no bloquear el flujo
      onNext(stepData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={commonStyles.container}>
      <View style={commonStyles.header}>
        <Text style={[commonStyles.title, { color: Colors[colorScheme].text }]}>
          Perfil de usuario
        </Text>
        <Text style={[commonStyles.subtitle, { color: Colors[colorScheme].text }]}>
          Personaliza tu perfil (opcional)
        </Text>
      </View>

      <View style={commonStyles.form}>
        <View style={commonStyles.inputContainer}>
          <Text style={[commonStyles.label, { color: Colors[colorScheme].text }]}>
            Nombre de usuario
          </Text>
          <TextInput
            style={[
              commonStyles.input,
              {
                backgroundColor: Colors[colorScheme].background,
                color: Colors[colorScheme].text,
                borderColor: '#666',
              },
            ]}
            value={username}
            onChangeText={setUsername}
            placeholder="usuario123"
            placeholderTextColor={`${Colors[colorScheme].text}60`}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={commonStyles.inputContainer}>
          <Text style={[commonStyles.label, { color: Colors[colorScheme].text }]}>
            Foto de perfil
          </Text>
          
          <TouchableOpacity
            style={[
              commonStyles.imagePickerContainer,
              {
                backgroundColor: Colors[colorScheme].background,
                borderColor: '#666',
              },
            ]}
            onPress={showImageOptions}
            disabled={isUploadingImage}
          >
            {profileImage ? (
              <View style={commonStyles.imagePreviewContainer}>
                <Image source={{ uri: profileImage }} style={commonStyles.imagePreview} />
                <Text style={[commonStyles.imageText, { color: Colors[colorScheme].text }]}>
                  Tocar para cambiar
                </Text>
              </View>
            ) : (
              <View style={commonStyles.imagePlaceholder}>
                <FontAwesome
                  name="camera"
                  size={40}
                  color={Colors[colorScheme].text + '60'}
                />
                <Text style={[commonStyles.imageText, { color: Colors[colorScheme].text }]}>
                  {isUploadingImage ? 'Procesando...' : 'Subir foto de perfil'}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            commonStyles.button,
            { backgroundColor: Colors[colorScheme].tint },
            (isLoading || isUploadingImage) && commonStyles.buttonDisabled,
          ]}
          onPress={handleNext}
          disabled={isLoading || isUploadingImage}
        >
          <Text style={commonStyles.buttonText}>
            {isLoading ? 'Guardando...' : 'Finalizar registro'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
