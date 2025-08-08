export interface UploadBranchImageRequest {
  branchId: string;
  image: ArrayBuffer;
  fileName?: string;
  contentType?: string;
  imageType: 'main' | 'gallery' | 'thumbnail';
}
