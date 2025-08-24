import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';

export interface PaymentPreferenceResponse {
  Id: string; // preference id
  InitPoint?: string; // URL checkout producción (puede no venir en plan gratis)
  SandboxInitPoint?: string; // URL sandbox
  Status?: string; // pending | approved (gratis) etc.
  AdditionalData?: unknown;
  // Alias de conveniencia
  preferenceId?: string;
}

export interface CreateUserPlanPreferenceRequest {
  PlanTypeId: string;
  UserId: string;
  SuccessUrl: string;
  FailureUrl: string;
  PendingUrl?: string;
  PaymentMethod?: 'CARD' | 'PSE' | string;
  BankCode?: string;
  BuyerEmail?: string;
}

export interface CreateGymPlanPreferenceRequest {
  GymPlanSelectedTypeId: string;
  GymId: string;
  UserId: string; // owner que inicia el pago
  SuccessUrl: string;
  FailureUrl: string;
  PendingUrl?: string;
  PaymentMethod?: 'CARD' | 'PSE' | string;
  BankCode?: string;
  BuyerEmail?: string;
}

export interface PaymentStatus {
  paymentId?: string;
  PaymentId?: string;
  preferenceId?: string;
  PreferenceId?: string;
  status?: string; // Pending|Approved|Rejected|Cancelled|Expired
  Status?: string;
  planCreated?: boolean;
  PlanCreated?: boolean;
  createdPlanId?: string | null;
  CreatedPlanId?: string | null;
  type?: 'user' | 'gym' | string;
  Type?: string;
  paymentMethod?: string; // CARD|PSE|VISA|...
  PaymentMethod?: string;
  bankCode?: string | null;
  BankCode?: string | null;
  expiresAt?: string | null; // ISO UTC
  ExpiresAt?: string | null;
}

class PaymentService {
  async createUserPlanPreference(
    req: CreateUserPlanPreferenceRequest
  ): Promise<ApiResponse<PaymentPreferenceResponse>> {
    return apiService.post<PaymentPreferenceResponse>(
      '/payments/plan/preference',
      req
    );
  }

  async createGymPlanPreference(
    req: CreateGymPlanPreferenceRequest
  ): Promise<ApiResponse<PaymentPreferenceResponse>> {
    return apiService.post<PaymentPreferenceResponse>(
      '/payments/gymplan/preference',
      req
    );
  }

  async getPaymentStatus(
    paymentId: string
  ): Promise<ApiResponse<PaymentStatus>> {
    return apiService.get<PaymentStatus>(`/payments/status/${paymentId}`);
  }

  async pollPaymentStatus(
    id: string,
    intervalMs = 5000,
    timeoutMs = 180000,
    shouldStop?: () => boolean
  ): Promise<ApiResponse<unknown>> {
    const start = Date.now();
    while (true) {
      if (shouldStop?.()) throw new Error('Polling cancelled');
      const resp = await this.getPaymentStatus(id);
      const status: string = (
        resp?.Data?.status ||
        resp?.Data?.Status ||
        ''
      ).toString();
      if (!resp.Success) return resp;
      if (['Approved', 'Rejected', 'Cancelled', 'Expired'].includes(status))
        return resp;
      if (Date.now() - start > timeoutMs) return resp; // devolver último pending
      await new Promise((r) => setTimeout(r, intervalMs));
    }
  }

  // Nuevo: crear pago con tarjeta usando token (Bricks)
  async createUserPlanCardPayment(req: {
    PlanTypeId: string;
    UserId: string;
    CardToken: string;
    BuyerEmail?: string | null;
    Amount?: number | null;
  }): Promise<ApiResponse<PaymentPreferenceResponse>> {
    return apiService.post<PaymentPreferenceResponse>(
      '/payments/plan/card',
      req
    );
  }

  async createGymPlanCardPayment(req: {
    GymPlanSelectedTypeId: string;
    GymId: string;
    UserId: string;
    CardToken: string;
    BuyerEmail?: string | null;
    Amount?: number | null;
  }): Promise<ApiResponse<PaymentPreferenceResponse>> {
    return apiService.post<PaymentPreferenceResponse>(
      '/payments/gymplan/card',
      req
    );
  }
}

export const paymentService = new PaymentService();
