import { clubsApplicationsApi } from './applications.api';
import { clubsCoreApi } from './core.api';
import { clubsMembersApi } from './members.api';
import { clubsTournamentsApi } from './tournaments.api';

export const clubsApi = {
  ...clubsCoreApi,
  ...clubsMembersApi,
  ...clubsTournamentsApi,
  ...clubsApplicationsApi,
};
