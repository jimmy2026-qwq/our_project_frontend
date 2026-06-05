import { describe, expect, it } from 'vitest';

import {
  formatPoints,
  formatYakuValue,
  getAcceptedRiichiActions,
  getDoraIndicators,
  getPlayerDisplayName,
  getPlayerSeat,
  getRemainingTileCount,
  getReplayActions,
  getReplaySequenceLimit,
  getReplayStepCount,
  getRoundPlayerId,
  getRoundTitle,
  getVisibleDoraIndicatorCount,
  isExhaustiveDrawResultStep,
  isPlayerTenpai,
  removeFirstTile,
} from '@/pages/TablePaifuPage/functions/getReplay';
import type {
  PaifuRoundSummary,
  TablePaifuDetail,
} from '@/pages/TablePaifuPage/types';

const paifu: TablePaifuDetail = {
  id: 'paifu-replay-core',
  metadata: {
    tableId: 'table-1',
    tournamentId: 'tournament-1',
    stageId: 'stage-1',
    recordedAt: '2026-06-05T00:00:00Z',
    playerNames: {
      east: '东家',
      south: '南家',
    },
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
    ],
  },
  rounds: [],
  finalStandings: [
    { playerId: 'west', seat: 'West', finalPoints: 25000, placement: 3 },
    { playerId: 'north', seat: 'North', finalPoints: 25000, placement: 4 },
  ],
};

const round: PaifuRoundSummary = {
  descriptor: { roundWind: 'East', handNumber: 1, honba: 0 },
  initialHands: {
    east: ['1m', '2m', '3m'],
    south: ['1p', '2p', '3p'],
  },
  actions: [
    {
      sequenceNo: 1,
      actor: 'east',
      actionType: 'Draw',
      tile: '4m',
      handTilesAfterAction: ['1m', '2m', '3m', '4m'],
      revealedTiles: [],
    },
    {
      sequenceNo: 2,
      actor: 'east',
      actionType: 'Riichi',
      tile: '1m',
      handTilesAfterAction: ['2m', '3m', '4m'],
      revealedTiles: ['1m'],
    },
    {
      sequenceNo: 3,
      actionType: 'DoraReveal',
      tile: '5z',
      revealedTiles: [],
    },
    {
      sequenceNo: 4,
      actor: 'south',
      actionType: 'Discard',
      tile: '1p',
      handTilesAfterAction: ['2p', '3p'],
      revealedTiles: ['1p'],
    },
  ],
  result: {
    outcome: 'ExhaustiveDraw',
    yaku: [],
    points: 0,
    scoreChanges: [
      { playerId: 'east', delta: 1500 },
      { playerId: 'south', delta: -1500 },
    ],
    tenpaiPlayerIds: ['east'],
  },
};

describe('TablePaifuPage replay core', () => {
  it('formats round, points, and yaku values for the replay surface', () => {
    expect(getRoundTitle(round)).toBe('东1局0本场');
    expect(formatPoints(1234567)).toBe('1,234,567');
    expect(formatPoints()).toBe('-');
    expect(formatYakuValue(3)).toBe('3 番');
    expect(formatYakuValue(13)).toBe('役满');
    expect(formatYakuValue(26)).toBe('两倍役满');
  });

  it('builds replay steps from player-visible actions and adds one draw result step', () => {
    expect(getReplayActions(round).map((action) => action.sequenceNo)).toEqual([
      2,
      4,
    ]);
    expect(getReplayStepCount(round)).toBe(3);
    expect(getReplaySequenceLimit(round, 0)).toBe(1);
    expect(getReplaySequenceLimit(round, 1)).toBe(3);
    expect(getReplaySequenceLimit(round, 99)).toBe(4);
    expect(isExhaustiveDrawResultStep(round, 2)).toBe(false);
    expect(isExhaustiveDrawResultStep(round, 3)).toBe(true);
  });

  it('derives visible dora indicators and remaining wall count by replay step', () => {
    expect(getDoraIndicators(round, 0)).toEqual([]);
    expect(getDoraIndicators(round, 1)).toEqual(['5z']);
    expect(getVisibleDoraIndicatorCount(round, 0)).toBe(1);
    expect(getVisibleDoraIndicatorCount(round, 1)).toBe(1);
    expect(getRemainingTileCount(round, 0)).toBe(68);
  });

  it('handles seat and name lookup fallbacks', () => {
    expect(getPlayerSeat(paifu, 'east')).toBe('East');
    expect(getPlayerSeat(paifu, 'west')).toBe('West');
    expect(getRoundPlayerId(paifu, 'South')).toBe('south');
    expect(getRoundPlayerId(paifu, 'North')).toBe('north');
    expect(getPlayerDisplayName(paifu, 'east')).toBe('东家');
    expect(getPlayerDisplayName(paifu, 'unknown')).toBe('unknown');
  });

  it('recognizes tenpai only for exhaustive draw results', () => {
    expect(isPlayerTenpai(round, 'east')).toBe(true);
    expect(isPlayerTenpai(round, 'south')).toBe(false);
    expect(
      isPlayerTenpai(
        { ...round, result: { ...round.result, outcome: 'Ron' } },
        'east',
      ),
    ).toBe(false);
  });

  it('removes only the first matching tile and keeps missing tiles untouched', () => {
    expect(removeFirstTile(['1m', '2m', '1m'], '1m')).toEqual(['2m', '1m']);
    expect(removeFirstTile(['1m', '2m'], '3m')).toEqual(['1m', '2m']);
  });

  it('does not count a riichi discard that is immediately won by ron', () => {
    const riichiRonRound: PaifuRoundSummary = {
      ...round,
      actions: [
        {
          sequenceNo: 1,
          actor: 'east',
          actionType: 'Riichi',
          tile: '1m',
          revealedTiles: ['1m'],
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
        han: 1,
        fu: 30,
        yaku: [{ kind: 'Riichi', han: 1 }],
        points: 1000,
        scoreChanges: [
          { playerId: 'east', delta: -1000 },
          { playerId: 'south', delta: 1000 },
        ],
      },
    };

    expect(getAcceptedRiichiActions(riichiRonRound)).toEqual([]);
  });
});
