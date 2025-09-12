export interface UpdateBranchServiceRequest {
  Id: string;
  BranchId: string;
  BranchServiceTypeId: string;
  Notes?: string | null;
  Ip?: string | null;
  IsActive: boolean;
}
