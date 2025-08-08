export interface ValidateOtpRequest {
  userId: string;
  otp: string;
  verificationType: string;
  recipient: string;
}
