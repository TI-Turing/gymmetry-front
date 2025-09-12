export interface PaymentIntent {
  Id: string;
  PreferenceId: string;
  ExternalPaymentId?: string | null;
  UserId?: string | null;
  GymId?: string | null;
  PlanTypeId?: string | null;
  GymPlanSelectedTypeId?: string | null;
  Amount: number;
  Currency: string; // e.g., "COP"
  Status:
    | 'Pending'
    | 'Approved'
    | 'Rejected'
    | 'Cancelled'
    | 'Expired'
    | string;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string | null;
  Ip?: string | null;
  IsActive: boolean;
  RawPreferenceJson?: string | null;
  RawPaymentJson?: string | null;
  Hash?: string | null;
  CreatedPlanId?: string | null;
  ExpiresAt?: string | null;
  LastStatusCheckAt?: string | null;
  PaymentMethod?: string | null; // CARD | PSE | ...
  BankCode?: string | null;
}
