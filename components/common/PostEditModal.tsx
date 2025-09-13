import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useColorScheme } from '../useColorScheme';
import { useI18n } from '../../hooks/useI18n';
import type { FeedItem } from '@/types/feedTypes';

export interface PostEditModalProps {
  visible: boolean;
  post: FeedItem | null;
  onClose: () => void;
  onSave: (updatedPost: Partial<FeedItem>) => Promise<void>;
}

interface FormData {
  title: string;
  content: string;
  tags: string;
  isPublic: boolean;
}

export const PostEditModal: React.FC<PostEditModalProps> = ({
  visible,
  post,
  onClose,
  onSave,
}) => {
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);
  const { t } = useI18n();

  // Estados del formulario
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    tags: '',
    isPublic: true,
  });

  const [originalData, setOriginalData] = useState<FormData>({
    title: '',
    content: '',
    tags: '',
    isPublic: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Cargar datos del post cuando se abre el modal
  useEffect(() => {
    if (post && visible) {
      const initialData: FormData = {
        title: post.title || '',
        content: post.content || '',
        tags: Array.isArray(post.tags) ? post.tags.join(', ') : post.tags || '',
        isPublic: post.isPublic ?? true,
      };
      setFormData(initialData);
      setOriginalData(initialData);
      setErrors({});
    }
  }, [post, visible]);

  // Validar formulario
  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = t('El título es requerido');
    } else if (formData.title.length > 200) {
      newErrors.title = t('El título debe tener máximo 200 caracteres');
    }

    if (!formData.content.trim()) {
      newErrors.content = t('El contenido es requerido');
    } else if (formData.content.length > 5000) {
      newErrors.content = t('El contenido debe tener máximo 5000 caracteres');
    }

    if (formData.tags && formData.tags.length > 500) {
      newErrors.tags = t('Los tags deben tener máximo 500 caracteres');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, t]);

  // Verificar si hay cambios
  const hasChanges = useCallback((): boolean => {
    return (
      formData.title !== originalData.title ||
      formData.content !== originalData.content ||
      formData.tags !== originalData.tags ||
      formData.isPublic !== originalData.isPublic
    );
  }, [formData, originalData]);

  // Manejar guardar
  const handleSave = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    if (!hasChanges()) {
      onClose();
      return;
    }

    setIsLoading(true);

    try {
      const updatedPost: Partial<FeedItem> = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        tags: formData.tags.trim() || undefined,
        isPublic: formData.isPublic,
      };

      await onSave(updatedPost);
      onClose();
    } catch (error) {
      Alert.alert(
        t('Error'),
        t('No se pudo guardar el post. Inténtalo de nuevo.')
      );
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm, hasChanges, onSave, onClose, t]);

  // Manejar cancelar con confirmación si hay cambios
  const handleCancel = useCallback(() => {
    if (hasChanges()) {
      Alert.alert(
        t('Descartar cambios'),
        t('¿Estás seguro de que deseas descartar los cambios?'),
        [
          {
            text: t('Continuar editando'),
            style: 'cancel',
          },
          {
            text: t('Descartar'),
            style: 'destructive',
            onPress: onClose,
          },
        ]
      );
    } else {
      onClose();
    }
  }, [hasChanges, onClose, t]);

  // Actualizar campo del formulario
  const updateField = useCallback(
    (field: keyof FormData, value: string | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Limpiar error del campo si existe
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

  const previewMode = false; // TODO: Implementar modo preview

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleCancel}
            disabled={isLoading}
          >
            <Text style={styles.cancelText}>{t('Cancelar')}</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>{t('Editar Post')}</Text>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleSave}
            disabled={isLoading || !hasChanges()}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FF6B35" />
            ) : (
              <Text
                style={[
                  styles.saveText,
                  (!hasChanges() || isLoading) && styles.saveTextDisabled,
                ]}
              >
                {t('Guardar')}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
          {/* Título */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>{t('Título')}</Text>
            <TextInput
              style={[styles.titleInput, errors.title && styles.inputError]}
              value={formData.title}
              onChangeText={(text) => updateField('title', text)}
              placeholder={t('Escribe el título del post...')}
              placeholderTextColor={colorScheme === 'dark' ? '#666' : '#999'}
              maxLength={200}
              editable={!isLoading}
            />
            {errors.title && (
              <Text style={styles.errorText}>{errors.title}</Text>
            )}
            <Text style={styles.charCount}>{formData.title.length}/200</Text>
          </View>

          {/* Contenido */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>{t('Contenido')}</Text>
            <TextInput
              style={[styles.contentInput, errors.content && styles.inputError]}
              value={formData.content}
              onChangeText={(text) => updateField('content', text)}
              placeholder={t('Escribe el contenido del post...')}
              placeholderTextColor={colorScheme === 'dark' ? '#666' : '#999'}
              multiline
              numberOfLines={8}
              maxLength={5000}
              textAlignVertical="top"
              editable={!isLoading}
            />
            {errors.content && (
              <Text style={styles.errorText}>{errors.content}</Text>
            )}
            <Text style={styles.charCount}>{formData.content.length}/5000</Text>
          </View>

          {/* Tags */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>{t('Tags')}</Text>
            <TextInput
              style={[styles.tagsInput, errors.tags && styles.inputError]}
              value={formData.tags}
              onChangeText={(text) => updateField('tags', text)}
              placeholder={t('Ej: fitness, entrenamiento, motivación')}
              placeholderTextColor={colorScheme === 'dark' ? '#666' : '#999'}
              maxLength={500}
              editable={!isLoading}
            />
            {errors.tags && <Text style={styles.errorText}>{errors.tags}</Text>}
            <Text style={styles.charCount}>{formData.tags.length}/500</Text>
          </View>

          {/* Visibilidad */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>{t('Visibilidad')}</Text>
            <View style={styles.visibilityContainer}>
              <TouchableOpacity
                style={[
                  styles.visibilityButton,
                  formData.isPublic && styles.visibilityButtonActive,
                ]}
                onPress={() => updateField('isPublic', true)}
                disabled={isLoading}
              >
                <Text
                  style={[
                    styles.visibilityText,
                    formData.isPublic && styles.visibilityTextActive,
                  ]}
                >
                  🌍 {t('Público')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.visibilityButton,
                  !formData.isPublic && styles.visibilityButtonActive,
                ]}
                onPress={() => updateField('isPublic', false)}
                disabled={isLoading}
              >
                <Text
                  style={[
                    styles.visibilityText,
                    !formData.isPublic && styles.visibilityTextActive,
                  ]}
                >
                  🔒 {t('Privado')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Preview (TODO: Implementar) */}
          {previewMode && (
            <View style={styles.previewContainer}>
              <Text style={styles.previewTitle}>{t('Vista previa')}</Text>
              <View style={styles.previewContent}>
                <Text style={styles.previewPostTitle}>{formData.title}</Text>
                <Text style={styles.previewPostContent}>
                  {formData.content}
                </Text>
                {formData.tags && (
                  <Text style={styles.previewTags}>Tags: {formData.tags}</Text>
                )}
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const createStyles = (colorScheme: 'light' | 'dark') => {
  const isDark = colorScheme === 'dark';

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#000' : '#fff',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#333' : '#e0e0e0',
    },
    headerButton: {
      minWidth: 70,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#fff' : '#000',
    },
    cancelText: {
      fontSize: 16,
      color: isDark ? '#ccc' : '#666',
    },
    saveText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FF6B35',
      textAlign: 'right',
    },
    saveTextDisabled: {
      color: isDark ? '#555' : '#ccc',
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
    },
    fieldContainer: {
      marginVertical: 16,
    },
    fieldLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#fff' : '#000',
      marginBottom: 8,
    },
    titleInput: {
      fontSize: 18,
      fontWeight: '500',
      color: isDark ? '#fff' : '#000',
      backgroundColor: isDark ? '#222' : '#f8f8f8',
      borderWidth: 1,
      borderColor: isDark ? '#333' : '#e0e0e0',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    contentInput: {
      fontSize: 16,
      color: isDark ? '#fff' : '#000',
      backgroundColor: isDark ? '#222' : '#f8f8f8',
      borderWidth: 1,
      borderColor: isDark ? '#333' : '#e0e0e0',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 12,
      minHeight: 120,
    },
    tagsInput: {
      fontSize: 16,
      color: isDark ? '#fff' : '#000',
      backgroundColor: isDark ? '#222' : '#f8f8f8',
      borderWidth: 1,
      borderColor: isDark ? '#333' : '#e0e0e0',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    inputError: {
      borderColor: '#e74c3c',
    },
    errorText: {
      fontSize: 14,
      color: '#e74c3c',
      marginTop: 4,
    },
    charCount: {
      fontSize: 12,
      color: isDark ? '#666' : '#999',
      textAlign: 'right',
      marginTop: 4,
    },
    visibilityContainer: {
      flexDirection: 'row',
      gap: 12,
    },
    visibilityButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: isDark ? '#333' : '#e0e0e0',
      backgroundColor: isDark ? '#222' : '#f8f8f8',
      alignItems: 'center',
    },
    visibilityButtonActive: {
      borderColor: '#FF6B35',
      backgroundColor: isDark ? '#2a1f1a' : '#fff5f0',
    },
    visibilityText: {
      fontSize: 16,
      color: isDark ? '#ccc' : '#666',
    },
    visibilityTextActive: {
      color: '#FF6B35',
      fontWeight: '600',
    },
    previewContainer: {
      marginVertical: 16,
      padding: 16,
      backgroundColor: isDark ? '#111' : '#f9f9f9',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: isDark ? '#333' : '#e0e0e0',
    },
    previewTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#fff' : '#000',
      marginBottom: 12,
    },
    previewContent: {
      backgroundColor: isDark ? '#222' : '#fff',
      padding: 12,
      borderRadius: 8,
    },
    previewPostTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#fff' : '#000',
      marginBottom: 8,
    },
    previewPostContent: {
      fontSize: 16,
      color: isDark ? '#ccc' : '#333',
      lineHeight: 22,
    },
    previewTags: {
      fontSize: 14,
      color: isDark ? '#999' : '#666',
      fontStyle: 'italic',
      marginTop: 8,
    },
  });
};
