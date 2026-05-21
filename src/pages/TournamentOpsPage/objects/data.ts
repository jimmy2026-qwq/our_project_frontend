import { AppealListAPI } from '@/api/tournament/appeal/AppealListAPI';
import { TournamentListAPI } from '@/api/tournament/TournamentListAPI';
import { TournamentRecordListAPI } from '@/api/tournament/TournamentRecordListAPI';
import { TournamentStageDirectoryAPI } from '@/api/tournament/TournamentStageDirectoryAPI';
import { TournamentStageTablesAPI } from '@/api/tournament/TournamentStageTablesAPI';
import type {
  AppealListQuery,
  AppealTicketView,
  ListEnvelope,
  MatchRecordListQuery,
  TableListQuery,
  TableStatus,
  TournamentMatchRecordView,
  TournamentStageDirectoryEntry,
  TournamentSummaryView,
  TournamentTableView,
} from '@/objects';
import {
  mapMatchRecordSummary,
  mapTournamentDirectoryEntry,
  mapTournamentTable,
  type TournamentDirectoryEntryView,
} from '@/pages/objects/tournament';
import type {
  AppealSummary,
  MatchRecordSummary,
  TournamentTableSummary,
} from '@/pages/objects/tournament';
import { sendAPI } from '@/system/api';

export type DataSource = 'api' | 'mock';

export interface LoadState<T> {
  envelope: ListEnvelope<T>;
  source: DataSource;
  warning?: string;
}

export interface StageContext {
  id: string;
  name: string;
}

export interface TournamentContext {
  id: string;
  name: string;
  stages: StageContext[];
}

export interface TournamentDirectoryState {
  items: TournamentContext[];
  source: DataSource;
  warning?: string;
}

export interface TournamentOpsState {
  tournamentId: string;
  stageId: string;
  tableStatus: TableStatus | '';
  playerId: string;
  appealStatus: AppealSummary['status'] | '';
}

export const DEFAULT_TOURNAMENT_OPS_STATE: TournamentOpsState = {
  tournamentId: '',
  stageId: '',
  tableStatus: '',
  playerId: '',
  appealStatus: '',
};

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

function getTournaments(filters = {}) {
  return sendAPI<ListEnvelope<TournamentSummaryView>>(
    new TournamentListAPI(filters),
  ).then(
    (envelope): ListEnvelope<TournamentDirectoryEntryView> => ({
      ...envelope,
      items: envelope.items.map(mapTournamentDirectoryEntry),
    }),
  );
}

function getTournamentStages(tournamentId: string) {
  return sendAPI<TournamentStageDirectoryEntry[]>(
    new TournamentStageDirectoryAPI(tournamentId),
  );
}

function getTournamentTables(
  tournamentId: string,
  stageId: string,
  filters: TableListQuery,
) {
  return sendAPI<ListEnvelope<TournamentTableView>>(
    new TournamentStageTablesAPI(tournamentId, stageId, filters),
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

function createEmptyLoadState<T>(): LoadState<T> {
  return {
    envelope: {
      items: [],
      total: 0,
      limit: 0,
      offset: 0,
      hasMore: false,
      appliedFilters: {},
    },
    source: 'api',
  };
}

export function getActiveTournament(
  tournaments: TournamentContext[],
  tournamentId: string,
) {
  return (
    tournaments.find((tournament) => tournament.id === tournamentId) ??
    tournaments[0] ??
    null
  );
}

export function normalizeTournamentOpsState(
  tournaments: TournamentContext[],
  state: TournamentOpsState,
): TournamentOpsState {
  if (tournaments.length === 0) {
    return {
      ...state,
      tournamentId: '',
      stageId: '',
    };
  }

  const activeTournament = getActiveTournament(tournaments, state.tournamentId);
  if (!activeTournament) {
    return state;
  }

  const hasTournament = tournaments.some(
    (tournament) => tournament.id === state.tournamentId,
  );
  const hasStage = activeTournament.stages.some(
    (stage) => stage.id === state.stageId,
  );

  return {
    ...state,
    tournamentId: hasTournament ? state.tournamentId : activeTournament.id,
    stageId: hasStage ? state.stageId : (activeTournament.stages[0]?.id ?? ''),
  };
}

export async function loadTournamentDirectory(): Promise<TournamentDirectoryState> {
  try {
    const tournaments = await getTournaments();
    const items = await Promise.all(
      tournaments.items.map(async (tournament) => {
        const stages = await getTournamentStages(tournament.id);
        return {
          id: tournament.id,
          name: tournament.name,
          stages: stages.map((stage) => ({
            id: stage.stageId,
            name: stage.name,
          })),
        } satisfies TournamentContext;
      }),
    );

    return {
      items: items.filter((tournament) => tournament.stages.length > 0),
      source: 'api',
    };
  } catch (error) {
    return {
      items: [],
      source: 'api',
      warning:
        error instanceof Error
          ? error.message
          : 'Unable to load tournament directory.',
    };
  }
}

export function formatDateTime(value: string) {
  const timestamp = Date.parse(value);

  if (Number.isNaN(timestamp)) {
    return 'Unavailable';
  }

  return new Intl.DateTimeFormat('zh-CN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(timestamp));
}

export async function loadTables(
  state: TournamentOpsState,
): Promise<LoadState<TournamentTableSummary>> {
  try {
    const envelope = await getTournamentTables(
      state.tournamentId,
      state.stageId,
      {
        status: state.tableStatus || undefined,
        playerId: state.playerId || undefined,
        limit: 10,
        offset: 0,
      },
    );

    return { envelope, source: 'api' };
  } catch (error) {
    return {
      ...createEmptyLoadState<TournamentTableSummary>(),
      warning:
        error instanceof Error
          ? error.message
          : 'Unable to load tournament tables.',
    };
  }
}

export async function loadRecords(
  state: TournamentOpsState,
): Promise<LoadState<MatchRecordSummary>> {
  try {
    const envelope = await getRecords({
      tournamentId: state.tournamentId,
      stageId: state.stageId,
      playerId: state.playerId || undefined,
      limit: 10,
      offset: 0,
    });

    return { envelope, source: 'api' };
  } catch (error) {
    return {
      ...createEmptyLoadState<MatchRecordSummary>(),
      warning:
        error instanceof Error
          ? error.message
          : 'Unable to load match records.',
    };
  }
}

export async function loadAppeals(
  state: TournamentOpsState,
): Promise<LoadState<AppealSummary>> {
  try {
    const envelope = await getAppeals({
      tournamentId: state.tournamentId,
      status: state.appealStatus || undefined,
      limit: 10,
      offset: 0,
    });

    return { envelope, source: 'api' };
  } catch (error) {
    return {
      ...createEmptyLoadState<AppealSummary>(),
      warning:
        error instanceof Error ? error.message : 'Unable to load appeals.',
    };
  }
}
