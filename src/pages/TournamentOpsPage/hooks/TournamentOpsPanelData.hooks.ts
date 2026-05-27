import {
  normalizeTournamentOpsState,
  type TournamentContext,
  type TournamentOpsState,
} from '../objects/data';
import { useTournamentAppealsData } from './TournamentAppealsData.hooks';
import { useTournamentRecordsData } from './TournamentRecordsData.hooks';
import { useTournamentTablesData } from './TournamentTablesData.hooks';

export function useTournamentOpsPanelData(
  tournaments: TournamentContext[],
  state: TournamentOpsState,
  reloadKey = 0,
) {
  const hasTournament = tournaments.length > 0;
  const effectiveState = hasTournament
    ? normalizeTournamentOpsState(tournaments, state)
    : state;
  const tables = useTournamentTablesData(effectiveState, reloadKey, hasTournament);
  const records = useTournamentRecordsData(
    effectiveState,
    reloadKey,
    hasTournament,
  );
  const appeals = useTournamentAppealsData(
    effectiveState,
    reloadKey,
    hasTournament,
  );

  return {
    tables: tables.tables,
    records: records.records,
    appeals: appeals.appeals,
    isLoadingPanelData:
      tables.isLoadingTables ||
      records.isLoadingRecords ||
      appeals.isLoadingAppeals,
  };
}
