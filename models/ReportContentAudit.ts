// Auto-generated from C# ReportContentAudit entity. Do not edit manually.

export interface ReportContentAudit {
  Id: string;
  ReportContentId: string;
  Action: AuditAction;
  SnapshotJson: string;
  ActorUserId: string;
  CreatedAt: string;

  // Navigation properties (if included)
  Actor?: {
    id: string;
    name: string;
  };
}

export enum AuditAction {
  Created = 'created',
  Updated = 'updated',
  Reviewed = 'reviewed',
  Resolved = 'resolved',
  Dismissed = 'dismissed',
  EvidenceAdded = 'evidence_added',
  EvidenceRemoved = 'evidence_removed',
}

export const AuditActionLabels = {
  [AuditAction.Created]: 'Creado',
  [AuditAction.Updated]: 'Actualizado',
  [AuditAction.Reviewed]: 'Revisado',
  [AuditAction.Resolved]: 'Resuelto',
  [AuditAction.Dismissed]: 'Descartado',
  [AuditAction.EvidenceAdded]: 'Evidencia Añadida',
  [AuditAction.EvidenceRemoved]: 'Evidencia Eliminada',
} as const;

export const AuditActionColors = {
  [AuditAction.Created]: '#10B981', // green
  [AuditAction.Updated]: '#3B82F6', // blue
  [AuditAction.Reviewed]: '#F59E0B', // amber
  [AuditAction.Resolved]: '#10B981', // green
  [AuditAction.Dismissed]: '#EF4444', // red
  [AuditAction.EvidenceAdded]: '#8B5CF6', // purple
  [AuditAction.EvidenceRemoved]: '#F97316', // orange
} as const;
