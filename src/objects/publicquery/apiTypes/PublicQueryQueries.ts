import type { PlayerStatus, StageStatus, TournamentStatus } from '@/objects/tournament';
import type { ClubRelationKind } from '@/objects/club';

export interface ScheduleQuery {
  tournamentStatus?: TournamentStatus;
  stageStatus?: StageStatus;
  limit?: number;
  offset?: number;
}

export interface PlayerLeaderboardQuery {
  clubId?: string;
  status?: PlayerStatus;
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
  relation?: ClubRelationKind;
  limit?: number;
  offset?: number;
}

export interface PublicClubLeaderboardQuery {
  name?: string;
  limit?: number;
  offset?: number;
}
