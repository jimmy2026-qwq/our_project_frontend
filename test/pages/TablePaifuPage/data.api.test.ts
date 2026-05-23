import { beforeEach, describe, expect, it, vi } from 'vitest';

const sendAPIMock = vi.hoisted(() => vi.fn());

vi.mock('@/system/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/system/api')>();
  return {
    ...actual,
    sendAPI: sendAPIMock,
  };
});

import { TournamentPaifuListAPI } from '@/api/tournament/TournamentPaifuListAPI';
import { loadTablePaifus } from '@/pages/TablePaifuPage/data';

describe('TablePaifuPage data api integration', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('requests paifus by table id and maps backend summaries into page details', async () => {
    sendAPIMock.mockResolvedValueOnce({
      items: [
        {
          paifuId: 'paifu-1',
          tableId: 'table-1',
          tournamentId: 'tournament-1',
          stageId: 'stage-1',
          recordedAt: '2026-05-21T10:00:00Z',
          source: 'manual',
          matchRecordId: 'record-1',
          totalHands: 8,
          playerIds: ['player-east', 'player-south'],
          finalStandings: [
            {
              playerId: 'player-east',
              seat: 'East',
              finalPoints: 42000,
              placement: 1,
              uma: 20,
              oka: 0,
            },
          ],
        },
      ],
      total: 1,
      limit: 20,
      offset: 0,
      hasMore: false,
      appliedFilters: { tableId: 'table-1' },
    })
      .mockResolvedValueOnce({
        tournamentId: 'tournament-1',
        name: 'Test Tournament',
        stages: [
          {
            stageId: 'stage-1',
            name: 'Old Stage Name',
            format: 'Knockout',
            status: 'Completed',
            roundCount: 1,
            tableCount: 1,
            pendingTablePlanCount: 0,
          },
        ],
      })
      .mockResolvedValueOnce({
        playerId: 'player-east',
        nickname: 'East Player',
      });

    const result = await loadTablePaifus('table-1');
    const message = sendAPIMock.mock.calls[0]?.[0];

    expect(message).toBeInstanceOf(TournamentPaifuListAPI);
    expect(message).toMatchObject({ tableId: 'table-1' });
    expect(result).toMatchObject({
      total: 1,
      items: [
        {
          id: 'paifu-1',
          metadata: {
            tableId: 'table-1',
            tournamentId: 'tournament-1',
            stageId: 'stage-1',
            tournamentName: 'Test Tournament',
            stageName: 'Test Tournament 淘汰赛',
            recordedAt: '2026-05-21T10:00:00Z',
            playerNames: {
              'player-east': 'East Player',
            },
          },
          rounds: [],
          finalStandings: [
            {
              playerId: 'player-east',
              seat: 'East',
              finalPoints: 42000,
              placement: 1,
            },
          ],
        },
      ],
    });
  });
});
