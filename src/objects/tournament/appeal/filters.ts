export interface AppealFilters {
  tournamentId?: string;
  stageId?: string;
  status?: 'Open' | 'UnderReview' | 'Resolved' | 'Rejected' | 'Escalated';
  tableId?: string;
  openedBy?: string;
  assigneeId?: string;
  priority?: string;
  overdueOnly?: boolean;
  limit?: number;
  offset?: number;
}
