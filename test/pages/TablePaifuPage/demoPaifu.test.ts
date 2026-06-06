import { describe, expect, it } from 'vitest';

import {
  createDemoTablePaifu,
  createDemoTablePaifuForTable,
} from '@/pages/TablePaifuPage/demo';
import type { TableDetail } from '@/pages/objects/TournamentViews';

describe('demo table paifu fallback data', () => {
  it('creates a stable three-round demo paifu with abortive, exhaustive and yakuman outcomes', () => {
    const paifu = createDemoTablePaifu('table-demo');

    expect(paifu).toMatchObject({
      id: 'demo-paifu-table-demo',
      metadata: {
        tableId: 'table-demo',
        tournamentId: 'demo-tournament',
        stageId: 'demo-stage',
        source: 'frontend-demo-paifu',
      },
    });
    expect(createDemoTablePaifu('').metadata.tableId).toBe('demo-table-01');
    expect(paifu.metadata.seats).toHaveLength(4);
    expect(paifu.rounds).toHaveLength(3);
    expect(paifu.finalStandings.map((standing) => standing.playerId)).toEqual([
      'player-south',
      'player-west',
      'player-north',
      'player-east',
    ]);

    expect(paifu.rounds[0]).toMatchObject({
      descriptor: { roundWind: 'East', handNumber: 1, honba: 0 },
      result: { outcome: 'AbortiveDraw', points: 0 },
    });
    expect(paifu.rounds[1].actions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          actionType: 'OpenKan',
          actor: 'player-south',
          fromPlayer: 'player-east',
          targetSequenceNo: 2,
        }),
        expect.objectContaining({
          actionType: 'DoraReveal',
          tile: '6z',
        }),
        expect.objectContaining({
          actionType: 'DrawGame',
          sequenceNo: 59,
        }),
      ]),
    );
    expect(paifu.rounds[1].result).toMatchObject({
      outcome: 'ExhaustiveDraw',
      scoreChanges: expect.arrayContaining([
        { playerId: 'player-east', delta: 3000 },
        { playerId: 'player-south', delta: -1000 },
      ]),
      tenpaiPlayerIds: ['player-east'],
    });
    expect(paifu.rounds[2].result).toMatchObject({
      outcome: 'Ron',
      target: 'player-east',
      winner: 'player-south',
      yaku: [{ han: 26, kind: 'PureChuurenPoutou' }],
    });
  });

  it('maps demo player ids and relative final points onto a real table', () => {
    const paifu = createDemoTablePaifuForTable({
      id: 'table-real',
      seats: [
        seat('East', 'real-east', 30000, 'club-a'),
        seat('South', 'real-south', 25000, 'club-b'),
        seat('West', 'real-west', 27000, null),
        seat('North', 'real-north', 22000, 'club-d'),
      ],
      stageId: 'stage-real',
      status: 'Archived',
      tableNo: 7,
      tournamentId: 'tournament-real',
    });

    expect(paifu).toMatchObject({
      id: 'demo-paifu-table-real',
      metadata: {
        tableId: 'table-real',
        tournamentId: 'tournament-real',
        stageId: 'stage-real',
        matchRecordId: null,
      },
    });
    expect(paifu.metadata.seats).toEqual([
      seat('East', 'real-east', 30000, 'club-a'),
      seat('South', 'real-south', 25000, 'club-b'),
      seat('West', 'real-west', 27000, null),
      seat('North', 'real-north', 22000, 'club-d'),
    ]);
    expect(paifu.finalStandings).toEqual([
      expect.objectContaining({
        playerId: 'real-south',
        seat: 'South',
        finalPoints: 89600,
      }),
      expect.objectContaining({
        playerId: 'real-west',
        seat: 'West',
        finalPoints: 26000,
      }),
      expect.objectContaining({
        playerId: 'real-north',
        seat: 'North',
        finalPoints: 21000,
      }),
      expect.objectContaining({
        playerId: 'real-east',
        seat: 'East',
        finalPoints: -32600,
      }),
    ]);

    expect(Object.keys(paifu.rounds[0].initialHands)).toEqual([
      'real-east',
      'real-south',
      'real-west',
      'real-north',
    ]);
    expect(paifu.rounds[1].actions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          actionType: 'OpenKan',
          actor: 'real-south',
          fromPlayer: 'real-east',
        }),
      ]),
    );
    expect(paifu.rounds[1].result.tenpaiPlayerIds).toEqual(['real-east']);
    expect(paifu.rounds[2].result).toMatchObject({
      winner: 'real-south',
      target: 'real-east',
      scoreChanges: expect.arrayContaining([
        { playerId: 'real-east', delta: -64600 },
        { playerId: 'real-south', delta: 65600 },
      ]),
    });
  });
});

function seat(
  seatWind: TableDetail['seats'][number]['seat'],
  playerId: string,
  initialPoints: number,
  clubId: string | null,
): TableDetail['seats'][number] {
  return {
    clubId,
    disconnected: false,
    initialPoints,
    playerId,
    ready: true,
    seat: seatWind,
  };
}
