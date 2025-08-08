export interface OtpRequest {
  userId: string;
  verificationType: string;
  recipient: string;
  method: string;
}
