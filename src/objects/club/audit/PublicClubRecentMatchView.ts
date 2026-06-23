import type { PublicClubRecentMatchSeatView } from './PublicClubRecentMatchSeatView';

export interface PublicClubRecentMatchView {
  matchRecordId: string;
  tournamentId: string;
  tournamentName: string;
  stageId: string;
  stageName: string;
  tableId: string;
  generatedAt: string;
  seats: PublicClubRecentMatchSeatView[];
}
