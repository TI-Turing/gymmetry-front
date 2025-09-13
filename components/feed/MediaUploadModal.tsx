import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
// import * as DocumentPicker from 'expo-document-picker'; // Para futuras funcionalidades
// import { Button } from '../common/Button'; // Para futuras funcionalidades

interface MediaUploadModalProps {
  visible: boolean;
  onClose: () => void;
  onMediaSelected: (media: MediaFile[]) => void;
  maxFiles?: number;
  allowedTypes?: ('image' | 'video')[];
}

interface MediaFile {
  uri: string;
  type: 'image' | 'video';
  name: string;
  size?: number;
  mimeType?: string;
}

const MediaUploadModal: React.FC<MediaUploadModalProps> = ({
  visible,
  onClose,
  onMediaSelected,
  maxFiles = 5,
  allowedTypes = ['image', 'video'],
}) => {
  const [selectedMedia, setSelectedMedia] = useState<MediaFile[]>([]);
  // const [uploading, setUploading] = useState(false); // Para progress bar futuro

  const requestPermissions = async () => {
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

  const pickFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: allowedTypes.includes('video')
          ? ImagePicker.MediaTypeOptions.All
          : ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        allowsEditing: false,
      });

      if (!result.canceled) {
        const newMedia: MediaFile[] = result.assets.map((asset, index) => ({
          uri: asset.uri,
          type: asset.type === 'video' ? 'video' : 'image',
          name: asset.fileName || `media_${Date.now()}_${index}`,
          size: asset.fileSize,
          mimeType: asset.mimeType,
        }));

        const totalFiles = selectedMedia.length + newMedia.length;
        if (totalFiles > maxFiles) {
          Alert.alert(
            'Límite excedido',
            `Solo puedes seleccionar hasta ${maxFiles} archivos`
          );
          return;
        }

        setSelectedMedia((prev) => [...prev, ...newMedia]);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo acceder a la galería');
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

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: allowedTypes.includes('video')
          ? ImagePicker.MediaTypeOptions.All
          : ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const newMedia: MediaFile = {
          uri: asset.uri,
          type: asset.type === 'video' ? 'video' : 'image',
          name: asset.fileName || `camera_${Date.now()}`,
          size: asset.fileSize,
          mimeType: asset.mimeType,
        };

        if (selectedMedia.length >= maxFiles) {
          Alert.alert(
            'Límite excedido',
            `Solo puedes seleccionar hasta ${maxFiles} archivos`
          );
          return;
        }

        setSelectedMedia((prev) => [...prev, newMedia]);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo usar la cámara');
    }
  };

  const removeMedia = (index: number) => {
    setSelectedMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConfirm = () => {
    if (selectedMedia.length === 0) {
      Alert.alert('Sin archivos', 'Selecciona al menos un archivo');
      return;
    }

    onMediaSelected(selectedMedia);
    setSelectedMedia([]);
    onClose();
  };

  const handleCancel = () => {
    setSelectedMedia([]);
    onClose();
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return 'Tamaño desconocido';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel}>
            <Text style={styles.cancelButton}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Seleccionar Media</Text>
          <TouchableOpacity onPress={handleConfirm}>
            <Text
              style={[
                styles.confirmButton,
                selectedMedia.length === 0 && styles.disabledButton,
              ]}
            >
              Confirmar
            </Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={pickFromGallery}
          >
            <Text style={styles.actionIcon}>📱</Text>
            <Text style={styles.actionText}>Galería</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={pickFromCamera}
          >
            <Text style={styles.actionIcon}>📷</Text>
            <Text style={styles.actionText}>Cámara</Text>
          </TouchableOpacity>
        </View>

        {/* Selected Media Preview */}
        <View style={styles.previewContainer}>
          <Text style={styles.previewTitle}>
            Archivos seleccionados ({selectedMedia.length}/{maxFiles})
          </Text>

          <ScrollView
            style={styles.previewScroll}
            showsVerticalScrollIndicator={false}
          >
            {selectedMedia.map((media, index) => (
              <View key={index} style={styles.mediaItem}>
                <View style={styles.mediaPreview}>
                  {media.type === 'image' ? (
                    <Image
                      source={{ uri: media.uri }}
                      style={styles.thumbnail}
                    />
                  ) : (
                    <View style={styles.videoThumbnail}>
                      <Text style={styles.videoIcon}>🎥</Text>
                    </View>
                  )}
                </View>

                <View style={styles.mediaInfo}>
                  <Text style={styles.mediaName} numberOfLines={1}>
                    {media.name}
                  </Text>
                  <Text style={styles.mediaSize}>
                    {formatFileSize(media.size)}
                  </Text>
                  <Text style={styles.mediaType}>
                    {media.type === 'image' ? 'Imagen' : 'Video'}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeMedia(index)}
                >
                  <Text style={styles.removeIcon}>❌</Text>
                </TouchableOpacity>
              </View>
            ))}

            {selectedMedia.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>📎</Text>
                <Text style={styles.emptyText}>
                  No has seleccionado ningún archivo
                </Text>
                <Text style={styles.emptySubtext}>
                  Usa los botones de arriba para agregar fotos o videos
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  cancelButton: {
    color: '#666',
    fontSize: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#333',
  },
  confirmButton: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
  disabledButton: {
    color: '#ccc',
  },
  actionContainer: {
    flexDirection: 'row' as const,
    padding: 16,
    gap: 16,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center' as const,
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: '#333',
  },
  previewContainer: {
    flex: 1,
    padding: 16,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#333',
    marginBottom: 12,
  },
  previewScroll: {
    flex: 1,
  },
  mediaItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 8,
  },
  mediaPreview: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden' as const,
    backgroundColor: '#e0e0e0',
  },
  thumbnail: {
    width: 60,
    height: 60,
  },
  videoThumbnail: {
    width: 60,
    height: 60,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: '#333',
  },
  videoIcon: {
    fontSize: 24,
    color: '#fff',
  },
  mediaInfo: {
    flex: 1,
    marginLeft: 12,
  },
  mediaName: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#333',
    marginBottom: 2,
  },
  mediaSize: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  mediaType: {
    fontSize: 12,
    color: '#888',
  },
  removeButton: {
    padding: 8,
  },
  removeIcon: {
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center' as const,
    padding: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: '#333',
    marginBottom: 8,
    textAlign: 'center' as const,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center' as const,
  },
};

export default MediaUploadModal;
