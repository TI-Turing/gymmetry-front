// import { azureFunctionService } from './azureFunctionService';
// import type { ApiResponse } from '@/types/apiTypes';

// Tipo temporal para ApiResponse mientras se integra
interface ApiResponse<T> {
  Success: boolean;
  Message: string;
  Data: T | null;
  StatusCode: number;
}

interface MediaUploadRequest {
  file: File | Blob;
  fileName: string;
  contentType: string;
  feedId?: string;
}

interface MediaUploadResponse {
  fileUrl: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
}

interface UploadProgressCallback {
  (progress: number): void;
}

class MediaUploadService {
  /**
   * Sube un archivo de media a Azure Blob Storage
   */
  async uploadMedia(
    request: MediaUploadRequest,
    onProgress?: UploadProgressCallback
  ): Promise<ApiResponse<MediaUploadResponse>> {
    try {
      // Crear FormData para el archivo
      const formData = new FormData();
      formData.append('file', request.file, request.fileName);
      formData.append('fileName', request.fileName);
      formData.append('contentType', request.contentType);

      if (request.feedId) {
        formData.append('feedId', request.feedId);
      }

      // Configurar XMLHttpRequest para poder trackear progreso
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Configurar progreso
        if (onProgress) {
          xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
              const progress = Math.round((event.loaded / event.total) * 100);
              onProgress(progress);
            }
          });
        }

        // Configurar respuesta
        xhr.addEventListener('load', () => {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            reject(new Error('Error parsing response'));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Network error during upload'));
        });

        // Realizar peticin
        xhr.open(
          'POST',
          `https://your-azure-function.azurewebsites.net/api/media/upload`
        );
        xhr.send(formData);
      });
    } catch (error) {
      // Media upload error logging removed for production
      return {
        Success: false,
        Message: 'Error al subir el archivo',
        Data: null,
        StatusCode: 500,
      };
    }
  }

  /**
   * Sube mltiples archivos de media
   */
  async uploadMultipleMedia(
    requests: MediaUploadRequest[],
    onProgress?: (fileIndex: number, progress: number) => void
  ): Promise<ApiResponse<MediaUploadResponse[]>> {
    try {
      const results: MediaUploadResponse[] = [];
      const errors: string[] = [];

      for (let i = 0; i < requests.length; i++) {
        const request = requests[i];

        const progressCallback = onProgress
          ? (progress: number) => onProgress(i, progress)
          : undefined;

        const result = await this.uploadMedia(request, progressCallback);

        if (result.Success && result.Data) {
          results.push(result.Data);
        } else {
          errors.push(`${request.fileName}: ${result.Message}`);
        }
      }

      if (errors.length > 0 && results.length === 0) {
        return {
          Success: false,
          Message: `Errores al subir archivos: ${errors.join(', ')}`,
          Data: null,
          StatusCode: 500,
        };
      }

      return {
        Success: true,
        Message:
          errors.length > 0
            ? `${results.length} archivos subidos, ${errors.length} fallaron`
            : `${results.length} archivos subidos exitosamente`,
        Data: results,
        StatusCode: 200,
      };
    } catch (error) {
      // Multiple media upload error logging removed for production
      return {
        Success: false,
        Message: 'Error al subir los archivos',
        Data: null,
        StatusCode: 500,
      };
    }
  }

  /**
   * Elimina un archivo de media
   */
  async deleteMedia(_fileUrl: string): Promise<ApiResponse<boolean>> {
    try {
      // TODO: Implement Azure Function service call
      return Promise.resolve({
        Success: true,
        Message: 'File deleted successfully',
        Data: true,
        StatusCode: 200,
      });
    } catch (error) {
      // Delete media error logging removed for production
      return {
        Success: false,
        Message: 'Error al eliminar el archivo',
        Data: null,
        StatusCode: 500,
      };
    }
  }

  /**
   * Comprime una imagen antes de subirla
   */
  async compressImage(file: File, quality: number = 0.8): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calcular dimensiones manteniendo aspect ratio
        const MAX_WIDTH = 1920;
        const MAX_HEIGHT = 1080;

        let { width, height } = img;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = (height * MAX_WIDTH) / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = (width * MAX_HEIGHT) / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Dibujar imagen comprimida
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file); // Fallback al archivo original
            }
          },
          'image/jpeg',
          quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Convierte URI de React Native a File para web
   */
  async uriToFile(
    uri: string,
    fileName: string,
    mimeType: string
  ): Promise<File> {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new File([blob], fileName, { type: mimeType });
  }

  /**
   * Valida el tipo de archivo
   */
  validateFileType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.some((type) => file.type.startsWith(type));
  }

  /**
   * Valida el tamao del archivo
   */
  validateFileSize(file: File, maxSizeInMB: number): boolean {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    return file.size <= maxSizeInBytes;
  }

  /**
   * Obtiene informacin del archivo
   */
  getFileInfo(file: File) {
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: new Date(file.lastModified),
      sizeInMB: +(file.size / (1024 * 1024)).toFixed(2),
    };
  }
}

export const mediaUploadService = new MediaUploadService();
export type { MediaUploadRequest, MediaUploadResponse, UploadProgressCallback };
