import type { ListEnvelope } from '@/objects';
import { toQueryString } from '@/lib/query';
import type { ClubContract } from './responses/club.responses';
import { mapEnvelope, request, sendJson } from '../shared/http';
import { mapClub } from './mappers';
import type { ClubFilters, CreateClubPayload } from './requests/core.requests';

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
