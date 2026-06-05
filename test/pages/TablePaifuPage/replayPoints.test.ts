import { describe, expect, it } from 'vitest';

import {
  getCurrentPlayerPoints,
  getCurrentRiichiStickCount,
  getPlayerPointsBeforeSettlement,
  getRiichiStickCountBeforeRound,
} from '@/pages/TablePaifuPage/functions/getReplay';
import type {
  PaifuRoundSummary,
  TablePaifuDetail,
} from '@/pages/TablePaifuPage/types';

const paifu: TablePaifuDetail = {
  id: 'paifu-points',
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

const exhaustiveRound: PaifuRoundSummary = {
  descriptor: { roundWind: 'East', handNumber: 1, honba: 0 },
  initialHands: { east: [], south: [], west: [], north: [] },
  actions: [
    {
      sequenceNo: 1,
      actor: 'east',
      actionType: 'Riichi',
      tile: '1m',
      revealedTiles: ['1m'],
    },
  ],
  result: {
    outcome: 'ExhaustiveDraw',
    yaku: [],
    points: 0,
    scoreChanges: [
      { playerId: 'east', delta: 1500 },
      { playerId: 'south', delta: -1500 },
      { playerId: 'west', delta: 0 },
      { playerId: 'north', delta: 0 },
    ],
    tenpaiPlayerIds: ['east'],
  },
};

const ronRound: PaifuRoundSummary = {
  descriptor: { roundWind: 'East', handNumber: 2, honba: 1 },
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
      actor: 'west',
      actionType: 'Win',
      tile: '3m',
      fromPlayer: 'east',
      revealedTiles: [],
    },
  ],
  result: {
    outcome: 'Ron',
    winner: 'west',
    target: 'east',
    han: 2,
    fu: 30,
    yaku: [{ kind: 'Riichi', han: 1 }],
    points: 3900,
    scoreChanges: [
      { playerId: 'east', delta: -3900 },
      { playerId: 'south', delta: 0 },
      { playerId: 'west', delta: 4900 },
      { playerId: 'north', delta: 0 },
    ],
  },
};

const rounds = [exhaustiveRound, ronRound];

describe('TablePaifuPage replay points', () => {
  it('carries riichi sticks through draws and clears them after a win settlement', () => {
    expect(getRiichiStickCountBeforeRound(rounds, 1)).toBe(1);
    expect(
      getCurrentRiichiStickCount({
        hasSettlementApplied: false,
        replayStep: 1,
        round: ronRound,
        rounds,
        selectedRoundIndex: 1,
      }),
    ).toBe(2);
    expect(
      getCurrentRiichiStickCount({
        hasSettlementApplied: true,
        replayStep: 2,
        round: ronRound,
        rounds,
        selectedRoundIndex: 1,
      }),
    ).toBe(0);
  });

  it('applies completed round deltas and current round riichi payments before settlement', () => {
    expect(
      getPlayerPointsBeforeSettlement({
        paifu,
        playerId: 'east',
        replayStep: 0,
        rounds,
        selectedRoundIndex: 1,
      }),
    ).toBe(25500);
    expect(
      getPlayerPointsBeforeSettlement({
        paifu,
        playerId: 'south',
        replayStep: 1,
        rounds,
        selectedRoundIndex: 1,
      }),
    ).toBe(22500);
  });

  it('adds score changes only after the selected round is complete', () => {
    expect(
      getCurrentPlayerPoints({
        paifu,
        playerId: 'west',
        replayStep: 1,
        rounds,
        selectedRoundIndex: 1,
      }),
    ).toBe(25000);
    expect(
      getCurrentPlayerPoints({
        paifu,
        playerId: 'west',
        replayStep: 2,
        rounds,
        selectedRoundIndex: 1,
      }),
    ).toBe(29900);
  });
});
