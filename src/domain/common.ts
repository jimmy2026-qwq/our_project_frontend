export type Role =
  | 'Guest'
  | 'RegisteredPlayer'
  | 'ClubAdmin'
  | 'TournamentAdmin'
  | 'SuperAdmin';

export type TournamentStatus =
  | 'Draft'
  | 'Registration'
  | 'RegistrationOpen'
  | 'InProgress'
  | 'Finished';

export type StageStatus = 'Pending' | 'Active' | 'Completed';

export type TableStatus =
  | 'WaitingPreparation'
  | 'InProgress'
  | 'Scoring'
  | 'Archived'
  | 'AppealPending';

export interface ListEnvelope<T, F = Record<string, unknown>> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
  appliedFilters: F;
}
