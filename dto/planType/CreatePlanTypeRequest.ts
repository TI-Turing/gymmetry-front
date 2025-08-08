export interface CreatePlanTypeRequest {
  name: string;
  description: string;
  price: number;
  features: string[];
  isActive?: boolean;
}
