export type AppealAttachmentStorageKind =
  | 'ExternalUrl'
  | 'ObjectStore'
  | 'SignedUrl'
  | 'InternalReference';

export type AppealAttachmentMediaKind =
  | 'Image'
  | 'Video'
  | 'Document'
  | 'Log'
  | 'Archive'
  | 'Other';

export type AppealPriority = 'Low' | 'Normal' | 'High' | 'Critical';
export type AppealStatus = 'Open' | 'UnderReview' | 'Resolved' | 'Rejected' | 'Escalated';
export type AppealDecisionType = 'Resolve' | 'Reject' | 'Escalate';
export type AppealTableResolution =
  | 'RestorePriorState'
  | 'ArchiveTable'
  | 'ResumeScoring'
  | 'ResumePlay'
  | 'ForceReset';

export interface AppealAttachmentView {
  name: string;
  uri: string;
  contentType: string | null;
  storageKind: AppealAttachmentStorageKind;
  mediaKind: AppealAttachmentMediaKind;
  sizeBytes: number | null;
  uploadedAt: string | null;
}

export interface AppealDecisionLogView {
  operatorId: string;
  decision: string;
  decidedAt: string;
  note: string | null;
}

export interface AppealTicketView {
  appealId: string;
  tableId: string;
  tournamentId: string;
  stageId: string;
  openedBy: string;
  description: string;
  attachments: AppealAttachmentView[];
  priority: AppealPriority;
  assigneeId: string | null;
  dueAt: string | null;
  status: AppealStatus;
  logs: AppealDecisionLogView[];
  reopenCount: number;
  createdAt: string;
  updatedAt: string;
  resolution: string | null;
}

export type AppealTicketResponse = AppealTicketView;
