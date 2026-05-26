import type { TournamentMatchRecordSeatResultView } from './TournamentMatchRecordSeatResultView';

export interface TournamentMatchRecordView {
  recordId: string;
  tableId: string;
  tournamentId: string;
  stageId: string;
  stageRoundNumber: number;
  generatedAt: string;
  seatResults: TournamentMatchRecordSeatResultView[];
  paifuId: string | null;
  finalizedBy: string | null;
  sourceEvent: string;
  notes: string[];
}

