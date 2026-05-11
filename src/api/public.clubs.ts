import type { ListEnvelope } from '@/domain';
import type {
  PublicClubDetailContract,
  PublicClubDirectoryEntryContract,
} from './contracts/public';
import {
  mapPublicClub,
  mapPublicClubDetail,
} from './public.mappers';
import { mapEnvelope, request } from './http';

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
