import type { ListEnvelope } from '@/objects';
import type {
  PublicClubDetailContract,
  PublicClubDirectoryEntryContract,
} from './responses/publicquery.responses';
import {
  mapPublicClub,
  mapPublicClubDetail,
} from './mappers';
import { mapEnvelope, request } from '../shared/http';

export const publicClubsApi = {
  getPublicClubs() {
    return request<ListEnvelope<PublicClubDirectoryEntryContract>>('/public/clubs').then((envelope) =>
      mapEnvelope(envelope, mapPublicClub),
    );
  },
  getPublicClubProfile(clubId: string) {
    return request<PublicClubDetailContract>(`/public/clubs/${clubId}`).then(mapPublicClubDetail);
  },
};
