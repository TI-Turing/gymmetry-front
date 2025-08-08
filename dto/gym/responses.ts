import { BackendApiResponse } from './BackendApiResponse';
import { Gym } from './Gym';

export type GymRegistrationResponse = BackendApiResponse<string>;
export type GymUpdateResponse = BackendApiResponse<any>;
export type GymGetResponse = BackendApiResponse<Gym>;
