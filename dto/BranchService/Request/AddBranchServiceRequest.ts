export interface AddBranchServiceRequest {
  BranchId: string;
  BranchServiceTypeId: string;
  Notes?: string | null;
  Ip?: string | null;
}
