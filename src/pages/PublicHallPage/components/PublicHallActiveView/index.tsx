import type {
  HomeDataState,
  LeaderboardDataState,
  PublicHallState,
} from '../../objects/PublicHallPage.types';

import {
  PublicHallError,
  PublicHallLeaderboardLoading,
} from '../PublicHallLoadingState';
import {
  PublicClubsSection,
} from '../PublicClubsSection';
import {
  PublicLeaderboardSection,
} from '../PublicLeaderboardSection';
import {
  PublicSchedulesSection,
} from '../PublicSchedulesSection';

interface PublicHallActiveViewProps {
  canCreateClub: boolean;
  canCreateTournament: boolean;
  canManagePlayers: boolean;
  data: HomeDataState;
  isLeaderboardLoading: boolean;
  leaderboardData: LeaderboardDataState | null;
  leaderboardError: string | null;
  state: PublicHallState;
  onPlayerManaged: () => void;
  onRefresh: () => void;
  onStateChange: (patch: Partial<PublicHallState>) => void;
}

export function PublicHallActiveView({
  canCreateClub,
  canCreateTournament,
  canManagePlayers,
  data,
  isLeaderboardLoading,
  leaderboardData,
  leaderboardError,
  state,
  onPlayerManaged,
  onRefresh,
  onStateChange,
}: PublicHallActiveViewProps) {
  if (state.activeView === 'clubs') {
    return (
      <PublicClubsSection
        payload={data.clubs}
        state={state}
        canCreateClub={canCreateClub}
        onStateChange={onStateChange}
        onRefresh={onRefresh}
      />
    );
  }

  if (state.activeView === 'leaderboard') {
    if (isLeaderboardLoading && !leaderboardData) {
      return <PublicHallLeaderboardLoading />;
    }

    if (leaderboardError && !leaderboardData) {
      return <PublicHallError message={leaderboardError} />;
    }

    if (!leaderboardData) {
      return <PublicHallLeaderboardLoading />;
    }

    return (
      <PublicLeaderboardSection
        payload={leaderboardData.leaderboard}
        state={state}
        clubs={data.clubs.envelope.items}
        canManagePlayers={canManagePlayers}
        onStateChange={onStateChange}
        onRefresh={onRefresh}
        onPlayerManaged={onPlayerManaged}
      />
    );
  }

  return (
    <PublicSchedulesSection
      payload={data.schedules}
      state={state}
      canCreateTournament={canCreateTournament}
      onStateChange={onStateChange}
      onRefresh={onRefresh}
    />
  );
}
