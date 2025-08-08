export interface UpdatePlanRequest {
  id: string;
  startDate?: string;
  endDate?: string;
  planTypeId?: string;
  userId?: string;
  isActive?: boolean;
}
