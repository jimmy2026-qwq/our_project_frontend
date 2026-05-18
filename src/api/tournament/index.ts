import { appealsApi } from './appeal';
import { recordsApi } from './records.api';
import { tablesApi } from './tables.api';
import { tournamentsApi } from './tournaments.api';

export const tournamentApi = {
  ...tournamentsApi,
  ...tablesApi,
  ...recordsApi,
  ...appealsApi,
};
