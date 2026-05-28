import { OpsAnalyticsPlayerDashboardAPI } from '@/api/opsanalytics';
import { GetCurrentPlayerAPI } from '@/api/player';
import { GetPublicClubAPI } from '@/api/club';
import {
  AppealListAPI,
  GetPublicTournamentAPI,
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
import type { AppealSummary } from '@/pages/objects/tournament';
import { sendAPI } from '@/system/api';

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

export function getCurrentPlayer(operatorId: string) {
  return sendAPI<PlayerProfileView>(new GetCurrentPlayerAPI(operatorId)).then(
    mapPlayerProfile,
  );
}

export function getPlayerDashboard(playerId: string, operatorId: string) {
  return sendAPI(new OpsAnalyticsPlayerDashboardAPI({ playerId, operatorId }))
    .then(mapDashboard);
}

export function getTables(filters: TableListQuery) {
  return sendAPI<ListEnvelope<TournamentTableView>>(
    new TournamentTableListAPI(filters),
  ).then((envelope) => ({
    ...envelope,
    items: envelope.items.map(mapTournamentTable),
  }));
}

export function getRecords(filters: MatchRecordListQuery) {
  return sendAPI<ListEnvelope<TournamentMatchRecordView>>(
    new TournamentRecordListAPI(filters),
  ).then((envelope) => ({
    ...envelope,
    items: envelope.items.map(mapMatchRecordSummary),
  }));
}

export function getAppeals(filters: AppealListQuery) {
  return sendAPI(new AppealListAPI(filters)).then((envelope) => ({
    ...envelope,
    items: envelope.items.map(mapAppeal),
  }));
}

export function getPublicTournamentName(tournamentId: string) {
  return sendAPI<PublicTournamentDetailView>(
    new GetPublicTournamentAPI(tournamentId),
  ).then((tournament) => tournament.name);
}

export function getPublicTournamentDetail(tournamentId: string) {
  return sendAPI<PublicTournamentDetailView>(
    new GetPublicTournamentAPI(tournamentId),
  );
}

export function getPublicClubName(clubId: string) {
  return sendAPI<PublicClubDetailView>(new GetPublicClubAPI(clubId)).then(
    (club) => club.name,
  );
}
