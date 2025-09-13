import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useColorScheme } from '../useColorScheme';
import { useI18n } from '../../hooks/useI18n';

export interface ReportCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface ReportModalProps {
  visible: boolean;
  contentId: string;
  contentType: 'post' | 'comment' | 'user' | 'media';
  onClose: () => void;
  onSubmit: (report: ReportSubmission) => Promise<void>;
}

export interface ReportSubmission {
  contentId: string;
  contentType: string;
  categoryId: string;
  description?: string;
  anonymous: boolean;
}

const REPORT_CATEGORIES: ReportCategory[] = [
  {
    id: 'spam',
    name: 'Spam',
    icon: '🚫',
    description: 'Contenido repetitivo, promocional no deseado o irrelevante',
  },
  {
    id: 'harassment',
    name: 'Acoso o bullying',
    icon: '😡',
    description: 'Comportamiento abusivo, intimidación o acoso',
  },
  {
    id: 'inappropriate',
    name: 'Contenido inapropiado',
    icon: '⚠️',
    description: 'Material ofensivo, explícito o no adecuado',
  },
  {
    id: 'misinformation',
    name: 'Información falsa',
    icon: '❌',
    description: 'Noticias falsas, desinformación o contenido engañoso',
  },
  {
    id: 'hate_speech',
    name: 'Discurso de odio',
    icon: '💢',
    description: 'Contenido que promueve odio hacia grupos o individuos',
  },
  {
    id: 'violence',
    name: 'Violencia',
    icon: '⚔️',
    description: 'Amenazas, violencia física o contenido peligroso',
  },
  {
    id: 'impersonation',
    name: 'Suplantación',
    icon: '🎭',
    description: 'Hacerse pasar por otra persona u organización',
  },
  {
    id: 'copyright',
    name: 'Derechos de autor',
    icon: '©️',
    description: 'Uso no autorizado de contenido protegido',
  },
  {
    id: 'other',
    name: 'Otro',
    icon: '❓',
    description: 'Otro motivo no listado anteriormente',
  },
];

export const ReportModal: React.FC<ReportModalProps> = ({
  visible,
  contentId,
  contentType,
  onClose,
  onSubmit,
}) => {
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);
  const { t } = useI18n();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [description, setDescription] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'category' | 'details' | 'confirmation'>(
    'category'
  );

  // Resetear estado cuando se cierra/abre el modal
  React.useEffect(() => {
    if (visible) {
      setSelectedCategoryId('');
      setDescription('');
      setAnonymous(false);
      setIsSubmitting(false);
      setStep('category');
    }
  }, [visible]);

  const selectedCategory = REPORT_CATEGORIES.find(
    (cat) => cat.id === selectedCategoryId
  );

  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setStep('details');
  }, []);

  const handleBack = useCallback(() => {
    if (step === 'details') {
      setStep('category');
    } else if (step === 'confirmation') {
      setStep('details');
    }
  }, [step]);

  const handleSubmitReport = useCallback(async () => {
    if (!selectedCategoryId) {
      Alert.alert(t('Error'), t('Por favor selecciona una categoría'));
      return;
    }

    setIsSubmitting(true);

    try {
      const report: ReportSubmission = {
        contentId,
        contentType,
        categoryId: selectedCategoryId,
        description: description.trim() || undefined,
        anonymous,
      };

      await onSubmit(report);
      setStep('confirmation');
    } catch (error) {
      Alert.alert(
        t('Error'),
        t('No se pudo enviar el reporte. Inténtalo de nuevo.')
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [
    selectedCategoryId,
    contentId,
    contentType,
    description,
    anonymous,
    onSubmit,
    t,
  ]);

  const handleCloseConfirmation = useCallback(() => {
    onClose();
  }, [onClose]);

  const renderCategoryStep = () => (
    <>
      <Text style={styles.title}>{t('¿Por qué reportas este contenido?')}</Text>
      <Text style={styles.subtitle}>
        {t('Selecciona la categoría que mejor describa el problema')}
      </Text>

      <ScrollView style={styles.categoriesContainer}>
        {REPORT_CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryItem}
            onPress={() => handleCategorySelect(category.id)}
            activeOpacity={0.7}
          >
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryName}>{t(category.name)}</Text>
            </View>
            <Text style={styles.categoryDescription}>
              {t(category.description)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
  );

  const renderDetailsStep = () => (
    <>
      <Text style={styles.title}>{t('Detalles del reporte')}</Text>
      <Text style={styles.subtitle}>
        {t('Categoría')}: {selectedCategory?.icon}{' '}
        {t(selectedCategory?.name || '')}
      </Text>

      <View style={styles.formContainer}>
        {/* Descripción opcional */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>
            {t('Descripción adicional (opcional)')}
          </Text>
          <TextInput
            style={styles.textArea}
            value={description}
            onChangeText={setDescription}
            placeholder={t('Proporciona más detalles sobre el problema...')}
            placeholderTextColor={colorScheme === 'dark' ? '#666' : '#999'}
            multiline
            numberOfLines={4}
            maxLength={500}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{description.length}/500</Text>
        </View>

        {/* Opción anónima */}
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setAnonymous(!anonymous)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, anonymous && styles.checkboxChecked]}>
            {anonymous && <Text style={styles.checkboxIcon}>✓</Text>}
          </View>
          <View style={styles.checkboxTextContainer}>
            <Text style={styles.checkboxLabel}>{t('Reporte anónimo')}</Text>
            <Text style={styles.checkboxDescription}>
              {t('Tu identidad no será compartida con el usuario reportado')}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleBack}
          disabled={isSubmitting}
        >
          <Text style={styles.secondaryButtonText}>{t('Atrás')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleSubmitReport}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.primaryButtonText}>{t('Enviar reporte')}</Text>
          )}
        </TouchableOpacity>
      </View>
    </>
  );

  const renderConfirmationStep = () => (
    <View style={styles.confirmationContainer}>
      <Text style={styles.confirmationIcon}>✅</Text>
      <Text style={styles.confirmationTitle}>
        {t('Reporte enviado exitosamente')}
      </Text>
      <Text style={styles.confirmationMessage}>
        {t(
          'Hemos recibido tu reporte y lo revisaremos pronto. Gracias por ayudarnos a mantener una comunidad segura.'
        )}
      </Text>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleCloseConfirmation}
      >
        <Text style={styles.primaryButtonText}>{t('Cerrar')}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          {step !== 'confirmation' && (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              disabled={isSubmitting}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.headerTitle}>
            {step === 'confirmation'
              ? t('Completado')
              : t('Reportar contenido')}
          </Text>

          <View style={styles.placeholder} />
        </View>

        {/* Contenido */}
        <View style={styles.content}>
          {step === 'category' && renderCategoryStep()}
          {step === 'details' && renderDetailsStep()}
          {step === 'confirmation' && renderConfirmationStep()}
        </View>
      </View>
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
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: isDark ? '#333' : '#f0f0f0',
      justifyContent: 'center',
      alignItems: 'center',
    },
    closeButtonText: {
      fontSize: 18,
      color: isDark ? '#ccc' : '#666',
      fontWeight: '600',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#fff' : '#000',
    },
    placeholder: {
      width: 32,
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
    },
    title: {
      fontSize: 22,
      fontWeight: '700',
      color: isDark ? '#fff' : '#000',
      textAlign: 'center',
      marginVertical: 20,
    },
    subtitle: {
      fontSize: 16,
      color: isDark ? '#ccc' : '#666',
      textAlign: 'center',
      marginBottom: 24,
      lineHeight: 22,
    },
    categoriesContainer: {
      flex: 1,
    },
    categoryItem: {
      backgroundColor: isDark ? '#1a1a1a' : '#f8f8f8',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: isDark ? '#333' : '#e0e0e0',
    },
    categoryHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    categoryIcon: {
      fontSize: 24,
      marginRight: 12,
    },
    categoryName: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#fff' : '#000',
    },
    categoryDescription: {
      fontSize: 14,
      color: isDark ? '#999' : '#666',
      lineHeight: 20,
    },
    formContainer: {
      flex: 1,
    },
    fieldContainer: {
      marginBottom: 24,
    },
    fieldLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#fff' : '#000',
      marginBottom: 8,
    },
    textArea: {
      fontSize: 16,
      color: isDark ? '#fff' : '#000',
      backgroundColor: isDark ? '#222' : '#f8f8f8',
      borderWidth: 1,
      borderColor: isDark ? '#333' : '#e0e0e0',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 12,
      minHeight: 100,
      textAlignVertical: 'top',
    },
    charCount: {
      fontSize: 12,
      color: isDark ? '#666' : '#999',
      textAlign: 'right',
      marginTop: 4,
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingVertical: 16,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: isDark ? '#555' : '#ccc',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
      marginTop: 2,
    },
    checkboxChecked: {
      backgroundColor: '#FF6B35',
      borderColor: '#FF6B35',
    },
    checkboxIcon: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '600',
    },
    checkboxTextContainer: {
      flex: 1,
    },
    checkboxLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#fff' : '#000',
      marginBottom: 4,
    },
    checkboxDescription: {
      fontSize: 14,
      color: isDark ? '#999' : '#666',
      lineHeight: 20,
    },
    actionButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 20,
      gap: 12,
    },
    secondaryButton: {
      flex: 1,
      paddingVertical: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: isDark ? '#555' : '#ccc',
      alignItems: 'center',
    },
    secondaryButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#ccc' : '#666',
    },
    primaryButton: {
      flex: 1,
      paddingVertical: 16,
      borderRadius: 8,
      backgroundColor: '#FF6B35',
      alignItems: 'center',
    },
    primaryButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#fff',
    },
    confirmationContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
    },
    confirmationIcon: {
      fontSize: 64,
      marginBottom: 24,
    },
    confirmationTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: isDark ? '#fff' : '#000',
      textAlign: 'center',
      marginBottom: 16,
    },
    confirmationMessage: {
      fontSize: 16,
      color: isDark ? '#ccc' : '#666',
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: 32,
    },
  });
};
