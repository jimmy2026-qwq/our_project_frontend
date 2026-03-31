import { useReducer } from 'react';

import {
  PublicClubsSection,
  PublicHallError,
  PublicHallHero,
  PublicHallLoading,
  PublicHallOverviewStrip,
  PublicHallTabs,
  PublicLeaderboardSection,
  PublicSchedulesSection,
} from '@/features/public-hall/components';
import { usePublicHallHomeData, usePublicHallState } from '@/features/public-hall/hooks';
import type { PublicHallState } from '@/features/public-hall/types';

export function PublicHallHomePage() {
  const { state, setState } = usePublicHallState();
  const [reloadKey, forceReload] = useReducer((value) => value + 1, 0);
  const { data, isLoading, error } = usePublicHallHomeData(state, reloadKey);

  const handleStateChange = (patch: Partial<PublicHallState>) => {
    setState((current) => ({ ...current, ...patch }));
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
        onRefresh={forceReload}
      />
    );
  } else if (state.activeView === 'leaderboard') {
    activeViewMarkup = (
      <PublicLeaderboardSection
        payload={data.leaderboard}
        state={state}
        clubs={data.clubs.envelope.items}
        onStateChange={handleStateChange}
        onRefresh={forceReload}
      />
    );
  } else {
    activeViewMarkup = (
      <PublicSchedulesSection
        payload={data.schedules}
        state={state}
        onStateChange={handleStateChange}
        onRefresh={forceReload}
      />
    );
  }

  return (
    <section className="public-portal">
      <PublicHallHero
        schedules={data.schedules}
        leaderboard={data.leaderboard}
        clubs={data.clubs}
        onSelectView={(view) => handleStateChange({ activeView: view })}
      />
      <PublicHallOverviewStrip
        schedules={data.schedules}
        leaderboard={data.leaderboard}
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
