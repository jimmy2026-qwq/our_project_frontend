import { describe, expect, it } from 'vitest';

import {
  getCurrentPlayerPoints,
  getCurrentRiichiStickCount,
  getDoraIndicators,
  getPlayerPointsBeforeSettlement,
  getRemainingTileCount,
  getReplayStepCount,
  getReplaySnapshot,
  getRoundTitle,
  getVisibleDoraIndicatorCount,
  isExhaustiveDrawResultStep,
  isPlayerTenpai,
} from '@/pages/TablePaifuPage/objects/replay';
import { createDemoTablePaifu } from '@/pages/TablePaifuPage/demo';
import type {
  PaifuRoundSummary,
  TablePaifuDetail,
} from '@/pages/TablePaifuPage/types';

const paifu: TablePaifuDetail = {
  id: 'paifu-riichi-sideways',
  metadata: {
    tableId: 'table-1',
    tournamentId: 'tournament-1',
    stageId: 'stage-1',
    recordedAt: '2026-05-22T00:00:00Z',
    seats: [
      {
        seat: 'East',
        playerId: 'player-east',
        initialPoints: 25000,
        disconnected: false,
        ready: true,
      },
      {
        seat: 'South',
        playerId: 'player-south',
        initialPoints: 25000,
        disconnected: false,
        ready: true,
      },
      {
        seat: 'West',
        playerId: 'player-west',
        initialPoints: 25000,
        disconnected: false,
        ready: true,
      },
      {
        seat: 'North',
        playerId: 'player-north',
        initialPoints: 25000,
        disconnected: false,
        ready: true,
      },
    ],
  },
  rounds: [],
  finalStandings: [
    { playerId: 'player-east', seat: 'East', finalPoints: 25000, placement: 1 },
    { playerId: 'player-south', seat: 'South', finalPoints: 25000, placement: 2 },
    { playerId: 'player-west', seat: 'West', finalPoints: 25000, placement: 3 },
    { playerId: 'player-north', seat: 'North', finalPoints: 25000, placement: 4 },
  ],
};

const round: PaifuRoundSummary = {
  descriptor: {
    roundWind: 'East',
    handNumber: 1,
    honba: 0,
  },
  initialHands: {
    'player-east': ['1m', '2m', '3m', '4m'],
    'player-south': ['1m', '2m'],
    'player-west': [],
    'player-north': [],
  },
  actions: [
    {
      sequenceNo: 1,
      actor: 'player-east',
      actionType: 'Riichi',
      tile: '1m',
      handTilesAfterAction: ['2m', '3m', '4m'],
      revealedTiles: ['1m'],
    },
    {
      sequenceNo: 2,
      actor: 'player-south',
      actionType: 'Pon',
      tile: '1m',
      handTilesAfterAction: ['2m'],
      revealedTiles: ['1m', '1m', '1m'],
    },
    {
      sequenceNo: 3,
      actor: 'player-east',
      actionType: 'Discard',
      tile: '2m',
      handTilesAfterAction: ['3m', '4m'],
      revealedTiles: ['2m'],
    },
    {
      sequenceNo: 4,
      actor: 'player-south',
      actionType: 'Chi',
      tile: '2m',
      handTilesAfterAction: [],
      revealedTiles: ['1m', '2m', '3m'],
    },
    {
      sequenceNo: 5,
      actor: 'player-east',
      actionType: 'Discard',
      tile: '3m',
      handTilesAfterAction: ['4m'],
      revealedTiles: ['3m'],
    },
    {
      sequenceNo: 6,
      actor: 'player-east',
      actionType: 'Discard',
      tile: '4m',
      handTilesAfterAction: [],
      revealedTiles: ['4m'],
    },
  ],
  result: {
    outcome: 'AbortiveDraw',
    yaku: [],
    points: 0,
    scoreChanges: [
      { playerId: 'player-east', delta: 0 },
      { playerId: 'player-south', delta: 0 },
      { playerId: 'player-west', delta: 0 },
      { playerId: 'player-north', delta: 0 },
    ],
  },
};

describe('TablePaifuPage replay', () => {
  it('keeps seven discards per player in the exhaustive draw demo hand', () => {
    const demoPaifu = createDemoTablePaifu('table-1');
    const exhaustiveDrawRound = demoPaifu.rounds.find(
      (item) => item.descriptor.honba === 1,
    );

    expect(exhaustiveDrawRound).toBeDefined();

    const discardCounts = Object.fromEntries(
      ['player-east', 'player-south', 'player-west', 'player-north'].map(
        (playerId) => [
          playerId,
          exhaustiveDrawRound?.actions.filter(
            (action) =>
              action.actor === playerId &&
              (action.actionType === 'Discard' || action.actionType === 'Riichi'),
          ).length ?? 0,
        ],
      ),
    );
    const snapshot = getReplaySnapshot(
      demoPaifu,
      exhaustiveDrawRound as PaifuRoundSummary,
      29,
    );

    expect(discardCounts).toEqual({
      'player-east': 7,
      'player-south': 7,
      'player-west': 7,
      'player-north': 7,
    });
    expect(snapshot.rivers.South).toHaveLength(7);
    expect(snapshot.rivers.West).toHaveLength(7);
    expect(snapshot.rivers.North).toHaveLength(7);
    expect(snapshot.rivers.East).toHaveLength(6);
  });

  it('keeps claimed open-kan tiles in the caller meld area', () => {
    const demoPaifu = createDemoTablePaifu('table-1');
    const exhaustiveDrawRound = demoPaifu.rounds.find(
      (item) => item.descriptor.honba === 1,
    ) as PaifuRoundSummary;
    const afterOpenKan = getReplaySnapshot(demoPaifu, exhaustiveDrawRound, 2);

    expect(afterOpenKan.rivers.East).toEqual([]);
    expect(afterOpenKan.melds.South).toEqual([
      {
        actionType: 'OpenKan',
        tiles: [
          { tile: '1z', sideways: true },
          { tile: '1z', sideways: false },
          { tile: '1z', sideways: false },
          { tile: '1z', sideways: false },
        ],
      },
    ]);
  });

  it('reveals kan dora after the open-kan player discards', () => {
    const demoPaifu = createDemoTablePaifu('table-1');
    const exhaustiveDrawRound = demoPaifu.rounds.find(
      (item) => item.descriptor.honba === 1,
    ) as PaifuRoundSummary;

    expect(getDoraIndicators(exhaustiveDrawRound, 2)).toEqual(['5z']);
    expect(getDoraIndicators(exhaustiveDrawRound, 3)).toEqual(['5z', '6z']);
    expect(getVisibleDoraIndicatorCount(exhaustiveDrawRound, 2)).toBe(1);
    expect(getVisibleDoraIndicatorCount(exhaustiveDrawRound, 3)).toBe(2);
    expect(getRemainingTileCount(exhaustiveDrawRound, 2)).toBe(68);
  });

  it('shows concealed kan edges face down and uses red five for the first exposed five', () => {
    const closedKanRound: PaifuRoundSummary = {
      ...round,
      actions: [
        {
          sequenceNo: 1,
          actor: 'player-east',
          actionType: 'ClosedKan',
          tile: '5p',
          handTilesAfterAction: [],
          revealedTiles: ['5p', '5p', '5p', '5p'],
        },
      ],
    };

    expect(getReplaySnapshot(paifu, closedKanRound, 1).melds.East).toEqual([
      {
        actionType: 'ClosedKan',
        tiles: [
          { tile: '5p', concealed: true },
          { tile: '0p', concealed: false },
          { tile: '5p', concealed: false },
          { tile: '5p', concealed: true },
        ],
      },
    ]);
  });

  it('adds one extra step for exhaustive draw reveal before applying points', () => {
    const demoPaifu = createDemoTablePaifu('table-1');
    const exhaustiveDrawRound = demoPaifu.rounds.find(
      (item) => item.descriptor.honba === 1,
    ) as PaifuRoundSummary;
    const lastDiscardStep = getReplayStepCount(exhaustiveDrawRound) - 1;
    const resultStep = getReplayStepCount(exhaustiveDrawRound);

    expect(isExhaustiveDrawResultStep(exhaustiveDrawRound, lastDiscardStep)).toBe(
      false,
    );
    expect(isExhaustiveDrawResultStep(exhaustiveDrawRound, resultStep)).toBe(true);
    expect(
      getCurrentPlayerPoints({
        paifu: demoPaifu,
        playerId: 'player-east',
        replayStep: lastDiscardStep,
        rounds: demoPaifu.rounds,
        selectedRoundIndex: 1,
      }),
    ).toBe(24000);
    expect(
      getCurrentPlayerPoints({
        paifu: demoPaifu,
        playerId: 'player-east',
        replayStep: resultStep,
        rounds: demoPaifu.rounds,
        selectedRoundIndex: 1,
      }),
    ).toBe(27000);
    expect(isPlayerTenpai(exhaustiveDrawRound, 'player-east')).toBe(true);
    expect(isPlayerTenpai(exhaustiveDrawRound, 'player-south')).toBe(false);
  });

  it('subtracts accepted riichi sticks immediately and keeps them through exhaustive draw', () => {
    const demoPaifu = createDemoTablePaifu('table-1');
    const exhaustiveDrawRound = demoPaifu.rounds.find(
      (item) => item.descriptor.honba === 1,
    ) as PaifuRoundSummary;

    expect(
      getCurrentPlayerPoints({
        paifu: demoPaifu,
        playerId: 'player-east',
        replayStep: 1,
        rounds: demoPaifu.rounds,
        selectedRoundIndex: 1,
      }),
    ).toBe(24000);
    expect(
      getCurrentRiichiStickCount({
        hasSettlementApplied: false,
        replayStep: 1,
        round: exhaustiveDrawRound,
        rounds: demoPaifu.rounds,
        selectedRoundIndex: 1,
      }),
    ).toBe(1);
    expect(
      getCurrentRiichiStickCount({
        hasSettlementApplied: false,
        replayStep: getReplayStepCount(exhaustiveDrawRound),
        round: exhaustiveDrawRound,
        rounds: demoPaifu.rounds,
        selectedRoundIndex: 1,
      }),
    ).toBe(1);
  });

  it('does not pay a riichi stick when the declaration discard is won by ron', () => {
    const demoPaifu = createDemoTablePaifu('table-1');
    const ronRound = demoPaifu.rounds.find(
      (item) => item.descriptor.honba === 2,
    ) as PaifuRoundSummary;

    expect(
      getPlayerPointsBeforeSettlement({
        paifu: demoPaifu,
        playerId: 'player-east',
        replayStep: 1,
        rounds: demoPaifu.rounds,
        selectedRoundIndex: 2,
      }),
    ).toBe(27000);
    expect(
      getCurrentRiichiStickCount({
        hasSettlementApplied: false,
        replayStep: 1,
        round: ronRound,
        rounds: demoPaifu.rounds,
        selectedRoundIndex: 2,
      }),
    ).toBe(1);
    expect(
      getCurrentRiichiStickCount({
        hasSettlementApplied: true,
        replayStep: getReplayStepCount(ronRound),
        round: ronRound,
        rounds: demoPaifu.rounds,
        selectedRoundIndex: 2,
      }),
    ).toBe(0);
  });

  it('uses explicit tenpai player ids instead of score deltas', () => {
    const allTenpaiRound: PaifuRoundSummary = {
      ...round,
      result: {
        outcome: 'ExhaustiveDraw',
        yaku: [],
        points: 0,
        scoreChanges: [
          { playerId: 'player-east', delta: 0 },
          { playerId: 'player-south', delta: 0 },
          { playerId: 'player-west', delta: 0 },
          { playerId: 'player-north', delta: 0 },
        ],
        tenpaiPlayerIds: [
          'player-east',
          'player-south',
          'player-west',
          'player-north',
        ],
      },
    };
    const allNotenRound: PaifuRoundSummary = {
      ...allTenpaiRound,
      result: {
        ...allTenpaiRound.result,
        tenpaiPlayerIds: [],
      },
    };

    expect(isPlayerTenpai(allTenpaiRound, 'player-east')).toBe(true);
    expect(isPlayerTenpai(allTenpaiRound, 'player-south')).toBe(true);
    expect(isPlayerTenpai(allNotenRound, 'player-east')).toBe(false);
  });

  it('formats round title and table center indicators in Chinese', () => {
    const infoRound: PaifuRoundSummary = {
      ...round,
      actions: [
        {
          sequenceNo: 1,
          actionType: 'DoraReveal',
          tile: '4z',
          revealedTiles: ['4z'],
        },
        {
          sequenceNo: 2,
          actor: 'player-east',
          actionType: 'Discard',
          tile: '1m',
          handTilesAfterAction: ['2m', '3m', '4m'],
          revealedTiles: ['1m'],
        },
      ],
    };

    expect(getRoundTitle(infoRound)).toBe('东1局0本场');
    expect(getDoraIndicators(infoRound, 0)).toEqual(['4z']);
    expect(getRemainingTileCount(infoRound, 0)).toBe(69);
    expect(getRemainingTileCount(infoRound, 1)).toBe(69);
  });

  it('carries the riichi sideways discard marker until an unclaimed discard remains', () => {
    expect(getReplaySnapshot(paifu, round, 1).rivers.East).toEqual([
      { tile: '1m', sideways: true },
    ]);
    expect(getReplaySnapshot(paifu, round, 2).rivers.East).toEqual([]);
    expect(getReplaySnapshot(paifu, round, 3).rivers.East).toEqual([
      { tile: '2m', sideways: true },
    ]);
    expect(getReplaySnapshot(paifu, round, 4).rivers.East).toEqual([]);
    expect(getReplaySnapshot(paifu, round, 6).rivers.East).toEqual([
      { tile: '3m', sideways: true },
      { tile: '4m', sideways: false },
    ]);
  });

  it('shows current points instead of final standings while replaying a round', () => {
    const pointRound: PaifuRoundSummary = {
      ...round,
      actions: [
        {
          sequenceNo: 1,
          actor: 'player-east',
          actionType: 'Discard',
          tile: '1m',
          handTilesAfterAction: ['2m', '3m', '4m'],
          revealedTiles: ['1m'],
        },
        {
          sequenceNo: 2,
          actor: 'player-south',
          actionType: 'Win',
          tile: '1m',
          handTilesAfterAction: ['1m', '2m'],
          revealedTiles: ['1m'],
        },
      ],
      result: {
        outcome: 'Ron',
        winner: 'player-south',
        target: 'player-east',
        han: 1,
        fu: 30,
        yaku: [{ name: '立直', han: 1 }],
        points: 1000,
        scoreChanges: [
          { playerId: 'player-east', delta: -1000 },
          { playerId: 'player-south', delta: 1000 },
          { playerId: 'player-west', delta: 0 },
          { playerId: 'player-north', delta: 0 },
        ],
      },
    };

    expect(
      getCurrentPlayerPoints({
        paifu,
        playerId: 'player-east',
        replayStep: 1,
        rounds: [pointRound],
        selectedRoundIndex: 0,
      }),
    ).toBe(25000);
    expect(
      getCurrentPlayerPoints({
        paifu,
        playerId: 'player-east',
        replayStep: 2,
        rounds: [pointRound],
        selectedRoundIndex: 0,
      }),
    ).toBe(24000);
  });
});
