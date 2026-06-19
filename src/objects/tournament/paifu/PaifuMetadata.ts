import type { TableSeat } from '../stage/table/TableSeat';

export interface PaifuMetadata {
  recordedAt: string;
  source: string;
  tableId: string;
  tournamentId: string;
  stageId: string;
  seats: TableSeat[];
  matchRecordId: string | null;
}
