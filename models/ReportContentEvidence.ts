// Auto-generated from C# ReportContentEvidence entity. Do not edit manually.

export interface ReportContentEvidence {
  Id: string;
  ReportContentId: string;
  FileName: string;
  ContentType: string;
  StoragePath: string;
  SizeBytes: number;
  CreatedAt: string;
}

export interface EvidenceUploadRequest {
  fileName: string;
  contentType: string;
  dataBase64: string;
}

export interface EvidenceUploadResponse {
  evidenceId: string;
  fileName: string;
  storageUrl: string;
  sizeBytes: number;
}
