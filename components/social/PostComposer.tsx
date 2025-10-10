import React, { useState } from 'react';
import {
  Modal,
  TextInput,
  TouchableOpacity,
  View as RNView,
} from 'react-native';
import { View, Text } from '@/components/Themed';
import Button from '@/components/common/Button';
import { useCustomAlert } from '@/components/common/CustomAlert';
import SmartImage from '@/components/common/SmartImage';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { sanitizeContent, isValidContent } from '@/utils/securityUtils';
import {
  canCreatePost,
  getRateLimitMessage,
  rateLimiter,
} from '@/utils/rateLimitUtils';
import { useAuth } from '@/contexts/AuthContext';
import { makePostComposerStyles } from './styles/postComposer';

export interface PostComposerProps {
  avatarUrl?: string | null;
  onSubmit: (content: string, mediaUrl?: string | null) => void;
  isAnonymous?: boolean;
}

export const PostComposer: React.FC<PostComposerProps> = ({
  avatarUrl,
  onSubmit,
  isAnonymous = false,
}) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const styles = useThemedStyles(makePostComposerStyles);
  const { user } = useAuth();
  const { showAlert, AlertComponent } = useCustomAlert();

  const handlePublish = async () => {
    const trimmedText = text.trim();

    // Validar contenido vacío
    if (!trimmedText) {
      showAlert('error', 'Error', 'El post no puede estar vacío');
      return;
    }

    // Validar contenido con seguridad
    if (!isValidContent(trimmedText)) {
      showAlert(
        'error',
        'Error',
        'El contenido no es válido. Debe tener entre 3 y 5000 caracteres.'
      );
      return;
    }

    // Verificar rate limiting
    const userId = user?.id || 'anonymous';
    if (!canCreatePost(userId)) {
      const timeRemaining = rateLimiter.getTimeUntilReset(
        `post_create_${userId}`,
        5 * 60 * 1000
      );
      const message = getRateLimitMessage('post', timeRemaining);
      showAlert('warning', 'Límite alcanzado', message);
      return;
    }

    try {
      setIsSubmitting(true);
      // Sanitizar contenido antes de enviar
      const sanitizedContent = sanitizeContent(trimmedText);
      await onSubmit(sanitizedContent, null);
      setText('');
      setOpen(false);
    } catch (error) {
      showAlert(
        'error',
        'Error',
        'No se pudo publicar el post. Intenta de nuevo.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <SmartImage
          uri={
            isAnonymous
              ? require('@/assets/images/icon.png')
              : avatarUrl || require('@/assets/images/icon.png')
          }
          style={styles.avatar}
          deferOnDataSaver={false}
        />
        <TouchableOpacity
          style={styles.inputFake}
          onPress={() => setOpen(true)}
        >
          <Text style={styles.placeholder}>
            {isAnonymous
              ? 'Publicar como Anónimo'
              : '¿Cómo fue tu entrenamiento hoy?'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => setOpen(true)}
        >
          <Text style={styles.actionText}>Foto</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => setOpen(true)}
        >
          <Text style={styles.actionText}>Ubicación</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={open} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setOpen(false)}>
              <Text style={styles.cancel}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Nuevo Post</Text>
            <RNView style={{ width: 60 }} />
          </View>
          <View style={styles.modalBody}>
            <TextInput
              style={styles.textarea}
              placeholder="Escribe algo..."
              placeholderTextColor={styles.colors.placeholder}
              multiline
              value={text}
              onChangeText={setText}
              autoFocus
            />
          </View>
          <View style={styles.modalFooter}>
            <Button
              title="Publicar"
              onPress={handlePublish}
              disabled={isSubmitting}
            />
          </View>
        </View>
      </Modal>
      <AlertComponent />
    </View>
  );
};

export default PostComposer;
