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
import { toPaifuSummary } from '@/pages/TablePaifuPage/objects/TablePaifuData.mappers';

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
        paifuId: 'paifu-1',
        tableId: 'table-1',
        tournamentId: 'tournament-1',
        stageId: 'stage-1',
        recordedAt: '2026-05-21T10:00:00Z',
        source: 'manual',
        matchRecordId: 'record-1',
        metadata: {
          recordedAt: '2026-05-21T10:00:00Z',
          source: 'manual',
          tableId: 'table-1',
          tournamentId: 'tournament-1',
          stageId: 'stage-1',
          seats: [],
          matchRecordId: 'record-1',
        },
        rounds: [],
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
    expect(message).toMatchObject({ query: { tableId: 'table-1' } });
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

  it('normalizes backend option arrays before replay reads paifu fields', () => {
    const paifu = toPaifuSummary({
      paifuId: 'paifu-1',
      tableId: 'table-1',
      tournamentId: 'tournament-1',
      stageId: 'stage-1',
      recordedAt: '2026-05-21T10:00:00Z',
      source: 'manual',
      matchRecordId: ['record-1'],
      totalHands: 1,
      playerIds: ['player-east'],
      metadata: {
        recordedAt: '2026-05-21T10:00:00Z',
        source: 'manual',
        tableId: 'table-1',
        tournamentId: 'tournament-1',
        stageId: 'stage-1',
        seats: [],
        matchRecordId: ['record-1'],
      },
      rounds: [
        {
          descriptor: { roundWind: 'East', handNumber: 1, honba: 0 },
          initialHands: { 'player-east': ['1m', '2m'] },
          actions: [
            {
              sequenceNo: 1,
              actor: ['player-east'],
              actionType: 'Riichi',
              tile: ['1m'],
              shantenAfterAction: [0],
              handTilesAfterAction: [['2m']],
              revealedTiles: ['1m'],
              note: ['double riichi'],
            },
          ],
          result: {
            outcome: 'Ron',
            winner: ['player-east'],
            target: [],
            han: [2],
            fu: [30],
            yaku: [],
            doraIndicators: [['4z']],
            uraDoraIndicators: [],
            uraDoraVisible: [true],
            points: 2000,
            wins: [
              {
                winner: 'player-east',
                target: ['player-south'],
                han: [2],
                fu: [30],
                yaku: [{ kind: 'Riichi', han: 1 }],
                doraIndicators: [['4z']],
                uraDoraIndicators: [],
                uraDoraVisible: [true],
                points: 2000,
              },
            ],
            scoreChanges: [],
            settlement: [],
            tenpaiPlayerIds: [],
          },
        },
      ],
      finalStandings: [],
    } as never);

    expect(paifu.metadata.matchRecordId).toBe('record-1');
    expect(paifu.rounds[0].actions[0]).toMatchObject({
      actor: 'player-east',
      tile: '1m',
      shantenAfterAction: 0,
      handTilesAfterAction: ['2m'],
      note: 'double riichi',
    });
    expect(paifu.rounds[0].result).toMatchObject({
      winner: 'player-east',
      target: undefined,
      han: 2,
      fu: 30,
      doraIndicators: ['4z'],
      uraDoraIndicators: [],
      uraDoraVisible: true,
      tenpaiPlayerIds: [],
      wins: [
        {
          winner: 'player-east',
          target: 'player-south',
          han: 2,
          fu: 30,
          yaku: [{ kind: 'Riichi', han: 1 }],
          doraIndicators: ['4z'],
          uraDoraIndicators: [],
          uraDoraVisible: true,
          points: 2000,
        },
      ],
    });
  });
});
