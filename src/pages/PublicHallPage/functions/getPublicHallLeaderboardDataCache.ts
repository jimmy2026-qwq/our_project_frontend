import type {
  LeaderboardDataState,
  PublicHallState,
} from '../objects/PublicHallPage.types';
import { PUBLIC_HALL_CACHE_TTL_MS } from '../objects/PublicHallState';

const leaderboardCache = new Map<
  string,
  { payload: LeaderboardDataState; cachedAt: number }
>();
const leaderboardRequests = new Map<string, Promise<LeaderboardDataState>>();

export function buildLeaderboardKey(state: PublicHallState) {
  return JSON.stringify({
    leaderboardClubId: state.leaderboardClubId,
    leaderboardStatus: state.leaderboardStatus,
  });
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

export function setCachedPublicHallLeaderboardData(
  cacheKey: string,
  payload: LeaderboardDataState,
) {
  leaderboardCache.set(cacheKey, { payload, cachedAt: Date.now() });
}

export function getLeaderboardDataRequest(cacheKey: string) {
  return leaderboardRequests.get(cacheKey) ?? null;
}

export function setLeaderboardDataRequest(
  cacheKey: string,
  request: Promise<LeaderboardDataState>,
) {
  leaderboardRequests.set(cacheKey, request);
}

export function deleteLeaderboardDataRequest(cacheKey: string) {
  leaderboardRequests.delete(cacheKey);
}
