// Request DTOs for ReportContent API endpoints

import {
  ContentType,
  ReportReason,
  ReportPriority,
} from '../../models/ReportContent';

export interface CreateReportContentRequest {
  ContentId: string;
  ContentType: ContentType;
  ReportReason: ReportReason;
  Description: string;
  Priority?: ReportPriority;
  ReporterUserId: string;
}

export interface UpdateReportContentRequest {
  Id: string;
  Description?: string;
  Priority?: ReportPriority;
  ModeratorNotes?: string;
}

export interface ReviewReportContentRequest {
  Id: string;
  ModeratorUserId: string;
  ModeratorNotes: string;
}

export interface ResolveReportContentRequest {
  Id: string;
  ModeratorUserId: string;
  Resolution: string;
  ActionTaken?: string;
  ModeratorNotes?: string;
}

export interface DismissReportContentRequest {
  Id: string;
  ModeratorUserId: string;
  DismissalReason: string;
  ModeratorNotes?: string;
}

export interface BulkResolveReportsRequest {
  ReportIds: string[];
  ModeratorUserId: string;
  Resolution: string;
  ActionTaken?: string;
  ModeratorNotes?: string;
}

export interface FindReportContentRequest {
  ContentId?: string;
  ContentType?: ContentType;
  ReportReason?: ReportReason;
  Status?: string;
  Priority?: ReportPriority;
  ReporterUserId?: string;
  ModeratorUserId?: string;
  CreatedAfter?: string;
  CreatedBefore?: string;
  UpdatedAfter?: string;
  UpdatedBefore?: string;
  HasEvidence?: boolean;
}

export interface AddEvidenceRequest {
  ReportContentId: string;
  EvidenceType: string;
  EvidenceUrl: string;
  Description?: string;
  UploadedByUserId: string;
}

export interface RemoveEvidenceRequest {
  EvidenceId: string;
  ModeratorUserId: string;
  RemovalReason?: string;
}
