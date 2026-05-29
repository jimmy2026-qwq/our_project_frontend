import { normalizeTournamentOpsState } from '../functions/getTournamentOpsState';
import type { TournamentContext, TournamentOpsState } from '../objects/data';
import { useTournamentAppealsData } from './useTournamentAppealsData';
import { useTournamentRecordsData } from './useTournamentRecordsData';
import { useTournamentTablesData } from './useTournamentTablesData';

export function useTournamentOpsPanelData(
  tournaments: TournamentContext[],
  state: TournamentOpsState,
  reloadKey = 0,
) {
  const hasTournament = tournaments.length > 0;
  const effectiveState = hasTournament
    ? normalizeTournamentOpsState(tournaments, state)
    : state;
  const tables = useTournamentTablesData(
    effectiveState,
    reloadKey,
    hasTournament,
  );
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
