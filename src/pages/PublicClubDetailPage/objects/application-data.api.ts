import {
  GetClubApplicationAPI,
  GetCurrentClubApplicationAPI,
  ListClubsAPI,
  SubmitClubApplicationAPI,
  WithdrawClubApplicationAPI,
} from '@/api/club';
import { GetCurrentPlayerAPI } from '@/api/player';
import type {
  ClubApplicationDetailQuery,
  ClubListQuery,
  ClubMembershipApplicationRequest,
  ClubMembershipApplicationResponse,
  ClubMembershipApplicationView,
  WithdrawClubApplicationRequest,
} from '@/objects';
import {
  mapClub,
  mapClubApplicationView,
} from '@/pages/objects/club';
import { mapPlayerProfile } from '@/pages/objects/player';
import type { PlayerProfileView } from '@/objects/player';
import { sendAPI } from '@/system/api';
import { mapEnvelope } from '@/system/api/http';

export const clubsApi = {
  getClubs(filters: ClubListQuery) {
    return sendAPI(new ListClubsAPI(filters)).then((envelope) =>
      mapEnvelope(envelope, mapClub),
    );
  },
  submitClubApplication(
    clubId: string,
    payload: ClubMembershipApplicationRequest,
  ) {
    return sendAPI<ClubMembershipApplicationResponse>(
      new SubmitClubApplicationAPI(clubId, payload),
    );
  },
  withdrawClubApplication(
    clubId: string,
    membershipId: string,
    payload: WithdrawClubApplicationRequest,
  ) {
    return sendAPI<ClubMembershipApplicationResponse>(
      new WithdrawClubApplicationAPI(clubId, membershipId, payload),
    );
  },
  getClubApplication(
    clubId: string,
    membershipId: string,
    filters: ClubApplicationDetailQuery,
  ) {
    return sendAPI<ClubMembershipApplicationView>(
      new GetClubApplicationAPI(clubId, membershipId, filters),
    ).then(mapClubApplicationView);
  },
  getCurrentClubApplication(
    clubId: string,
    filters: ClubApplicationDetailQuery,
  ) {
    return sendAPI<ClubMembershipApplicationView>(
      new GetCurrentClubApplicationAPI(clubId, filters),
    ).then(mapClubApplicationView);
  },
};

export function getCurrentPlayer(operatorId: string) {
  return sendAPI<PlayerProfileView>(new GetCurrentPlayerAPI(operatorId)).then(
    mapPlayerProfile,
  );
}
