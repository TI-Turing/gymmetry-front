export interface UploadGymLogoRequest {
  gymId: string;
  image: ArrayBuffer;
  fileName?: string;
  contentType?: string;
}
