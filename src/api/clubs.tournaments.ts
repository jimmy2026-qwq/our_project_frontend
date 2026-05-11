import type { ListEnvelope } from '@/domain';
import { toQueryString } from '@/lib/query';
import type { ClubTournamentParticipationContract } from './contracts/clubs';
import { request } from './http';

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
