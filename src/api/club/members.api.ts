import type { ListEnvelope } from '@/objects';
import { toQueryString } from '@/lib/query';
import type {
  AssignClubAdminPayload,
  ClubContract,
  ClubMemberContract,
  RemoveClubMemberPayload,
} from '@/objects/club';
import { mapEnvelope, request, sendJson } from '../shared/http';
import { buildRemoveClubMemberRequest } from './transport';
import { mapClub, mapClubMember } from './mappers';

export const clubsMembersApi = {
  assignClubAdmin(clubId: string, payload: AssignClubAdminPayload) {
    return sendJson<ClubContract>(`/clubs/${clubId}/admins`, 'POST', {
      playerId: payload.playerId,
      operatorId: payload.operatorId,
    });
  },
  removeClubMember(clubId: string, playerId: string, payload: RemoveClubMemberPayload) {
    return sendJson<ClubContract>(
      `/clubs/${clubId}/members/${playerId}/remove`,
      'POST',
      buildRemoveClubMemberRequest(payload),
    ).then(mapClub);
  },
  getClubMembers(clubId: string, filters: { status?: string; nickname?: string; limit?: number; offset?: number } = {}) {
    return request<ListEnvelope<ClubMemberContract>>(`/clubs/${clubId}/members${toQueryString(filters)}`).then(
      (envelope) => mapEnvelope(envelope, mapClubMember),
    );
  },
};
