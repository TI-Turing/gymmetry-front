// ReportContent Service - Connects to 14 backend endpoints

import { apiService } from './apiService';
import { ReportContent, ReportPriority } from '../models/ReportContent';
import { ReportContentEvidence } from '../models/ReportContentEvidence';
import { ReportContentAudit } from '../models/ReportContentAudit';
import type { ApiResponse } from '../dto/common/ApiResponse';
import {
  CreateReportContentRequest,
  UpdateReportContentRequest,
  ReviewReportContentRequest,
  ResolveReportContentRequest,
  DismissReportContentRequest,
  BulkResolveReportsRequest,
  FindReportContentRequest,
  AddEvidenceRequest,
  RemoveEvidenceRequest,
} from '../dto/ReportContent/ReportContentRequest';

// Type definitions for API responses
interface ReportStats {
  TotalReports: number;
  PendingReports: number;
  ResolvedReports: number;
  DismissedReports: number;
  HighPriorityReports: number;
  ReportsByType: Record<string, number>;
  ReportsByReason: Record<string, number>;
}

interface BulkOperationResult {
  ProcessedCount: number;
  SucceededCount: number;
  FailedCount: number;
  FailedIds: string[];
}

class ReportContentService {
  private readonly basePath = '/reportcontent';

  // 1. POST /reportcontent - Create new report
  async addReportContent(
    request: CreateReportContentRequest
  ): Promise<ApiResponse<ReportContent>> {
    return await apiService.post<ReportContent>(this.basePath, request);
  }

  // 2. GET /reportcontent/{id} - Get report by ID
  async getReportContentById(id: string): Promise<ApiResponse<ReportContent>> {
    return await apiService.get<ReportContent>(`${this.basePath}/${id}`);
  }

  // 3. PUT /reportcontent/{id} - Update report
  async updateReportContent(
    request: UpdateReportContentRequest
  ): Promise<ApiResponse<ReportContent>> {
    return await apiService.put<ReportContent>(
      `${this.basePath}/${request.Id}`,
      request
    );
  }

  // 4. DELETE /reportcontent/{id} - Delete report
  async deleteReportContent(id: string): Promise<ApiResponse<boolean>> {
    return await apiService.delete<boolean>(`${this.basePath}/${id}`);
  }

  // 5. POST /reportcontent/find - Find reports with filters
  async findReportContentsByFields(
    filters: FindReportContentRequest
  ): Promise<ApiResponse<ReportContent[]>> {
    return await apiService.post<ReportContent[]>(
      `${this.basePath}/find`,
      filters
    );
  }

  // 6. POST /reportcontent/{id}/review - Review report (moderator action)
  async reviewReportContent(
    request: ReviewReportContentRequest
  ): Promise<ApiResponse<ReportContent>> {
    return await apiService.post<ReportContent>(
      `${this.basePath}/${request.Id}/review`,
      request
    );
  }

  // 7. POST /reportcontent/{id}/resolve - Resolve report
  async resolveReportContent(
    request: ResolveReportContentRequest
  ): Promise<ApiResponse<ReportContent>> {
    return await apiService.post<ReportContent>(
      `${this.basePath}/${request.Id}/resolve`,
      request
    );
  }

  // 8. POST /reportcontent/{id}/dismiss - Dismiss report
  async dismissReportContent(
    request: DismissReportContentRequest
  ): Promise<ApiResponse<ReportContent>> {
    return await apiService.post<ReportContent>(
      `${this.basePath}/${request.Id}/dismiss`,
      request
    );
  }

  // 9. POST /reportcontent/bulk/resolve - Bulk resolve multiple reports
  async bulkResolveReports(
    request: BulkResolveReportsRequest
  ): Promise<ApiResponse<BulkOperationResult>> {
    return await apiService.post<BulkOperationResult>(
      `${this.basePath}/bulk/resolve`,
      request
    );
  }

  // 10. GET /reportcontent/stats - Get reporting statistics
  async getReportContentStats(): Promise<ApiResponse<ReportStats>> {
    return await apiService.get<ReportStats>(`${this.basePath}/stats`);
  }

  // 11. POST /reportcontent/{id}/evidence - Add evidence to report
  async addEvidence(
    request: AddEvidenceRequest
  ): Promise<ApiResponse<ReportContentEvidence>> {
    return await apiService.post<ReportContentEvidence>(
      `${this.basePath}/${request.ReportContentId}/evidence`,
      request
    );
  }

  // 12. GET /reportcontent/{id}/evidence - Get all evidence for report
  async getReportContentEvidence(
    reportId: string
  ): Promise<ApiResponse<ReportContentEvidence[]>> {
    return await apiService.get<ReportContentEvidence[]>(
      `${this.basePath}/${reportId}/evidence`
    );
  }

  // 13. DELETE /reportcontent/evidence/{evidenceId} - Remove evidence
  async removeEvidence(
    request: RemoveEvidenceRequest
  ): Promise<ApiResponse<boolean>> {
    return await apiService.delete<boolean>(
      `${this.basePath}/evidence/${request.EvidenceId}`
    );
  }

  // 14. GET /reportcontent/{id}/audit - Get audit trail for report
  async getReportContentAudit(
    reportId: string
  ): Promise<ApiResponse<ReportContentAudit[]>> {
    return await apiService.get<ReportContentAudit[]>(
      `${this.basePath}/${reportId}/audit`
    );
  }

  // Utility methods for common operations
  async getPendingReports(): Promise<ApiResponse<ReportContent[]>> {
    return this.findReportContentsByFields({ Status: 'pending' });
  }

  async getHighPriorityReports(): Promise<ApiResponse<ReportContent[]>> {
    return this.findReportContentsByFields({ Priority: ReportPriority.High });
  }

  async getReportsByContentId(
    contentId: string
  ): Promise<ApiResponse<ReportContent[]>> {
    return this.findReportContentsByFields({ ContentId: contentId });
  }

  async getReportsByUser(
    userId: string
  ): Promise<ApiResponse<ReportContent[]>> {
    return this.findReportContentsByFields({ ReporterUserId: userId });
  }
}

export const reportContentService = new ReportContentService();
