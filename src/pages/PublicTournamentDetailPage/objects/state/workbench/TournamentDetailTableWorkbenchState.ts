import type { TournamentDetailTableItem } from '@/pages/PublicTournamentDetailPage/objects/table/TournamentDetailTableItem';
import type { MatchRecordSummary } from '@/pages/shared_objects/tournament/MatchRecordSummary';

export interface TournamentDetailTableWorkbenchState {
  playerNames: Record<string, string>;
  recordByTableId: Record<string, MatchRecordSummary>;
  visibleTables: TournamentDetailTableItem[];
}
