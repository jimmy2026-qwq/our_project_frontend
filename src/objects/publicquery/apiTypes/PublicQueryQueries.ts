import type { StageStatus, TournamentStatus } from '@/objects/tournament';

export interface ScheduleQuery {
  tournamentStatus?: TournamentStatus;
  stageStatus?: StageStatus;
  limit?: number;
  offset?: number;
}

export interface PlayerLeaderboardQuery {
  clubId?: string;
  status?: 'Active' | 'Inactive' | 'Banned';
  limit?: number;
  offset?: number;
}

export interface PublicTournamentQuery {
  status?: TournamentStatus;
  organizer?: string;
  limit?: number;
  offset?: number;
}

export interface PublicClubQuery {
  name?: string;
  relation?: 'Alliance' | 'Rivalry' | 'Neutral';
  limit?: number;
  offset?: number;
}

export interface PublicClubLeaderboardQuery {
  name?: string;
  limit?: number;
  offset?: number;
}
