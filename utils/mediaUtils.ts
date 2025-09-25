// Constants for media validation
export const MEDIA_LIMITS = {
  MAX_FILES_PER_POST: 5,
  IMAGE: { 
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    MAX_WIDTH: 1920, 
    MAX_HEIGHT: 1080 
  },
  VIDEO: { 
    MAX_SIZE: 50 * 1024 * 1024, // 50MB
    MAX_DURATION: 60 
  }
};

export const SUPPORTED_TYPES = {
  IMAGES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  VIDEOS: ['video/mp4', 'video/mov', 'video/avi']
};

// Interfaces
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
}

// Validation functions
export function validateSingleMediaAsset(
  asset: MediaAsset,
  type: 'image' | 'video'
): MediaValidationResult {
  const result: MediaValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  if (!asset) {
    result.isValid = false;
    result.errors.push('Asset no válido');
    return result;
  }

  // Check file size
  const maxSize = type === 'image' 
    ? MEDIA_LIMITS.IMAGE.MAX_SIZE 
    : MEDIA_LIMITS.VIDEO.MAX_SIZE;

  if (asset.fileSize && asset.fileSize > maxSize) {
    result.isValid = false;
    result.errors.push(
      `Archivo demasiado grande. Máximo: ${Math.round(maxSize / (1024 * 1024))}MB`
    );
  }

  // Check mime type
  const supportedTypes = type === 'image' 
    ? SUPPORTED_TYPES.IMAGES 
    : SUPPORTED_TYPES.VIDEOS;

  if (
    asset.mimeType &&
    !supportedTypes.includes(asset.mimeType.toLowerCase())
  ) {
    result.isValid = false;
    result.errors.push(`Tipo de archivo no soportado: ${asset.mimeType}`);
  }

  return result;
}

export function validateMultipleMediaFiles(
  assets: MediaAsset[]
): MediaValidationResult {
  const result: MediaValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  if (!assets || assets.length === 0) {
    result.isValid = false;
    result.errors.push('No hay archivos para validar');
    return result;
  }

  if (assets.length > MEDIA_LIMITS.MAX_FILES_PER_POST) {
    result.isValid = false;
    result.errors.push(
      `Máximo ${MEDIA_LIMITS.MAX_FILES_PER_POST} archivos por publicación`
    );
    return result;
  }

  // Validate each asset
  assets.forEach((asset, i) => {
    const type = asset.type === 'video' ? 'video' : 'image';
    const validation = validateSingleMediaAsset(asset, type);

    if (!validation.isValid) {
      result.isValid = false;
      result.errors.push(
        ...validation.errors.map((err) => `Archivo ${i + 1}: ${err}`)
      );
    }

    result.warnings.push(
      ...validation.warnings.map((warn) => `Archivo ${i + 1}: ${warn}`)
    );
  });

  return result;
}
