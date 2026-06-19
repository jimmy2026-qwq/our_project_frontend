import type { TableStatus } from '@/objects';

import type { TableSeatState } from './TableSeatState';

export interface TableDetail {
  id: string;
  tournamentId: string;
  stageId: string;
  tableNo: number;
  status: TableStatus;
  seats: TableSeatState[];
}
