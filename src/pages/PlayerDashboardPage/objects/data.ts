import { OpsAnalyticsPlayerDashboardAPI } from '@/api/opsanalytics';
import { GetCurrentPlayerAPI } from '@/api/player';
import { GetPublicClubAPI, GetPublicTournamentAPI } from '@/api/publicquery';
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
  PublicClubDetailView,
  PublicTournamentDetailView,
  TableListQuery,
  TournamentMatchRecordView,
  TournamentTableView,
} from '@/objects';
import type { PlayerProfileView } from '@/objects/player';
import { mapDashboard } from '@/pages/objects/opsanalytics';
import { mapPlayerProfile } from '@/pages/objects/player';
import {
  mapMatchRecordSummary,
  mapTournamentTable,
} from '@/pages/objects/tournament';
import type {
  AppealSummary,
  TournamentTableSummary,
} from '@/pages/objects/tournament';
import { sendAPI } from '@/system/api';

export interface RecentTableItem extends TournamentTableSummary {
  tournamentName: string;
}

export interface PlayerClubLink {
  id: string;
  name: string;
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

function getCurrentPlayer(operatorId: string) {
  return sendAPI<PlayerProfileView>(new GetCurrentPlayerAPI(operatorId)).then(
    mapPlayerProfile,
  );
}

function getPlayerDashboard(playerId: string, operatorId: string) {
  return sendAPI(new OpsAnalyticsPlayerDashboardAPI({ playerId, operatorId }))
    .then(mapDashboard);
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

function getPublicTournamentName(tournamentId: string) {
  return sendAPI<PublicTournamentDetailView>(
    new GetPublicTournamentAPI(tournamentId),
  ).then((tournament) => tournament.name);
}

function getPublicClubName(clubId: string) {
  return sendAPI<PublicClubDetailView>(new GetPublicClubAPI(clubId)).then(
    (club) => club.name,
  );
}

function getPlayerClubLinks(clubIds: string[]) {
  return Promise.all(
    clubIds.map(async (clubId) => {
      try {
        return {
          id: clubId,
          name: await getPublicClubName(clubId),
        };
      } catch {
        return {
          id: clubId,
          name: clubId,
        };
      }
    }),
  );
}

export async function loadPlayerDashboardData(operatorId: string) {
  const [player, dashboard, tablesEnvelope, recordsEnvelope, appealsEnvelope] =
    await Promise.all([
      getCurrentPlayer(operatorId),
      getPlayerDashboard(operatorId, operatorId),
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
    .sort((left, right) => {
      const rank = (status: TournamentTableSummary['status']) =>
        status === 'InProgress'
          ? 0
          : status === 'Scoring'
            ? 1
            : status === 'AppealPending' || status === 'AppealInProgress'
              ? 2
              : 3;

      return rank(left.status) - rank(right.status);
    });

  const tournamentNames = new Map<string, string>();
  await Promise.all(
    [
      ...new Set(
        rawRecentTables.map((table) => table.tournamentId).filter(Boolean),
      ),
    ].map(async (tournamentId) => {
      try {
        const tournamentName = await getPublicTournamentName(tournamentId);
        tournamentNames.set(tournamentId, tournamentName);
      } catch {
        tournamentNames.set(tournamentId, tournamentId);
      }
    }),
  );

  const recentTables: RecentTableItem[] = rawRecentTables.map((table) => ({
    ...table,
    tournamentName: tournamentNames.get(table.tournamentId) ?? table.tournamentId,
  }));

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
    recentTables,
    archivedRecords,
    appeals,
  };
}

export type PlayerDashboardData = Awaited<
  ReturnType<typeof loadPlayerDashboardData>
>;
