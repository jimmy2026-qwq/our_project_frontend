import { beforeEach, describe, expect, it, vi } from 'vitest';

const sendAPIMock = vi.hoisted(() => vi.fn());

vi.mock('@/system/api', () => ({
  APIMessage: class {},
  sendAPI: sendAPIMock,
}));

import {
  DEFAULT_TOURNAMENT_OPS_STATE,
  loadAppeals,
  loadRecords,
  loadTables,
  loadTournamentDirectory,
} from '@/pages/TournamentOpsPage/objects/data';

function envelope<T>(items: T[], offset = 0) {
  return {
    items,
    total: items.length,
    limit: 20,
    offset,
    hasMore: false,
    appliedFilters: {},
  };
}

describe('tournament-ops data api integration', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('loads tournament directory from backend-shaped tournament and stage endpoints', async () => {
    sendAPIMock.mockResolvedValueOnce(
      envelope([
        { tournamentId: 'tournament-1', name: 'Spring Cup' },
        { tournamentId: 'tournament-empty', name: 'No Stages Yet' },
      ]),
    );
    sendAPIMock
      .mockResolvedValueOnce([
        {
          stageId: 'stage-1',
          name: 'Qualifier',
          status: 'Active',
          roundCount: 3,
          scheduledTableCount: 2,
        },
      ])
      .mockResolvedValueOnce([]);

    const result = await loadTournamentDirectory();

    expect(sendAPIMock.mock.calls[0][0].constructor.name).toBe(
      'TournamentListAPI',
    );
    expect(sendAPIMock.mock.calls[1][0]).toMatchObject({
      tournamentId: 'tournament-1',
    });
    expect(result).toEqual({
      items: [
        {
          id: 'tournament-1',
          name: 'Spring Cup',
          stages: [{ id: 'stage-1', name: 'Qualifier' }],
        },
      ],
      source: 'api',
    });
  });

  it('loads table, record, and appeal envelopes with page-owned filters', async () => {
    const state = {
      ...DEFAULT_TOURNAMENT_OPS_STATE,
      tournamentId: 'tournament-1',
      stageId: 'stage-1',
      tableStatus: 'WaitingPreparation' as const,
      playerId: 'player-1',
      appealStatus: 'Open' as const,
    };
    sendAPIMock.mockResolvedValueOnce(
      envelope([
        {
          tableId: 'table-1',
          tournamentId: 'tournament-1',
          stageId: 'stage-1',
          tableNo: 1,
          status: 'WaitingPreparation',
          seats: [],
        },
      ]),
    );
    sendAPIMock.mockResolvedValueOnce(
      envelope([
        {
          recordId: 'record-1',
          generatedAt: '2026-05-21T10:00:00Z',
          seatResults: [{ playerId: 'player-1', placement: 1 }],
          notes: [],
        },
      ]),
    );
    sendAPIMock.mockResolvedValueOnce(
      envelope([
        {
          appealId: 'appeal-1',
          tournamentId: 'tournament-1',
          stageId: 'stage-1',
          tableId: 'table-1',
          status: 'Open',
          openedBy: 'player-1',
          description: 'Disputed hand',
          attachments: [],
          priority: 'Normal',
          assigneeId: null,
          dueAt: null,
          createdAt: '2026-05-21T10:00:00Z',
          updatedAt: '2026-05-21T10:00:00Z',
          resolution: null,
          reopenCount: 0,
          logs: [],
        },
      ]),
    );

    await expect(loadTables(state)).resolves.toMatchObject({
      source: 'api',
      envelope: { items: [{ id: 'table-1' }] },
    });
    await expect(loadRecords(state)).resolves.toMatchObject({
      source: 'api',
      envelope: { items: [{ id: 'record-1' }] },
    });
    await expect(loadAppeals(state)).resolves.toMatchObject({
      source: 'api',
      envelope: { items: [{ id: 'appeal-1' }] },
    });

    expect(sendAPIMock.mock.calls[0][0]).toMatchObject({
      tournamentId: 'tournament-1',
      stageId: 'stage-1',
      status: 'WaitingPreparation',
      playerId: 'player-1',
      limit: 10,
      offset: 0,
    });
    expect(sendAPIMock.mock.calls[1][0]).toMatchObject({
      tournamentId: 'tournament-1',
      stageId: 'stage-1',
      playerId: 'player-1',
      limit: 10,
      offset: 0,
    });
    expect(sendAPIMock.mock.calls[2][0]).toMatchObject({
      tournamentId: 'tournament-1',
      status: 'Open',
      limit: 10,
      offset: 0,
    });
  });

  it('returns empty warning states when backend data calls fail', async () => {
    sendAPIMock.mockRejectedValueOnce(
      new Error('tables unavailable'),
    );

    await expect(loadTables(DEFAULT_TOURNAMENT_OPS_STATE)).resolves.toMatchObject(
      {
        source: 'api',
        warning: 'tables unavailable',
        envelope: { items: [], total: 0 },
      },
    );
  });
});
