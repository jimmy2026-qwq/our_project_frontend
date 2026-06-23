import type { HomeDataState } from '../objects/state/HomeDataState';
import type { PublicHallState } from '../objects/state/PublicHallState';
import type { PublicHallViewerContext } from '../objects/state/PublicHallViewerContext';
import { PUBLIC_HALL_CACHE_TTL_MS } from '../objects/state/PublicHallCache';

const homeDataCache = new Map<
  string,
  { payload: HomeDataState; cachedAt: number }
>();
const homeDataRequests = new Map<string, Promise<HomeDataState>>();

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

export function setCachedPublicHallHomeData(
  cacheKey: string,
  payload: HomeDataState,
) {
  homeDataCache.set(cacheKey, { payload, cachedAt: Date.now() });
}

export function getHomeDataRequest(cacheKey: string) {
  return homeDataRequests.get(cacheKey) ?? null;
}

export function setHomeDataRequest(
  cacheKey: string,
  request: Promise<HomeDataState>,
) {
  homeDataRequests.set(cacheKey, request);
}

export function deleteHomeDataRequest(cacheKey: string) {
  homeDataRequests.delete(cacheKey);
}
