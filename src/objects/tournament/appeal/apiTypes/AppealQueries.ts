import type { AppealPriority, AppealStatus } from './TournamentAppealResponses';

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
