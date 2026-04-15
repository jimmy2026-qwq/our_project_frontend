import { operationsApi } from '@/api/operations';
import type {
  AppealSummary,
  ListEnvelope,
  MatchRecordSummary,
  TableStatus,
  TournamentTableSummary,
} from '@/domain';

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

export function getActiveTournament(tournaments: TournamentContext[], tournamentId: string) {
  return tournaments.find((tournament) => tournament.id === tournamentId) ?? tournaments[0] ?? null;
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

  const hasTournament = tournaments.some((tournament) => tournament.id === state.tournamentId);
  const hasStage = activeTournament.stages.some((stage) => stage.id === state.stageId);

  return {
    ...state,
    tournamentId: hasTournament ? state.tournamentId : activeTournament.id,
    stageId: hasStage ? state.stageId : activeTournament.stages[0]?.id ?? '',
  };
}

export async function loadTournamentDirectory(): Promise<TournamentDirectoryState> {
  try {
    const tournaments = await operationsApi.getTournaments();
    const items = await Promise.all(
      tournaments.items.map(async (tournament) => {
        const stages = await operationsApi.getTournamentStages(tournament.id);
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
      warning: error instanceof Error ? error.message : 'Unable to load tournament directory.',
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

export async function loadTables(state: TournamentOpsState): Promise<LoadState<TournamentTableSummary>> {
  try {
    const envelope = await operationsApi.getTournamentTables(state.tournamentId, state.stageId, {
      status: state.tableStatus || undefined,
      playerId: state.playerId || undefined,
      limit: 10,
      offset: 0,
    });

    return { envelope, source: 'api' };
  } catch (error) {
    return {
      ...createEmptyLoadState<TournamentTableSummary>(),
      warning: error instanceof Error ? error.message : 'Unable to load tournament tables.',
    };
  }
}

export async function loadRecords(state: TournamentOpsState): Promise<LoadState<MatchRecordSummary>> {
  try {
    const envelope = await operationsApi.getRecords({
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
      warning: error instanceof Error ? error.message : 'Unable to load match records.',
    };
  }
}

export async function loadAppeals(state: TournamentOpsState): Promise<LoadState<AppealSummary>> {
  try {
    const envelope = await operationsApi.getAppeals({
      tournamentId: state.tournamentId,
      status: state.appealStatus || undefined,
      limit: 10,
      offset: 0,
    });

    return { envelope, source: 'api' };
  } catch (error) {
    return {
      ...createEmptyLoadState<AppealSummary>(),
      warning: error instanceof Error ? error.message : 'Unable to load appeals.',
    };
  }
}
