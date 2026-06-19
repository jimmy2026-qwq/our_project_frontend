import type { TableStatus } from '@/objects';

export interface TournamentTableSummary {
  id: string;
  tournamentId: string;
  stageId: string;
  tableCode: string;
  status: TableStatus;
  playerIds: string[];
  seatCount: number;
}
