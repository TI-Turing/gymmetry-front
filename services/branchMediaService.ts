// Servicio para BranchMedia - Manejo de imágenes y medios de las sedes
import { apiService } from './apiService';

// Interfaces DTO (basadas en patrones comunes de manejo de medios)
export interface UploadBranchImageRequest {
  branchId: string;
  image: ArrayBuffer;
  fileName?: string;
  contentType?: string;
  imageType: 'main' | 'gallery' | 'thumbnail'; // Tipo de imagen
}

export interface BranchMediaResponse {
  id: string;
  branchId: string;
  imageUrl: string;
  imageType: string;
  fileName: string;
  uploadedAt: string;
}

export interface UpdateBranchImageRequest {
  id: string;
  branchId: string;
  image: ArrayBuffer;
  fileName?: string;
  contentType?: string;
}

// Interface para búsqueda por campos (genérica)
export interface FindBranchMediaByFieldsRequest {
  fields: { [key: string]: any };
}

export interface BranchMediaBasicInfo {
  id: string;
  branchId: string;
  imageUrl: string;
  imageType: string;
  fileName: string;
}

// Interfaces de respuesta del backend (formato estándar de Azure Functions)
export interface ApiResponse<T> {
  Success: boolean;
  Message: string;
  Data: T;
  StatusCode: number;
}

// Funciones del servicio
export const branchMediaService = {
  async uploadBranchImage(
    request: UploadBranchImageRequest
  ): Promise<ApiResponse<string>> {
    // POST /branch/media/upload (ruta inferida para subir imágenes de sede)
    const response = await apiService.post<string>(
      '/branch/media/upload',
      request
    );
    return response;
  },

  async getBranchImages(
    branchId: string
  ): Promise<ApiResponse<BranchMediaResponse[]>> {
    // GET /branch/{branchId}/media (ruta inferida para obtener imágenes de una sede)
    const response = await apiService.get<BranchMediaResponse[]>(
      `/branch/${branchId}/media`
    );
    return response;
  },

  async getBranchImageById(
    branchId: string,
    imageId: string
  ): Promise<ApiResponse<BranchMediaResponse>> {
    // GET /branch/{branchId}/media/{imageId} (ruta inferida para obtener imagen específica)
    const response = await apiService.get<BranchMediaResponse>(
      `/branch/${branchId}/media/${imageId}`
    );
    return response;
  },

  async updateBranchImage(
    request: UpdateBranchImageRequest
  ): Promise<ApiResponse<string>> {
    // PUT /branch/media/update (ruta inferida para actualizar imagen de sede)
    const response = await apiService.put<string>(
      '/branch/media/update',
      request
    );
    return response;
  },

  async deleteBranchImage(
    branchId: string,
    imageId: string
  ): Promise<ApiResponse<boolean>> {
    // DELETE /branch/{branchId}/media/{imageId} (ruta inferida para eliminar imagen)
    const response = await apiService.delete<boolean>(
      `/branch/${branchId}/media/${imageId}`
    );
    return response;
  },

  async setBranchMainImage(
    branchId: string,
    imageId: string
  ): Promise<ApiResponse<boolean>> {
    // PUT /branch/{branchId}/media/{imageId}/main (ruta inferida para establecer imagen principal)
    const response = await apiService.put<boolean>(
      `/branch/${branchId}/media/${imageId}/main`,
      {}
    );
    return response;
  },

  async findBranchMediaByFields(
    request: FindBranchMediaByFieldsRequest
  ): Promise<ApiResponse<BranchMediaBasicInfo[]>> {
    // POST /branch/media/find (genérica para buscar por cualquier campo)
    const response = await apiService.post<BranchMediaBasicInfo[]>(
      '/branch/media/find',
      request
    );
    return response;
  },
};
