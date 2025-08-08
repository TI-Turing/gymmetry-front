export interface UpdateBranchImageRequest {
  id: string;
  branchId: string;
  image: ArrayBuffer;
  fileName?: string;
  contentType?: string;
}
