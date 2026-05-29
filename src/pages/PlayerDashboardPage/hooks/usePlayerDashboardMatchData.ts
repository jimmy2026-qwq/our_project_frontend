import { useCallback } from 'react';

import {
  GetPublicTournamentAPI,
  TournamentRecordListAPI,
  TournamentTableListAPI,
} from '@/api/tournament';
import type {
  ListEnvelope,
  MatchRecordListQuery,
  PublicTournamentDetailView,
  TableListQuery,
  TournamentMatchRecordView,
  TournamentTableView,
} from '@/objects';
import type {
  MatchRecordSummary,
  TournamentTableSummary,
} from '@/pages/objects/TournamentViews';
import { sendAPI } from '@/system/api';

import { getActiveTableRank } from '../functions/getActiveTableRank';
import { getStageDisplayName } from '../functions/getStageDisplayName';
import {
  toMatchRecordSummary,
  toTournamentTableSummary,
} from '../objects/PlayerDashboard.mappers';
import type { RecentTableItem } from '../objects/PlayerDashboard.types';

function getTables(filters: TableListQuery) {
  return sendAPI<ListEnvelope<TournamentTableView>>(
    new TournamentTableListAPI(filters),
  ).then((envelope) => ({
    ...envelope,
    items: envelope.items.map(toTournamentTableSummary),
  }));
}

function getRecords(filters: MatchRecordListQuery) {
  return sendAPI<ListEnvelope<TournamentMatchRecordView>>(
    new TournamentRecordListAPI(filters),
  ).then((envelope) => ({
    ...envelope,
    items: envelope.items.map(toMatchRecordSummary),
  }));
}

async function withTournamentNames(
  tables: TournamentTableSummary[],
): Promise<RecentTableItem[]> {
  const tournamentNames = new Map<string, string>();
  await Promise.all(
    [...new Set(tables.map((table) => table.tournamentId).filter(Boolean))].map(
      async (tournamentId) => {
        try {
          const tournamentName = await sendAPI(
            new GetPublicTournamentAPI(tournamentId),
          ).then((tournament) => tournament.name);
          tournamentNames.set(tournamentId, tournamentName);
        } catch {
          tournamentNames.set(tournamentId, tournamentId);
        }
      },
    ),
  );

  return tables.map((table) => ({
    ...table,
    tournamentName:
      tournamentNames.get(table.tournamentId) ?? table.tournamentId,
  }));
}

async function withRecordDisplayNames(
  records: MatchRecordSummary[],
): Promise<MatchRecordSummary[]> {
  const tournamentDetails = new Map<string, PublicTournamentDetailView>();

  await Promise.all(
    [
      ...new Set(records.map((record) => record.tournamentId).filter(Boolean)),
    ].map(async (tournamentId) => {
      try {
        tournamentDetails.set(
          tournamentId,
          await sendAPI(new GetPublicTournamentAPI(tournamentId)),
        );
      } catch {
        // Keep ids as fallback labels when public detail is unavailable.
      }
    }),
  );

  return records.map((record) => {
    const tournament = tournamentDetails.get(record.tournamentId);
    const stage = tournament?.stages.find(
      (candidate) => candidate.stageId === record.stageId,
    );

    return {
      ...record,
      tournamentName: tournament?.name ?? record.tournamentId,
      stageName: tournament
        ? (getStageDisplayName(tournament, stage) ?? record.stageId)
        : record.stageId,
    };
  });
}

export function usePlayerDashboardMatchData() {
  return useCallback(async (operatorId: string) => {
    const [tablesEnvelope, recordsEnvelope] = await Promise.all([
      getTables({ playerId: operatorId, limit: 8 }),
      getRecords({ playerId: operatorId, limit: 8 }),
    ]);
    const rawRecentTables = tablesEnvelope.items
      .filter((table) => table.status !== 'Archived')
      .sort(
        (left, right) =>
          getActiveTableRank(left.status) - getActiveTableRank(right.status),
      );
    const archivedRecords = [...recordsEnvelope.items]
      .sort((left, right) => right.recordedAt.localeCompare(left.recordedAt))
      .slice(0, 8);

    return {
      recentTables: await withTournamentNames(rawRecentTables),
      archivedRecords: await withRecordDisplayNames(archivedRecords),
    };
  }, []);
}
