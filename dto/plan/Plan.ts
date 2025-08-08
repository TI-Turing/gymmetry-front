export interface Plan {
  id: string;
  startDate: string;
  endDate: string;
  planTypeId: string;
  userId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  planType?: any;
  user?: any;
}
