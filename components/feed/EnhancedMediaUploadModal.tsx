import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  StyleSheet,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome5 } from '@expo/vector-icons';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { useImageQualityParams } from '@/utils/imageHelper';
import Colors from '@/constants/Colors';

interface EnhancedMediaUploadModalProps {
  visible: boolean;
  onClose: () => void;
  onMediaSelected: (media: ProcessedMediaFile[]) => void;
  onUploadProgress?: (progress: number) => void;
  maxFiles?: number;
  maxFileSize?: number; // En MB
  allowedTypes?: ('image' | 'video')[];
  allowCrop?: boolean;
  compressionQuality?: 'low' | 'medium' | 'high' | 'auto';
  title?: string;
}

export interface ProcessedMediaFile {
  uri: string;
  type: 'image' | 'video';
  name: string;
  size: number;
  mimeType: string;
  width?: number;
  height?: number;
  compressed?: boolean;
  originalSize?: number;
}

export const EnhancedMediaUploadModal: React.FC<
  EnhancedMediaUploadModalProps
> = ({
  visible,
  onClose,
  onMediaSelected,
  onUploadProgress,
  maxFiles = 10,
  maxFileSize = 50,
  allowedTypes = ['image', 'video'],
  allowCrop = true,
  compressionQuality: _compressionQuality = 'auto',
  title = 'Seleccionar medios',
}) => {
  const [selectedMedia, setSelectedMedia] = useState<ProcessedMediaFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Hook para parámetros de calidad de imagen
  const imageQualityParams = useImageQualityParams(1920, 1080);

  const requestPermissions = async (): Promise<boolean> => {
    if (Platform.OS !== 'web') {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permisos requeridos',
          'Se necesitan permisos para acceder a la galería'
        );
        return false;
      }
    }
    return true;
  };

  const processMediaFile = async (
    asset: ImagePicker.ImagePickerAsset
  ): Promise<ProcessedMediaFile | null> => {
    try {
      const fileSize = asset.fileSize || 0;
      const fileSizeMB = fileSize / (1024 * 1024);

      if (fileSizeMB > maxFileSize) {
        Alert.alert(
          'Archivo muy grande',
          `El archivo es muy grande (${fileSizeMB.toFixed(1)}MB). El tamaño máximo es ${maxFileSize}MB.`
        );
        return null;
      }

      return {
        uri: asset.uri,
        type: asset.type === 'video' ? 'video' : 'image',
        name:
          asset.fileName ||
          `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        size: fileSize,
        mimeType:
          asset.mimeType ||
          (asset.type === 'video' ? 'video/mp4' : 'image/jpeg'),
        width: asset.width,
        height: asset.height,
        compressed: false,
      };
    } catch (error) {
      // Error processing media file
      return null;
    }
  };

  const pickFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setProcessing(true);

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: allowedTypes.includes('video')
          ? ImagePicker.MediaTypeOptions.All
          : ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: imageQualityParams.quality,
        allowsEditing: false,
        selectionLimit: maxFiles - selectedMedia.length,
      });

      if (!result.canceled) {
        const processedFiles: ProcessedMediaFile[] = [];

        for (const asset of result.assets) {
          const processed = await processMediaFile(asset);
          if (processed) {
            processedFiles.push(processed);
          }
        }

        if (processedFiles.length > 0) {
          const totalFiles = selectedMedia.length + processedFiles.length;
          if (totalFiles > maxFiles) {
            Alert.alert(
              'Límite excedido',
              `Solo puedes seleccionar hasta ${maxFiles} archivos`
            );
            processedFiles.splice(maxFiles - selectedMedia.length);
          }

          setSelectedMedia((prev) => [...prev, ...processedFiles]);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo acceder a la galería');
    } finally {
      setProcessing(false);
    }
  };

  const pickFromCamera = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permisos requeridos',
          'Se necesitan permisos para usar la cámara'
        );
        return;
      }
    }

    setProcessing(true);

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: allowedTypes.includes('video')
          ? ImagePicker.MediaTypeOptions.All
          : ImagePicker.MediaTypeOptions.Images,
        quality: imageQualityParams.quality,
        allowsEditing: allowCrop,
      });

      if (!result.canceled && result.assets[0]) {
        if (selectedMedia.length >= maxFiles) {
          Alert.alert(
            'Límite excedido',
            `Solo puedes seleccionar hasta ${maxFiles} archivos`
          );
          return;
        }

        const processed = await processMediaFile(result.assets[0]);
        if (processed) {
          setSelectedMedia((prev) => [...prev, processed]);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo usar la cámara');
    } finally {
      setProcessing(false);
    }
  };

  const removeMedia = (index: number) => {
    setSelectedMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConfirm = async () => {
    if (selectedMedia.length === 0) {
      Alert.alert('Sin selección', 'Selecciona al menos un archivo');
      return;
    }

    if (onUploadProgress) {
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }

    onMediaSelected(selectedMedia);
    handleClose();
  };

  const handleClose = () => {
    setSelectedMedia([]);
    setUploadProgress(0);
    onClose();
  };

  const getTotalSize = (): string => {
    const totalBytes = selectedMedia.reduce(
      (sum, media) => sum + media.size,
      0
    );
    return (totalBytes / (1024 * 1024)).toFixed(1);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <FontAwesome5 name="times" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity
            onPress={handleConfirm}
            style={[
              styles.confirmButton,
              selectedMedia.length === 0 && styles.confirmButtonDisabled,
            ]}
            disabled={selectedMedia.length === 0}
          >
            <Text
              style={[
                styles.confirmButtonText,
                selectedMedia.length === 0 && styles.confirmButtonTextDisabled,
              ]}
            >
              Confirmar ({selectedMedia.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Estadísticas */}
        {selectedMedia.length > 0 && (
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              {selectedMedia.length} de {maxFiles} archivos • {getTotalSize()}{' '}
              MB
            </Text>
          </View>
        )}

        {/* Botones de acción */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={pickFromGallery}
            disabled={processing}
          >
            <FontAwesome5 name="images" size={24} color="#007AFF" />
            <Text style={styles.actionButtonText}>Galería</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={pickFromCamera}
            disabled={processing}
          >
            <FontAwesome5 name="camera" size={24} color="#007AFF" />
            <Text style={styles.actionButtonText}>Cámara</Text>
          </TouchableOpacity>
        </View>

        {/* Loading indicator */}
        {processing && (
          <View style={styles.processingContainer}>
            <LoadingSpinner size="small" />
            <Text style={styles.processingText}>Procesando archivos...</Text>
          </View>
        )}

        {/* Progress bar */}
        {onUploadProgress && uploadProgress > 0 && uploadProgress < 100 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${uploadProgress}%` }]}
              />
            </View>
            <Text style={styles.progressText}>{uploadProgress}%</Text>
          </View>
        )}

        {/* Lista de medios seleccionados */}
        <ScrollView
          style={styles.mediaList}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.mediaGrid}>
            {selectedMedia.map((media, index) => (
              <View
                key={`${media.uri}-${index}`}
                style={styles.mediaPreviewItem}
              >
                <View style={styles.mediaPreview}>
                  <Image
                    source={{ uri: media.uri }}
                    style={styles.mediaImage}
                  />

                  {/* Overlay con información */}
                  <View style={styles.mediaOverlay}>
                    <View style={styles.mediaInfo}>
                      <FontAwesome5
                        name={media.type === 'video' ? 'play-circle' : 'image'}
                        size={16}
                        color="white"
                      />
                      <Text style={styles.mediaSize}>
                        {formatFileSize(media.size)}
                      </Text>
                    </View>

                    {media.compressed && (
                      <View style={styles.compressedBadge}>
                        <FontAwesome5
                          name="compress-alt"
                          size={12}
                          color="white"
                        />
                      </View>
                    )}
                  </View>
                </View>

                {/* Botón de eliminar */}
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeMedia(index)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <FontAwesome5 name="times-circle" size={20} color="#FF4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Empty state */}
        {selectedMedia.length === 0 && !processing && (
          <View style={styles.emptyState}>
            <FontAwesome5 name="photo-video" size={64} color="#CCC" />
            <Text style={styles.emptyStateTitle}>
              Sin archivos seleccionados
            </Text>
            <Text style={styles.emptyStateText}>
              Toca "Galería" o "Cámara" para añadir fotos o videos
            </Text>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: Colors.light.background,
  },
  closeButton: {
    padding: 8,
    width: 80,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    flex: 1,
    textAlign: 'center',
  },
  confirmButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.light.tint,
    borderRadius: 8,
    width: 120,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: Colors.light.tabIconDefault,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  confirmButtonTextDisabled: {
    color: '#999',
  },
  statsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F7F7F7',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  statsText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16,
    backgroundColor: Colors.light.background,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#F7F7F7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  processingText: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.light.tint,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    minWidth: 35,
    textAlign: 'right',
  },
  mediaList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingVertical: 16,
  },
  mediaPreviewItem: {
    width: '48%',
    aspectRatio: 1,
    position: 'relative',
  },
  mediaPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  mediaOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mediaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mediaSize: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  compressedBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'white',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default EnhancedMediaUploadModal;
