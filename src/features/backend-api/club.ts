import type {
  AssignClubAdminRequest,
  ClubApplicationDetailQuery,
  ClubApplicationListQuery,
  ClubMembershipApplication,
  ClubMembershipApplicationRequest,
  ClubMembershipApplicationView,
  Club,
  ClubListQuery,
  ClubMemberListQuery,
  ClubTournamentQuery,
  ClubTournamentParticipationView,
  CreateClubRequest,
  ListEnvelope,
  RemoveClubMemberRequest,
  ReviewClubApplicationRequest,
  WithdrawClubApplicationRequest,
} from '@/objects';
import {
  mapClub,
  mapClubApplicationView,
  mapClubMember,
} from '@/pages/objects/ClubMappers';
import { sendAPI } from '@/system/api';
import { mapEnvelope } from '@/system/api/http';

import { AssignClubAdminAPI } from '@/api/club/AssignClubAdminAPI';
import { CreateClubAPI } from '@/api/club/CreateClubAPI';
import { GetClubAPI } from '@/api/club/GetClubAPI';
import { GetClubApplicationAPI } from '@/api/club/GetClubApplicationAPI';
import { GetCurrentClubApplicationAPI } from '@/api/club/GetCurrentClubApplicationAPI';
import { ListClubApplicationsAPI } from '@/api/club/ListClubApplicationsAPI';
import { ListClubMembersAPI } from '@/api/club/ListClubMembersAPI';
import { ListClubsAPI } from '@/api/club/ListClubsAPI';
import { ListClubTournamentsAPI } from '@/api/club/ListClubTournamentsAPI';
import { RemoveClubMemberAPI } from '@/api/club/RemoveClubMemberAPI';
import { ReviewClubApplicationAPI } from '@/api/club/ReviewClubApplicationAPI';
import { SubmitClubApplicationAPI } from '@/api/club/SubmitClubApplicationAPI';
import { WithdrawClubApplicationAPI } from '@/api/club/WithdrawClubApplicationAPI';


export const clubsApi = {
  getClub(clubId: string) {
    return sendAPI<Club>(new GetClubAPI(clubId));
  },
  createClub(payload: CreateClubRequest) {
    return sendAPI<Club>(new CreateClubAPI(payload)).then(mapClub);
  },
  getClubs(filters: ClubListQuery) {
    return sendAPI(new ListClubsAPI(filters)).then((envelope) =>
      mapEnvelope(envelope, mapClub),
    );
  },
  assignClubAdmin(clubId: string, payload: AssignClubAdminRequest) {
    return sendAPI<Club>(new AssignClubAdminAPI(clubId, payload));
  },
  removeClubMember(
    clubId: string,
    playerId: string,
    payload: RemoveClubMemberRequest,
  ) {
    return sendAPI<Club>(
      new RemoveClubMemberAPI(clubId, playerId, payload),
    ).then(mapClub);
  },
  getClubMembers(clubId: string, filters: ClubMemberListQuery = {}) {
    return sendAPI(new ListClubMembersAPI(clubId, filters)).then((envelope) =>
      mapEnvelope(envelope, mapClubMember),
    );
  },
  getClubTournaments(clubId: string, filters: ClubTournamentQuery = {}) {
    return sendAPI<ListEnvelope<ClubTournamentParticipationView>>(
      new ListClubTournamentsAPI(clubId, filters),
    );
  },
  submitClubApplication(clubId: string, payload: ClubMembershipApplicationRequest) {
    return sendAPI<ClubMembershipApplication>(
      new SubmitClubApplicationAPI(clubId, payload),
    );
  },
  withdrawClubApplication(
    clubId: string,
    membershipId: string,
    payload: WithdrawClubApplicationRequest,
  ) {
    return sendAPI<ClubMembershipApplication>(
      new WithdrawClubApplicationAPI(clubId, membershipId, payload),
    );
  },
  getClubApplications(clubId: string, filters: ClubApplicationListQuery) {
    return sendAPI(new ListClubApplicationsAPI(clubId, filters)).then(
      (envelope) => mapEnvelope(envelope, mapClubApplicationView),
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
  reviewClubApplication(
    clubId: string,
    membershipId: string,
    payload: ReviewClubApplicationRequest,
  ) {
    return sendAPI<ClubMembershipApplicationView>(
      new ReviewClubApplicationAPI(clubId, membershipId, payload),
    ).then(mapClubApplicationView);
  },
};
