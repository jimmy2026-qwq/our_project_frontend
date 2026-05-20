import type {
  HomeDataState,
  LeaderboardDataState,
  PublicHallState,
  PublicHallViewerContext,
} from './types';
import { PUBLIC_HALL_CACHE_TTL_MS } from './data.shared';

const homeDataCache = new Map<
  string,
  { payload: HomeDataState; cachedAt: number }
>();
const homeDataRequests = new Map<string, Promise<HomeDataState>>();
const leaderboardCache = new Map<
  string,
  { payload: LeaderboardDataState; cachedAt: number }
>();
const leaderboardRequests = new Map<string, Promise<LeaderboardDataState>>();

export function buildHomeDataKey(
  state: PublicHallState,
  context: PublicHallViewerContext,
) {
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

export function buildLeaderboardKey(state: PublicHallState) {
  return JSON.stringify({
    leaderboardClubId: state.leaderboardClubId,
    leaderboardStatus: state.leaderboardStatus,
  });
}

export function getCachedPublicHallHomeData(
  state: PublicHallState,
  context: PublicHallViewerContext = { session: null },
) {
  const cacheKey = buildHomeDataKey(state, context);
  const cached = homeDataCache.get(cacheKey);

  if (!cached || Date.now() - cached.cachedAt >= PUBLIC_HALL_CACHE_TTL_MS) {
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

export function getCachedPublicHallLeaderboardData(state: PublicHallState) {
  const cacheKey = buildLeaderboardKey(state);
  const cached = leaderboardCache.get(cacheKey);

  if (!cached || Date.now() - cached.cachedAt >= PUBLIC_HALL_CACHE_TTL_MS) {
    return null;
  }

  return cached.payload;
}

export function peekPublicHallLeaderboardData(state: PublicHallState) {
  return leaderboardCache.get(buildLeaderboardKey(state))?.payload ?? null;
}

export function getInFlightHomeDataRequest(cacheKey: string) {
  return homeDataRequests.get(cacheKey);
}

export function setInFlightHomeDataRequest(
  cacheKey: string,
  request: Promise<HomeDataState>,
) {
  homeDataRequests.set(cacheKey, request);
}

export function clearInFlightHomeDataRequest(cacheKey: string) {
  homeDataRequests.delete(cacheKey);
}

export function setCachedPublicHallHomeData(
  cacheKey: string,
  payload: HomeDataState,
) {
  homeDataCache.set(cacheKey, { payload, cachedAt: Date.now() });
}

export function getInFlightLeaderboardRequest(cacheKey: string) {
  return leaderboardRequests.get(cacheKey);
}

export function setInFlightLeaderboardRequest(
  cacheKey: string,
  request: Promise<LeaderboardDataState>,
) {
  leaderboardRequests.set(cacheKey, request);
}

export function clearInFlightLeaderboardRequest(cacheKey: string) {
  leaderboardRequests.delete(cacheKey);
}

export function setCachedPublicHallLeaderboardData(
  cacheKey: string,
  payload: LeaderboardDataState,
) {
  leaderboardCache.set(cacheKey, { payload, cachedAt: Date.now() });
}
