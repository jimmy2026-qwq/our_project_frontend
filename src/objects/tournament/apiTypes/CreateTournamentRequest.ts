import type { CreateTournamentStageRequest } from './CreateTournamentStageRequest';

export interface CreateTournamentRequest {
  name: string;
  organizer: string;
  startsAt: string;
  endsAt: string;
  adminId?: string;
  stages: CreateTournamentStageRequest[];
}

