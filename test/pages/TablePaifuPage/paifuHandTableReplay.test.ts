import { describe, expect, it } from 'vitest';

import {
  createScoreDisplays,
  createTableSticks,
  isScoreSettlementRound,
} from '@/pages/TablePaifuPage/components/PaifuHandTable/functions/getPaifuHandTableReplay';
import type {
  PaifuRoundSummary,
  TablePaifuDetail,
} from '@/pages/TablePaifuPage/types';

const paifu: TablePaifuDetail = {
  id: 'paifu-center',
  metadata: {
    tableId: 'table-1',
    tournamentId: 'tournament-1',
    stageId: 'stage-1',
    recordedAt: '2026-06-05T00:00:00Z',
    seats: [
      {
        seat: 'East',
        playerId: 'east',
        initialPoints: 25000,
        disconnected: false,
        ready: true,
      },
      {
        seat: 'South',
        playerId: 'south',
        initialPoints: 25000,
        disconnected: false,
        ready: true,
      },
      {
        seat: 'West',
        playerId: 'west',
        initialPoints: 25000,
        disconnected: false,
        ready: true,
      },
      {
        seat: 'North',
        playerId: 'north',
        initialPoints: 25000,
        disconnected: false,
        ready: true,
      },
    ],
  },
  rounds: [],
  finalStandings: [],
};

const round: PaifuRoundSummary = {
  descriptor: { roundWind: 'East', handNumber: 1, honba: 2 },
  initialHands: { east: [], south: [], west: [], north: [] },
  actions: [
    {
      sequenceNo: 1,
      actor: 'south',
      actionType: 'Riichi',
      tile: '2m',
      revealedTiles: ['2m'],
    },
    {
      sequenceNo: 2,
      actor: 'south',
      actionType: 'Win',
      tile: '1m',
      fromPlayer: 'east',
      revealedTiles: [],
    },
  ],
  result: {
    outcome: 'Ron',
    winner: 'south',
    target: 'east',
    han: 3,
    fu: 40,
    yaku: [{ kind: 'Riichi', han: 1 }],
    points: 8000,
    scoreChanges: [
      { playerId: 'east', delta: -8000 },
      { playerId: 'south', delta: 8000 },
      { playerId: 'west', delta: 0 },
      { playerId: 'north', delta: 0 },
    ],
  },
};

describe('PaifuHandTable replay helpers', () => {
  it('marks only score-settlement outcomes as score-settlement rounds', () => {
    expect(isScoreSettlementRound(round)).toBe(true);
    expect(
      isScoreSettlementRound({
        ...round,
        result: { ...round.result, outcome: 'AbortiveDraw' },
      }),
    ).toBe(false);
  });

  it('animates points and remaining deltas from base points', () => {
    const displays = createScoreDisplays({
      hasRoundScoreDelta: true,
      paifu,
      replayStep: 2,
      round,
      rounds: [round],
      selectedRoundIndex: 0,
      settlementProgress: 0.25,
    });

    expect(displays.East).toEqual({
      delta: -6000,
      points: 23000,
      showDelta: true,
    });
    expect(displays.South).toEqual({
      delta: 6000,
      points: 26000,
      showDelta: true,
    });
    expect(displays.West).toEqual({
      delta: 0,
      points: 25000,
      showDelta: true,
    });
  });

  it('hides delta labels when there is no active settlement animation', () => {
    const displays = createScoreDisplays({
      hasRoundScoreDelta: true,
      paifu,
      replayStep: 0,
      round,
      rounds: [round],
      selectedRoundIndex: 0,
    });

    expect(displays.East.showDelta).toBe(false);
  });

  it('uses backend honba and clears riichi after win settlement starts', () => {
    expect(
      createTableSticks({
        replayStep: 1,
        round,
        rounds: [round],
        selectedRoundIndex: 0,
      }),
    ).toEqual({ honba: 2, riichi: 1 });
    expect(
      createTableSticks({
        replayStep: 2,
        round,
        rounds: [round],
        selectedRoundIndex: 0,
        settlementProgress: 0.1,
      }),
    ).toEqual({ honba: 2, riichi: 0 });
  });
});
