export interface PaymentStatusResponse {
  PaymentId: string;
  PreferenceId: string;
  Status: string; // enum string
  PlanCreated: boolean;
  Type: string; // user|gym
  CreatedPlanId?: string | null;
  PaymentMethod?: string | null;
  BankCode?: string | null;
  ExpiresAt?: string | null;
  Amount?: number | null;
  Currency?: string | null;
}
