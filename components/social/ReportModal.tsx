import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomAlert } from '../common/CustomAlert';
import Colors from '@/constants/Colors';
import { useI18n } from '../../hooks/useI18n';
import { useColorScheme } from '../useColorScheme';
import { useReportRateLimit } from '../../hooks/useReportRateLimit';
import { reportContentService } from '@/services';
import {
  ContentType,
  ReportReason,
  ReportPriority,
  ReportReasonLabels,
} from '@/models/ReportContent';
import { reportModalStyles } from './styles/reportModalStyles';

interface ReportModalProps {
  visible: boolean;
  onClose: () => void;
  contentId: string;
  contentType: ContentType;
  contentPreview?: string;
  onReportSubmitted?: () => void;
}

const REPORT_CONSTANTS = {
  MAX_DESCRIPTION_LENGTH: 500,
  MIN_DESCRIPTION_LENGTH: 10,
} as const;

export const ReportModal: React.FC<ReportModalProps> = ({
  visible,
  onClose,
  contentId,
  contentType,
  contentPreview,
  onReportSubmitted,
}) => {
  const { t } = useI18n();
  const colorScheme = useColorScheme();
  const styles = reportModalStyles(colorScheme);
  const { rateLimit, decrementReportCount } = useReportRateLimit();

  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(
    null
  );
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<ReportPriority>(
    ReportPriority.Medium
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'info' as 'info' | 'warning' | 'error' | 'success',
  });

  const showAlert = (
    title: string,
    message: string,
    type: 'info' | 'warning' | 'error' | 'success' = 'info'
  ) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      type,
    });
  };

  const hideAlert = () => {
    setAlertConfig((prev) => ({ ...prev, visible: false }));
  };

  const resetForm = () => {
    setSelectedReason(null);
    setDescription('');
    setPriority(ReportPriority.Medium);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateForm = (): boolean => {
    if (!selectedReason) {
      showAlert(
        t('reportModal.validation.title'),
        t('reportModal.validation.reasonRequired'),
        'warning'
      );
      return false;
    }

    if (description.trim().length < REPORT_CONSTANTS.MIN_DESCRIPTION_LENGTH) {
      showAlert(
        t('reportModal.validation.title'),
        `${t('reportModal.validation.descriptionTooShort')} (${REPORT_CONSTANTS.MIN_DESCRIPTION_LENGTH})`,
        'warning'
      );
      return false;
    }

    if (description.length > REPORT_CONSTANTS.MAX_DESCRIPTION_LENGTH) {
      showAlert(
        t('reportModal.validation.title'),
        `${t('reportModal.validation.descriptionTooLong')} (${REPORT_CONSTANTS.MAX_DESCRIPTION_LENGTH})`,
        'warning'
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    // Check rate limit before submitting
    if (rateLimit.isLimitReached) {
      showAlert(
        t('reportModal.rateLimit.title'),
        t('reportModal.rateLimit.message'),
        'warning'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await reportContentService.addReportContent({
        ContentId: contentId,
        ContentType: contentType,
        ReportReason: selectedReason!,
        Description: description.trim(),
        Priority: priority,
        ReporterUserId: 'current-user-id', // TODO: Get from auth context
      });

      if (response.Success) {
        // Decrement report count after successful submission
        decrementReportCount();

        showAlert(
          t('reportModal.success.title'),
          t('reportModal.success.message'),
          'success'
        );

        setTimeout(() => {
          handleClose();
          onReportSubmitted?.();
        }, 2000);
      } else {
        showAlert(
          t('reportModal.error.title'),
          response.Message || t('reportModal.error.defaultMessage'),
          'error'
        );
      }
    } catch (error) {
      // Error logged for debugging
      showAlert(
        t('reportModal.error.title'),
        t('reportModal.error.networkError'),
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderReasonOption = (reason: ReportReason) => {
    const isSelected = selectedReason === reason;

    return (
      <TouchableOpacity
        key={reason}
        style={[styles.reasonOption, isSelected && styles.reasonOptionSelected]}
        onPress={() => setSelectedReason(reason)}
        disabled={isSubmitting}
      >
        <View style={styles.reasonOptionContent}>
          <Text
            style={[
              styles.reasonOptionText,
              isSelected && styles.reasonOptionTextSelected,
            ]}
          >
            {ReportReasonLabels[reason]}
          </Text>
          {isSelected && (
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={Colors[colorScheme].tint}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderPriorityOption = (
    priorityOption: ReportPriority,
    label: string
  ) => {
    const isSelected = priority === priorityOption;

    return (
      <TouchableOpacity
        key={priorityOption}
        style={[
          styles.priorityOption,
          isSelected && styles.priorityOptionSelected,
        ]}
        onPress={() => setPriority(priorityOption)}
        disabled={isSubmitting}
      >
        <Text
          style={[
            styles.priorityOptionText,
            isSelected && styles.priorityOptionTextSelected,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleClose}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={handleClose}
              style={styles.closeButton}
              disabled={isSubmitting}
            >
              <Ionicons
                name="close"
                size={24}
                color={Colors[colorScheme].text}
              />
            </TouchableOpacity>
            <Text style={styles.title}>{t('reportModal.title')}</Text>
            <TouchableOpacity
              onPress={handleSubmit}
              style={[
                styles.submitButton,
                (!selectedReason ||
                  description.trim().length <
                    REPORT_CONSTANTS.MIN_DESCRIPTION_LENGTH ||
                  isSubmitting ||
                  rateLimit.isLimitReached) &&
                  styles.submitButtonDisabled,
              ]}
              disabled={
                !selectedReason ||
                description.trim().length <
                  REPORT_CONSTANTS.MIN_DESCRIPTION_LENGTH ||
                isSubmitting ||
                rateLimit.isLimitReached
              }
            >
              {isSubmitting ? (
                <ActivityIndicator
                  size="small"
                  color={Colors[colorScheme].background}
                />
              ) : (
                <Text style={styles.submitButtonText}>
                  {t('reportModal.submit')}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Rate Limit Indicator */}
          {rateLimit.remainingReports <= 3 && (
            <View style={styles.rateLimitContainer}>
              <Ionicons
                name="warning-outline"
                size={16}
                color={Colors[colorScheme].warning}
              />
              <Text style={styles.rateLimitText}>
                {rateLimit.isLimitReached
                  ? t('reportModal.rateLimit.reached')
                  : `${t('reportModal.rateLimit.warning')} ${
                      rateLimit.remainingReports
                    }`}
              </Text>
            </View>
          )}

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Content Preview */}
            {contentPreview && (
              <View style={styles.previewSection}>
                <Text style={styles.sectionTitle}>
                  {t('reportModal.contentPreview')}
                </Text>
                <View style={styles.previewContainer}>
                  <Text style={styles.previewText} numberOfLines={3}>
                    {contentPreview}
                  </Text>
                </View>
              </View>
            )}

            {/* Report Reason */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {t('reportModal.reasonTitle')}{' '}
                <Text style={styles.required}>*</Text>
              </Text>
              <Text style={styles.sectionDescription}>
                {t('reportModal.reasonDescription')}
              </Text>
              <View style={styles.reasonList}>
                {(Object.values(ReportReason) as ReportReason[]).map(
                  renderReasonOption
                )}
              </View>
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {t('reportModal.descriptionTitle')}{' '}
                <Text style={styles.required}>*</Text>
              </Text>
              <Text style={styles.sectionDescription}>
                {t('reportModal.descriptionDescription')}
              </Text>
              <TextInput
                style={styles.textInput}
                value={description}
                onChangeText={setDescription}
                placeholder={t('reportModal.descriptionPlaceholder')}
                placeholderTextColor={Colors[colorScheme].textMuted}
                multiline
                numberOfLines={4}
                maxLength={REPORT_CONSTANTS.MAX_DESCRIPTION_LENGTH}
                editable={!isSubmitting}
                textAlignVertical="top"
              />
              <Text style={styles.characterCount}>
                {description.length} / {REPORT_CONSTANTS.MAX_DESCRIPTION_LENGTH}
              </Text>
            </View>

            {/* Priority */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {t('reportModal.priorityTitle')}
              </Text>
              <Text style={styles.sectionDescription}>
                {t('reportModal.priorityDescription')}
              </Text>
              <View style={styles.priorityList}>
                {renderPriorityOption(
                  ReportPriority.Low,
                  t('reportModal.priority.low')
                )}
                {renderPriorityOption(
                  ReportPriority.Medium,
                  t('reportModal.priority.medium')
                )}
                {renderPriorityOption(
                  ReportPriority.High,
                  t('reportModal.priority.high')
                )}
              </View>
            </View>

            {/* Guidelines */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {t('reportModal.guidelinesTitle')}
              </Text>
              <Text style={styles.guidelinesText}>
                {t('reportModal.guidelinesText')}
              </Text>
            </View>
          </ScrollView>
        </View>
      </Modal>

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={hideAlert}
      />
    </>
  );
};
