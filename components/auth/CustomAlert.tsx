import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useColorScheme } from '../useColorScheme';
import Colors from '@/constants/Colors';

interface CustomAlertProps {
  visible: boolean;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  onClose: () => void;
  confirmText?: string;
  showCancel?: boolean;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

export const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  type,
  title,
  message,
  onClose,
  confirmText = 'Aceptar',
  showCancel = false,
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
}) => {
  const colorScheme = useColorScheme();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, scaleAnim, opacityAnim]);

  const getIconConfig = () => {
    switch (type) {
      case 'success':
        return { name: 'check-circle', color: '#4CAF50' };
      case 'error':
        return { name: 'exclamation-circle', color: '#F44336' };
      case 'warning':
        return { name: 'exclamation-triangle', color: '#FF9800' };
      case 'info':
        return { name: 'info-circle', color: '#2196F3' };
      default:
        return { name: 'info-circle', color: '#2196F3' };
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  const iconConfig = getIconConfig();

  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={onClose}
    >
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
          opacity: opacityAnim,
        }}
      >
        <TouchableOpacity
          style={{ position: 'absolute', width: '100%', height: '100%' }}
          activeOpacity={1}
          onPress={onClose}
        />

        <View
          style={{
            backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#FFFFFF',
            borderRadius: 16,
            padding: 24,
            width: '100%',
            maxWidth: 340,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
          }}
        >
          {/* Icono */}
          <View
            style={{
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: `${iconConfig.color}15`,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <FontAwesome
                name={iconConfig.name as any}
                size={32}
                color={iconConfig.color}
              />
            </View>
          </View>

          {/* Título */}
          {!(type === 'error' && title === 'Error') && (
            <Text
              style={{
                fontSize: 20,
                fontWeight: '700',
                color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
                textAlign: 'center',
                marginBottom: 8,
              }}
            >
              {title}
            </Text>
          )}

          {/* Mensaje */}
          <Text
            style={{
              fontSize: 16,
              color: colorScheme === 'dark' ? '#E0E0E0' : '#424242',
              textAlign: 'center',
              lineHeight: 24,
              marginBottom: 28,
              marginTop: type === 'error' && title === 'Error' ? 8 : 0,
              fontWeight: '400',
            }}
          >
            {message}
          </Text>

          {/* Botones */}
          <View
            style={{
              flexDirection: showCancel ? 'row' : 'column',
              gap: 12,
            }}
          >
            {showCancel && (
              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  paddingHorizontal: 20,
                  borderRadius: 12,
                  backgroundColor:
                    colorScheme === 'dark' ? '#404040' : '#F5F5F5',
                  alignItems: 'center',
                }}
                onPress={handleCancel}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: colorScheme === 'dark' ? '#FFFFFF' : '#424242',
                  }}
                >
                  {cancelText}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={{
                flex: showCancel ? 1 : undefined,
                paddingVertical: 14,
                paddingHorizontal: 20,
                borderRadius: 12,
                backgroundColor:
                  type === 'success'
                    ? Colors[colorScheme].tint
                    : type === 'error'
                      ? Colors[colorScheme].tint
                      : type === 'warning'
                        ? Colors[colorScheme].tint
                        : Colors[colorScheme].tint,
                alignItems: 'center',
              }}
              onPress={handleConfirm}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#FFFFFF',
                }}
              >
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
};

// Hook para usar la alerta más fácilmente
export const useCustomAlert = () => {
  const [alert, setAlert] = React.useState<{
    visible: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    confirmText?: string;
    showCancel?: boolean;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  }>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  });

  const showAlert = React.useCallback(
    (
      type: 'success' | 'error' | 'warning' | 'info',
      title: string,
      message: string,
      options?: {
        confirmText?: string;
        showCancel?: boolean;
        cancelText?: string;
        onConfirm?: () => void;
        onCancel?: () => void;
      }
    ) => {
      setAlert({
        visible: true,
        type,
        title,
        message,
        ...options,
      });
    },
    []
  );

  const showError = React.useCallback(
    (
      message: string,
      options?: {
        confirmText?: string;
        showCancel?: boolean;
        cancelText?: string;
        onConfirm?: () => void;
        onCancel?: () => void;
      }
    ) => {
      showAlert('error', 'Error', message, options);
    },
    [showAlert]
  );

  const showSuccess = React.useCallback(
    (
      message: string,
      options?: {
        confirmText?: string;
        showCancel?: boolean;
        cancelText?: string;
        onConfirm?: () => void;
        onCancel?: () => void;
      }
    ) => {
      showAlert('success', 'Éxito', message, options);
    },
    [showAlert]
  );

  const hideAlert = React.useCallback(() => {
    setAlert(prev => ({ ...prev, visible: false }));
  }, []);

  const AlertComponent = React.useCallback(
    () => (
      <CustomAlert
        visible={alert.visible}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        confirmText={alert.confirmText}
        showCancel={alert.showCancel}
        cancelText={alert.cancelText}
        onConfirm={alert.onConfirm}
        onCancel={alert.onCancel}
        onClose={hideAlert}
      />
    ),
    [alert, hideAlert]
  );

  return {
    showAlert,
    showError,
    showSuccess,
    hideAlert,
    AlertComponent,
  };
};
