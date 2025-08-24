// Unified API response envelope used across the app.
// Keep this generic and do NOT overwrite from generators.
export interface ApiResponse<T = unknown> {
  Success: boolean;
  Message: string;
  Data: T | null;
  StatusCode: number;
}
