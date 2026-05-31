import type { AppealAttachmentView } from './AppealAttachmentView';
import type { AppealDecisionLog } from '../AppealDecisionLog';
import type { AppealPriority } from '../AppealPriority';
import type { AppealStatus } from '../AppealStatus';

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
  logs: AppealDecisionLog[];
  reopenCount: number;
  createdAt: string;
  updatedAt: string;
  resolution: string | null;
}
