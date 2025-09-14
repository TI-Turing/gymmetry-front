import React, { useState } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '../useColorScheme';
import { useI18n } from '../../hooks/useI18n';
import { ReportModal } from './ReportModal';
import { ContentType } from '@/models/ReportContent';
import { reportButtonStyles } from './styles/reportButtonStyles';

interface ReportButtonProps {
  contentId: string;
  contentType: ContentType;
  contentPreview?: string;
  style?: 'icon' | 'text' | 'compact';
  size?: 'small' | 'medium' | 'large';
  onReportSubmitted?: () => void;
  disabled?: boolean;
}

export const ReportButton: React.FC<ReportButtonProps> = ({
  contentId,
  contentType,
  contentPreview,
  style = 'icon',
  size = 'medium',
  onReportSubmitted,
  disabled = false,
}) => {
  const { t } = useI18n();
  const colorScheme = useColorScheme();
  const styles = reportButtonStyles(colorScheme, size);
  const [showReportModal, setShowReportModal] = useState(false);

  const handlePress = () => {
    if (disabled) return;
    setShowReportModal(true);
  };

  const handleReportSubmitted = () => {
    setShowReportModal(false);
    onReportSubmitted?.();
  };

  const renderIcon = () => (
    <Ionicons
      name="flag-outline"
      size={styles.icon.fontSize}
      color={
        disabled ? Colors[colorScheme].textMuted : Colors[colorScheme].text
      }
    />
  );

  const renderContent = () => {
    switch (style) {
      case 'text':
        return (
          <Text style={[styles.text, disabled && styles.textDisabled]}>
            {t('reportButton.report')}
          </Text>
        );

      case 'compact':
        return (
          <View style={styles.compactContent}>
            {renderIcon()}
            <Text style={[styles.compactText, disabled && styles.textDisabled]}>
              {t('reportButton.report')}
            </Text>
          </View>
        );

      case 'icon':
      default:
        return renderIcon();
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.container, disabled && styles.containerDisabled]}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.7}
        accessibilityLabel={t('reportButton.accessibilityLabel')}
        accessibilityHint={t('reportButton.accessibilityHint')}
        accessibilityRole="button"
      >
        {renderContent()}
      </TouchableOpacity>

      <ReportModal
        visible={showReportModal}
        onClose={() => setShowReportModal(false)}
        contentId={contentId}
        contentType={contentType}
        contentPreview={contentPreview}
        onReportSubmitted={handleReportSubmitted}
      />
    </>
  );
};
