// Auto-generated from C# ReportContent entity. Do not edit manually.
import type { User } from './User';

export interface ReportContent {
  Id: string;
  ReportedContentId: string;
  ContentType: ContentType;
  ReporterId: string;
  ReportedUserId: string;
  Reason: ReportReason;
  Description: string | null;
  Status: ReportStatus;
  Priority: ReportPriority;
  ReviewedBy: string | null;
  ReviewedAt: string | null;
  Resolution: string | null;
  CreatedAt: string;
  UpdatedAt: string | null;
  IsActive: boolean;

  // Navigation properties (if included in responses)
  Reporter?: User;
  ReportedUser?: User;
  ReviewedByUser?: User;
}

export enum ContentType {
  Feed = 1,
  Comment = 2,
}

export enum ReportReason {
  Spam = 1,
  Harassment = 2,
  InappropriateContent = 3,
  Hate = 4,
  Violence = 5,
  Misinformation = 6,
  Other = 7,
}

export enum ReportStatus {
  Pending = 1,
  UnderReview = 2,
  Resolved = 3,
  Dismissed = 4,
}

export enum ReportPriority {
  Low = 1,
  Medium = 2,
  High = 3,
  Critical = 4,
}

// Helper functions for enum mapping
export const ContentTypeLabels = {
  [ContentType.Feed]: 'Post',
  [ContentType.Comment]: 'Comentario',
} as const;

export const ReportReasonLabels = {
  [ReportReason.Spam]: 'Spam',
  [ReportReason.Harassment]: 'Acoso',
  [ReportReason.InappropriateContent]: 'Contenido Inapropiado',
  [ReportReason.Hate]: 'Discurso de Odio',
  [ReportReason.Violence]: 'Violencia',
  [ReportReason.Misinformation]: 'Desinformación',
  [ReportReason.Other]: 'Otro',
} as const;

export const ReportStatusLabels = {
  [ReportStatus.Pending]: 'Pendiente',
  [ReportStatus.UnderReview]: 'En Revisión',
  [ReportStatus.Resolved]: 'Resuelto',
  [ReportStatus.Dismissed]: 'Descartado',
} as const;

export const ReportPriorityLabels = {
  [ReportPriority.Low]: 'Baja',
  [ReportPriority.Medium]: 'Media',
  [ReportPriority.High]: 'Alta',
  [ReportPriority.Critical]: 'Crítica',
} as const;

// Color mapping for UI
export const ReportStatusColors = {
  [ReportStatus.Pending]: '#6B7280', // gray
  [ReportStatus.UnderReview]: '#3B82F6', // blue
  [ReportStatus.Resolved]: '#10B981', // green
  [ReportStatus.Dismissed]: '#EF4444', // red muted
} as const;

export const ReportPriorityColors = {
  [ReportPriority.Low]: '#6B7280', // neutral
  [ReportPriority.Medium]: '#F59E0B', // amber
  [ReportPriority.High]: '#F97316', // orange
  [ReportPriority.Critical]: '#EF4444', // red
} as const;
