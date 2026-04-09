import type { ClubSummary, PlayerLeaderboardEntry, PublicSchedule } from '@/domain/public';

import type { LoadState, PublicView } from '../types';

export interface PublicHallHeroProps {
  schedules: LoadState<PublicSchedule>;
  leaderboard: LoadState<PlayerLeaderboardEntry> | null;
  clubs: LoadState<ClubSummary>;
  onSelectView: (view: PublicView) => void;
}

export interface PublicHallOverviewStripProps {
  schedules: LoadState<PublicSchedule>;
  leaderboard: LoadState<PlayerLeaderboardEntry> | null;
  clubs: LoadState<ClubSummary>;
}

export interface PublicHallTabsProps {
  activeView: PublicView;
  onSelectView: (view: PublicView) => void;
}
