import type { ClubSummary, PublicSchedule } from '@/domain/public';

import type {
  HomeDataPayload,
  LeaderboardDataPayload,
  LoadState,
  PublicHallState,
  PublicHallViewerContext,
} from './types';
import {
  buildHomeDataKey,
  buildLeaderboardKey,
  clearInFlightHomeDataRequest,
  clearInFlightLeaderboardRequest,
  getCachedPublicHallHomeData,
  getCachedPublicHallLeaderboardData,
  getInFlightHomeDataRequest,
  getInFlightLeaderboardRequest,
  peekPublicHallHomeData,
  peekPublicHallLeaderboardData,
  setCachedPublicHallHomeData,
  setCachedPublicHallLeaderboardData,
  setInFlightHomeDataRequest,
  setInFlightLeaderboardRequest,
} from './data.home.cache';
import { loadLeaderboard } from './data.home.leaderboard';
import { loadClubs, loadManagedDraftSchedules, loadSchedules } from './data.home.schedules';

export {
  getCachedPublicHallHomeData,
  peekPublicHallHomeData,
  getCachedPublicHallLeaderboardData,
  peekPublicHallLeaderboardData,
  loadSchedules,
  loadClubs,
  loadLeaderboard,
};

export async function loadPublicHallHomeData(
  state: PublicHallState,
  context: PublicHallViewerContext = { session: null },
): Promise<HomeDataPayload> {
  const cacheKey = buildHomeDataKey(state, context);
  const cached = getCachedPublicHallHomeData(state, context);

  if (cached) {
    return cached;
  }

  const inFlightRequest = getInFlightHomeDataRequest(cacheKey);

  if (inFlightRequest) {
    return inFlightRequest;
  }

  const request = (async () => {
    const [schedules, clubs, draftSchedules] = await Promise.all([
      loadSchedules(state),
      loadClubs(state),
      loadManagedDraftSchedules(context),
    ]);
    const mergedSchedules: LoadState<PublicSchedule> =
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
    setCachedPublicHallHomeData(cacheKey, payload);
    return payload;
  })();

  setInFlightHomeDataRequest(cacheKey, request);

  try {
    return await request;
  } finally {
    clearInFlightHomeDataRequest(cacheKey);
  }
}

export async function loadPublicHallLeaderboardData(
  state: PublicHallState,
  clubs: LoadState<ClubSummary>,
): Promise<LeaderboardDataPayload> {
  const cacheKey = buildLeaderboardKey(state);
  const cached = getCachedPublicHallLeaderboardData(state);

  if (cached) {
    return cached;
  }

  const inFlightRequest = getInFlightLeaderboardRequest(cacheKey);

  if (inFlightRequest) {
    return inFlightRequest;
  }

  const request = (async () => {
    const leaderboard = await loadLeaderboard(state, clubs);
    const payload = { leaderboard };
    setCachedPublicHallLeaderboardData(cacheKey, payload);
    return payload;
  })();

  setInFlightLeaderboardRequest(cacheKey, request);

  try {
    return await request;
  } finally {
    clearInFlightLeaderboardRequest(cacheKey);
  }
}
