import type {
  AppealSummary,
  CreateTournamentPayload,
  ListEnvelope,
  MatchRecordSummary,
  SeatWind,
  SubmitStageLineupPayload,
  TablePaifuDetail,
  TableStatus,
} from '@/domain';
import { toQueryString } from '@/lib/query';
import type {
  CreatedTournamentContract,
  TournamentDetailContract,
  TournamentDirectoryEntryContract,
  TournamentStageDirectoryEntryContract,
  TournamentTableContract,
} from './contracts/operations';
import { mapTableDetail, mapTournamentTable } from './operations.mappers';
import { encodeBackendOption, request, sendJson } from './http';

export interface RecordFilters {
  tournamentId?: string;
  stageId?: string;
  playerId?: string;
  limit?: number;
  offset?: number;
}

export interface AppealFilters {
  tournamentId?: string;
  status?: 'Open' | 'Resolved' | 'Rejected' | 'Escalated';
  tableId?: string;
  limit?: number;
  offset?: number;
}

export interface TableFilters {
  status?: TableStatus;
  playerId?: string;
  limit?: number;
  offset?: number;
}

export interface TournamentFilters {
  status?: string;
  adminId?: string;
  organizer?: string;
  limit?: number;
  offset?: number;
}

export interface StartTablePayload {
  operatorId?: string;
}

export interface ResetTablePayload {
  operatorId: string;
  note: string;
}

export interface FileAppealPayload {
  playerId: string;
  description: string;
}

export type TournamentStageDirectoryEntry = TournamentStageDirectoryEntryContract;

export interface UpdateSeatStatePayload {
  operatorId: string;
  seat: SeatWind;
  ready?: boolean;
  disconnected?: boolean;
  note?: string;
}

export const operationsApi = {
  getTables(filters: TableFilters) {
    return request<ListEnvelope<TournamentTableContract>>(`/tables${toQueryString(filters)}`).then((envelope) => ({
      ...envelope,
      items: envelope.items.map(mapTournamentTable),
    }));
  },
  getTournaments(filters: TournamentFilters = {}) {
    return request<ListEnvelope<TournamentDirectoryEntryContract>>(`/tournaments${toQueryString(filters)}`);
  },
  getTournamentStages(tournamentId: string) {
    return request<TournamentStageDirectoryEntryContract[] | { value?: TournamentStageDirectoryEntryContract[] }>(
      `/tournaments/${tournamentId}/stages`,
    ).then((payload) => (Array.isArray(payload) ? payload : payload.value ?? []));
  },
  getTournament(tournamentId: string) {
    return request<TournamentDetailContract>(`/tournaments/${tournamentId}`);
  },
  publishTournament(tournamentId: string, operatorId?: string) {
    return sendJson<TournamentDetailContract>(`/tournaments/${tournamentId}/publish`, 'POST', {
      operatorId: encodeBackendOption(operatorId),
    });
  },
  scheduleTournamentStage(tournamentId: string, stageId: string, operatorId?: string) {
    return sendJson<TournamentDetailContract>(`/tournaments/${tournamentId}/stages/${stageId}/schedule`, 'POST', {
      operatorId: encodeBackendOption(operatorId),
    });
  },
  registerTournamentClub(tournamentId: string, clubId: string, operatorId?: string) {
    return sendJson<TournamentDetailContract>(`/tournaments/${tournamentId}/clubs/${clubId}`, 'POST', {
      operatorId: encodeBackendOption(operatorId),
    });
  },
  submitStageLineup(tournamentId: string, stageId: string, payload: SubmitStageLineupPayload) {
    return sendJson<TournamentDetailContract>(`/tournaments/${tournamentId}/stages/${stageId}/lineups`, 'POST', {
      clubId: payload.clubId,
      operatorId: payload.operatorId,
      seats: payload.playerIds.map((playerId) => ({
        playerId,
        preferredWind: [],
        reserve: false,
      })),
      note: payload.note ? [payload.note] : [],
    });
  },
  createTournament(payload: CreateTournamentPayload) {
    return sendJson<CreatedTournamentContract>('/tournaments', 'POST', {
      name: payload.name,
      organizer: payload.organizer,
      startsAt: payload.startsAt,
      endsAt: payload.endsAt,
      adminId: payload.adminId ? [payload.adminId] : [],
      stages: [
        {
          id: [],
          name: payload.stage.name,
          format: payload.stage.format,
          order: payload.stage.order ?? 1,
          roundCount: payload.stage.roundCount,
          operatorId: [],
          ruleTemplateKey: [],
          advancementRuleType: [],
          cutSize: [],
          thresholdScore: [],
          targetTableCount: [],
          schedulingPoolSize: [payload.stage.schedulingPoolSize ?? 4],
        },
      ],
    });
  },
  getTable(tableId: string) {
    return request<TournamentTableContract>(`/tables/${tableId}`).then(mapTableDetail);
  },
  getTablePaifus(tableId: string) {
    return request<ListEnvelope<TablePaifuDetail>>(`/paifus${toQueryString({ tableId })}`);
  },
  startTable(tableId: string, payload: StartTablePayload = {}) {
    return sendJson<unknown>(`/tables/${tableId}/start`, 'POST', {
      operatorId: payload.operatorId ? [payload.operatorId] : [],
    });
  },
  resetTable(tableId: string, payload: ResetTablePayload) {
    return sendJson<unknown>(`/tables/${tableId}/reset`, 'POST', payload);
  },
  fileAppeal(tableId: string, payload: FileAppealPayload) {
    return sendJson<unknown>(`/tables/${tableId}/appeals`, 'POST', {
      playerId: payload.playerId,
      description: payload.description,
      attachments: [],
      priority: [],
      dueAt: [],
    });
  },
  updateSeatState(tableId: string, payload: UpdateSeatStatePayload) {
    return sendJson<unknown>(`/tables/${tableId}/seats/${payload.seat}/state`, 'POST', {
      operatorId: payload.operatorId,
      ...(payload.ready === undefined ? {} : { ready: encodeBackendOption(payload.ready) }),
      ...(payload.disconnected === undefined
        ? {}
        : { disconnected: encodeBackendOption(payload.disconnected) }),
      note: payload.note ? [payload.note] : [],
    });
  },
  getTournamentTables(tournamentId: string, stageId: string, filters: TableFilters) {
    return request<ListEnvelope<TournamentTableContract>>(
      `/tournaments/${tournamentId}/stages/${stageId}/tables${toQueryString(filters)}`,
    ).then((envelope) => ({
      ...envelope,
      items: envelope.items.map(mapTournamentTable),
    }));
  },
  getRecords(filters: RecordFilters) {
    return request<ListEnvelope<MatchRecordSummary>>(`/records${toQueryString(filters)}`);
  },
  getAppeals(filters: AppealFilters) {
    return request<ListEnvelope<AppealSummary>>(`/appeals${toQueryString(filters)}`);
  },
  buildTournamentTablesPath(tournamentId: string, stageId: string, filters: TableFilters) {
    return `/tournaments/${tournamentId}/stages/${stageId}/tables${toQueryString(filters)}`;
  },
  buildRecordsPath(filters: RecordFilters) {
    return `/records${toQueryString(filters)}`;
  },
  buildAppealsPath(filters: AppealFilters) {
    return `/appeals${toQueryString(filters)}`;
  },
  buildDictionaryEntryPath(key: string) {
    return `/dictionary/${key}`;
  },
  buildDictionaryListPath(prefix: string, limit = 20, offset = 0) {
    return `/dictionary${toQueryString({ prefix, limit, offset })}`;
  },
  buildDictionaryAuditPath(key: string, operatorId: string, eventType?: string, limit = 20) {
    return `/audits/dictionary/${key}${toQueryString({ operatorId, eventType, limit })}`;
  },
};
