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
  RegisterPayload,
  SessionInfo,
  StageStatus,
  TournamentPublicProfile,
  TournamentTableSummary,
  TableStatus,
  TournamentStatus,
  AuthSession,
  LoginPayload,
  PlayerProfile,
} from '../domain/models';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api';

interface RequestOptions {
  headers?: HeadersInit;
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function readErrorMessage(response: Response) {
  const fallback = '请求失败，请稍后再试。';
  const contentType = response.headers.get('content-type') ?? '';

  try {
    if (contentType.includes('application/json')) {
      const payload = (await response.json()) as {
        message?: string;
        error?: string;
        detail?: string;
      };

      return payload.message?.trim() || payload.error?.trim() || payload.detail?.trim() || fallback;
    }

    const text = (await response.text()).trim();
    return text || fallback;
  } catch {
    return fallback;
  }
}

async function request<T>(path: string, options: RequestOptions = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: options.headers,
  });

  if (!response.ok) {
    throw new ApiError(response.status, await readErrorMessage(response));
  }

  return (await response.json()) as T;
}

async function sendJson<T>(path: string, method: 'POST', body: unknown, options: RequestOptions = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new ApiError(response.status, await readErrorMessage(response));
  }

  return (await response.json()) as T;
}

function encodeBackendOption<T>(value: T | undefined) {
  return value === undefined ? [] : [value];
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
  adminId?: string;
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

export interface CreatePlayerPayload {
  userId: string;
  nickname: string;
  rankPlatform: string;
  tier: string;
  stars?: number;
  initialElo?: number;
}

export interface CreatedPlayer {
  id: string;
  userId: string;
  nickname: string;
  elo: number;
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
  login(payload: LoginPayload) {
    return sendJson<AuthSession>('/auth/login', 'POST', payload);
  },
  register(payload: RegisterPayload) {
    return sendJson<AuthSession>('/auth/register', 'POST', payload);
  },
  getAuthSession(token: string) {
    return request<AuthSession>('/auth/session', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  logout(token: string) {
    return sendJson<{ success: boolean }>(
      '/auth/logout',
      'POST',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  },
  createPlayer(payload: CreatePlayerPayload) {
    return sendJson<CreatedPlayer>(
      '/players',
      'POST',
      {
        userId: payload.userId,
        nickname: payload.nickname,
        rankPlatform: payload.rankPlatform,
        tier: payload.tier,
        stars: encodeBackendOption(payload.stars),
        initialElo: payload.initialElo ?? 1500,
      },
    );
  },
  upgradeGuestSession(guestSessionId: string, playerId: string) {
    return sendJson<{ id: string; displayName: string; upgradedToPlayerId?: string }>(
      `/guest-sessions/${guestSessionId}/upgrade`,
      'POST',
      { playerId },
    );
  },
  revokeGuestSession(guestSessionId: string, reason?: string) {
    return sendJson<{ id: string; revokedAt?: string }>(
      `/guest-sessions/${guestSessionId}/revoke`,
      'POST',
      { reason: encodeBackendOption(reason) },
    );
  },
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
    return sendJson<GuestSession>('/guest-sessions', 'POST', {
      displayName: encodeBackendOption(payload.displayName),
      ttlHours: [],
      deviceFingerprint: [],
    });
  },
  getGuestSession(guestSessionId: string) {
    return request<GuestSession>(`/guest-sessions/${guestSessionId}`);
  },
  submitClubApplication(clubId: string, payload: ClubApplicationPayload) {
    return sendJson<ClubApplication>(`/clubs/${clubId}/applications`, 'POST', {
      applicantUserId: encodeBackendOption(undefined),
      displayName: payload.displayName,
      message: encodeBackendOption(payload.message),
      guestSessionId: encodeBackendOption(payload.guestSessionId),
      operatorId: encodeBackendOption(payload.operatorId),
    });
  },
  withdrawClubApplication(
    clubId: string,
    membershipId: string,
    payload: WithdrawClubApplicationPayload,
  ) {
    return sendJson<ClubApplication>(
      `/clubs/${clubId}/applications/${membershipId}/withdraw`,
      'POST',
      {
        guestSessionId: encodeBackendOption(payload.guestSessionId),
        operatorId: encodeBackendOption(payload.operatorId),
        note: encodeBackendOption(payload.note),
      },
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
      {
        operatorId: payload.operatorId,
        decision: payload.decision,
        note: encodeBackendOption(payload.note),
        playerId: encodeBackendOption(payload.playerId),
      },
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
