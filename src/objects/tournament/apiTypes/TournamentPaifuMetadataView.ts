import type { TableSeat } from '../TableSeat';

export interface TournamentPaifuMetadataView {
  recordedAt: string;
  source: string;
  tableId: string;
  tournamentId: string;
  stageId: string;
  seats: TableSeat[];
  matchRecordId: string | null;
}
