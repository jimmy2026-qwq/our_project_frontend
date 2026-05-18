import { publicClubsApi } from './clubs.api';
import { publicDashboardsApi } from './dashboards.api';
import { publicLeaderboardsApi } from './leaderboards.api';
import { publicSchedulesApi } from './schedules.api';
import { publicTournamentsApi } from './tournaments.api';

export type {
  PlayerLeaderboardFilters,
  ScheduleFilters,
} from './requests/publicquery.requests';

export const publicApi = {
  ...publicSchedulesApi,
  ...publicLeaderboardsApi,
  ...publicClubsApi,
  ...publicTournamentsApi,
  ...publicDashboardsApi,
};
