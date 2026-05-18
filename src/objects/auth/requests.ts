export interface SessionQuery {
  operatorId?: string;
  guestSessionId?: string;
}

export interface CreateGuestSessionPayload {
  displayName: string;
}

export interface DemoSummaryQuery {
  variant?: 'Basic' | 'Leaderboard' | 'Appeal';
  bootstrapIfMissing?: boolean;
  refreshDerived?: boolean;
}
