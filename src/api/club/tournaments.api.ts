import type { ListEnvelope } from '@/objects';
import { toQueryString } from '@/lib/query';
import type { ClubTournamentParticipationContract } from '@/objects/club';
import { request } from '../shared/http';

export const clubsTournamentsApi = {
  getClubTournaments(
    clubId: string,
    filters: { scope?: 'recent' | 'active' | 'all'; viewer?: string; limit?: number; offset?: number } = {},
  ) {
    return request<ListEnvelope<ClubTournamentParticipationContract>>(
      `/clubs/${clubId}/tournaments${toQueryString(filters)}`,
    );
  },
};
