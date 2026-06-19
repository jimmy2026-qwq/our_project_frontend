import type { TableDetail } from '@/pages/shared_objects/tournament/TableDetail';

export type TableSeat = TableDetail['seats'][number];

export type TableSeatMap = Record<
  'East' | 'South' | 'West' | 'North',
  TableSeat | null
>;
