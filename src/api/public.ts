import type {
  ClubPublicProfile,
  ClubSummary,
  DashboardSummary,
  ListEnvelope,
  PublicSchedule,
  StageStatus,
  TournamentPublicProfile,
  TournamentStatus,
} from '../domain/models';
import { toQueryString } from '../lib/query';
import { mapEnvelope, request } from './http';

export interface ScheduleFilters {
  tournamentStatus?: TournamentStatus;
  stageStatus?: StageStatus;
  limit?: number;
  offset?: number;
}

export interface PlayerLeaderboardFilters {
  clubId?: string;
  status?: 'Active' | 'Inactive' | 'Banned';
  limit?: number;
  offset?: number;
}

interface RawPublicSchedule {
  tournamentId: string;
  tournamentName: string;
  tournamentStatus: TournamentStatus;
  stageId: string;
  stageName: string;
  stageStatus: StageStatus;
  startsAt: string;
}

interface RawPublicTournamentStage {
  stageId: string;
  name: string;
  status: 'Pending' | 'Ready' | 'Active' | 'Completed';
  roundCount: number;
  tableCount: number;
  pendingTablePlanCount: number;
}

interface RawPublicTournamentDetail {
  tournamentId: string;
  name: string;
  organizer: string;
  status: TournamentStatus;
  startsAt: string;
  endsAt: string;
  clubIds: string[];
  playerIds: string[];
  whitelistCount: number;
  stages: RawPublicTournamentStage[];
}

interface RawPublicClubRelation {
  relation: 'Alliance' | 'Rivalry' | 'Neutral';
}

interface RawPublicClubDirectoryEntry {
  clubId: string;
  name: string;
  memberCount: number;
  powerRating: number;
  treasuryBalance: number;
  relations: RawPublicClubRelation[];
}

interface RawPublicClubHonor {
  title: string;
}

interface RawPublicClubLineupMember {
  nickname: string;
}

interface RawPublicClubRecentMatch {
  tournamentId?: string;
  tournamentName: string;
}

interface RawPublicClubDetail {
  clubId: string;
  name: string;
  memberCount: number;
  powerRating: number;
  treasuryBalance?: number;
  relations?: RawPublicClubRelation[];
  honors?: RawPublicClubHonor[];
  applicationPolicy?: {
    requirementsText?: string | string[] | null;
    applicationsOpen?: boolean;
    expectedReviewSlaHours?: number | number[] | null;
  } | null;
  currentLineup?: RawPublicClubLineupMember[];
  recentMatches?: RawPublicClubRecentMatch[];
}

interface RawDashboardOwnerPlayer {
  playerId: string;
}

interface RawDashboardOwnerClub {
  clubId: string;
}

interface RawDashboard {
  owner:
    | { Player: RawDashboardOwnerPlayer }
    | { Club: RawDashboardOwnerClub };
  sampleSize: number;
  dealInRate: number;
  winRate: number;
  averageWinPoints: number;
  riichiRate: number;
  averagePlacement: number;
  topFinishRate: number;
  lastUpdatedAt: string;
  version: number;
}

export interface RawRankSnapshot {
  platform: string;
  tier: string;
  stars?: number | null;
}

export interface RawPlayerLeaderboardEntry {
  playerId: string;
  nickname: string;
  elo: number;
  currentRank?: RawRankSnapshot | null;
  normalizedRankScore?: number | null;
  clubIds: string[];
  status: 'Active' | 'Suspended' | 'Banned';
}

function mapPublicSchedule(item: RawPublicSchedule): PublicSchedule {
  return {
    tournamentId: item.tournamentId,
    tournamentName: item.tournamentName,
    tournamentStatus: item.tournamentStatus,
    stageId: item.stageId,
    stageName: item.stageName,
    stageStatus: item.stageStatus,
    scheduledAt: item.startsAt,
  };
}

function mapStageStatus(status: RawPublicTournamentStage['status']): StageStatus {
  return status === 'Ready' ? 'Pending' : status;
}

function mapTournamentWhitelistType(item: RawPublicTournamentDetail): TournamentPublicProfile['whitelistType'] {
  const hasClubParticipants = item.clubIds.length > 0;
  const hasDirectPlayers = item.playerIds.length > 0;

  if (hasClubParticipants && hasDirectPlayers) {
    return 'Mixed';
  }

  if (hasClubParticipants) {
    return 'Club';
  }

  return 'Player';
}

function mapPublicTournamentDetail(item: RawPublicTournamentDetail): TournamentPublicProfile {
  const nextStage =
    item.stages.find((stage) => stage.status === 'Active' || stage.status === 'Ready') ?? item.stages[0];

  return {
    id: item.tournamentId,
    name: item.name,
    status: item.status,
    tagline: `Organizer: ${item.organizer}`,
    description: `Public tournament detail includes ${item.stages.length} stage(s), ${item.playerIds.length} player slot(s), and ${item.whitelistCount} whitelist entry/entries.`,
    venue: item.organizer,
    stageCount: item.stages.length,
    whitelistType: mapTournamentWhitelistType(item),
    clubIds: item.clubIds,
    clubCount: item.clubIds.length,
    playerCount: item.playerIds.length,
    whitelistCount: item.whitelistCount,
    nextStageId: nextStage?.stageId ?? '',
    nextStageName: nextStage?.name ?? 'No stages available',
    nextStageStatus: nextStage ? mapStageStatus(nextStage.status) : 'Pending',
    nextScheduledAt: item.startsAt,
    stages: item.stages.map((stage) => ({
      stageId: stage.stageId,
      name: stage.name,
      status: mapStageStatus(stage.status),
      roundCount: stage.roundCount,
      tableCount: stage.tableCount,
      pendingTablePlanCount: stage.pendingTablePlanCount,
    })),
  };
}

function mapPublicClub(item: RawPublicClubDirectoryEntry): ClubSummary {
  return {
    id: item.clubId,
    name: item.name,
    memberCount: item.memberCount,
    powerRating: item.powerRating,
    treasury: item.treasuryBalance,
    relations: item.relations.map((relation) =>
      relation.relation === 'Alliance' ? 'Alliance' : 'Hostile',
    ),
  };
}

function mapPublicClubDetail(item: RawPublicClubDetail): ClubPublicProfile {
  const requirementsTextValue = item.applicationPolicy?.requirementsText;
  const requirementsText = Array.isArray(requirementsTextValue)
    ? requirementsTextValue.find((value) => value.trim().length > 0)
    : requirementsTextValue?.trim();
  const expectedReviewSlaValue = item.applicationPolicy?.expectedReviewSlaHours;
  const expectedReviewSlaHours = Array.isArray(expectedReviewSlaValue)
    ? expectedReviewSlaValue[0]
    : expectedReviewSlaValue;
  const honors = item.honors ?? [];
  const relations = item.relations ?? [];
  const currentLineup = item.currentLineup ?? [];
  const recentMatches = item.recentMatches ?? [];
  const applicationNote =
    item.applicationPolicy?.applicationsOpen === false
      ? 'Applications are currently closed.'
      : expectedReviewSlaHours
        ? `Expected review SLA: ${expectedReviewSlaHours} hours.`
        : 'Public recruitment policy is available from the backend detail endpoint.';

  return {
    id: item.clubId,
    name: item.name,
    slogan: honors[0]?.title ?? 'Public club profile',
    description: requirementsText || applicationNote,
    memberCount: item.memberCount,
    powerRating: item.powerRating,
    treasury: item.treasuryBalance ?? 0,
    relations: relations.map((relation) =>
      relation.relation === 'Alliance' ? 'Alliance' : 'Hostile',
    ),
    featuredPlayers: currentLineup.map((member) => member.nickname),
    activeTournaments: recentMatches.map((match, index) => ({
      id: match.tournamentId ?? `${item.clubId}-recent-${index}`,
      name: match.tournamentName,
      source: 'recent' as const,
    })),
  };
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

function formatDecimal(value: number) {
  return value.toFixed(2);
}

function mapDashboard(item: RawDashboard): DashboardSummary {
  const ownerId = 'Player' in item.owner ? item.owner.Player.playerId : item.owner.Club.clubId;
  const ownerType = 'Player' in item.owner ? 'player' : 'club';
  const subjectLabel = ownerType === 'player' ? 'Player dashboard' : 'Club dashboard';

  return {
    ownerId,
    ownerType,
    headline: `${subjectLabel} synced from the backend aggregate.`,
    metrics: [
      {
        label: 'Sample size',
        value: String(item.sampleSize),
        accent: 'gold',
      },
      {
        label: 'Win rate',
        value: formatPercent(item.winRate),
        accent: 'teal',
      },
      {
        label: 'Avg placement',
        value: formatDecimal(item.averagePlacement || 0),
      },
      {
        label: 'Riichi rate',
        value: formatPercent(item.riichiRate),
      },
    ],
  };
}

export const publicApi = {
  getPublicSchedules(filters: ScheduleFilters) {
    return request<ListEnvelope<RawPublicSchedule>>(
      `/public/schedules${toQueryString(filters)}`,
    ).then((envelope) => mapEnvelope(envelope, mapPublicSchedule));
  },
  getPublicPlayerLeaderboard(filters: PlayerLeaderboardFilters) {
    return request<ListEnvelope<RawPlayerLeaderboardEntry>>(
      `/public/leaderboards/players${toQueryString(filters)}`,
    );
  },
  getPublicClubs() {
    return request<ListEnvelope<RawPublicClubDirectoryEntry>>('/public/clubs').then((envelope) =>
      mapEnvelope(envelope, mapPublicClub),
    );
  },
  getPublicTournamentProfile(tournamentId: string) {
    return request<RawPublicTournamentDetail>(`/public/tournaments/${tournamentId}`).then(
      mapPublicTournamentDetail,
    );
  },
  getPublicClubProfile(clubId: string) {
    return request<RawPublicClubDetail>(`/public/clubs/${clubId}`).then(mapPublicClubDetail);
  },
  getPlayerDashboard(playerId: string, operatorId: string) {
    return request<RawDashboard>(
      `/dashboards/players/${playerId}${toQueryString({ operatorId })}`,
    ).then(mapDashboard);
  },
  getClubDashboard(clubId: string, operatorId: string) {
    return request<RawDashboard>(
      `/dashboards/clubs/${clubId}${toQueryString({ operatorId })}`,
    ).then(mapDashboard);
  },
};
