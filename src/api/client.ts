import { toQueryString } from '../lib/query';
import type {
  AppealSummary,
  ClubApplication,
  ClubApplicationView,
  ClubPublicProfile,
  ClubSummary,
  DashboardSummary,
  DemoSummary,
  GuestSession,
  ListEnvelope,
  MatchRecordSummary,
  PublicSchedule,
  SessionInfo,
  StageStatus,
  TournamentPublicProfile,
  TournamentTableSummary,
  TableStatus,
  TournamentStatus,
  PlayerProfile,
} from '../domain/models';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api';

async function request<T>(path: string) {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

async function sendJson<T>(path: string, method: 'POST', body: unknown) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

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

export interface ClubFilters {
  activeOnly?: boolean;
  joinableOnly?: boolean;
  memberId?: string;
  limit?: number;
  offset?: number;
}

export interface RecordFilters {
  tournamentId?: string;
  stageId?: string;
  playerId?: string;
  limit?: number;
  offset?: number;
}

export interface AppealFilters {
  tournamentId?: string;
  status?: 'Open' | 'Resolved' | 'Rejected' | 'Escalated';
  tableId?: string;
  limit?: number;
  offset?: number;
}

export interface TableFilters {
  status?: TableStatus;
  playerId?: string;
  limit?: number;
  offset?: number;
}

export interface CreateGuestSessionPayload {
  displayName: string;
}

export interface ClubApplicationPayload {
  guestSessionId?: string;
  operatorId?: string;
  displayName?: string;
  message: string;
}

export interface WithdrawClubApplicationPayload {
  guestSessionId?: string;
  operatorId?: string;
  note?: string;
}

export interface SessionQuery {
  operatorId?: string;
  guestSessionId?: string;
}

export interface ClubApplicationListFilters {
  operatorId: string;
  status?: ClubApplicationView['status'];
  applicantUserId?: string;
  displayName?: string;
  limit?: number;
  offset?: number;
}

export interface ReviewClubApplicationPayload {
  operatorId: string;
  decision: 'approve' | 'reject';
  note?: string;
  playerId?: string;
}

export interface DemoSummaryQuery {
  variant?: 'Basic' | 'Leaderboard' | 'Appeal';
  bootstrapIfMissing?: boolean;
  refreshDerived?: boolean;
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

function mapEnvelope<TIn, TOut>(
  envelope: ListEnvelope<TIn>,
  mapper: (item: TIn) => TOut,
): ListEnvelope<TOut> {
  return {
    ...envelope,
    items: envelope.items.map(mapper),
  };
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
    activeTournaments: recentMatches.map((match) => match.tournamentName),
  };
}

export const apiClient = {
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
  getClubs(filters: ClubFilters) {
    return request<ListEnvelope<ClubSummary>>(`/clubs${toQueryString(filters)}`);
  },
  getPublicClubs() {
    return request<ListEnvelope<RawPublicClubDirectoryEntry>>('/public/clubs').then((envelope) =>
      mapEnvelope(envelope, mapPublicClub),
    );
  },
  getSession(filters: SessionQuery) {
    return request<SessionInfo>(`/session${toQueryString(filters)}`);
  },
  getCurrentPlayer(operatorId: string) {
    return request<PlayerProfile>(`/players/me${toQueryString({ operatorId })}`);
  },
  getDemoSummary(filters: DemoSummaryQuery = {}) {
    return request<DemoSummary>(
      `/demo/summary${toQueryString({
        variant: filters.variant ?? 'Basic',
        bootstrapIfMissing: filters.bootstrapIfMissing ?? true,
        refreshDerived: filters.refreshDerived ?? true,
      })}`,
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
  createGuestSession(payload: CreateGuestSessionPayload) {
    return sendJson<GuestSession>('/guest-sessions', 'POST', payload);
  },
  getGuestSession(guestSessionId: string) {
    return request<GuestSession>(`/guest-sessions/${guestSessionId}`);
  },
  submitClubApplication(clubId: string, payload: ClubApplicationPayload) {
    return sendJson<ClubApplication>(`/clubs/${clubId}/applications`, 'POST', payload);
  },
  withdrawClubApplication(
    clubId: string,
    membershipId: string,
    payload: WithdrawClubApplicationPayload,
  ) {
    return sendJson<ClubApplication>(
      `/clubs/${clubId}/applications/${membershipId}/withdraw`,
      'POST',
      payload,
    );
  },
  getClubApplications(clubId: string, filters: ClubApplicationListFilters) {
    return request<ListEnvelope<ClubApplicationView>>(
      `/clubs/${clubId}/applications${toQueryString(filters)}`,
    );
  },
  getClubApplication(clubId: string, membershipId: string, filters: SessionQuery) {
    return request<ClubApplicationView>(
      `/clubs/${clubId}/applications/${membershipId}${toQueryString(filters)}`,
    );
  },
  reviewClubApplication(
    clubId: string,
    membershipId: string,
    payload: ReviewClubApplicationPayload,
  ) {
    return sendJson<ClubApplicationView>(
      `/clubs/${clubId}/applications/${membershipId}/review`,
      'POST',
      payload,
    );
  },
  getPlayerDashboard(playerId: string, operatorId: string) {
    return request<DashboardSummary>(
      `/dashboards/players/${playerId}${toQueryString({ operatorId })}`,
    );
  },
  getClubDashboard(clubId: string, operatorId: string) {
    return request<DashboardSummary>(
      `/dashboards/clubs/${clubId}${toQueryString({ operatorId })}`,
    );
  },
  getTournamentTables(tournamentId: string, stageId: string, filters: TableFilters) {
    return request<ListEnvelope<TournamentTableSummary>>(
      `/tournaments/${tournamentId}/stages/${stageId}/tables${toQueryString(filters)}`,
    );
  },
  getRecords(filters: RecordFilters) {
    return request<ListEnvelope<MatchRecordSummary>>(`/records${toQueryString(filters)}`);
  },
  getAppeals(filters: AppealFilters) {
    return request<ListEnvelope<AppealSummary>>(`/appeals${toQueryString(filters)}`);
  },
  buildTournamentTablesPath(tournamentId: string, stageId: string, filters: TableFilters) {
    return `/tournaments/${tournamentId}/stages/${stageId}/tables${toQueryString(filters)}`;
  },
  buildRecordsPath(filters: RecordFilters) {
    return `/records${toQueryString(filters)}`;
  },
  buildAppealsPath(filters: AppealFilters) {
    return `/appeals${toQueryString(filters)}`;
  },
  buildDictionaryEntryPath(key: string) {
    return `/dictionary/${key}`;
  },
  buildDictionaryListPath(prefix: string, limit = 20, offset = 0) {
    return `/dictionary${toQueryString({ prefix, limit, offset })}`;
  },
  buildDictionaryAuditPath(key: string, operatorId: string, eventType?: string, limit = 20) {
    return `/audits/dictionary/${key}${toQueryString({ operatorId, eventType, limit })}`;
  },
};
