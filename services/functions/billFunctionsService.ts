import { apiService, ApiResponse } from '../apiService';
import type { Bill } from '@/models/Bill';

// Auto-generated service for Bill Azure Functions
export const billFunctionsService = {
  async getBillById(id: string): Promise<ApiResponse<Bill>> {
    const response = await apiService.get<Bill>(`/bill/${id}`);
    return response;
  },
  async getAllBills(): Promise<ApiResponse<Bill[]>> {
    const response = await apiService.get<Bill[]>(`/bills`);
    return response;
  },
  async findBillsByFields(
    request: Record<string, any>
  ): Promise<ApiResponse<Bill[]>> {
    const response = await apiService.post<Bill[]>(`/bills/find`, request);
    return response;
  },
};
