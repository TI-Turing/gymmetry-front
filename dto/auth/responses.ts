import { User } from '../models/user';

export interface LoginResponse {
  Success: boolean;
  Message: string;
  Data: {
    UserId: string;
    UserName: string;
    Email: string;
    Token: string;
    RefreshToken: string;
    TokenExpiration: string;
    RefreshTokenExpiration: string;
    User: User;
  };
  StatusCode: number;
}

export interface RegisterResponse {
  Success: boolean;
  Message: string;
  Data: any;
  StatusCode: number;
}

export interface RefreshTokenResponse {
  Success: boolean;
  Message: string;
  Data: {
    NewToken: string;
    TokenExpiration: string;
  };
  StatusCode: number;
}
