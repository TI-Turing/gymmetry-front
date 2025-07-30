import { User } from '../models/user';

export interface LoginResponseData {
  UserId: string;
  UserName: string;
  Email: string;
  Token: string;
  RefreshToken: string;
  TokenExpiration: string;
  RefreshTokenExpiration: string;
  User: User;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: LoginResponseData;
  statusCode: number;
}

export interface RegisterResponseData {
  // Define the actual registration response data structure here
  [key: string]: any;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: RegisterResponseData;
  statusCode: number;
}

export interface RefreshTokenResponseData {
  NewToken: string;
  TokenExpiration: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data: RefreshTokenResponseData;
  statusCode: number;
}
