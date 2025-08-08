export interface UpdatePlanTypeRequest {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  features?: string[];
  isActive?: boolean;
}
