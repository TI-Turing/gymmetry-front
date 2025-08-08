import { Gym } from './Gym';

export interface CachedGymData {
  gym: Gym | null;
  lastFetched: string;
}
