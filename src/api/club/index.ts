import { clubsApplicationsApi } from './applications.api';
import { clubsCoreApi } from './core.api';
import { clubsMembersApi } from './members.api';
import { clubsTournamentsApi } from './tournaments.api';

export type { ClubFilters, CreateClubPayload } from './requests/core.requests';
export type {
  ClubApplicationListFilters,
  ClubApplicationPayload,
  ReviewClubApplicationPayload,
  WithdrawClubApplicationPayload,
} from './requests/applications.requests';
export type { AssignClubAdminPayload, RemoveClubMemberPayload } from './requests/members.requests';

export const clubsApi = {
  ...clubsCoreApi,
  ...clubsMembersApi,
  ...clubsTournamentsApi,
  ...clubsApplicationsApi,
};
