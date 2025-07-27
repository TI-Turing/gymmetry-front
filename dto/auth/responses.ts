export interface LoginResponse {
  Success: boolean;
  Message: string;
  Data: {
    UserId: string;
    UserName: string;
    Email: string;
    Token: string;
  };
  StatusCode: number;
}

export interface RegisterResponse {
  Success: boolean;
  Message: string;
  Data: any;
  StatusCode: number;
}
