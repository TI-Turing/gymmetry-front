export interface BackendApiResponse<T> {
  Success: boolean;
  Message: string;
  Data: T | null;
  StatusCode: number;
}
