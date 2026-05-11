import { publicClubsApi } from './public.clubs';
import { publicDashboardsApi } from './public.dashboards';
import { publicLeaderboardsApi } from './public.leaderboards';
import { publicSchedulesApi } from './public.schedules';
import { publicTournamentsApi } from './public.tournaments';

export type {
  PlayerLeaderboardFilters,
  ScheduleFilters,
} from './public.shared';

export const publicApi = {
  ...publicSchedulesApi,
  ...publicLeaderboardsApi,
  ...publicClubsApi,
  ...publicTournamentsApi,
  ...publicDashboardsApi,
};
