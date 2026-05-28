import { ListPublicClubsAPI } from '@/api/club';
import { ListPublicSchedulesAPI } from '@/api/tournament';
import type { ClubSummary } from '@/pages/objects/club';
import { sendAPI } from '@/system/api';
import { mapEnvelope } from '@/system/api/http';

import {
  mapPublicClub,
  mapPublicSchedule,
} from '../../../functions/mapPublicHall';
import type {
  HomeDataState,
  LoadState,
  PublicHallState,
  PublicHallViewerContext,
  PublicSchedule,
} from '../../../objects/PublicHallPage.types';
import {
  buildHomeDataKey,
  deleteHomeDataRequest,
  getCachedPublicHallHomeData,
  getHomeDataRequest,
  peekPublicHallHomeData,
  setCachedPublicHallHomeData,
  setHomeDataRequest,
} from './getPublicHallHomeDataCache';
import { loadManagedDraftSchedules } from './loadManagedDraftSchedules';

export { peekPublicHallHomeData };

function createEmptyLoadState<T>(): LoadState<T> {
  return {
    envelope: {
      items: [],
      total: 0,
      limit: 0,
      offset: 0,
      hasMore: false,
      appliedFilters: {},
    },
    source: 'api',
  };
}

async function loadSchedules(
  state: PublicHallState,
): Promise<LoadState<PublicSchedule>> {
  try {
    const envelope = await sendAPI(
      new ListPublicSchedulesAPI({
        tournamentStatus: state.scheduleTournamentStatus || undefined,
        stageStatus: state.scheduleStageStatus || undefined,
      }),
    ).then((payload) => mapEnvelope(payload, mapPublicSchedule));
    return { envelope, source: 'api' };
  } catch (error) {
    return {
      ...createEmptyLoadState<PublicSchedule>(),
      warning:
        error instanceof Error
          ? error.message
          : 'Unable to load public schedules.',
    };
  }
}

async function loadClubs(): Promise<LoadState<ClubSummary>> {
  try {
    const envelope = await sendAPI(new ListPublicClubsAPI()).then((payload) =>
      mapEnvelope(payload, mapPublicClub),
    );
    return { envelope, source: 'api' };
  } catch (error) {
    return {
      ...createEmptyLoadState<ClubSummary>(),
      warning:
        error instanceof Error
          ? error.message
          : 'Unable to load club directory.',
    };
  }
}

function mergeDraftSchedules(
  schedules: LoadState<PublicSchedule>,
  draftSchedules: PublicSchedule[],
): LoadState<PublicSchedule> {
  if (draftSchedules.length === 0) {
    return schedules;
  }

  return {
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
  };
}

export async function loadPublicHallHomeData(
  state: PublicHallState,
  context: PublicHallViewerContext = { session: null },
): Promise<HomeDataState> {
  const cacheKey = buildHomeDataKey(state, context);
  const cached = getCachedPublicHallHomeData(state, context);

  if (cached) {
    return cached;
  }

  const inFlightRequest = getHomeDataRequest(cacheKey);

  if (inFlightRequest) {
    return inFlightRequest;
  }

  const request = (async () => {
    const [schedules, clubs, draftSchedules] = await Promise.all([
      loadSchedules(state),
      loadClubs(),
      loadManagedDraftSchedules(context),
    ]);
    const payload = {
      schedules: mergeDraftSchedules(schedules, draftSchedules),
      clubs,
    };
    setCachedPublicHallHomeData(cacheKey, payload);
    return payload;
  })();

  setHomeDataRequest(cacheKey, request);

  try {
    return await request;
  } finally {
    deleteHomeDataRequest(cacheKey);
  }
}
