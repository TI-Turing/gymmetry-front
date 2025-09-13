import React, { useState, useCallback } from 'react';
import { TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Text } from '@/components/Themed';
import { useColorScheme } from '../useColorScheme';
import { ReportModal, ReportSubmission } from './ReportModal';
import { useI18n } from '../../hooks/useI18n';

export interface ReportButtonProps {
  contentId: string;
  contentType: 'post' | 'comment' | 'user' | 'media';
  onReportSubmitted?: (report: ReportSubmission) => void;
  showText?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const ReportButton: React.FC<ReportButtonProps> = ({
  contentId,
  contentType,
  onReportSubmitted,
  showText = true,
  size = 'medium',
}) => {
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme, size);
  const { t } = useI18n();
  const [showReportModal, setShowReportModal] = useState(false);

  const handleReportPress = useCallback(() => {
    // Mostrar confirmación antes de abrir el modal de reporte
    Alert.alert(
      t('Reportar contenido'),
      t('¿Estás seguro de que deseas reportar este contenido?'),
      [
        {
          text: t('Cancelar'),
          style: 'cancel',
        },
        {
          text: t('Continuar'),
          onPress: () => setShowReportModal(true),
        },
      ]
    );
  }, [t]);

  const handleReportSubmit = useCallback(
    async (report: ReportSubmission) => {
      try {
        // Aquí se haría la llamada a la API para enviar el reporte
        // await reportService.submitReport(report);

        // Simular envío exitoso
        // Report submitted successfully

        // Notificar al padre
        onReportSubmitted?.(report);

        // Mostrar confirmación adicional si es necesario
        // Alert.alert(
        //   t('Reporte enviado'),
        //   t('Gracias por tu reporte. Lo revisaremos pronto.')
        // );
      } catch (error) {
        // Error submitting report
        throw error; // Re-throw para que el modal maneje el error
      }
    },
    [onReportSubmitted]
  );

  return (
    <>
      <TouchableOpacity
        style={styles.reportButton}
        onPress={handleReportPress}
        activeOpacity={0.7}
      >
        <Text style={styles.reportIcon}>🚨</Text>
        {showText && <Text style={styles.reportText}>{t('Reportar')}</Text>}
      </TouchableOpacity>

      <ReportModal
        visible={showReportModal}
        contentId={contentId}
        contentType={contentType}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleReportSubmit}
      />
    </>
  );
};

const createStyles = (
  colorScheme: 'light' | 'dark',
  size: 'small' | 'medium' | 'large'
) => {
  const isDark = colorScheme === 'dark';

  // Tamaños según el prop size
  const sizeConfig = {
    small: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      fontSize: 12,
      iconSize: 14,
    },
    medium: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      fontSize: 14,
      iconSize: 16,
    },
    large: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      fontSize: 16,
      iconSize: 18,
    },
  };

  const config = sizeConfig[size];

  return StyleSheet.create({
    reportButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: config.paddingHorizontal,
      paddingVertical: config.paddingVertical,
      borderRadius: 16,
      backgroundColor: isDark ? '#2a1a1a' : '#fff0f0',
      borderWidth: 1,
      borderColor: isDark ? '#4a2a2a' : '#ffd0d0',
      alignSelf: 'flex-start',
    },
    reportIcon: {
      fontSize: config.iconSize,
      marginRight: 4,
    },
    reportText: {
      fontSize: config.fontSize,
      color: isDark ? '#ff8a8a' : '#cc4444',
      fontWeight: '500',
    },
  });
};
