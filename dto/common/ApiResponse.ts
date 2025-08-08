// Unified API response envelope used across the app.
// Keep this generic and do NOT overwrite from generators.
export interface ApiResponse<T = any> {
  Success: boolean;
  Message: string;
  Data: T | null;
  StatusCode: number;
}
