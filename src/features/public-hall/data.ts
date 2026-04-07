import { publicApi, type RawPlayerLeaderboardEntry } from '@/api/public';
import { operationsApi, type RawTournamentDetail } from '@/api/operations';
import type {
  ClubPublicProfile,
  ClubSummary,
  PlayerLeaderboardEntry,
  PublicSchedule,
  TournamentPublicProfile,
} from '@/domain/models';
import {
  mockClubProfiles,
  mockClubs,
  mockLeaderboard,
  mockSchedules,
  mockTournamentProfiles,
  toMockEnvelope,
} from '@/mocks/overview';

import type {
  ClubDetailState,
  HomeDataPayload,
  LeaderboardDataPayload,
  LoadState,
  PublicHallState,
  PublicHallViewerContext,
  TournamentDetailState,
} from './types';

function mapLeaderboardStatus(status: RawPlayerLeaderboardEntry['status']): PlayerLeaderboardEntry['status'] {
  return status === 'Suspended' ? 'Inactive' : status;
}

function formatRankLabel(rank?: RawPlayerLeaderboardEntry['currentRank']) {
  if (!rank) {
    return null;
  }

  return rank.stars ? `${rank.platform} ${rank.tier} ${rank.stars}` : `${rank.platform} ${rank.tier}`;
}

export const DEFAULT_PUBLIC_HALL_STATE: PublicHallState = {
  activeView: 'schedules',
  scheduleTournamentStatus: 'InProgress',
  scheduleStageStatus: 'Active',
  leaderboardClubId: '',
  leaderboardStatus: 'Active',
  clubActiveOnly: true,
};

const HOME_DATA_CACHE_TTL_MS = 15_000;

const homeDataCache = new Map<string, { payload: HomeDataPayload; cachedAt: number }>();
const homeDataRequests = new Map<string, Promise<HomeDataPayload>>();

function buildHomeDataKey(state: PublicHallState, context: PublicHallViewerContext) {
  const session = context.session;
  return JSON.stringify({
    scheduleTournamentStatus: state.scheduleTournamentStatus,
    scheduleStageStatus: state.scheduleStageStatus,
    leaderboardClubId: state.leaderboardClubId,
    leaderboardStatus: state.leaderboardStatus,
    clubActiveOnly: state.clubActiveOnly,
    operatorId: session?.user.operatorId ?? session?.user.userId ?? '',
    isTournamentAdmin: session?.user.roles.isTournamentAdmin ?? false,
    isSuperAdmin: session?.user.roles.isSuperAdmin ?? false,
  });
}

export function getCachedPublicHallHomeData(
  state: PublicHallState,
  context: PublicHallViewerContext = { session: null },
) {
  const cacheKey = buildHomeDataKey(state, context);
  const cached = homeDataCache.get(cacheKey);

  if (!cached || Date.now() - cached.cachedAt >= HOME_DATA_CACHE_TTL_MS) {
    return null;
  }

  return cached.payload;
}

export function peekPublicHallHomeData(
  state: PublicHallState,
  context: PublicHallViewerContext = { session: null },
) {
  return homeDataCache.get(buildHomeDataKey(state, context))?.payload ?? null;
}

export async function loadSchedules(state: PublicHallState): Promise<LoadState<PublicSchedule>> {
  try {
    const envelope = await publicApi.getPublicSchedules({
      tournamentStatus: state.scheduleTournamentStatus || undefined,
      stageStatus: state.scheduleStageStatus || undefined,
    });
    return { envelope, source: 'api' };
  } catch (error) {
    const items = mockSchedules.filter((item) => {
      const tournamentMatch =
        !state.scheduleTournamentStatus || item.tournamentStatus === state.scheduleTournamentStatus;
      const stageMatch = !state.scheduleStageStatus || item.stageStatus === state.scheduleStageStatus;
      return tournamentMatch && stageMatch;
    });

    return {
      envelope: toMockEnvelope(items, {
        tournamentStatus: state.scheduleTournamentStatus,
        stageStatus: state.scheduleStageStatus,
      }),
      source: 'mock',
      warning: error instanceof Error ? error.message : 'Public schedules fallback to mock.',
    };
  }
}

async function loadManagedDraftSchedules(context: PublicHallViewerContext): Promise<PublicSchedule[]> {
  const session = context.session;
  const operatorId = session?.user.operatorId ?? session?.user.userId;
  const canManageTournament =
    !!session?.user.roles.isRegisteredPlayer &&
    (session.user.roles.isSuperAdmin || session.user.roles.isTournamentAdmin);

  if (!canManageTournament || !operatorId) {
    return [];
  }

  const tournaments = await operationsApi.getTournaments({
    adminId: operatorId,
    status: 'Draft',
    limit: 50,
    offset: 0,
  });

  const stagesByTournament = await Promise.all(
    tournaments.items.map(async (tournament) => {
      const detail = await operationsApi.getTournament(tournament.id);
      const stages = detail.stages ?? [];

      if (stages.length === 0) {
        return [
          {
            tournamentId: detail.id,
            tournamentName: detail.name,
            tournamentStatus: 'Draft',
            stageId: `${detail.id}-draft-stage`,
            stageName: 'Draft stage',
            stageStatus: 'Pending',
            scheduledAt: detail.startsAt,
            isUnpublished: true,
          } satisfies PublicSchedule,
        ];
      }

      return stages.map((stage) => ({
        tournamentId: detail.id,
        tournamentName: detail.name,
        tournamentStatus: 'Draft',
        stageId: stage.id,
        stageName: stage.name,
        stageStatus: mapAdminStageStatus(stage.status),
        scheduledAt: detail.startsAt,
        isUnpublished: true,
      } satisfies PublicSchedule));
    }),
  );

  return stagesByTournament.flat().sort((left, right) => Date.parse(left.scheduledAt) - Date.parse(right.scheduledAt));
}

export async function loadClubs(state: PublicHallState): Promise<LoadState<ClubSummary>> {
  try {
    const envelope = await publicApi.getPublicClubs();
    return { envelope, source: 'api' };
  } catch (error) {
    return {
      envelope: toMockEnvelope(mockClubs, { activeOnly: state.clubActiveOnly }),
      source: 'mock',
      warning: error instanceof Error ? error.message : 'Club directory fallback to mock.',
    };
  }
}

export async function loadLeaderboard(
  state: PublicHallState,
  clubs: LoadState<ClubSummary>,
): Promise<LoadState<PlayerLeaderboardEntry>> {
  try {
    const envelope = await publicApi.getPublicPlayerLeaderboard({
      clubId: state.leaderboardClubId || undefined,
      status: state.leaderboardStatus || undefined,
    });

    const clubNamesById = new Map(clubs.envelope.items.map((club) => [club.id, club.name]));
    return {
      envelope: {
        ...envelope,
        items: envelope.items.map((item, index) => ({
          playerId: item.playerId,
          nickname: item.nickname,
          clubName: item.clubIds.map((clubId) => clubNamesById.get(clubId) ?? clubId).join(' / '),
          elo: item.elo,
          rank: index + 1 + envelope.offset,
          currentRank: formatRankLabel(item.currentRank),
          normalizedRankScore: item.normalizedRankScore,
          status: mapLeaderboardStatus(item.status),
        })),
      },
      source: 'api',
    };
  } catch (error) {
    const selectedClubName = mockClubs.find((club) => club.id === state.leaderboardClubId)?.name;
    const items = mockLeaderboard.filter((item) => {
      const clubMatch = !selectedClubName || item.clubName === selectedClubName;
      const statusMatch = !state.leaderboardStatus || item.status === state.leaderboardStatus;
      return clubMatch && statusMatch;
    });

    return {
      envelope: toMockEnvelope(items, {
        clubId: state.leaderboardClubId,
        status: state.leaderboardStatus,
      }),
      source: 'mock',
      warning: error instanceof Error ? error.message : 'Player leaderboard fallback to mock.',
    };
  }
}

export async function loadPublicHallHomeData(
  state: PublicHallState,
  context: PublicHallViewerContext = { session: null },
): Promise<HomeDataPayload> {
  const cacheKey = buildHomeDataKey(state, context);
  const cached = homeDataCache.get(cacheKey);

  if (cached && Date.now() - cached.cachedAt < HOME_DATA_CACHE_TTL_MS) {
    return cached.payload;
  }

  const inFlightRequest = homeDataRequests.get(cacheKey);

  if (inFlightRequest) {
    return inFlightRequest;
  }

  const request = (async () => {
    const [schedules, clubs, draftSchedules] = await Promise.all([
      loadSchedules(state),
      loadClubs(state),
      loadManagedDraftSchedules(context),
    ]);
    const mergedSchedules =
      draftSchedules.length > 0
        ? {
            ...schedules,
            envelope: {
              ...schedules.envelope,
              items: [
                ...draftSchedules,
                ...schedules.envelope.items.filter(
                  (item) =>
                    !draftSchedules.some(
                      (draft) =>
                        draft.tournamentId === item.tournamentId &&
                        draft.stageId === item.stageId,
                    ),
                ),
              ],
              total: draftSchedules.length + schedules.envelope.items.length,
            },
          }
        : schedules;
    const payload = { schedules: mergedSchedules, clubs };
    homeDataCache.set(cacheKey, { payload, cachedAt: Date.now() });
    return payload;
  })();

  homeDataRequests.set(cacheKey, request);

  try {
    return await request;
  } finally {
    homeDataRequests.delete(cacheKey);
  }
}

const leaderboardCache = new Map<string, { payload: LeaderboardDataPayload; cachedAt: number }>();
const leaderboardRequests = new Map<string, Promise<LeaderboardDataPayload>>();

function buildLeaderboardKey(state: PublicHallState) {
  return JSON.stringify({
    leaderboardClubId: state.leaderboardClubId,
    leaderboardStatus: state.leaderboardStatus,
  });
}

export function getCachedPublicHallLeaderboardData(state: PublicHallState) {
  const cacheKey = buildLeaderboardKey(state);
  const cached = leaderboardCache.get(cacheKey);

  if (!cached || Date.now() - cached.cachedAt >= HOME_DATA_CACHE_TTL_MS) {
    return null;
  }

  return cached.payload;
}

export function peekPublicHallLeaderboardData(state: PublicHallState) {
  return leaderboardCache.get(buildLeaderboardKey(state))?.payload ?? null;
}

export async function loadPublicHallLeaderboardData(
  state: PublicHallState,
  clubs: LoadState<ClubSummary>,
): Promise<LeaderboardDataPayload> {
  const cacheKey = buildLeaderboardKey(state);
  const cached = leaderboardCache.get(cacheKey);

  if (cached && Date.now() - cached.cachedAt < HOME_DATA_CACHE_TTL_MS) {
    return cached.payload;
  }

  const inFlightRequest = leaderboardRequests.get(cacheKey);

  if (inFlightRequest) {
    return inFlightRequest;
  }

  const request = (async () => {
    const leaderboard = await loadLeaderboard(state, clubs);
    const payload = { leaderboard };
    leaderboardCache.set(cacheKey, { payload, cachedAt: Date.now() });
    return payload;
  })();

  leaderboardRequests.set(cacheKey, request);

  try {
    return await request;
  } finally {
    leaderboardRequests.delete(cacheKey);
  }
}

export async function loadTournamentDetail(tournamentId: string): Promise<TournamentDetailState> {
  try {
    const item = await publicApi.getPublicTournamentProfile(tournamentId);
    return { item, source: 'api' };
  } catch (error) {
    try {
      const draftItem = await operationsApi.getTournament(tournamentId);
      return {
        item: mapTournamentDetailFromAdminView(draftItem),
        source: 'api',
        warning: 'This tournament is still in draft mode and is shown through the admin endpoint.',
      };
    } catch {
      // fall through to mock
    }

    return {
      item: mockTournamentProfiles.find((profile) => profile.id === tournamentId) ?? null,
      source: 'mock',
      warning: error instanceof Error ? error.message : 'Tournament detail fallback to mock.',
    };
  }
}

function mapTournamentDetailFromAdminView(item: RawTournamentDetail): TournamentPublicProfile {
  const stages = item.stages ?? [];
  const nextStage = stages[0];

  return {
    id: item.id,
    name: item.name,
    status: (item.status as TournamentPublicProfile['status']) ?? 'Draft',
    tagline: `Organizer: ${item.organizer}`,
    description: `Draft tournament detail loaded from the admin endpoint with ${stages.length} stage(s).`,
    venue: item.organizer,
    stageCount: stages.length,
    whitelistType:
      item.participatingClubs?.length && item.participatingPlayers?.length
        ? 'Mixed'
        : item.participatingClubs?.length
          ? 'Club'
          : 'Player',
    clubIds: item.participatingClubs ?? [],
    clubCount: item.participatingClubs?.length ?? 0,
    playerCount: item.participatingPlayers?.length ?? 0,
    whitelistCount: item.whitelist?.length ?? 0,
    nextStageId: nextStage?.id ?? '',
    nextStageName: nextStage?.name ?? 'No stages available',
    nextStageStatus: mapAdminStageStatus(nextStage?.status),
    nextScheduledAt: item.startsAt,
    stages: stages.map((stage) => ({
      stageId: stage.id,
      name: stage.name,
      status: mapAdminStageStatus(stage.status),
      roundCount: stage.roundCount ?? 0,
      tableCount: 0,
      pendingTablePlanCount: stage.pendingTablePlans?.length ?? 0,
    })),
  };
}

function mapAdminStageStatus(status?: string): TournamentPublicProfile['nextStageStatus'] {
  if (status === 'Active') {
    return 'Active';
  }

  if (status === 'Completed') {
    return 'Completed';
  }

  return 'Pending';
}

export async function loadClubDetail(clubId: string): Promise<ClubDetailState> {
  try {
    const [item, invitedTournaments] = await Promise.all([
      publicApi.getPublicClubProfile(clubId),
      loadInvitedClubTournaments(clubId),
    ]);
    return {
      item: {
        ...item,
        activeTournaments: mergeClubTournaments(item.activeTournaments, invitedTournaments),
      },
      source: 'api',
    };
  } catch (error) {
    const fallbackClub = mockClubs.find((club) => club.id === clubId);
    return {
      item:
        mockClubProfiles.find((profile) => profile.id === clubId) ??
        (fallbackClub
          ? {
              id: fallbackClub.id,
              name: fallbackClub.name,
              slogan: 'Public club profile',
              description:
                'Club detail fell back to the directory payload because the full public detail response was unavailable.',
              memberCount: fallbackClub.memberCount,
              powerRating: fallbackClub.powerRating,
              treasury: fallbackClub.treasury,
              relations: fallbackClub.relations,
              featuredPlayers: [],
              activeTournaments: [],
            }
          : null),
      source: 'mock',
      warning: error instanceof Error ? error.message : 'Club detail fallback to mock.',
    };
  }
}

async function loadInvitedClubTournaments(clubId: string): Promise<ClubPublicProfile['activeTournaments']> {
  try {
    const tournaments = await operationsApi.getTournaments({ limit: 100, offset: 0 });
    const details = await Promise.all(
      tournaments.items.map((tournament) => operationsApi.getTournament(tournament.id)),
    );

    return details
      .filter((tournament) => (tournament.participatingClubs ?? []).includes(clubId))
      .map((tournament) => ({
        id: tournament.id,
        name: tournament.name,
        status: tournament.status as TournamentPublicProfile['status'],
        source: 'invited' as const,
      }));
  } catch {
    return [];
  }
}

function mergeClubTournaments(
  current: ClubPublicProfile['activeTournaments'],
  invited: ClubPublicProfile['activeTournaments'],
) {
  const merged = [...current];

  invited.forEach((entry) => {
    if (!merged.some((item) => item.id === entry.id || item.name === entry.name)) {
      merged.push(entry);
    }
  });

  return merged;
}

export function buildFallbackTournamentStages(
  tournamentId: string,
  profile: TournamentPublicProfile,
): NonNullable<TournamentPublicProfile['stages']> {
  if (profile.stages && profile.stages.length > 0) {
    return profile.stages;
  }

  return mockSchedules
    .filter((item) => item.tournamentId === tournamentId)
    .map((item) => ({
      stageId: item.stageId,
      name: item.stageName,
      status: item.stageStatus,
      roundCount: 1,
      tableCount: 0,
      pendingTablePlanCount: 0,
    }));
}
