export interface CreateUserPlanPreferenceRequest {
  PlanTypeId: string;
  UserId: string;
  SuccessUrl?: string | null;
  FailureUrl?: string | null;
  PendingUrl?: string | null;
  PaymentMethod?: 'CARD' | 'PSE' | string;
  BankCode?: string | null;
  BuyerEmail?: string | null;
}
