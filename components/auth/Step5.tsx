import React, { useState, useEffect, useRef } from 'react';
import {
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Keyboard,
  Modal,
} from 'react-native';
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
import {
  Step5Data,
  UsernameCheckRequest,
  UsernameCheckResponse,
  UploadProfileImageResponse,
} from './types';
import { handleApiError } from './utils/api';
import { commonStyles } from './styles/common';
import { useCustomAlert } from './CustomAlert';
import { LoadingAnimation } from './LoadingAnimation';

interface Step5Props {
  userId: string;
  onNext: (data: Step5Data) => void;
  onBack?: () => void;
  initialData?: Step5Data;
}

export default function Step5({ userId, onNext, initialData }: Step5Props) {
  const colorScheme = useColorScheme();
  const { showError, showSuccess, AlertComponent } = useCustomAlert();
  const [username, setUsername] = useState(initialData?.username || '');
  const [profileImage, setProfileImage] = useState<string | null>(
    initialData?.profileImage || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<
    'idle' | 'available' | 'taken' | 'invalid'
  >('idle');
  const [usernameError, setUsernameError] = useState<string>('');
  const [imageError, setImageError] = useState<boolean>(false);
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [showImageModal, setShowImageModal] = useState(false);

  // Ref para el debounce
  const debounceRef = useRef<number>(0);

  // Ref para el TextInput del username
  const usernameInputRef = useRef<TextInput>(null);

  // Ref para prevenir que se cierre el teclado
  const preventKeyboardClose = useRef<boolean>(false);

  // Cache temporal para usernames ya validados
  const usernameCache = useRef<
    Map<string, { status: 'available' | 'taken'; timestamp: number }>
  >(new Map());

  // Función para validar formato del nombre de usuario
  const validateUsernameFormat = (value: string): boolean => {
    // Solo permite letras inglesas, números y caracteres especiales básicos
    // No permite espacios
    const englishAlphabetRegex =
      /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
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
      setUsernameError(
        'Solo se permiten letras, números y caracteres especiales. No se permiten espacios.'
      );
      return;
    }

    // Verificar cache primero (válido por 5 minutos)
    const cached = usernameCache.current.get(usernameToCheck);
    const cacheValidTime = 5 * 60 * 1000; // 5 minutos en millisegundos

    if (cached && Date.now() - cached.timestamp < cacheValidTime) {
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
        UserName: usernameToCheck,
      };

      // Usar apiService para incluir el token automáticamente
      const response = await apiService.post<UsernameCheckResponse>(
        '/users/find',
        requestData
      );

      // Restaurar el foco inmediatamente después del request
      if (wasInputFocused && usernameInputRef.current) {
        requestAnimationFrame(() => {
          if (
            usernameInputRef.current &&
            !usernameInputRef.current.isFocused()
          ) {
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
          usernameCache.current.set(usernameToCheck, {
            status: 'available',
            timestamp: Date.now(),
          });
        } else {
          // Si hay datos, el nombre de usuario ya está tomado
          setUsernameStatus('taken');
          setUsernameError('Este nombre de usuario ya está en uso');
          // Guardar en cache
          usernameCache.current.set(usernameToCheck, {
            status: 'taken',
            timestamp: Date.now(),
          });
        }
      } else {
        setUsernameStatus('invalid');
        setUsernameError(
          response.data?.Message || 'Error al verificar el nombre de usuario'
        );
      }
    } catch (error: any) {
      setUsernameStatus('invalid');
      setUsernameError(
        'Error al verificar la disponibilidad del nombre de usuario'
      );

      // Restaurar el foco en caso de error también
      if (wasInputFocused && usernameInputRef.current) {
        requestAnimationFrame(() => {
          if (
            usernameInputRef.current &&
            !usernameInputRef.current.isFocused()
          ) {
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
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        // Si estamos validando, reabrir el teclado
        if (preventKeyboardClose.current && usernameInputRef.current) {
          setTimeout(() => {
            if (usernameInputRef.current && preventKeyboardClose.current) {
              usernameInputRef.current.focus();
            }
          }, 100);
        }
      }
    );

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
  const uploadProfileImage = async (
    imageUri: string
  ): Promise<string | null> => {
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
      const response = await apiService.post<UploadProfileImageResponse>(
        '/user/upload-profile-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.Success) {
        showSuccess('La imagen de perfil se subió correctamente');
        return response.data.Data; // Retornar la URL de la imagen
      } else {
        showError(response.data.Message || 'Error al subir la imagen');
        return null;
      }
    } catch (error: any) {
      showError('No se pudo subir la imagen. Intenta de nuevo.');
      return null;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const pickImage = async () => {
    try {
      // Solicitar permisos
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        showError('Necesitamos permisos para acceder a tus fotos');
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
          setImageError(false);
          setImageLoading(false);
          setProfileImage(uploadedImageUrl); // Usar la URL del servidor
        } else {
          setImageError(false);
          setImageLoading(false);
          setProfileImage(resizedUri); // Usar imagen local si falla el upload
        }
      }
    } catch (error) {
      showError('No se pudo seleccionar la imagen');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const takePhoto = async () => {
    try {
      // Solicitar permisos
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        showError('Necesitamos permisos de cámara para tomar fotos');
        return;
      }

      setImageLoading(true);
      setImageError(false);

      // Abrir cámara
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1], // Imagen cuadrada
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const takenPhoto = result.assets[0];
        // Redimensionar imagen y validar tamaño
        const resizedUri = await resizeImageTo2MB(takenPhoto.uri);
        // Subir imagen al servidor
        const uploadedImageUrl = await uploadProfileImage(resizedUri);

        if (uploadedImageUrl) {
          setImageError(false);
          setImageLoading(false);
          setProfileImage(uploadedImageUrl); // Usar la URL del servidor
        } else {
          setImageError(false);
          setImageLoading(false);
          setProfileImage(resizedUri); // Usar imagen local si falla el upload
        }
      } else {
        setImageLoading(false);
      }

      setShowImageModal(false);
    } catch (error) {
      setImageLoading(false);
      setImageError(true);
      showError('No se pudo tomar la foto. Intenta nuevamente.');
      setShowImageModal(false);
    }
  };

  const showImageOptions = () => {
    // Reset error state when user tries again
    setImageError(false);
    setShowImageModal(true);
  };

  const handleNext = async () => {
    // Validar que si hay username, esté disponible
    if (username.trim() && usernameStatus !== 'available') {
      if (usernameStatus === 'taken') {
        showError('El nombre de usuario no está disponible');
        return;
      }
      if (usernameStatus === 'invalid') {
        showError(usernameError || 'El nombre de usuario no es válido');
        return;
      }
      if (usernameStatus === 'idle' || isCheckingUsername) {
        showError(
          'Se está verificando la disponibilidad del nombre de usuario'
        );
        return;
      }
    }

    setIsLoading(true);

    const stepData: Step5Data = {
      username: username.trim() || undefined,
      profileImage: profileImage || undefined,
    };

    try {
      // Si hay datos para actualizar, validar que la API responda correctamente
      if (stepData.username || stepData.profileImage) {
        const updateData: any = {};

        if (stepData.username) {
          updateData.username = stepData.username;
        }

        // Para la imagen, ya se subió anteriormente en uploadProfileImage
        // Solo necesitamos validar que se guardó correctamente

        // Solo llamar al API si hay datos que actualizar (username por ahora)
        if (stepData.username) {
          const response = await userAPI.updateUser(userId, updateData);

          if (!response.Success) {
            showError(
              response.Message || 'Error al actualizar el perfil de usuario'
            );
            return; // NO permitir avanzar si la API falla
          }
        }
      }

      // Solo avanzar si todo fue exitoso
      onNext(stepData);
    } catch (error: any) {
      const errorMessage = handleApiError(error);
      showError('No se pudo completar el registro. Intenta de nuevo.');
      // NO avanzar en caso de error
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
        <Text
          style={[commonStyles.subtitle, { color: Colors[colorScheme].text }]}
        >
          Personaliza tu perfil (opcional)
        </Text>
      </View>

      <View style={commonStyles.form}>
        <View style={commonStyles.inputContainer}>
          <Text
            style={[commonStyles.label, { color: Colors[colorScheme].text }]}
          >
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
                  borderColor:
                    usernameStatus === 'available'
                      ? '#00C851'
                      : usernameStatus === 'taken' ||
                          usernameStatus === 'invalid'
                        ? '#FF4444'
                        : '#666',
                  paddingRight: 45, // Espacio para el icono
                },
              ]}
              value={username}
              onChangeText={handleUsernameChange}
              onBlur={handleUsernameBlur}
              onFocus={handleUsernameFocus}
              placeholder='usuario123'
              placeholderTextColor={`${Colors[colorScheme].text}60`}
              autoCapitalize='none'
              autoCorrect={false}
              blurOnSubmit={false}
              returnKeyType='done'
              keyboardType='default'
              textContentType='username'
            />

            {/* Icono de estado */}
            <View
              style={{
                position: 'absolute',
                right: 15,
                top: '50%',
                transform: [{ translateY: -10 }],
              }}
            >
              {isCheckingUsername ? (
                <LoadingAnimation size={20} />
              ) : usernameStatus === 'available' ? (
                <FontAwesome name='check-circle' size={20} color='#00C851' />
              ) : usernameStatus === 'taken' || usernameStatus === 'invalid' ? (
                <FontAwesome name='times-circle' size={20} color='#FF4444' />
              ) : null}
            </View>
          </View>

          {/* Mensaje de error o estado */}
          {usernameError ? (
            <Text
              style={{
                color: '#FF4444',
                fontSize: 12,
                marginTop: 5,
                marginLeft: 5,
              }}
            >
              {usernameError}
            </Text>
          ) : usernameStatus === 'available' && username.trim() ? (
            <Text
              style={{
                color: '#00C851',
                fontSize: 12,
                marginTop: 5,
                marginLeft: 5,
              }}
            >
              ✓ Nombre de usuario disponible
            </Text>
          ) : null}
        </View>

        <View style={commonStyles.inputContainer}>
          <Text
            style={[commonStyles.label, { color: Colors[colorScheme].text }]}
          >
            Foto de perfil
          </Text>

          <TouchableOpacity
            style={[
              commonStyles.imagePickerContainer,
              {
                backgroundColor: Colors[colorScheme].background,
                borderColor: '#666',
                opacity: isUploadingImage ? 0.7 : 1,
              },
            ]}
            onPress={showImageOptions}
            disabled={isUploadingImage}
          >
            {isUploadingImage ? (
              <View style={commonStyles.imagePlaceholder}>
                <LoadingAnimation size={50} />
                <Text
                  style={[
                    commonStyles.imageText,
                    { color: Colors[colorScheme].text, marginTop: 12 },
                  ]}
                >
                  Procesando imagen...
                </Text>
              </View>
            ) : profileImage && !imageError ? (
              <View style={commonStyles.imagePreviewContainer}>
                {imageLoading && (
                  <View
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      justifyContent: 'center',
                      alignItems: 'center',
                      zIndex: 1,
                      borderRadius: 8,
                    }}
                  >
                    <LoadingAnimation size={30} />
                  </View>
                )}
                <Image
                  source={{ uri: profileImage }}
                  style={[
                    commonStyles.imagePreview,
                    imageLoading && { opacity: 0.7 },
                  ]}
                  onError={error => {
                    setImageError(true);
                    setImageLoading(false);
                  }}
                  onLoad={() => {
                    setImageError(false);
                    setImageLoading(false);
                  }}
                  onLoadStart={() => {
                    setImageLoading(true);
                    setImageError(false);
                  }}
                />
                <Text
                  style={[
                    commonStyles.imageText,
                    { color: Colors[colorScheme].text },
                  ]}
                >
                  Tocar para cambiar
                </Text>
              </View>
            ) : (
              <View style={commonStyles.imagePlaceholder}>
                {imageError && profileImage ? (
                  <>
                    <FontAwesome
                      name='exclamation-triangle'
                      size={40}
                      color='#FF6B6B'
                    />
                    <Text
                      style={[
                        commonStyles.imageText,
                        { color: '#FF6B6B', marginTop: 8 },
                      ]}
                    >
                      Error al cargar imagen
                    </Text>
                    <Text
                      style={[
                        commonStyles.imageText,
                        { color: Colors[colorScheme].text, fontSize: 12 },
                      ]}
                    >
                      Tocar para intentar de nuevo
                    </Text>
                  </>
                ) : (
                  <>
                    <FontAwesome
                      name='camera'
                      size={40}
                      color={Colors[colorScheme].text + '60'}
                    />
                    <Text
                      style={[
                        commonStyles.imageText,
                        { color: Colors[colorScheme].text },
                      ]}
                    >
                      Subir foto de perfil
                    </Text>
                  </>
                )}
              </View>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            commonStyles.button,
            {
              backgroundColor: Colors[colorScheme].tint,
            },
            (isLoading || isUploadingImage || isCheckingUsername) &&
              commonStyles.buttonDisabled,
          ]}
          onPress={handleNext}
          disabled={isLoading || isUploadingImage || isCheckingUsername}
        >
          <Text style={commonStyles.buttonText}>
            {isLoading
              ? 'Guardando...'
              : isUploadingImage
                ? 'Subiendo imagen...'
                : isCheckingUsername
                  ? 'Verificando...'
                  : 'Finalizar registro'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal para selección de imagen */}
      <Modal
        visible={showImageModal}
        transparent={true}
        animationType='slide'
        onRequestClose={() => setShowImageModal(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
          activeOpacity={1}
          onPress={() => setShowImageModal(false)}
        >
          <View
            style={{
              backgroundColor: Colors[colorScheme].background,
              borderRadius: 12,
              padding: 20,
              width: '90%',
              maxWidth: 400,
              elevation: 5,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
            }}
            onStartShouldSetResponder={() => true}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: Colors[colorScheme].text,
                }}
              >
                Seleccionar foto de perfil
              </Text>
              <TouchableOpacity
                onPress={() => setShowImageModal(false)}
                style={{
                  padding: 8,
                  borderRadius: 20,
                  backgroundColor: `${Colors[colorScheme].text}10`,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: Colors[colorScheme].text,
                    fontWeight: 'bold',
                  }}
                >
                  ✕
                </Text>
              </TouchableOpacity>
            </View>

            <Text
              style={{
                fontSize: 16,
                color: Colors[colorScheme].text,
                marginBottom: 20,
                textAlign: 'center',
              }}
            >
              Elige una opción
            </Text>

            <TouchableOpacity
              style={{
                padding: 16,
                borderRadius: 8,
                backgroundColor: Colors[colorScheme].tint,
                marginBottom: 12,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                setShowImageModal(false);
                takePhoto();
              }}
            >
              <FontAwesome
                name='camera'
                size={20}
                color='white'
                style={{ marginRight: 10 }}
              />
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                Tomar foto
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                padding: 16,
                borderRadius: 8,
                backgroundColor: Colors[colorScheme].tint,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                setShowImageModal(false);
                pickImage();
              }}
            >
              <FontAwesome
                name='image'
                size={20}
                color='white'
                style={{ marginRight: 10 }}
              />
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                Elegir de galería
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Componente de alertas personalizado */}
      <AlertComponent />
    </ScrollView>
  );
}
