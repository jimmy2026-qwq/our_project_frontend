import { useEffect, useReducer, useState } from 'react';

import {
  PublicClubsSection,
  PublicHallError,
  PublicHallHero,
  PublicHallLeaderboardLoading,
  PublicHallLoading,
  PublicHallOverviewStrip,
  PublicHallTabs,
  PublicLeaderboardSection,
  PublicSchedulesSection,
} from '@/features/public-hall/components';
import { usePublicHallHomeData, usePublicHallLeaderboardData, usePublicHallState } from '@/features/public-hall/hooks';
import type { PublicHallState } from '@/features/public-hall/types';
import { useAuth, useRefreshNotice } from '@/hooks';

export function PublicHallHomePage() {
  const { state, setState } = usePublicHallState();
  const { session } = useAuth();
  const [reloadKey, forceReload] = useReducer((value) => value + 1, 0);
  const [pendingRefresh, setPendingRefresh] = useState(false);
  const { data, isLoading, error } = usePublicHallHomeData(state, { session }, reloadKey);
  const {
    data: leaderboardData,
    isLoading: isLeaderboardLoading,
    error: leaderboardError,
  } = usePublicHallLeaderboardData(state, data, reloadKey);
  const { notifyRefreshResult } = useRefreshNotice();

  const handleStateChange = (patch: Partial<PublicHallState>) => {
    setState((current) => ({ ...current, ...patch }));
  };

  useEffect(() => {
    if (!pendingRefresh || isLoading) {
      return;
    }

    if (error && !data) {
      notifyRefreshResult(
        [],
        {
          failureTitle: 'Public hall refresh failed',
          successTitle: 'Public hall refreshed',
          successMessage: 'Live public hall data was reloaded successfully.',
          fallbackTitle: 'Public hall refreshed with fallback',
          fallbackMessage: 'Some public hall panels are currently using mock data.',
        },
        error,
      );
      setPendingRefresh(false);
      return;
    }

    if (!data) {
      return;
    }

    notifyRefreshResult(
      [data.schedules, data.clubs, ...(leaderboardData ? [leaderboardData.leaderboard] : [])],
      {
        failureTitle: 'Public hall refresh failed',
        successTitle: 'Public hall refreshed',
        successMessage: 'Live public hall data was reloaded successfully.',
        fallbackTitle: 'Public hall refreshed with fallback',
        fallbackMessage: 'Some public hall panels are currently using mock data.',
      },
      error,
    );

    setPendingRefresh(false);
  }, [data, error, isLoading, leaderboardData, notifyRefreshResult, pendingRefresh]);

  const handleRefresh = () => {
    setPendingRefresh(true);
    forceReload();
  };

  if (isLoading && !data) {
    return <PublicHallLoading />;
  }

  if (error && !data) {
    return <PublicHallError message={error} />;
  }

  if (!data) {
    return <PublicHallError message="Public hall data is unavailable." />;
  }

  let activeViewMarkup;

  if (state.activeView === 'clubs') {
    activeViewMarkup = (
      <PublicClubsSection
        payload={data.clubs}
        state={state}
        onStateChange={handleStateChange}
        onRefresh={handleRefresh}
      />
    );
  } else if (state.activeView === 'leaderboard') {
    if (isLeaderboardLoading && !leaderboardData) {
      activeViewMarkup = <PublicHallLeaderboardLoading />;
    } else if (leaderboardError && !leaderboardData) {
      activeViewMarkup = <PublicHallError message={leaderboardError} />;
    } else if (leaderboardData) {
      activeViewMarkup = (
        <PublicLeaderboardSection
          payload={leaderboardData.leaderboard}
          state={state}
          clubs={data.clubs.envelope.items}
          onStateChange={handleStateChange}
          onRefresh={handleRefresh}
        />
      );
    } else {
      activeViewMarkup = <PublicHallLeaderboardLoading />;
    }
  } else {
    activeViewMarkup = (
      <PublicSchedulesSection
        payload={data.schedules}
        state={state}
        onStateChange={handleStateChange}
        onRefresh={handleRefresh}
      />
    );
  }

  return (
    <section className="public-portal">
      <PublicHallHero
        schedules={data.schedules}
        leaderboard={leaderboardData?.leaderboard ?? null}
        clubs={data.clubs}
        onSelectView={(view) => handleStateChange({ activeView: view })}
      />
      <PublicHallOverviewStrip
        schedules={data.schedules}
        leaderboard={leaderboardData?.leaderboard ?? null}
        clubs={data.clubs}
      />
      <PublicHallTabs
        activeView={state.activeView}
        onSelectView={(view) => handleStateChange({ activeView: view })}
      />
      {activeViewMarkup}
    </section>
  );
}
