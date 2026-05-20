export interface AppealAttachmentView {
  name: string;
  uri: string;
  contentType?: string | null;
  storageKind: string;
  mediaKind: string;
  sizeBytes?: number | null;
  uploadedAt?: string | null;
}

export interface AppealDecisionLogView {
  operatorId: string;
  decision: string;
  decidedAt: string;
  note?: string | null;
}

export interface AppealTicketView {
  appealId: string;
  tableId: string;
  tournamentId: string;
  stageId: string;
  openedBy: string;
  description: string;
  attachments: AppealAttachmentView[];
  priority: string;
  assigneeId?: string | null;
  dueAt?: string | null;
  status: 'Open' | 'UnderReview' | 'Resolved' | 'Rejected' | 'Escalated';
  logs: AppealDecisionLogView[];
  reopenCount: number;
  createdAt: string;
  updatedAt: string;
  resolution?: string | null;
}

export type AppealTicketResponse = AppealTicketView;
