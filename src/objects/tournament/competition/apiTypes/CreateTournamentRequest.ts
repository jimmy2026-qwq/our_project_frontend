import type { CreateTournamentStageRequest } from '../../stage/apiTypes/CreateTournamentStageRequest';

export interface CreateTournamentRequest {
  name: string;
  organizer: string;
  startsAt: string;
  endsAt: string;
  adminId?: string;
  stages: CreateTournamentStageRequest[];
}
