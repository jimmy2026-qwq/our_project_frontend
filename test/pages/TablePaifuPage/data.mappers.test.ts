import { describe, expect, it } from 'vitest';

import {
  toBackendPaifu,
  toPaifuSummary,
} from '@/pages/TablePaifuPage/objects/TablePaifuData.mappers';
import type { TablePaifuDetail } from '@/pages/TablePaifuPage/types';

describe('TablePaifuData mappers', () => {
  it('maps backend paifu rounds into frontend replay details with multi-win fields', () => {
    const paifu = toPaifuSummary({
      paifuId: 'paifu-1',
      metadata: {
        recordedAt: '2026-06-05T00:00:00Z',
        source: 'backend',
        tableId: 'table-1',
        tournamentId: 'tournament-1',
        stageId: 'stage-1',
        seats: [],
        matchRecordId: [],
      },
      rounds: [
        {
          descriptor: { roundWind: 'East', handNumber: 1, honba: 0 },
          players: [
            {
              playerId: 'east',
              seat: 'East',
              initialHand: { tiles: ['1m', '2m'] },
              track: { events: [] },
            },
          ],
          timeline: {
            events: [
              {
                sequenceNo: 1,
                actor: ['east'],
                actionType: 'Discard',
                tile: ['1m'],
                fromPlayer: [],
                targetSequenceNo: [],
                shantenAfterAction: [],
                handTilesAfterAction: [['2m']],
                revealedTiles: ['1m'],
                note: [],
              },
            ],
          },
          result: {
            outcome: 'Ron',
            winner: ['south'],
            target: ['east'],
            han: [3],
            fu: [40],
            yaku: [{ kind: 'Riichi', han: 1 }],
            doraIndicators: [['5z']],
            uraDoraIndicators: [],
            uraDoraVisible: [false],
            points: 11600,
            scoreChanges: [
              { playerId: 'east', delta: -11600 },
              { playerId: 'south', delta: 7700 },
              { playerId: 'west', delta: 3900 },
            ],
            settlement: [],
            tenpaiPlayerIds: [],
            wins: [
              {
                winner: 'south',
                target: ['east'],
                han: [3],
                fu: [40],
                yaku: [{ kind: 'Riichi', han: 1 }],
                doraIndicators: [['5z']],
                uraDoraIndicators: [],
                uraDoraVisible: [false],
                points: 7700,
              },
              {
                winner: 'west',
                target: ['east'],
                han: [2],
                fu: [30],
                yaku: [{ kind: 'Pinfu', han: 1 }],
                doraIndicators: [['5z']],
                uraDoraIndicators: [],
                uraDoraVisible: [false],
                points: 3900,
              },
            ],
          },
        },
      ],
      finalStandings: [],
    } as never);

    expect(paifu.id).toBe('paifu-1');
    expect(paifu.metadata.matchRecordId).toBeNull();
    expect(paifu.rounds[0].initialHands).toEqual({ east: ['1m', '2m'] });
    expect(paifu.rounds[0].actions[0]).toMatchObject({
      actor: 'east',
      tile: '1m',
      handTilesAfterAction: ['2m'],
      revealedTiles: ['1m'],
    });
    expect(paifu.rounds[0].result.wins).toEqual([
      expect.objectContaining({ winner: 'south', target: 'east', points: 7700 }),
      expect.objectContaining({ winner: 'west', target: 'east', points: 3900 }),
    ]);
  });

  it('maps frontend paifu details back into backend-shaped contracts', () => {
    const paifu: TablePaifuDetail = {
      id: 'paifu-2',
      metadata: {
        tableId: 'table-1',
        tournamentId: 'tournament-1',
        stageId: 'stage-1',
        recordedAt: '2026-06-05T00:00:00Z',
        source: 'frontend',
        matchRecordId: undefined,
        seats: [
          {
            seat: 'East',
            playerId: 'east',
            initialPoints: 25000,
            disconnected: false,
            ready: true,
          },
        ],
      },
      rounds: [
        {
          descriptor: { roundWind: 'East', handNumber: 1, honba: 0 },
          initialHands: { east: ['1m', '2m'] },
          actions: [
            {
              sequenceNo: 1,
              actor: 'east',
              actionType: 'Discard',
              tile: '1m',
              revealedTiles: ['1m'],
            },
          ],
          result: {
            outcome: 'Tsumo',
            winner: 'east',
            han: 5,
            fu: undefined,
            yaku: [{ kind: 'NagashiMangan', han: 5 }],
            doraIndicators: ['5z'],
            uraDoraIndicators: undefined,
            uraDoraVisible: false,
            points: 12000,
            scoreChanges: [
              { playerId: 'east', delta: 12000 },
              { playerId: 'south', delta: -4000 },
            ],
            wins: [
              {
                winner: 'east',
                yaku: [{ kind: 'NagashiMangan', han: 5 }],
                points: 12000,
                doraIndicators: ['5z'],
                uraDoraVisible: false,
              },
            ],
          },
        },
      ],
      finalStandings: [
        { playerId: 'east', seat: 'East', finalPoints: 37000, placement: 1 },
      ],
    };

    expect(toBackendPaifu(paifu)).toMatchObject({
      id: 'paifu-2',
      metadata: {
        matchRecordId: null,
      },
      rounds: [
        {
          result: {
            winner: 'east',
            fu: null,
            uraDoraIndicators: null,
            wins: [
              {
                winner: 'east',
                target: null,
                fu: null,
                yaku: [{ kind: 'NagashiMangan', han: 5 }],
                points: 12000,
              },
            ],
          },
        },
      ],
    });
  });
});
