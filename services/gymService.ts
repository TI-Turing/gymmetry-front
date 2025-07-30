// Servicio para Gym - Solo funciones adicionales que no están en components/gym/GymService.ts
// Las funciones principales (add, update, getById) ya están implementadas en GymService
import { apiService } from './apiService';

// Interfaces DTO adicionales (replicadas desde C#)
export interface GenerateGymQrRequest {
  gymId: string;
  url: string;
}

export interface UploadGymLogoRequest {
  gymId: string;
  image: ArrayBuffer;
  fileName?: string;
  contentType?: string;
}

export interface GenerateGymQrResponse {
  qrCode: string;
  gymPlanSelectedType: any; // Puedes definir la interfaz si tienes el modelo
}

// Interface para búsqueda por campos (genérica)
export interface FindGymsByFieldsRequest {
  fields: { [key: string]: any };
}

export interface GymBasicInfo {
  id: string;
  name: string;
  email: string;
  nit: string;
  isVerified: boolean;
}

// Interface para respuesta de búsqueda por nombre
export interface FindGymsByNameResponse {
  Id: string;
  Name: string;
  Nit: string;
  Email: string;
  LogoUrl: string | null;
  Description: string;
  PhoneNumber: string | null;
  WebsiteUrl: string | null;
  SocialMediaLinks: string | null;
  LegalRepresentative: string | null;
  BillingEmail: string | null;
  SubscriptionPlanId: string | null;
  IsVerified: boolean;
  Tags: string | null;
  Owner_UserId: string;
  BrandColor: string | null;
  MaxBranchesAllowed: number | null;
  QrImageUrl: string | null;
  TrialEndsAt: string | null;
  CountryId: string;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  GymTypeId: string;
  GymType: any;
  Bills: any[];
  Branches: any[];
  GymPlanSelecteds: any[];
  Plans: any[];
  RoutineTemplates: any[];
  UserGyms: any[];
  PaymentAttempts: any[];
  FacbookUrl: string | null;
  InstagramUrl: string | null;
  Slogan: string | null;
  PaisId: string | null;
}

// Interfaces de respuesta del backend (formato estándar de Azure Functions)
export interface ApiResponse<T> {
  Success: boolean;
  Message: string;
  Data: T;
  StatusCode: number;
}

// Funciones del servicio adicionales
export const gymServiceExtensions = {
  async generateGymQr(
    request: GenerateGymQrRequest
  ): Promise<ApiResponse<GenerateGymQrResponse>> {
    // POST /gym/generate-qr (según la ruta de la Azure Function)
    const response = await apiService.post<GenerateGymQrResponse>(
      '/gym/generate-qr',
      request
    );
    return response;
  },

  async uploadGymLogo(
    request: UploadGymLogoRequest
  ): Promise<ApiResponse<string>> {
    // POST /gym/upload-logo (según la ruta de la Azure Function)
    const response = await apiService.post<string>('/gym/upload-logo', request);
    return response;
  },

  async deleteGym(gymId: string): Promise<ApiResponse<boolean>> {
    // DELETE /gym/{id} (según la ruta de la Azure Function)
    const response = await apiService.delete<boolean>(`/gym/${gymId}`);
    return response;
  },

  async findGymsByFields(
    request: FindGymsByFieldsRequest
  ): Promise<ApiResponse<GymBasicInfo[]>> {
    // POST /gym/find (genérica para buscar gyms por cualquier campo)
    const response = await apiService.post<GymBasicInfo[]>(
      '/gym/find',
      request
    );
    return response;
  },

  async findGymsByName(
    name: string
  ): Promise<ApiResponse<FindGymsByNameResponse[]>> {
    // GET /gyms/findbyname/{name} (según la Azure Function especificada)
    const response = await apiService.get<FindGymsByNameResponse[]>(
      `/gyms/findbyname/${encodeURIComponent(name)}`
    );
    return response;
  },
};
