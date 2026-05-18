import type {
  CreateTournamentPayload,
  ListEnvelope,
  SubmitStageLineupPayload,
} from '@/objects';
import { toQueryString } from '@/lib/query';
import type {
  CreatedTournamentContract,
  TournamentDetailContract,
  TournamentDirectoryEntryContract,
  TournamentMutationContract,
  TournamentStageDirectoryEntryContract,
} from './responses/tournament.responses';
import { request, sendJson } from '../shared/http';
import {
  buildCreateTournamentRequest,
  buildSubmitStageLineupRequest,
  postWithOperatorCompat,
} from './transport';

export interface TournamentFilters {
  status?: string;
  adminId?: string;
  organizer?: string;
  limit?: number;
  offset?: number;
}

export const tournamentsApi = {
  getTournaments(filters: TournamentFilters = {}) {
    return request<ListEnvelope<TournamentDirectoryEntryContract>>(`/tournaments${toQueryString(filters)}`);
  },
  getTournamentStages(tournamentId: string) {
    return request<TournamentStageDirectoryEntryContract[] | { value?: TournamentStageDirectoryEntryContract[] }>(
      `/tournaments/${tournamentId}/stages`,
    ).then((payload) => (Array.isArray(payload) ? payload : payload.value ?? []));
  },
  getTournament(tournamentId: string) {
    return request<TournamentDetailContract>(`/tournaments/${tournamentId}`);
  },
  publishTournament(tournamentId: string, operatorId?: string) {
    return postWithOperatorCompat<TournamentMutationContract>(`/tournaments/${tournamentId}/publish`, operatorId);
  },
  scheduleTournamentStage(tournamentId: string, stageId: string, operatorId?: string) {
    return postWithOperatorCompat<TournamentMutationContract>(
      `/tournaments/${tournamentId}/stages/${stageId}/schedule`,
      operatorId,
    );
  },
  registerTournamentClub(tournamentId: string, clubId: string, operatorId?: string) {
    return postWithOperatorCompat<TournamentMutationContract>(
      `/tournaments/${tournamentId}/clubs/${clubId}`,
      operatorId,
    );
  },
  submitStageLineup(tournamentId: string, stageId: string, payload: SubmitStageLineupPayload) {
    return sendJson<TournamentMutationContract>(
      `/tournaments/${tournamentId}/stages/${stageId}/lineups`,
      'POST',
      buildSubmitStageLineupRequest(payload),
    );
  },
  createTournament(payload: CreateTournamentPayload) {
    return sendJson<CreatedTournamentContract>('/tournaments', 'POST', buildCreateTournamentRequest(payload));
  },
};
