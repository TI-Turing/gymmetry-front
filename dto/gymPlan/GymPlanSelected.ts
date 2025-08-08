import { GymPlanSelectedType } from './GymPlanSelectedType';

export interface GymPlanSelected {
  id: string;
  gymId: string;
  gymPlanSelectedTypeId: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  gymPlanSelectedType?: GymPlanSelectedType;
}
