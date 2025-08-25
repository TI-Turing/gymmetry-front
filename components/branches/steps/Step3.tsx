import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { UI_CONSTANTS } from '@/constants/AppConstants';

interface Step3Props {
  branchId: string;
}

export default function Step3({ branchId: _branchId }: Step3Props) {
  const handleSelectImages = () => {
    // TODO: Implementar selección de imágenes
  };

  const handleSelectVideos = () => {
    // TODO: Implementar selección de videos
  };

  const handleTakePhoto = () => {
    // TODO: Implementar captura de foto
  };

  return (
    <View style={styles.container}>
      <Text style={styles.stepTitle}>Paso 3: Imágenes y Videos</Text>
      <Text style={styles.stepDescription}>
        Agrega imágenes y videos de tu sede para que los usuarios puedan
        conocerla mejor.
      </Text>

      {/* Opciones de subida de archivos */}
      <View style={styles.uploadOptions}>
        <TouchableOpacity
          style={styles.uploadOption}
          onPress={handleSelectImages}
        >
          <FontAwesome name="image" size={32} color={Colors.dark.tint} />
          <Text style={styles.uploadOptionTitle}>Seleccionar Imágenes</Text>
          <Text style={styles.uploadOptionDescription}>
            Galería de fotos del dispositivo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.uploadOption} onPress={handleTakePhoto}>
          <FontAwesome name="camera" size={32} color={Colors.dark.tint} />
          <Text style={styles.uploadOptionTitle}>Tomar Foto</Text>
          <Text style={styles.uploadOptionDescription}>
            Capturar nueva imagen
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.uploadOption}
          onPress={handleSelectVideos}
        >
          <FontAwesome name="video-camera" size={32} color={Colors.dark.tint} />
          <Text style={styles.uploadOptionTitle}>Seleccionar Videos</Text>
          <Text style={styles.uploadOptionDescription}>
            Videos del dispositivo
          </Text>
        </TouchableOpacity>
      </View>

      {/* Información sobre los archivos */}
      <View style={styles.infoContainer}>
        <FontAwesome name="info-circle" size={16} color="#FFA726" />
        <Text style={styles.infoText}>
          Puedes saltarte este paso y agregar imágenes más tarde desde la
          configuración de la sede.
        </Text>
      </View>

      {/* Placeholder para preview de archivos seleccionados */}
      <View style={styles.previewContainer}>
        <Text style={styles.previewTitle}>Archivos seleccionados</Text>
        <View style={styles.placeholderPreview}>
          <FontAwesome name="file-image-o" size={24} color="#666666" />
          <Text style={styles.placeholderText}>
            Los archivos seleccionados aparecerán aquí
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: UI_CONSTANTS.SPACING.LG,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: UI_CONSTANTS.SPACING.SM,
  },
  stepDescription: {
    fontSize: 16,
    color: '#B0B0B0',
    marginBottom: UI_CONSTANTS.SPACING.LG,
    lineHeight: 22,
  },
  uploadOptions: {
    marginBottom: UI_CONSTANTS.SPACING.LG,
  },
  uploadOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 12,
    padding: UI_CONSTANTS.SPACING.MD,
    marginBottom: UI_CONSTANTS.SPACING.MD,
  },
  uploadOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: UI_CONSTANTS.SPACING.MD,
    flex: 1,
  },
  uploadOptionDescription: {
    fontSize: 14,
    color: '#B0B0B0',
    marginLeft: UI_CONSTANTS.SPACING.MD,
    flex: 2,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#2A1F1A',
    borderWidth: 1,
    borderColor: '#FFA726',
    borderRadius: 8,
    padding: UI_CONSTANTS.SPACING.MD,
    marginBottom: UI_CONSTANTS.SPACING.LG,
  },
  infoText: {
    fontSize: 14,
    color: '#FFA726',
    marginLeft: UI_CONSTANTS.SPACING.SM,
    flex: 1,
    lineHeight: 20,
  },
  previewContainer: {
    marginTop: UI_CONSTANTS.SPACING.MD,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: UI_CONSTANTS.SPACING.SM,
  },
  placeholderPreview: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1A1A',
    borderWidth: 2,
    borderColor: '#333333',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: UI_CONSTANTS.SPACING.XL,
  },
  placeholderText: {
    color: '#666666',
    fontSize: 14,
    marginTop: UI_CONSTANTS.SPACING.SM,
    textAlign: 'center',
  },
});
