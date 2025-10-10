import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Animated } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';
import { createStyles } from './styles/FloatingCreateButton.styles';

interface FloatingCreateButtonProps {
  onPress?: () => void;
  visible?: boolean;
}

/**
 * Botón flotante para crear nuevos posts
 *
 * Características:
 * ✅ Posición ajustable más a la izquierda y abajo
 * ✅ Auto-hide al hacer scroll down, reaparece al scroll up
 * ✅ Icono de más (+) intuitivo
 * ✅ Sombra y elevación para destacar
 * ✅ Navegación a pantalla de creación
 * ✅ Tema claro/oscuro integrado
 * ✅ Accesibilidad completa
 */
const FloatingCreateButton: React.FC<FloatingCreateButtonProps> = ({
  onPress,
  visible = true,
}) => {
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: visible ? 0 : 120, // Desplazamiento hacia abajo cuando se oculta
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
  }, [visible, translateY]);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      try {
        router.push('/createPost');
      } catch (error) {
        // Navigation failed, handle silently
      }
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.button}
        onPress={handlePress}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Crear nueva publicación"
        accessibilityHint="Toca para abrir la pantalla de creación de posts"
      >
        <FontAwesome name="plus" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default FloatingCreateButton;
