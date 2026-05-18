import { publicClubsApi } from './clubs.api';
import { publicLeaderboardsApi } from './leaderboards.api';
import { publicSchedulesApi } from './schedules.api';
import { publicTournamentsApi } from './tournaments.api';

export const publicApi = {
  ...publicSchedulesApi,
  ...publicLeaderboardsApi,
  ...publicClubsApi,
  ...publicTournamentsApi,
};
