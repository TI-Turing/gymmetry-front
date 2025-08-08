// Servicio para BranchMedia - Manejo de imágenes y medios de las sedes
import { apiService, ApiResponse } from './apiService';
import { UploadBranchImageRequest } from '@/dto/branchMedia/UploadBranchImageRequest';
import { BranchMediaResponse } from '@/dto/branchMedia/BranchMediaResponse';
import { UpdateBranchImageRequest } from '@/dto/branchMedia/UpdateBranchImageRequest';
import { FindBranchMediaByFieldsRequest } from '@/dto/branchMedia/FindBranchMediaByFieldsRequest';
import { BranchMediaBasicInfo } from '@/dto/branchMedia/BranchMediaBasicInfo';

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
