import type { AppealPriority } from './AppealPriority';
import type { AppealStatus } from './AppealStatus';

export interface AppealListQuery {
  tournamentId?: string;
  stageId?: string;
  status?: AppealStatus;
  tableId?: string;
  openedBy?: string;
  assigneeId?: string;
  priority?: AppealPriority;
  overdueOnly?: boolean;
  dueBefore?: string;
  dueAfter?: string;
  asOf?: string;
  limit?: number;
  offset?: number;
}
