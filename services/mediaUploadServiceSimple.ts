// Servicio simplificado para upload de media - Versión básica para funcionalidad crítica

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
  private baseUrl = 'https://your-azure-function.azurewebsites.net';

  /**
   * Sube un archivo de media (simulado para desarrollo)
   */
  async uploadMedia(
    request: MediaUploadRequest,
    onProgress?: UploadProgressCallback
  ): Promise<ApiResponse<MediaUploadResponse>> {
    try {
      // Simular progreso
      if (onProgress) {
        for (let i = 0; i <= 100; i += 10) {
          setTimeout(() => onProgress(i), i * 10);
        }
      }

      // Simular delay de upload
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Respuesta simulada exitosa
      const mockResponse: MediaUploadResponse = {
        fileUrl: `https://mockblobstorage.blob.core.windows.net/media/${request.fileName}`,
        fileName: request.fileName,
        fileSize: request.file.size || 0,
        uploadedAt: new Date().toISOString(),
      };

      return {
        Success: true,
        Message: 'Archivo subido exitosamente',
        Data: mockResponse,
        StatusCode: 200,
      };
    } catch (error) {
      return {
        Success: false,
        Message: 'Error al subir el archivo',
        Data: null,
        StatusCode: 500,
      };
    }
  }

  /**
   * Sube múltiples archivos de media
   */
  async uploadMultipleMedia(
    requests: MediaUploadRequest[],
    onProgress?: (fileIndex: number, progress: number) => void
  ): Promise<ApiResponse<MediaUploadResponse[]>> {
    try {
      const results: MediaUploadResponse[] = [];

      for (let i = 0; i < requests.length; i++) {
        const request = requests[i];

        const progressCallback = onProgress
          ? (progress: number) => onProgress(i, progress)
          : undefined;

        const result = await this.uploadMedia(request, progressCallback);

        if (result.Success && result.Data) {
          results.push(result.Data);
        }
      }

      return {
        Success: true,
        Message: `${results.length} archivos subidos exitosamente`,
        Data: results,
        StatusCode: 200,
      };
    } catch (error) {
      return {
        Success: false,
        Message: 'Error al subir los archivos',
        Data: null,
        StatusCode: 500,
      };
    }
  }

  /**
   * Elimina un archivo de media (simulado)
   */
  async deleteMedia(_fileUrl: string): Promise<ApiResponse<boolean>> {
    try {
      // Simular delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return {
        Success: true,
        Message: 'Archivo eliminado exitosamente',
        Data: true,
        StatusCode: 200,
      };
    } catch (error) {
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
              resolve(file);
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
   * Convierte URI a File para web
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
   * Valida el tamaño del archivo
   */
  validateFileSize(file: File, maxSizeInMB: number): boolean {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    return file.size <= maxSizeInBytes;
  }

  /**
   * Obtiene información del archivo
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
