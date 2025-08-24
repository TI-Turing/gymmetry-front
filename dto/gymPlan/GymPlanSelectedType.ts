export interface GymPlanSelectedType {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  ip: string | null;
  isActive: boolean;
  countryId: string;
  price: number | null;
  usdPrice: number | null;
  description: string;
  gymPlanSelecteds: unknown[];
}
