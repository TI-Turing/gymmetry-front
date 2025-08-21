import { apiService, ApiResponse } from './apiService';

export interface PaymentPreferenceResponse {
  Id: string;
  InitPoint: string; // URL checkout producción
  SandboxInitPoint?: string; // URL sandbox
  Status?: string;
  AdditionalData?: any;
}

export interface CreateUserPlanPreferenceRequest {
  PlanTypeId: string;
  UserId: string;
  SuccessUrl: string;
  FailureUrl: string;
  PendingUrl?: string;
}

export interface CreateGymPlanPreferenceRequest {
  GymPlanSelectedTypeId: string;
  GymId: string;
  SuccessUrl: string;
  FailureUrl: string;
  PendingUrl?: string;
}

class PaymentService {
  async createUserPlanPreference(req: CreateUserPlanPreferenceRequest): Promise<ApiResponse<PaymentPreferenceResponse>> {
    return apiService.post<PaymentPreferenceResponse>('/payments/plan/preference', req);
  }

  async createGymPlanPreference(req: CreateGymPlanPreferenceRequest): Promise<ApiResponse<PaymentPreferenceResponse>> {
    return apiService.post<PaymentPreferenceResponse>('/payments/gymplan/preference', req);
  }

  async getPaymentStatus(paymentId: string): Promise<ApiResponse<any>> {
    return apiService.get<any>(`/payments/status/${paymentId}`);
  }
}

export const paymentService = new PaymentService();
