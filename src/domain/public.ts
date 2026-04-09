import type { StageStatus, TournamentStatus } from './common';

export interface PublicSchedule {
  tournamentId: string;
  tournamentName: string;
  tournamentStatus: TournamentStatus;
  stageId: string;
  stageName: string;
  stageStatus: StageStatus;
  scheduledAt: string;
  endsAt?: string;
  currentRound?: number;
  roundCount?: number;
  tableCount?: number;
  activeTableCount?: number;
  pendingTablePlanCount?: number;
  participantCount?: number;
  whitelistCount?: number;
  isUnpublished?: boolean;
}

export interface PlayerLeaderboardEntry {
  playerId: string;
  nickname: string;
  clubName: string;
  clubIds?: string[];
  elo: number;
  rank: number;
  currentRank?: string | null;
  currentRankSnapshot?: {
    platform: string;
    tier: string;
    stars?: number | null;
  } | null;
  normalizedRankScore?: number | null;
  status: 'Active' | 'Inactive' | 'Banned';
}

export interface ClubSummary {
  id: string;
  name: string;
  memberCount: number;
  activeMemberCount?: number;
  adminCount?: number;
  powerRating: number;
  treasury: number;
  totalPoints?: number;
  pointPool?: number;
  allianceCount?: number;
  rivalryCount?: number;
  strongestRivalClubId?: string | null;
  strongestRivalPower?: number | null;
  honorTitles?: string[];
  relations: Array<'Alliance' | 'Hostile'>;
}

export interface TournamentPublicProfile {
  id: string;
  name: string;
  organizer?: string;
  status: TournamentStatus;
  tagline: string;
  description: string;
  venue: string;
  startsAt?: string;
  endsAt?: string;
  stageCount: number;
  activeStageCount?: number;
  participantCount?: number;
  whitelistType: 'Club' | 'Player' | 'Mixed';
  clubIds?: string[];
  clubCount?: number;
  playerCount?: number;
  whitelistCount?: number;
  nextStageId: string;
  nextStageName: string;
  nextStageStatus: StageStatus;
  nextScheduledAt: string;
  stages?: Array<{
    stageId: string;
    name: string;
    format?: string;
    order?: number;
    status: StageStatus;
    currentRound?: number;
    roundCount: number;
    tableCount: number;
    archivedTableCount?: number;
    pendingTablePlanCount: number;
    standings?: unknown | null;
    bracket?: unknown | null;
  }>;
}

export interface ClubPublicProfile {
  id: string;
  name: string;
  slogan: string;
  description: string;
  memberCount: number;
  activeMemberCount?: number;
  adminCount?: number;
  powerRating: number;
  treasury: number;
  totalPoints?: number;
  pointPool?: number;
  relations: Array<'Alliance' | 'Hostile'>;
  honors?: Array<{
    title: string;
    achievedAt?: string;
    note?: string;
  }>;
  applicationPolicy?: {
    applicationsOpen: boolean;
    requirementsText?: string | null;
    expectedReviewSlaHours?: number | null;
    pendingApplicationCount?: number;
  };
  featuredPlayers: string[];
  currentLineup?: Array<{
    playerId?: string;
    nickname: string;
    elo?: number;
    currentRank?: {
      platform: string;
      tier: string;
      stars?: number | null;
    } | null;
    status?: 'Active' | 'Inactive' | 'Banned';
    isAdmin?: boolean;
    internalTitle?: string | null;
    privileges?: string[];
  }>;
  recentMatches?: Array<{
    matchRecordId?: string;
    tournamentId?: string;
    tournamentName: string;
    stageId?: string;
    stageName?: string;
    tableId?: string;
    generatedAt?: string;
  }>;
  activeTournaments: Array<{
    id: string;
    name: string;
    status?: TournamentStatus;
    source?: 'recent' | 'invited';
  }>;
}

export interface DemoSummary {
  publicSchedules?: PublicSchedule[];
  publicClubDirectory?: ClubSummary[];
  playerLeaderboard?: PlayerLeaderboardEntry[];
  recommendedOperatorId?: string;
}
