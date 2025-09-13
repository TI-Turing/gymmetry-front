import React, { useState } from 'react';
import { TouchableOpacity, Text, Alert } from 'react-native';
import MediaUploadModal from './MediaUploadModal';
import { mediaUploadService } from '../../services/mediaUploadServiceSimple';
import type { MediaUploadResponse } from '../../services/mediaUploadServiceSimple';

interface MediaFile {
  uri: string;
  type: 'image' | 'video';
  name: string;
  size?: number;
  mimeType?: string;
}

interface MediaUploadButtonProps {
  onMediaUploaded?: (uploadedFiles: MediaUploadResponse[]) => void;
  feedId?: string;
  maxFiles?: number;
  disabled?: boolean;
}

const MediaUploadButton: React.FC<MediaUploadButtonProps> = ({
  onMediaUploaded,
  feedId,
  maxFiles = 5,
  disabled = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    [fileIndex: number]: number;
  }>({});

  const handleMediaSelected = async (mediaFiles: MediaFile[]) => {
    if (mediaFiles.length === 0) return;

    setUploading(true);
    setUploadProgress({});

    try {
      // Convertir archivos de media a requests de upload
      const uploadRequests = await Promise.all(
        mediaFiles.map(async (media, _index) => {
          try {
            // Para React Native, necesitamos convertir URI a File
            const file = await mediaUploadService.uriToFile(
              media.uri,
              media.name,
              media.mimeType || 'image/jpeg'
            );

            // Comprimir imágenes si es necesario
            const finalFile =
              media.type === 'image' && file.size > 2 * 1024 * 1024
                ? await mediaUploadService.compressImage(file)
                : file;

            return {
              file: finalFile,
              fileName: media.name,
              contentType: finalFile.type,
              feedId,
            };
          } catch (error) {
            Alert.alert(
              'Error',
              `No se pudo procesar el archivo ${media.name}`
            );
            throw error;
          }
        })
      );

      // Callback de progreso
      const onProgress = (fileIndex: number, progress: number) => {
        setUploadProgress((prev) => ({
          ...prev,
          [fileIndex]: progress,
        }));
      };

      // Subir archivos
      const result = await mediaUploadService.uploadMultipleMedia(
        uploadRequests,
        onProgress
      );

      if (result.Success && result.Data) {
        Alert.alert(
          'Éxito',
          result.Message || 'Archivos subidos correctamente'
        );
        onMediaUploaded?.(result.Data);
      } else {
        Alert.alert('Error', result.Message || 'Error al subir archivos');
      }
    } catch (error) {
      Alert.alert('Error', 'Error inesperado al procesar los archivos');
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  };

  const getProgressText = () => {
    const progresses = Object.values(uploadProgress);
    if (progresses.length === 0) return '';

    const avgProgress =
      progresses.reduce((a, b) => a + b, 0) / progresses.length;
    return ` (${Math.round(avgProgress)}%)`;
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.uploadButton, disabled && styles.disabledButton]}
        onPress={() => setModalVisible(true)}
        disabled={disabled || uploading}
      >
        <Text style={styles.uploadIcon}>📷</Text>
        <Text style={[styles.uploadText, disabled && styles.disabledText]}>
          {uploading ? `Subiendo${getProgressText()}` : 'Subir Media'}
        </Text>
      </TouchableOpacity>

      <MediaUploadModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onMediaSelected={handleMediaSelected}
        maxFiles={maxFiles}
      />
    </>
  );
};

const styles = {
  uploadButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: '#FF6B35',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    margin: 8,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  uploadIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  uploadText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  disabledText: {
    color: '#999',
  },
};

export default MediaUploadButton;
