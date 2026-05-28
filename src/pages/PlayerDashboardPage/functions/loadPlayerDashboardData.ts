import { OpsAnalyticsPlayerDashboardAPI } from '@/api/opsanalytics';
import { GetCurrentPlayerAPI } from '@/api/player';
import {
  AppealListAPI,
  TournamentRecordListAPI,
  TournamentTableListAPI,
} from '@/api/tournament';
import type {
  AppealListQuery,
  AppealTicketView,
  ListEnvelope,
  MatchRecordListQuery,
  TableListQuery,
  TournamentMatchRecordView,
  TournamentTableView,
} from '@/objects';
import type { TournamentTableSummary } from '@/pages/objects/tournament';
import { mapDashboard } from '@/pages/objects/opsanalytics';
import { mapPlayerProfile } from '@/pages/objects/player';
import {
  mapMatchRecordSummary,
  mapTournamentTable,
} from '@/pages/objects/tournament';
import type { AppealSummary } from '@/pages/objects/tournament';
import { sendAPI } from '@/system/api';

import {
  getPlayerClubLinks,
  withRecordDisplayNames,
  withTournamentNames,
} from './mapPlayerDashboardData';

function getActiveTableRank(status: TournamentTableSummary['status']) {
  switch (status) {
    case 'InProgress':
      return 0;
    case 'Scoring':
      return 1;
    case 'AppealInProgress':
      return 2;
    default:
      return 3;
  }
}

function mapAppeal(ticket: AppealTicketView): AppealSummary {
  const lastLog = ticket.logs[ticket.logs.length - 1];

  return {
    id: ticket.appealId,
    tournamentId: ticket.tournamentId,
    stageId: ticket.stageId,
    tableId: ticket.tableId,
    status: ticket.status,
    openedBy: ticket.openedBy,
    createdBy: ticket.openedBy,
    description: ticket.description,
    attachments: ticket.attachments.map((attachment) => attachment.uri),
    priority: ticket.priority,
    assigneeId: ticket.assigneeId,
    dueAt: ticket.dueAt,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
    resolution: ticket.resolution,
    verdict: lastLog?.note ?? null,
    reopenCount: ticket.reopenCount,
  };
}

function getTables(filters: TableListQuery) {
  return sendAPI<ListEnvelope<TournamentTableView>>(
    new TournamentTableListAPI(filters),
  ).then((envelope) => ({
    ...envelope,
    items: envelope.items.map(mapTournamentTable),
  }));
}

function getRecords(filters: MatchRecordListQuery) {
  return sendAPI<ListEnvelope<TournamentMatchRecordView>>(
    new TournamentRecordListAPI(filters),
  ).then((envelope) => ({
    ...envelope,
    items: envelope.items.map(mapMatchRecordSummary),
  }));
}

function getAppeals(filters: AppealListQuery) {
  return sendAPI(new AppealListAPI(filters)).then((envelope) => ({
    ...envelope,
    items: envelope.items.map(mapAppeal),
  }));
}

export async function loadPlayerDashboardData(operatorId: string) {
  const [player, dashboard, tablesEnvelope, recordsEnvelope, appealsEnvelope] =
    await Promise.all([
      sendAPI(new GetCurrentPlayerAPI(operatorId)).then(mapPlayerProfile),
      sendAPI(
        new OpsAnalyticsPlayerDashboardAPI({
          playerId: operatorId,
          operatorId,
        }),
      ).then(mapDashboard),
      getTables({ playerId: operatorId, limit: 8 }),
      getRecords({ playerId: operatorId, limit: 8 }),
      getAppeals({
        openedBy: operatorId,
        limit: 20,
        offset: 0,
      }),
    ]);
  const playerClubs = await getPlayerClubLinks(player.clubIds ?? []);
  const rawRecentTables = tablesEnvelope.items
    .filter((table) => table.status !== 'Archived')
    .sort(
      (left, right) =>
        getActiveTableRank(left.status) - getActiveTableRank(right.status),
    );
  const archivedRecords = [...recordsEnvelope.items]
    .sort((left, right) => right.recordedAt.localeCompare(left.recordedAt))
    .slice(0, 8);
  const appeals = [...appealsEnvelope.items].sort((left, right) =>
    (right.updatedAt ?? right.createdAt).localeCompare(
      left.updatedAt ?? left.createdAt,
    ),
  );

  return {
    player,
    playerClubs,
    dashboard,
    recentTables: await withTournamentNames(rawRecentTables),
    archivedRecords: await withRecordDisplayNames(archivedRecords),
    appeals,
  };
}

export type PlayerDashboardData = Awaited<ReturnType<typeof loadPlayerDashboardData>>;
export type { PlayerClubLink, RecentTableItem } from '../objects/PlayerDashboard.types';
