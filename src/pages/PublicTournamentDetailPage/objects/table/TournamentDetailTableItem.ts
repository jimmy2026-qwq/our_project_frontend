import type { TableStatus } from '@/objects';

export interface TournamentDetailTableItem {
  id: string;
  stageId: string;
  stageName: string;
  tableCode: string;
  status: TableStatus;
  playerIds: string[];
}
