import { clubsApplicationsApi } from './clubs.applications';
import { clubsCoreApi } from './clubs.core';
import { clubsMembersApi } from './clubs.members';
import { clubsTournamentsApi } from './clubs.tournaments';

export type {
  AssignClubAdminPayload,
  ClubApplicationListFilters,
  ClubApplicationPayload,
  ClubFilters,
  CreateClubPayload,
  RemoveClubMemberPayload,
  ReviewClubApplicationPayload,
  WithdrawClubApplicationPayload,
} from './clubs.shared';

export const clubsApi = {
  ...clubsCoreApi,
  ...clubsMembersApi,
  ...clubsTournamentsApi,
  ...clubsApplicationsApi,
};
