import type { ClubRankNodeRequest } from './ClubRankNodeRequest';

export interface UpdateClubRankTreeRequest {
  operatorId: string;
  ranks: ClubRankNodeRequest[];
  note?: string;
}
