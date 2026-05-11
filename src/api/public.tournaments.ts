import type { PublicTournamentDetailContract } from './contracts/public';
import { mapPublicTournamentDetail } from './public.mappers';
import { request } from './http';

export const publicTournamentsApi = {
  getPublicTournamentProfile(tournamentId: string) {
    return request<PublicTournamentDetailContract>(`/public/tournaments/${tournamentId}`).then(
      mapPublicTournamentDetail,
    );
  },
};
