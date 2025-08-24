import type { ApiResponse } from '@/dto/common/ApiResponse';
import { Gym } from './Gym';

export type GymRegistrationResponse = ApiResponse<string>;
export type GymUpdateResponse = ApiResponse<unknown>;
export type GymGetResponse = ApiResponse<Gym>;
