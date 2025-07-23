import { User } from '../user/responses';

export interface LoginResponse {
  user: User;
  token: string;
  expiresIn?: number;
}

export interface RegisterResponse {
  user: User;
  token: string;
  message?: string;
}
