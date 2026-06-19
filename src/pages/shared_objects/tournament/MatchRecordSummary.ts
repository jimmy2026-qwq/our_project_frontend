import type { MatchRecordSeatResultSummary } from './MatchRecordSeatResultSummary';

export interface MatchRecordSummary {
  id: string;
  tournamentId: string;
  tournamentName?: string;
  stageId: string;
  stageName?: string;
  tableId: string;
  recordedAt: string;
  winnerId: string;
  summary: string;
  seatResults?: MatchRecordSeatResultSummary[];
}
