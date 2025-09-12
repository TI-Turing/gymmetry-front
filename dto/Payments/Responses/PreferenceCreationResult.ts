export interface PreferenceCreationResult {
  PreferenceId: string;
  InitPoint: string;
  SandboxInitPoint?: string | null;
  RawJson: string;
}

export interface PaymentDetailsResult {
  Status: string;
  RawJson: string;
  Amount?: number | null;
  Currency?: string | null;
  PreferenceId?: string | null;
  ExternalPaymentId?: string | null;
}
