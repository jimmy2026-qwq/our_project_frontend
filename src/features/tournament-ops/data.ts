import { apiClient } from '@/api/client';
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

export interface TournamentOpsState {
  tournamentId: string;
  stageId: string;
  tableStatus: TableStatus | '';
  playerId: string;
  appealStatus: AppealSummary['status'] | '';
}

export const tournamentContexts: TournamentContext[] = [
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
  tournamentId: tournamentContexts[0].id,
  stageId: tournamentContexts[0].stages[0].id,
  tableStatus: '',
  playerId: '',
  appealStatus: '',
};

export function getActiveTournament(tournamentId: string) {
  return tournamentContexts.find((tournament) => tournament.id === tournamentId) ?? tournamentContexts[0];
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export async function loadTables(state: TournamentOpsState): Promise<LoadState<TournamentTableSummary>> {
  try {
    const envelope = await apiClient.getTournamentTables(state.tournamentId, state.stageId, {
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
      warning: error instanceof Error ? error.message : 'Tournament tables fallback to mock.',
    };
  }
}

export async function loadRecords(state: TournamentOpsState): Promise<LoadState<MatchRecordSummary>> {
  try {
    const envelope = await apiClient.getRecords({
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
      warning: error instanceof Error ? error.message : 'Records fallback to mock.',
    };
  }
}

export async function loadAppeals(state: TournamentOpsState): Promise<LoadState<AppealSummary>> {
  try {
    const envelope = await apiClient.getAppeals({
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
      warning: error instanceof Error ? error.message : 'Appeals fallback to mock.',
    };
  }
}
