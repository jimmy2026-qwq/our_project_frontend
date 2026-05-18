import { authApi } from '../auth';
import { clubsApi } from '../club';
import { playerApi } from '../player';
import { tournamentApi } from '../tournament';
import { publicApi } from '../publicquery';

export const apiClient = {
  ...authApi,
  ...playerApi,
  ...publicApi,
  ...clubsApi,
  ...tournamentApi,
};
