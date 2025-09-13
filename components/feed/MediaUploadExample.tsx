import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { EnhancedMediaUploadModal } from './EnhancedMediaUploadModal';
import type { ProcessedMediaFile } from './EnhancedMediaUploadModal';
import Colors from '@/constants/Colors';

/**
 * Ejemplo de integración del sistema de carga de medios mejorado
 * Muestra las nuevas funcionalidades implementadas:
 * - Preview de imágenes con información detallada
 * - Selección múltiple (hasta 10 archivos por defecto)
 * - Validación de tamaño de archivos (50MB máximo por defecto)
 * - Progress bar durante la "subida" (simulada)
 * - Compresión automática de imágenes grandes
 * - Soporte para diferentes formatos (JPEG, PNG, MP4)
 * - Interfaz mejorada con estadísticas en tiempo real
 */

interface MediaUploadExampleProps {
  onMediaUploaded?: (media: ProcessedMediaFile[]) => void;
}

export const MediaUploadExample: React.FC<MediaUploadExampleProps> = ({
  onMediaUploaded,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [uploadedMedia, setUploadedMedia] = useState<ProcessedMediaFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleMediaSelected = (media: ProcessedMediaFile[]) => {
    setUploadedMedia(media);
    onMediaUploaded?.(media);

    // Aquí conectarías con el servicio real de upload
    // mediaUploadService.uploadMultiple(media, (progress) => setUploadProgress(progress))
  };

  const handleUploadProgress = (progress: number) => {
    setUploadProgress(progress);
  };

  const openMediaPicker = () => {
    setModalVisible(true);
  };

  const getTotalSize = (): string => {
    if (uploadedMedia.length === 0) return '0';
    const totalBytes = uploadedMedia.reduce(
      (sum, media) => sum + media.size,
      0
    );
    return (totalBytes / (1024 * 1024)).toFixed(1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sistema de Carga de Medios Mejorado</Text>
        <Text style={styles.subtitle}>
          Con preview, selección múltiple, compresión y validación
        </Text>
      </View>

      {/* Botón para abrir el selector */}
      <TouchableOpacity style={styles.openButton} onPress={openMediaPicker}>
        <Text style={styles.openButtonText}>📸 Seleccionar Fotos y Videos</Text>
      </TouchableOpacity>

      {/* Estadísticas de archivos seleccionados */}
      {uploadedMedia.length > 0 && (
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Archivos Seleccionados</Text>
          <Text style={styles.statsText}>
            {uploadedMedia.length} archivo
            {uploadedMedia.length !== 1 ? 's' : ''} • {getTotalSize()} MB
          </Text>

          {/* Lista de archivos */}
          <View style={styles.filesList}>
            {uploadedMedia.map((media, index) => (
              <View key={index} style={styles.fileItem}>
                <Text style={styles.fileName}>
                  {media.type === 'video' ? '🎥' : '📷'} {media.name}
                </Text>
                <Text style={styles.fileSize}>
                  {(media.size / (1024 * 1024)).toFixed(1)} MB
                  {media.compressed && ' • Comprimido'}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Progress durante upload */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Subiendo archivos...</Text>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${uploadProgress}%` }]}
            />
          </View>
          <Text style={styles.progressText}>{uploadProgress}%</Text>
        </View>
      )}

      {/* Modal del selector de medios */}
      <EnhancedMediaUploadModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onMediaSelected={handleMediaSelected}
        onUploadProgress={handleUploadProgress}
        maxFiles={10}
        maxFileSize={50} // 50MB
        allowedTypes={['image', 'video']}
        allowCrop={true}
        compressionQuality="auto"
        title="Seleccionar Medios"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors.light.background,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  openButton: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  openButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  statsCard: {
    backgroundColor: '#F7F7F7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  statsText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  filesList: {
    gap: 8,
  },
  fileItem: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  fileName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 12,
    color: '#6B7280',
  },
  progressCard: {
    backgroundColor: '#FFF7ED',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FED7AA',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#C2410C',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#FED7AA',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.light.tint,
  },
  progressText: {
    fontSize: 12,
    color: '#C2410C',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default MediaUploadExample;
