import type {
  AppealAttachmentMediaKind,
  AppealAttachmentStorageKind,
  AppealDecisionType,
  AppealPriority,
  AppealTableResolution,
} from './TournamentAppealResponses';

export interface AppealAttachmentRequest {
  name: string;
  uri: string;
  contentType?: string | null;
  storageKind?: AppealAttachmentStorageKind | null;
  mediaKind?: AppealAttachmentMediaKind | null;
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
  priority?: AppealPriority;
  dueAt?: string;
}

export interface ResolveAppealRequest {
  operatorId: string;
  verdict: string;
  note?: string;
}

export interface AdjudicateAppealRequest {
  operatorId: string;
  decision: AppealDecisionType;
  verdict: string;
  tableResolution?: AppealTableResolution;
  note?: string;
}

export interface UpdateAppealWorkflowRequest {
  operatorId: string;
  assigneeId?: string;
  clearAssignee?: boolean;
  priority?: AppealPriority;
  dueAt?: string;
  clearDueAt?: boolean;
  note?: string;
}

export interface ReopenAppealRequest {
  operatorId: string;
  reason: string;
  note?: string;
}
