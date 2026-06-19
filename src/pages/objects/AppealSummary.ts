import type { AppealSummaryStatus } from './AppealSummaryStatus';

export interface AppealSummary {
  id: string;
  tournamentId: string;
  stageId: string;
  tableId: string;
  status: AppealSummaryStatus;
  openedBy: string;
  createdBy?: string;
  description: string;
  attachments?: string[];
  priority?: string | null;
  assigneeId?: string | null;
  dueAt?: string | null;
  createdAt: string;
  updatedAt?: string;
  resolution?: string | null;
  verdict?: string | null;
  reopenCount?: number;
}
