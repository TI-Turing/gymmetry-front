export interface BranchServiceResponse {
  Id: string;
  BranchId: string;
  BranchServiceTypeId: string;
  Notes?: string | null;
  CreatedAt: string;
  UpdatedAt?: string | null;
  IsActive: boolean;
}
