import React from 'react';
import { TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';
import { createStyles } from './styles/FloatingCreateButton.styles';

interface FloatingCreateButtonProps {
  onPress?: () => void;
}

/**
 * Botón flotante para crear nuevos posts
 *
 * Características:
 * ✅ Posición fija en esquina inferior derecha
 * ✅ Icono de más (+) intuitivo
 * ✅ Sombra y elevación para destacar
 * ✅ Navegación a pantalla de creación
 * ✅ Tema claro/oscuro integrado
 * ✅ Accesibilidad completa
 */
const FloatingCreateButton: React.FC<FloatingCreateButtonProps> = ({
  onPress,
}) => {
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);

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
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel="Crear nueva publicación"
      accessibilityHint="Toca para abrir la pantalla de creación de posts"
    >
      <FontAwesome name="plus" size={24} color="#FFFFFF" />
    </TouchableOpacity>
  );
};

export default FloatingCreateButton;
