import type { TableDetail } from '@/pages/objects/tournament';

export type TableSeat = TableDetail['seats'][number];

export type TableSeatMap = Record<
  'East' | 'South' | 'West' | 'North',
  TableSeat | null
>;
