export interface CreateCardPaymentRequest {
  UserId: string;
  PlanTypeId?: string | null;
  GymId?: string | null;
  GymPlanSelectedTypeId?: string | null;
  CardToken: string;
  Installments?: number;
  BuyerEmail?: string | null;
}
