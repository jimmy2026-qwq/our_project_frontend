import { useCallback } from 'react';

import { ListPublicClubsAPI } from '@/api/club';
import { ListPublicSchedulesAPI } from '@/api/tournament';
import type { ClubSummary } from '@/pages/shared_objects/club/ClubSummary';
import { sendAPI, mapEnvelope } from '@/system/api';

import { buildHomeDataKey, deleteHomeDataRequest, getCachedPublicHallHomeData, getHomeDataRequest, setCachedPublicHallHomeData, setHomeDataRequest } from '../functions/getPublicHallHomeDataCache';
import { toPublicClubSummary, toPublicSchedule } from '../functions/toPublicHallData';
import type { HomeDataState } from '../objects/state/HomeDataState';
import { LoadState } from '../objects/state/LoadState';
import { PublicHallState } from '../objects/state/PublicHallState';
import { PublicHallViewerContext } from '../objects/state/PublicHallViewerContext';
import { PublicSchedule } from '../objects/schedule/PublicSchedule';
import { useManagedDraftSchedulesLoader } from './useManagedDraftSchedulesLoader';

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
  };
}

async function loadSchedules(
  state: PublicHallState,
): Promise<LoadState<PublicSchedule>> {
  try {
    const envelope = await sendAPI(
      new ListPublicSchedulesAPI({
        tournamentStatus: state.scheduleTournamentStatus,
        stageStatus: state.scheduleStageStatus,
      }),
    ).then((payload) => mapEnvelope(payload, toPublicSchedule));
    return { envelope };
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
      mapEnvelope(payload, toPublicClubSummary),
    );
    return { envelope };
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

export function usePublicHallHomeDataLoader() {
  const loadManagedDraftSchedules = useManagedDraftSchedulesLoader();

  return useCallback(
    async (
      state: PublicHallState,
      context: PublicHallViewerContext = { session: null },
    ): Promise<HomeDataState> => {
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
    },
    [loadManagedDraftSchedules],
  );
}
