import type { TableSeat } from '../tablemanagement/TableSeat';

export interface PaifuMetadata {
  recordedAt: string;
  source: string;
  tableId: string;
  tournamentId: string;
  stageId: string;
  seats: TableSeat[];
  matchRecordId: string | null;
}
