import React, {
  memo,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import {
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Keyboard,
  Modal,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

import { Text, View } from '../Themed';
import { useColorScheme } from '../useColorScheme';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { useCustomAlert } from './CustomAlert';
import { commonStyles } from './styles/common';
import { Step5Data, UsernameCheckRequest } from './types';
import { handleApiError } from './utils/api';
import { apiService } from '@/services/apiService';
import { userAPI } from '@/services/apiExamples';
import Colors from '@/constants/Colors';
import { VALIDATION_CONSTANTS } from '@/constants/AppConstants';

interface Step5Props {
  userId: string;
  onNext: (data: Step5Data) => void;
  onBack?: () => void;
  initialData?: Step5Data;
  showError?: (message: string) => void;
  showSuccess?: (message: string) => void;
}

const Step5 = memo<Step5Props>(
  ({
    userId,
    onNext,
    initialData,
    showError: externalShowError,
    showSuccess: externalShowSuccess,
  }) => {
    const colorScheme = useColorScheme();
    const {
      showError: internalShowError,
      showSuccess: internalShowSuccess,
      AlertComponent,
    } = useCustomAlert();

    // Usar las funciones externas si se proporcionan, sino usar las internas
    const showError = externalShowError || internalShowError;
    const showSuccess = externalShowSuccess || internalShowSuccess;

    // Estados del componente
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

    // Referencias
    const debounceRef = useRef<number>(0);
    const usernameInputRef = useRef<TextInput>(null);
    const preventKeyboardClose = useRef<boolean>(false);
    const usernameCache = useRef<
      Map<string, { status: 'available' | 'taken'; timestamp: number }>
    >(new Map());

    // Validaciones memoizadas
    const canProceed = useMemo(() => {
      if (!username.trim()) return true; // Username es opcional
      return usernameStatus === 'available' && !isCheckingUsername;
    }, [username, usernameStatus, isCheckingUsername]);

    // Función para validar formato del nombre de usuario
    const validateUsernameFormat = useCallback((value: string): boolean => {
      const englishAlphabetRegex =
        /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
      return englishAlphabetRegex.test(value) && !value.includes(' ');
    }, []);

    // Función para verificar disponibilidad del nombre de usuario
    const checkUsernameAvailability = useCallback(
      async (usernameToCheck: string) => {
        if (!usernameToCheck.trim()) {
          setUsernameStatus('idle');
          setUsernameError('');
          return;
        }

        if (usernameToCheck.length < VALIDATION_CONSTANTS.USERNAME.MIN_LENGTH) {
          setUsernameStatus('invalid');
          setUsernameError(
            `El nombre de usuario debe tener al menos ${VALIDATION_CONSTANTS.USERNAME.MIN_LENGTH} caracteres`
          );
          return;
        }

        if (!validateUsernameFormat(usernameToCheck)) {
          setUsernameStatus('invalid');
          setUsernameError(
            'Solo se permiten letras, números y caracteres especiales. No se permiten espacios.'
          );
          return;
        }

        // Verificar cache primero (válido por 5 minutos)
        const cached = usernameCache.current.get(usernameToCheck);
        const cacheValidTime = 5 * 60 * 1000;

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

        const wasInputFocused = usernameInputRef.current?.isFocused();

        try {
          setIsCheckingUsername(true);
          setUsernameError('');
          preventKeyboardClose.current = true;

          const requestData: UsernameCheckRequest = {
            UserName: usernameToCheck,
          };

          const response = await apiService.post<any[]>(
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

          if (response.Success) {
            if (!response.Data || response.Data.length === 0) {
              setUsernameStatus('available');
              setUsernameError('');
              usernameCache.current.set(usernameToCheck, {
                status: 'available',
                timestamp: Date.now(),
              });
            } else {
              setUsernameStatus('taken');
              setUsernameError('Este nombre de usuario ya está en uso');
              usernameCache.current.set(usernameToCheck, {
                status: 'taken',
                timestamp: Date.now(),
              });
            }
          } else {
            setUsernameStatus('invalid');
            setUsernameError(
              response.Message || 'Error al verificar el nombre de usuario'
            );
          }
        } catch {
          setUsernameStatus('invalid');
          setUsernameError(
            'Error al verificar la disponibilidad del nombre de usuario'
          );

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
          preventKeyboardClose.current = false;
        }
      },
      [validateUsernameFormat]
    );

    // Hook para manejar el debounce del nombre de usuario
    useEffect(() => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      if (!username.trim()) {
        setUsernameStatus('idle');
        setUsernameError('');
        return;
      }

      if (username.length < VALIDATION_CONSTANTS.USERNAME.MIN_LENGTH) {
        setUsernameStatus('invalid');
        setUsernameError(
          `El nombre de usuario debe tener al menos ${VALIDATION_CONSTANTS.USERNAME.MIN_LENGTH} caracteres`
        );
        return;
      }

      debounceRef.current = setTimeout(() => {
        checkUsernameAvailability(username);
      }, 750) as unknown as number;

      return () => {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
      };
    }, [username, checkUsernameAvailability]);

    // Hook para manejar eventos del teclado
    useEffect(() => {
      const keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        () => {
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
    const handleUsernameChange = useCallback(
      (text: string) => {
        const filteredText = text.replace(/\s/g, '');

        if (validateUsernameFormat(filteredText)) {
          setUsername(filteredText);
          setUsernameStatus('idle');
          setUsernameError('');
        }
      },
      [validateUsernameFormat]
    );

    // Función para manejar cuando el input pierde el foco
    const handleUsernameBlur = useCallback(() => {
      if (preventKeyboardClose.current) {
        setTimeout(() => {
          if (usernameInputRef.current && preventKeyboardClose.current) {
            usernameInputRef.current.focus();
          }
        }, 10);
      }
    }, []);

    // Función para manejar cuando el input obtiene foco
    const handleUsernameFocus = useCallback(() => {
      if (usernameInputRef.current) {
        preventKeyboardClose.current = false;
      }
    }, []);

    // Función para redimensionar imagen y validar tamaño máximo de 2MB
    const resizeImageTo2MB = useCallback(
      async (uri: string): Promise<string> => {
        let quality = 0.9;
        let result;

        do {
          result = await ImageManipulator.manipulateAsync(
            uri,
            [
              {
                resize: {
                  width: 1000,
                  height: 1000,
                },
              },
            ],
            {
              compress: quality,
              format: ImageManipulator.SaveFormat.PNG,
            }
          );

          const response = await fetch(result.uri);
          const blob = await response.blob();
          const sizeInMB = blob.size / (1024 * 1024);

          if (sizeInMB <= 2) {
            break;
          }

          quality -= 0.1;

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
      },
      []
    );

    // Función para subir imagen al servidor
    const uploadProfileImage = useCallback(
      async (imageUri: string): Promise<string | null> => {
        try {
          setIsUploadingImage(true);

          const formData = new FormData();
          formData.append('UserId', userId);

          const filename = `profile_${userId}_${Date.now()}.png`;
          formData.append('ProfileImage', {
            uri: imageUri,
            type: 'image/png',
            name: filename,
          } as any);

          const response = await apiService.post<string>(
            '/user/upload-profile-image',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );

          if (response.Success) {
            showSuccess('La imagen de perfil se subió correctamente');
            return response.Data;
          } else {
            showError(response.Message || 'Error al subir la imagen');
            return null;
          }
        } catch {
          showError('No se pudo subir la imagen. Intenta de nuevo.');
          return null;
        } finally {
          setIsUploadingImage(false);
        }
      },
      [userId, showError, showSuccess]
    );

    const pickImage = useCallback(async () => {
      try {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          showError('Necesitamos permisos para acceder a tus fotos');
          return;
        }

        setIsUploadingImage(true);

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });

        if (!result.canceled && result.assets[0]) {
          const selectedImage = result.assets[0];
          const resizedUri = await resizeImageTo2MB(selectedImage.uri);
          const uploadedImageUrl = await uploadProfileImage(resizedUri);

          if (uploadedImageUrl) {
            setImageError(false);
            setImageLoading(false);
            setProfileImage(uploadedImageUrl);
          } else {
            setImageError(false);
            setImageLoading(false);
            setProfileImage(resizedUri);
          }
        }
      } catch {
        showError('No se pudo seleccionar la imagen');
      } finally {
        setIsUploadingImage(false);
      }
    }, [showError, resizeImageTo2MB, uploadProfileImage]);

    const takePhoto = useCallback(async () => {
      try {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          showError('Necesitamos permisos de cámara para tomar fotos');
          return;
        }

        setImageLoading(true);
        setImageError(false);

        const result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
          const takenPhoto = result.assets[0];
          const resizedUri = await resizeImageTo2MB(takenPhoto.uri);
          const uploadedImageUrl = await uploadProfileImage(resizedUri);

          if (uploadedImageUrl) {
            setImageError(false);
            setImageLoading(false);
            setProfileImage(uploadedImageUrl);
          } else {
            setImageError(false);
            setImageLoading(false);
            setProfileImage(resizedUri);
          }
        } else {
          setImageLoading(false);
        }

        setShowImageModal(false);
      } catch {
        setImageLoading(false);
        setImageError(true);
        showError('No se pudo tomar la foto. Intenta nuevamente.');
        setShowImageModal(false);
      }
    }, [showError, resizeImageTo2MB, uploadProfileImage]);

    const showImageOptions = useCallback(() => {
      setImageError(false);
      setShowImageModal(true);
    }, []);

    const handleNext = useCallback(async () => {
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
        ...(username.trim() && { username: username.trim() }),
        ...(profileImage && { profileImage }),
      };

      try {
        if (stepData.username || stepData.profileImage) {
          const updateData: any = {};

          if (stepData.username) {
            updateData.username = stepData.username;
          }

          if (stepData.username) {
            const response = await userAPI.updateUser(userId, updateData);

            if (!response.Success) {
              showError(
                response.Message || 'Error al actualizar el perfil de usuario'
              );
              return;
            }
          }
        }

        onNext(stepData);
      } catch (error: any) {
        handleApiError(error);
        showError('No se pudo completar el registro. Intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    }, [
      username,
      usernameStatus,
      usernameError,
      isCheckingUsername,
      profileImage,
      userId,
      onNext,
      showError,
    ]);

    // Componente para mostrar el estado del username
    const UsernameStatusIcon = memo(() => {
      if (isCheckingUsername) {
        return <LoadingSpinner size='small' />;
      }
      if (usernameStatus === 'available') {
        return <FontAwesome name='check-circle' size={20} color='#00C851' />;
      }
      if (usernameStatus === 'taken' || usernameStatus === 'invalid') {
        return <FontAwesome name='times-circle' size={20} color='#FF4444' />;
      }
      return null;
    });

    return (
      <ScrollView contentContainerStyle={commonStyles.container}>
        <View style={commonStyles.header}>
          <Text
            style={[commonStyles.title, { color: Colors[colorScheme].text }]}
          >
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
                    paddingRight: 45,
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
                accessibilityLabel='Campo de nombre de usuario'
                accessibilityHint='Ingresa tu nombre de usuario opcional'
              />

              <View
                style={{
                  position: 'absolute',
                  right: 15,
                  top: '50%',
                  transform: [{ translateY: -10 }],
                }}
              >
                <UsernameStatusIcon />
              </View>
            </View>

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
                  <LoadingSpinner size='large' />
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
                      <LoadingSpinner size='small' />
                    </View>
                  )}
                  <Image
                    source={{ uri: profileImage }}
                    style={[
                      commonStyles.imagePreview,
                      imageLoading && { opacity: 0.7 },
                    ]}
                    onError={() => {
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

          <Button
            title={
              isLoading
                ? 'Guardando...'
                : isUploadingImage
                  ? 'Subiendo imagen...'
                  : isCheckingUsername
                    ? 'Verificando...'
                    : 'Finalizar registro'
            }
            onPress={handleNext}
            disabled={
              !canProceed || isLoading || isUploadingImage || isCheckingUsername
            }
            loading={isLoading || isUploadingImage || isCheckingUsername}
            variant='primary'
            size='large'
            accessibilityLabel='Botón para finalizar el registro'
            accessibilityHint='Presiona para completar el proceso de registro'
          />
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
                <Text
                  style={{ color: 'white', fontSize: 16, fontWeight: '600' }}
                >
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
                <Text
                  style={{ color: 'white', fontSize: 16, fontWeight: '600' }}
                >
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
);

Step5.displayName = 'Step5';

export default Step5;
