import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, Animated, Dimensions } from 'react-native';
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
  }, [visible]);

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
      animationType="none"
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
        
        <Animated.View
          style={{
            backgroundColor: Colors[colorScheme].background,
            borderRadius: 16,
            padding: 24,
            width: '100%',
            maxWidth: 340,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            transform: [{ scale: scaleAnim }],
          }}
        >
          {/* Icono */}
          <View style={{
            alignItems: 'center',
            marginBottom: 16,
          }}>
            <View style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: `${iconConfig.color}15`,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 12,
            }}>
              <FontAwesome
                name={iconConfig.name as any}
                size={32}
                color={iconConfig.color}
              />
            </View>
          </View>

          {/* Título */}
          <Text style={{
            fontSize: 20,
            fontWeight: '700',
            color: Colors[colorScheme].text,
            textAlign: 'center',
            marginBottom: 8,
          }}>
            {title}
          </Text>

          {/* Mensaje */}
          <Text style={{
            fontSize: 16,
            color: `${Colors[colorScheme].text}CC`,
            textAlign: 'center',
            lineHeight: 22,
            marginBottom: 24,
          }}>
            {message}
          </Text>

          {/* Botones */}
          <View style={{
            flexDirection: showCancel ? 'row' : 'column',
            gap: 12,
          }}>
            {showCancel && (
              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  paddingHorizontal: 20,
                  borderRadius: 12,
                  backgroundColor: `${Colors[colorScheme].text}10`,
                  alignItems: 'center',
                }}
                onPress={handleCancel}
              >
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: Colors[colorScheme].text,
                }}>
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
                backgroundColor: Colors[colorScheme].tint,
                alignItems: 'center',
              }}
              onPress={handleConfirm}
            >
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: 'white',
              }}>
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
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

  const showAlert = React.useCallback((
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
  }, []);

  const hideAlert = React.useCallback(() => {
    setAlert(prev => ({ ...prev, visible: false }));
  }, []);

  const AlertComponent = React.useCallback(() => (
    <CustomAlert
      {...alert}
      onClose={hideAlert}
    />
  ), [alert, hideAlert]);

  return {
    showAlert,
    hideAlert,
    AlertComponent,
  };
};
