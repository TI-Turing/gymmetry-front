export interface PaymentPreferenceResponse {
  Id: string;
  PreferenceId?: string; // alias
  InitPoint: string;
  SandboxInitPoint?: string | null;
  Status: string; // pending | approved (free)
}
