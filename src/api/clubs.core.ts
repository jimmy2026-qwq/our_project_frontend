import type { ListEnvelope } from '@/domain';
import { toQueryString } from '@/lib/query';
import type { ClubContract } from './contracts/clubs';
import { mapEnvelope, request, sendJson } from './http';
import {
  type ClubFilters,
  type CreateClubPayload,
  mapClub,
} from './clubs.shared';

export const clubsCoreApi = {
  getClub(clubId: string) {
    return request<ClubContract>(`/clubs/${clubId}`);
  },
  createClub(payload: CreateClubPayload) {
    return sendJson<ClubContract>('/clubs', 'POST', {
      name: payload.name,
      creatorId: payload.creatorId,
    }).then(mapClub);
  },
  getClubs(filters: ClubFilters) {
    return request<ListEnvelope<ClubContract>>(`/clubs${toQueryString(filters)}`).then((envelope) =>
      mapEnvelope(envelope, mapClub),
    );
  },
};
