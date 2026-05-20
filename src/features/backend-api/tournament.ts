import { sendAPI } from '@/system/api';
import type {
  AdjudicateAppealRequest,
  AppealListQuery,
  AppealTicketView,
  CreateTournamentRequest,
  ListEnvelope,
  MatchRecordListQuery,
  ForceResetTableRequest,
  StartTableRequest,
  SubmitStageLineupRequest,
  TableListQuery,
  TournamentDetailView,
  TournamentListQuery,
  TournamentMutationView,
  TournamentMatchRecordView,
  TournamentPaifuSummaryView,
  TournamentSummaryView,
  TournamentStageDirectoryEntry,
  TournamentTableView,
  UpdateOwnTableReadyStateRequest,
  UpdateTableSeatStateRequest,
} from '@/objects';
import type { TournamentDirectoryEntryView } from '@/pages/objects/TournamentMappers';
import type { AppealSummary } from '@/pages/objects/TournamentViews';
import {
  mapMatchRecordSummary,
  mapPaifuSummary,
  mapTableDetail,
  mapTournamentDirectoryEntry,
  mapTournamentTable,
} from '@/pages/objects/TournamentMappers';
import { AppealAdjudicateAPI } from '@/api/tournament/appeal/AppealAdjudicateAPI';
import { AppealFileAPI } from '@/api/tournament/appeal/AppealFileAPI';
import { AppealListAPI } from '@/api/tournament/appeal/AppealListAPI';
import { AppealUpdateWorkflowAPI } from '@/api/tournament/appeal/AppealUpdateWorkflowAPI';
import type { FileAppealRequest, UpdateAppealWorkflowRequest } from '@/objects/tournament/appeal';
import { TournamentCreateAPI } from '@/api/tournament/TournamentCreateAPI';
import { TournamentGetAPI } from '@/api/tournament/TournamentGetAPI';
import { TournamentListAPI } from '@/api/tournament/TournamentListAPI';
import { TournamentPaifuListAPI } from '@/api/tournament/TournamentPaifuListAPI';
import { TournamentPublishAPI } from '@/api/tournament/TournamentPublishAPI';
import { TournamentRecordListAPI } from '@/api/tournament/TournamentRecordListAPI';
import { TournamentRegisterClubAPI } from '@/api/tournament/TournamentRegisterClubAPI';
import { TournamentStageDirectoryAPI } from '@/api/tournament/TournamentStageDirectoryAPI';
import { TournamentStageScheduleTablesAPI } from '@/api/tournament/TournamentStageScheduleTablesAPI';
import { TournamentStageSubmitLineupAPI } from '@/api/tournament/TournamentStageSubmitLineupAPI';
import { TournamentStageTablesAPI } from '@/api/tournament/TournamentStageTablesAPI';
import { TournamentTableGetAPI } from '@/api/tournament/TournamentTableGetAPI';
import { TournamentTableListAPI } from '@/api/tournament/TournamentTableListAPI';
import { TournamentTableResetAPI } from '@/api/tournament/TournamentTableResetAPI';
import { TournamentTableStartAPI } from '@/api/tournament/TournamentTableStartAPI';
import { TournamentTableUpdateOwnReadyAPI } from '@/api/tournament/TournamentTableUpdateOwnReadyAPI';
import { TournamentTableUpdateSeatStateAPI } from '@/api/tournament/TournamentTableUpdateSeatStateAPI';


export interface CreatedTournamentView {
  id: string;
  name: string;
  organizer: string;
  status?: string;
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

export const tournamentApi = {
  getTournaments(filters: TournamentListQuery = {}) {
    return sendAPI<ListEnvelope<TournamentSummaryView>>(new TournamentListAPI(filters)).then((envelope): ListEnvelope<TournamentDirectoryEntryView> => ({
      ...envelope,
      items: envelope.items.map(mapTournamentDirectoryEntry),
    }));
  },
  getTournamentStages(tournamentId: string) {
    return sendAPI<TournamentStageDirectoryEntry[]>(new TournamentStageDirectoryAPI(tournamentId));
  },
  getTournament(tournamentId: string) {
    return sendAPI<TournamentDetailView>(new TournamentGetAPI(tournamentId));
  },
  publishTournament(tournamentId: string, operatorId?: string) {
    return sendAPI<TournamentMutationView>(new TournamentPublishAPI(tournamentId, operatorId));
  },
  scheduleTournamentStage(tournamentId: string, stageId: string, operatorId?: string) {
    return sendAPI<TournamentMutationView>(new TournamentStageScheduleTablesAPI(tournamentId, stageId, operatorId));
  },
  registerTournamentClub(tournamentId: string, clubId: string, operatorId?: string) {
    return sendAPI<TournamentMutationView>(new TournamentRegisterClubAPI(tournamentId, clubId, operatorId));
  },
  submitStageLineup(tournamentId: string, stageId: string, payload: SubmitStageLineupRequest) {
    return sendAPI<TournamentMutationView>(new TournamentStageSubmitLineupAPI(tournamentId, stageId, payload));
  },
  createTournament(payload: CreateTournamentRequest) {
    return sendAPI<TournamentSummaryView>(new TournamentCreateAPI(payload)).then((tournament) => ({
      id: tournament.tournamentId,
      name: tournament.name,
      organizer: tournament.organizer,
      status: tournament.status,
    }) satisfies CreatedTournamentView);
  },
  getTables(filters: TableListQuery) {
    return sendAPI<ListEnvelope<TournamentTableView>>(new TournamentTableListAPI(filters)).then((envelope) => ({
      ...envelope,
      items: envelope.items.map(mapTournamentTable),
    }));
  },
  getTable(tableId: string) {
    return sendAPI<TournamentTableView>(new TournamentTableGetAPI(tableId)).then(mapTableDetail);
  },
  getTablePaifus(tableId: string) {
    return sendAPI<ListEnvelope<TournamentPaifuSummaryView>>(new TournamentPaifuListAPI({ tableId })).then((envelope) => ({
      ...envelope,
      items: envelope.items.map(mapPaifuSummary),
    }));
  },
  startTable(tableId: string, payload: StartTableRequest = {}) {
    return sendAPI(new TournamentTableStartAPI(tableId, payload));
  },
  resetTable(tableId: string, payload: ForceResetTableRequest) {
    return sendAPI(new TournamentTableResetAPI(tableId, payload));
  },
  fileAppeal(tableId: string, payload: FileAppealRequest) {
    return sendAPI(new AppealFileAPI(tableId, payload));
  },
  updateSeatState(tableId: string, payload: UpdateTableSeatStateRequest) {
    return sendAPI(new TournamentTableUpdateSeatStateAPI(tableId, payload));
  },
  updateOwnReadyState(tableId: string, payload: UpdateOwnTableReadyStateRequest) {
    return sendAPI<TournamentTableView>(new TournamentTableUpdateOwnReadyAPI(tableId, payload)).then(mapTableDetail);
  },
  getTournamentTables(tournamentId: string, stageId: string, filters: TableListQuery) {
    return sendAPI<ListEnvelope<TournamentTableView>>(
      new TournamentStageTablesAPI(tournamentId, stageId, filters),
    ).then((envelope) => ({
      ...envelope,
      items: envelope.items.map(mapTournamentTable),
    }));
  },
  getRecords(filters: MatchRecordListQuery) {
    return sendAPI<ListEnvelope<TournamentMatchRecordView>>(new TournamentRecordListAPI(filters)).then((envelope) => ({
      ...envelope,
      items: envelope.items.map(mapMatchRecordSummary),
    }));
  },
  getAppeals(filters: AppealListQuery) {
    return sendAPI(new AppealListAPI(filters)).then((envelope) => ({
      ...envelope,
      items: envelope.items.map(mapAppeal),
    }));
  },
  adjudicateAppeal(appealId: string, payload: AdjudicateAppealRequest) {
    return sendAPI(new AppealAdjudicateAPI(appealId, payload)).then(mapAppeal);
  },
  updateAppealWorkflow(appealId: string, payload: UpdateAppealWorkflowRequest) {
    return sendAPI(new AppealUpdateWorkflowAPI(appealId, payload)).then(mapAppeal);
  },
};
