// Response DTOs for ReportContent API endpoints

import { ReportContent } from '../../models/ReportContent';
import { ReportContentEvidence } from '../../models/ReportContentEvidence';
import { ReportContentAudit } from '../../models/ReportContentAudit';

export interface ReportContentResponse {
  Success: boolean;
  Message: string;
  Data: ReportContent;
  StatusCode: number;
}

export interface ReportContentListResponse {
  Success: boolean;
  Message: string;
  Data: ReportContent[];
  StatusCode: number;
}

export interface ReportContentEvidenceResponse {
  Success: boolean;
  Message: string;
  Data: ReportContentEvidence;
  StatusCode: number;
}

export interface ReportContentEvidenceListResponse {
  Success: boolean;
  Message: string;
  Data: ReportContentEvidence[];
  StatusCode: number;
}

export interface ReportContentAuditResponse {
  Success: boolean;
  Message: string;
  Data: ReportContentAudit[];
  StatusCode: number;
}

export interface ReportContentStatsResponse {
  Success: boolean;
  Message: string;
  Data: {
    TotalReports: number;
    PendingReports: number;
    ResolvedReports: number;
    DismissedReports: number;
    HighPriorityReports: number;
    ReportsByType: Record<string, number>;
    ReportsByReason: Record<string, number>;
  };
  StatusCode: number;
}

export interface BulkOperationResponse {
  Success: boolean;
  Message: string;
  Data: {
    ProcessedCount: number;
    SucceededCount: number;
    FailedCount: number;
    FailedIds: string[];
  };
  StatusCode: number;
}

export interface DeleteResponse {
  Success: boolean;
  Message: string;
  Data: boolean;
  StatusCode: number;
}
