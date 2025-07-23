import React, { useState, useEffect, useRef } from 'react';
import { TextInput, TouchableOpacity, ScrollView, Alert, Image, Keyboard } from 'react-native';
import { Text, View } from '../Themed';
import { useColorScheme } from '../useColorScheme';
import Colors from '@/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { userAPI } from '@/services/apiExamples';
import { apiService } from '@/services/apiService';
import { Environment } from '@/environment';

// Imports locales
import { Step5Data, UsernameCheckRequest, UsernameCheckResponse, UploadProfileImageResponse } from './types';
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
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'available' | 'taken' | 'invalid'>('idle');
  const [usernameError, setUsernameError] = useState<string>('');
  const colorScheme = useColorScheme();
  
  // Ref para el debounce
  const debounceRef = useRef<number>(0);
  
  // Ref para el TextInput del username
  const usernameInputRef = useRef<TextInput>(null);
  
  // Ref para prevenir que se cierre el teclado
  const preventKeyboardClose = useRef<boolean>(false);

  // Cache temporal para usernames ya validados
  const usernameCache = useRef<Map<string, { status: 'available' | 'taken', timestamp: number }>>(new Map());

  // Función para validar formato del nombre de usuario
  const validateUsernameFormat = (value: string): boolean => {
    // Solo permite letras inglesas, números y caracteres especiales básicos
    // No permite espacios
    const englishAlphabetRegex = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
    return englishAlphabetRegex.test(value) && !value.includes(' ');
  };

  // Función para verificar disponibilidad del nombre de usuario
  const checkUsernameAvailability = async (usernameToCheck: string) => {
    if (!usernameToCheck.trim()) {
      setUsernameStatus('idle');
      setUsernameError('');
      return;
    }

    // Validar mínimo de caracteres
    if (usernameToCheck.length < 4) {
      setUsernameStatus('invalid');
      setUsernameError('El nombre de usuario debe tener al menos 4 caracteres');
      return;
    }

    // Validar formato
    if (!validateUsernameFormat(usernameToCheck)) {
      setUsernameStatus('invalid');
      setUsernameError('Solo se permiten letras, números y caracteres especiales. No se permiten espacios.');
      return;
    }

    // Verificar cache primero (válido por 5 minutos)
    const cached = usernameCache.current.get(usernameToCheck);
    const cacheValidTime = 5 * 60 * 1000; // 5 minutos en millisegundos
    
    if (cached && (Date.now() - cached.timestamp) < cacheValidTime) {
      console.log('🗂️ [USERNAME CACHE] Usando resultado del cache:', usernameToCheck);
      if (cached.status === 'available') {
        setUsernameStatus('available');
        setUsernameError('');
      } else {
        setUsernameStatus('taken');
        setUsernameError('Este nombre de usuario ya está en uso');
      }
      return;
    }

    // Mantener el foco antes de hacer el request
    const wasInputFocused = usernameInputRef.current?.isFocused();

    try {
      setIsCheckingUsername(true);
      setUsernameError('');
      
      // Marcar que estamos validando para prevenir cierre del teclado
      preventKeyboardClose.current = true;

      const requestData: UsernameCheckRequest = {
        UserName: usernameToCheck
      };

      console.log('🔍 [USERNAME CHECK] Validando:', usernameToCheck);

      // Usar apiService para incluir el token automáticamente
      const response = await apiService.post<UsernameCheckResponse>('/users/find', requestData);
      
      // Restaurar el foco inmediatamente después del request
      if (wasInputFocused && usernameInputRef.current) {
        requestAnimationFrame(() => {
          if (usernameInputRef.current && !usernameInputRef.current.isFocused()) {
            usernameInputRef.current.focus();
          }
        });
      }
      
      if (response.data?.Success) {
        // Si Data está vacío, el nombre de usuario está disponible
        if (!response.data.Data || response.data.Data.length === 0) {
          setUsernameStatus('available');
          setUsernameError('');
          // Guardar en cache
          usernameCache.current.set(usernameToCheck, { status: 'available', timestamp: Date.now() });
        } else {
          // Si hay datos, el nombre de usuario ya está tomado
          setUsernameStatus('taken');
          setUsernameError('Este nombre de usuario ya está en uso');
          // Guardar en cache
          usernameCache.current.set(usernameToCheck, { status: 'taken', timestamp: Date.now() });
        }
      } else {
        setUsernameStatus('invalid');
        setUsernameError(response.data?.Message || 'Error al verificar el nombre de usuario');
      }
    } catch (error: any) {
      console.error('❌ [USERNAME CHECK] Error:', error);
      setUsernameStatus('invalid');
      setUsernameError('Error al verificar la disponibilidad del nombre de usuario');
      
      // Restaurar el foco en caso de error también
      if (wasInputFocused && usernameInputRef.current) {
        requestAnimationFrame(() => {
          if (usernameInputRef.current && !usernameInputRef.current.isFocused()) {
            usernameInputRef.current.focus();
          }
        });
      }
    } finally {
      setIsCheckingUsername(false);
      // Permitir que el teclado se pueda cerrar nuevamente
      preventKeyboardClose.current = false;
    }
  };

  // Hook para manejar el debounce del nombre de usuario
  useEffect(() => {
    // Limpiar timeout anterior
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Si el username está vacío, no hacer nada
    if (!username.trim()) {
      setUsernameStatus('idle');
      setUsernameError('');
      return;
    }

    // Validar mínimo de caracteres antes de hacer cualquier verificación
    if (username.length < 4) {
      setUsernameStatus('invalid');
      setUsernameError('El nombre de usuario debe tener al menos 4 caracteres');
      return;
    }

    // Crear nuevo timeout para el debounce (750ms)
    debounceRef.current = setTimeout(() => {
      checkUsernameAvailability(username);
    }, 750) as unknown as number;

    // Cleanup
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [username]);

  // Hook para manejar eventos del teclado
  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      // Si estamos validando, reabrir el teclado
      if (preventKeyboardClose.current && usernameInputRef.current) {
        setTimeout(() => {
          if (usernameInputRef.current && preventKeyboardClose.current) {
            usernameInputRef.current.focus();
          }
        }, 100);
      }
    });

    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  // Función para manejar cambios en el input del nombre de usuario
  const handleUsernameChange = (text: string) => {
    // Filtrar espacios y caracteres no permitidos en tiempo real
    const filteredText = text.replace(/\s/g, ''); // Quitar espacios
    
    if (validateUsernameFormat(filteredText)) {
      setUsername(filteredText);
      setUsernameStatus('idle'); // Reset status mientras escribe
      setUsernameError('');
    }
  };

  // Función para manejar cuando el input pierde el foco
  const handleUsernameBlur = () => {
    // Solo permitir que se cierre el teclado si no estamos validando
    if (preventKeyboardClose.current) {
      // Inmediatamente restaurar el foco si estamos validando
      setTimeout(() => {
        if (usernameInputRef.current && preventKeyboardClose.current) {
          usernameInputRef.current.focus();
        }
      }, 10);
    }
  };

  // Función para manejar cuando el input obtiene foco
  const handleUsernameFocus = () => {
    // Asegurar que el input esté visible cuando se enfoque
    if (usernameInputRef.current) {
      preventKeyboardClose.current = false;
    }
  };

  // Función para redimensionar imagen y validar tamaño máximo de 2MB
  const resizeImageTo2MB = async (uri: string): Promise<string> => {
    let quality = 0.9; // Calidad inicial alta
    let result;
    
    do {
      result = await ImageManipulator.manipulateAsync(
        uri,
        [
          // Redimensionar manteniendo aspecto
          {
            resize: {
              width: 1000, // Tamaño inicial
              height: 1000,
            },
          },
        ],
        {
          compress: quality,
          format: ImageManipulator.SaveFormat.PNG, // Convertir a PNG
        }
      );
      
      // Verificar tamaño del archivo
      const response = await fetch(result.uri);
      const blob = await response.blob();
      const sizeInMB = blob.size / (1024 * 1024);
      
      console.log(`📏 [IMAGE RESIZE] Tamaño actual: ${sizeInMB.toFixed(2)}MB con calidad ${quality}`);
      
      if (sizeInMB <= 2) {
        break; // La imagen ya está dentro del límite
      }
      
      // Reducir calidad para el siguiente intento
      quality -= 0.1;
      
      // Si la calidad es muy baja, reducir también las dimensiones
      if (quality < 0.3) {
        result = await ImageManipulator.manipulateAsync(
          uri,
          [
            {
              resize: {
                width: 800,
                height: 800,
              },
            },
          ],
          {
            compress: 0.3,
            format: ImageManipulator.SaveFormat.PNG,
          }
        );
        break;
      }
    } while (quality > 0.1);
    
    return result.uri;
  };

  // Función para subir imagen al servidor
  const uploadProfileImage = async (imageUri: string): Promise<string | null> => {
    try {
      setIsUploadingImage(true);

      // Crear FormData para enviar la imagen
      const formData = new FormData();
      formData.append('UserId', userId);
      
      // Preparar el archivo de imagen
      const filename = `profile_${userId}_${Date.now()}.png`;
      formData.append('ProfileImage', {
        uri: imageUri,
        type: 'image/png',
        name: filename,
      } as any);

      // Hacer el request usando apiService para incluir el token automáticamente
      const response = await apiService.post<UploadProfileImageResponse>('/user/upload-profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.Success) {
        Alert.alert('¡Éxito!', 'La imagen de perfil se subió correctamente');
        console.log('✅ [IMAGE UPLOAD] URL de la imagen:', response.data.Data);
        return response.data.Data; // Retornar la URL de la imagen
      } else {
        Alert.alert('Error', response.data.Message || 'Error al subir la imagen');
        console.error('❌ [IMAGE UPLOAD] Error:', response.data.Message);
        return null;
      }
    } catch (error: any) {
      console.error('❌ [IMAGE UPLOAD] Error:', error);
      Alert.alert('Error', 'No se pudo subir la imagen. Intenta de nuevo.');
      return null;
    } finally {
      setIsUploadingImage(false);
    }
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
        
        // Redimensionar imagen y validar tamaño
        const resizedUri = await resizeImageTo2MB(selectedImage.uri);
        
        // Subir imagen al servidor
        const uploadedImageUrl = await uploadProfileImage(resizedUri);
        
        if (uploadedImageUrl) {
          setProfileImage(uploadedImageUrl); // Usar la URL del servidor
        } else {
          setProfileImage(resizedUri); // Usar imagen local si falla el upload
        }
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
        
        // Redimensionar imagen y validar tamaño
        const resizedUri = await resizeImageTo2MB(takenPhoto.uri);
        
        // Subir imagen al servidor
        const uploadedImageUrl = await uploadProfileImage(resizedUri);
        
        if (uploadedImageUrl) {
          setProfileImage(uploadedImageUrl); // Usar la URL del servidor
        } else {
          setProfileImage(resizedUri); // Usar imagen local si falla el upload
        }
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
    // Validar que si hay username, esté disponible
    if (username.trim() && usernameStatus !== 'available') {
      if (usernameStatus === 'taken') {
        Alert.alert('Error', 'El nombre de usuario no está disponible');
        return;
      }
      if (usernameStatus === 'invalid') {
        Alert.alert('Error', usernameError || 'El nombre de usuario no es válido');
        return;
      }
      if (usernameStatus === 'idle' || isCheckingUsername) {
        Alert.alert('Espera', 'Se está verificando la disponibilidad del nombre de usuario');
        return;
      }
    }

    setIsLoading(true);

    const stepData: Step5Data = {
      username: username.trim() || undefined,
      profileImage: profileImage || undefined,
    };
    
    try {
      // Por ahora solo pasamos los datos sin hacer llamada a la API
      // ya que los tipos del API no incluyen estos campos
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
          <View style={{ position: 'relative' }}>
            <TextInput
              ref={usernameInputRef}
              style={[
                commonStyles.input,
                {
                  backgroundColor: Colors[colorScheme].background,
                  color: Colors[colorScheme].text,
                  borderColor: usernameStatus === 'available' ? '#00C851' : 
                             usernameStatus === 'taken' || usernameStatus === 'invalid' ? '#FF4444' : 
                             '#666',
                  paddingRight: 45, // Espacio para el icono
                },
              ]}
              value={username}
              onChangeText={handleUsernameChange}
              onBlur={handleUsernameBlur}
              onFocus={handleUsernameFocus}
              placeholder="usuario123"
              placeholderTextColor={`${Colors[colorScheme].text}60`}
              autoCapitalize="none"
              autoCorrect={false}
              blurOnSubmit={false}
              returnKeyType="done"
              keyboardType="default"
              textContentType="username"
            />
            
            {/* Icono de estado */}
            <View style={{
              position: 'absolute',
              right: 15,
              top: '50%',
              transform: [{ translateY: -10 }],
            }}>
              {isCheckingUsername ? (
                <FontAwesome name="spinner" size={20} color={Colors[colorScheme].text + '60'} />
              ) : usernameStatus === 'available' ? (
                <FontAwesome name="check-circle" size={20} color="#00C851" />
              ) : usernameStatus === 'taken' || usernameStatus === 'invalid' ? (
                <FontAwesome name="times-circle" size={20} color="#FF4444" />
              ) : null}
            </View>
          </View>
          
          {/* Mensaje de error o estado */}
          {usernameError ? (
            <Text style={{
              color: '#FF4444',
              fontSize: 12,
              marginTop: 5,
              marginLeft: 5,
            }}>
              {usernameError}
            </Text>
          ) : usernameStatus === 'available' && username.trim() ? (
            <Text style={{
              color: '#00C851',
              fontSize: 12,
              marginTop: 5,
              marginLeft: 5,
            }}>
              ✓ Nombre de usuario disponible
            </Text>
          ) : null}
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
            (isLoading || isUploadingImage || isCheckingUsername) && commonStyles.buttonDisabled,
          ]}
          onPress={handleNext}
          disabled={isLoading || isUploadingImage || isCheckingUsername}
        >
          <Text style={commonStyles.buttonText}>
            {isLoading ? 'Guardando...' : 
             isUploadingImage ? 'Subiendo imagen...' :
             isCheckingUsername ? 'Verificando...' : 
             'Finalizar registro'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
