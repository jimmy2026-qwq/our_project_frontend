import type { PublicTournamentDetailContract } from '@/objects/publicquery';
import { mapPublicTournamentDetail } from './mappers';
import { request } from '../shared/http';

export const publicTournamentsApi = {
  getPublicTournamentProfile(tournamentId: string) {
    return request<PublicTournamentDetailContract>(`/public/tournaments/${tournamentId}`).then(
      mapPublicTournamentDetail,
    );
  },
};
