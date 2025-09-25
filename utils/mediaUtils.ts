/**
 * Utilidades para manejo de multimedia - Versión robusta y simplificada
 */

// Límites de archivos multimedia
export const MEDIA_LIMITS = {
  MAX_FILES_PER_POST: 5,
  IMAGE: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    MAX_WIDTH: 1920,
    MAX_HEIGHT: 1080,
    JPEG_QUALITY: 0.8,
  },
  VIDEO: {
    MAX_SIZE: 50 * 1024 * 1024, // 50MB
    MAX_DURATION: 60, // 60 segundos
  },
};

// Tipos de archivo soportados
export const SUPPORTED_TYPES = {
  IMAGES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  VIDEOS: ['video/mp4', 'video/quicktime', 'video/x-msvideo'],
};

// Interfaces
export interface CompressedImageResult {
  uri: string;
  blob: Blob;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

export interface MediaValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface MediaAsset {
  uri: string;
  type?: string;
  mimeType?: string;
  fileSize?: number;
  fileName?: string;
  duration?: number;
}

/**
 * Comprime una imagen usando expo-image-manipulator con máximo fallback
 */
export async function compressImage(
  imageUri: string,
  _mimeType: string = 'image/jpeg'
): Promise<CompressedImageResult> {
  // Verificar URI válida
  if (!imageUri || typeof imageUri !== 'string') {
    throw new Error('URI de imagen inválida');
  }

  try {
    // Intentar compresión con expo-image-manipulator
    const { manipulateAsync, SaveFormat } = await import(
      'expo-image-manipulator'
    );

    const result = await manipulateAsync(
      imageUri,
      [
        {
          resize: {
            width: 800, // Tamaño conservador
            height: 600,
          },
        },
      ],
      {
        compress: 0.8,
        format: SaveFormat.JPEG,
      }
    );

    // Crear blob
    const response = await fetch(result.uri);
    const blob = await response.blob();

    return {
      uri: result.uri,
      blob,
      originalSize: 800 * 600 * 3, // Estimación
      compressedSize: blob.size,
      compressionRatio: 0.3, // Estimación
    };
  } catch (error) {
    // Fallback completo: devolver imagen original
    const response = await fetch(imageUri);
    const blob = await response.blob();

    return {
      uri: imageUri,
      blob,
      originalSize: blob.size,
      compressedSize: blob.size,
      compressionRatio: 0,
    };
  }
}

/**
 * Convierte un Blob a File
 */
export function blobToFile(blob: Blob, fileName: string): File {
  return new File([blob], fileName, {
    type: blob.type || 'image/jpeg',
    lastModified: Date.now(),
  });
}

/**
 * Valida un archivo multimedia individual
 */
export function validateMediaFile(
  asset: MediaAsset,
  type: 'image' | 'video'
): MediaValidationResult {
  const result: MediaValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
  };

  if (!asset) {
    result.isValid = false;
    result.errors.push('Archivo no válido');
    return result;
  }

  // Validar tamaño
  const maxSize =
    type === 'image'
      ? MEDIA_LIMITS.IMAGE.MAX_SIZE
      : MEDIA_LIMITS.VIDEO.MAX_SIZE;
  if (asset.fileSize && asset.fileSize > maxSize) {
    result.isValid = false;
    result.errors.push(
      `Archivo demasiado grande. Máximo: ${Math.round(maxSize / 1024 / 1024)}MB`
    );
  }

  // Validar tipo MIME
  const supportedTypes =
    type === 'image' ? SUPPORTED_TYPES.IMAGES : SUPPORTED_TYPES.VIDEOS;
  if (
    asset.mimeType &&
    !supportedTypes.includes(asset.mimeType.toLowerCase())
  ) {
    result.isValid = false;
    result.errors.push(`Tipo de archivo no soportado: ${asset.mimeType}`);
  }

  return result;
}

/**
 * Valida múltiples archivos multimedia
 */
export function validateMultipleMediaFiles(
  assets: MediaAsset[]
): MediaValidationResult {
  const result: MediaValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
  };

  if (!assets || assets.length === 0) {
    result.isValid = false;
    result.errors.push('No se seleccionaron archivos');
    return result;
  }

  if (assets.length > MEDIA_LIMITS.MAX_FILES_PER_POST) {
    result.isValid = false;
    result.errors.push(
      `Máximo ${MEDIA_LIMITS.MAX_FILES_PER_POST} archivos por publicación`
    );
    return result;
  }

  // Validar cada archivo
  for (let i = 0; i < assets.length; i++) {
    const asset = assets[i];
    const type = asset.type === 'video' ? 'video' : 'image';
    const validation = validateMediaFile(asset, type);

    if (!validation.isValid) {
      result.isValid = false;
      result.errors.push(
        ...validation.errors.map((err) => `Archivo ${i + 1}: ${err}`)
      );
    }

    result.warnings.push(
      ...validation.warnings.map((warn) => `Archivo ${i + 1}: ${warn}`)
    );
  }

  return result;
}
