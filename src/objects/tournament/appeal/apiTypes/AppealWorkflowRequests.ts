export interface AppealAttachmentRequest {
  name: string;
  uri: string;
  contentType?: string | null;
  storageKind?: string | null;
  mediaKind?: string | null;
  checksum?: string | null;
  checksumAlgorithm?: string | null;
  sizeBytes?: number | null;
  uploadedAt?: string | null;
  retentionUntil?: string | null;
}

export interface FileAppealRequest {
  playerId: string;
  description: string;
  attachments?: AppealAttachmentRequest[];
  priority?: string;
  dueAt?: string;
}

export interface ResolveAppealRequest {
  operatorId: string;
  verdict: string;
  note?: string;
}

export interface AdjudicateAppealRequest {
  operatorId: string;
  decision: 'Resolve' | 'Reject' | 'Escalate';
  verdict: string;
  tableResolution?: 'RestorePriorState' | 'ArchiveTable' | 'ResumeScoring' | 'ResumePlay' | 'ForceReset';
  note?: string;
}

export interface UpdateAppealWorkflowRequest {
  operatorId: string;
  assigneeId?: string;
  clearAssignee?: boolean;
  priority?: string;
  dueAt?: string;
  clearDueAt?: boolean;
  note?: string;
}

export interface ReopenAppealRequest {
  operatorId: string;
  reason: string;
  note?: string;
}
