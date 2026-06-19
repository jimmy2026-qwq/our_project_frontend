import type { AppealPriority, AppealStatus } from '@/objects/tournament/appeal';

export interface AppealSummary {
  id: string;
  tournamentId: string;
  stageId: string;
  tableId: string;
  status: AppealStatus;
  openedBy: string;
  createdBy?: string;
  description: string;
  attachments?: string[];
  priority?: AppealPriority | null;
  assigneeId?: string | null;
  dueAt?: string | null;
  createdAt: string;
  updatedAt?: string;
  resolution?: string | null;
  verdict?: string | null;
  reopenCount?: number;
}
