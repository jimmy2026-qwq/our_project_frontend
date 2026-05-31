import type { TournamentSettlementStatus } from '../TournamentSettlementStatus';

export interface TournamentSettlementQuery {
  stageId?: string;
  status?: TournamentSettlementStatus;
  championId?: string;
  limit?: number;
  offset?: number;
}
