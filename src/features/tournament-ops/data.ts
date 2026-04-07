import { operationsApi } from '@/api/operations';
import type {
  AppealSummary,
  ListEnvelope,
  MatchRecordSummary,
  TableStatus,
  TournamentTableSummary,
} from '@/domain/models';
import { mockAppeals, mockRecords, mockTournamentTables, toMockEnvelope } from '@/mocks/overview';

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

export const fallbackTournamentContexts: TournamentContext[] = [
  {
    id: 'tournament-123',
    name: 'Riichi Nexus Spring Masters',
    stages: [
      { id: 'stage-swiss-1', name: 'Swiss Round 1' },
      { id: 'stage-finals', name: 'Finals' },
    ],
  },
  {
    id: 'tournament-456',
    name: 'Kanto Club Open',
    stages: [{ id: 'stage-qualifier-a', name: 'Qualifier A' }],
  },
];

export const DEFAULT_TOURNAMENT_OPS_STATE: TournamentOpsState = {
  tournamentId: fallbackTournamentContexts[0].id,
  stageId: fallbackTournamentContexts[0].stages[0].id,
  tableStatus: '',
  playerId: '',
  appealStatus: '',
};

export function getActiveTournament(tournaments: TournamentContext[], tournamentId: string) {
  return tournaments.find((tournament) => tournament.id === tournamentId) ?? tournaments[0] ?? fallbackTournamentContexts[0];
}

export function normalizeTournamentOpsState(
  tournaments: TournamentContext[],
  state: TournamentOpsState,
): TournamentOpsState {
  const activeTournament = getActiveTournament(tournaments, state.tournamentId);
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
      items: fallbackTournamentContexts,
      source: 'mock',
      warning: error instanceof Error ? error.message : '赛事目录加载失败，已回退到本地兜底数据。',
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
    const filtered = mockTournamentTables.filter((table) => {
      const stageMatch = table.stageId === state.stageId;
      const statusMatch = !state.tableStatus || table.status === state.tableStatus;
      const playerMatch = !state.playerId || table.playerIds.includes(state.playerId);
      return stageMatch && statusMatch && playerMatch;
    });

    return {
      envelope: toMockEnvelope(filtered, {
        tournamentId: state.tournamentId,
        stageId: state.stageId,
        status: state.tableStatus,
        playerId: state.playerId,
      }),
      source: 'mock',
      warning: error instanceof Error ? error.message : '牌桌数据加载失败，已回退到本地兜底数据。',
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
    const filtered = mockRecords.filter((record) => {
      const tournamentMatch = record.tournamentId === state.tournamentId;
      const stageMatch = record.stageId === state.stageId;
      const playerMatch = !state.playerId || record.summary.includes(state.playerId);
      return tournamentMatch && stageMatch && playerMatch;
    });

    return {
      envelope: toMockEnvelope(filtered, {
        tournamentId: state.tournamentId,
        stageId: state.stageId,
        playerId: state.playerId,
      }),
      source: 'mock',
      warning: error instanceof Error ? error.message : '对局记录加载失败，已回退到本地兜底数据。',
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
    const filtered = mockAppeals.filter((appeal) => {
      const tournamentMatch = appeal.tournamentId === state.tournamentId;
      const statusMatch = !state.appealStatus || appeal.status === state.appealStatus;
      return tournamentMatch && statusMatch;
    });

    return {
      envelope: toMockEnvelope(filtered, {
        tournamentId: state.tournamentId,
        status: state.appealStatus,
      }),
      source: 'mock',
      warning: error instanceof Error ? error.message : '申诉数据加载失败，已回退到本地兜底数据。',
    };
  }
}
