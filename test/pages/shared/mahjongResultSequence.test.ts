import { describe, expect, it } from 'vitest';

import {
  advanceResultSequenceStep,
  getResultSequenceStep,
  getResultWinForActor,
  getResultWins,
  getWinYaku,
  isNagashiManganWin,
  isResultScoreStep,
} from '@/pages/shared/mahjongResultSequence';
import type { MahjongResultLike } from '@/pages/shared/mahjongResultSequence';

const doubleRonResult: MahjongResultLike = {
  outcome: 'Ron',
  winner: 'player-south',
  target: 'player-east',
  han: 3,
  fu: 40,
  yaku: [{ kind: 'Riichi', han: 1 }],
  points: 11600,
  scoreChanges: [
    { playerId: 'player-east', delta: -11600 },
    { playerId: 'player-south', delta: 7700 },
    { playerId: 'player-west', delta: 3900 },
    { playerId: 'player-north', delta: 0 },
  ],
  wins: [
    {
      winner: 'player-south',
      target: 'player-east',
      han: 3,
      fu: 40,
      yaku: [{ kind: 'Riichi', han: 1 }],
      points: 7700,
    },
    {
      winner: 'player-west',
      target: 'player-east',
      han: 2,
      fu: 30,
      yaku: [{ kind: 'Pinfu', han: 1 }],
      points: 3900,
    },
  ],
};

describe('mahjongResultSequence', () => {
  it('walks multiple ron winners one by one before the total score screen', () => {
    expect(getResultSequenceStep(doubleRonResult, 0)).toMatchObject({
      kind: 'win',
      index: 0,
      totalWinCount: 2,
      win: { winner: 'player-south' },
    });
    expect(getResultSequenceStep(doubleRonResult, 1)).toMatchObject({
      kind: 'win',
      index: 1,
      totalWinCount: 2,
      win: { winner: 'player-west' },
    });
    expect(getResultSequenceStep(doubleRonResult, 2)).toMatchObject({
      kind: 'score',
      index: 2,
      totalWinCount: 2,
    });
  });

  it('advances to the score screen and then stays there', () => {
    expect(advanceResultSequenceStep(doubleRonResult, 0)).toBe(1);
    expect(advanceResultSequenceStep(doubleRonResult, 1)).toBe(2);
    expect(advanceResultSequenceStep(doubleRonResult, 2)).toBe(2);
    expect(isResultScoreStep(doubleRonResult, 2)).toBe(true);
  });

  it('clamps negative and overlarge step indexes into valid sequence screens', () => {
    expect(getResultSequenceStep(doubleRonResult, -10)).toMatchObject({
      kind: 'win',
      index: 0,
      win: { winner: 'player-south' },
    });
    expect(getResultSequenceStep(doubleRonResult, 99)).toMatchObject({
      kind: 'score',
      index: 2,
    });
  });

  it('builds a two-step sequence for legacy single-winner results', () => {
    const singleWinnerResult: MahjongResultLike = {
      outcome: 'Tsumo',
      winner: 'player-east',
      target: null,
      han: 4,
      fu: 30,
      yaku: [{ kind: 'MenzenTsumo', han: 1 }],
      points: 12000,
      scoreChanges: [
        { playerId: 'player-east', delta: 12000 },
        { playerId: 'player-south', delta: -4000 },
        { playerId: 'player-west', delta: -4000 },
        { playerId: 'player-north', delta: -4000 },
      ],
    };

    expect(getResultWins(singleWinnerResult)).toEqual([
      expect.objectContaining({ winner: 'player-east', points: 12000 }),
    ]);
    expect(getResultSequenceStep(singleWinnerResult, 0)).toMatchObject({
      kind: 'win',
      win: { winner: 'player-east' },
    });
    expect(getResultSequenceStep(singleWinnerResult, 1)).toMatchObject({
      kind: 'score',
      totalWinCount: 1,
    });
  });

  it('selects the paifu win matching the current win action actor', () => {
    expect(getResultWinForActor(doubleRonResult, 'player-west')).toMatchObject({
      winner: 'player-west',
      points: 3900,
    });
    expect(getResultWinForActor(doubleRonResult, 'missing-player')).toMatchObject({
      winner: 'player-south',
    });
  });

  it('falls back to aggregate yaku when a win entry has no per-winner yaku', () => {
    const [firstWin] = getResultWins({
      ...doubleRonResult,
      yaku: [{ kind: 'Tanyao', han: 1 }],
      wins: [
        {
          winner: 'player-south',
          target: 'player-east',
          han: 1,
          fu: 30,
          yaku: [],
          points: 1000,
        },
      ],
    });

    expect(getWinYaku(doubleRonResult, firstWin)).toEqual(doubleRonResult.yaku);
  });

  it('recognizes nagashi mangan win entries', () => {
    expect(
      isNagashiManganWin({
        winner: 'player-east',
        target: null,
        han: 5,
        fu: null,
        yaku: [{ kind: 'NagashiMangan', han: 5 }],
        points: 12000,
      }),
    ).toBe(true);
  });

  it('does not create a winner sequence for drawn hands', () => {
    expect(
      getResultSequenceStep(
        {
          outcome: 'ExhaustiveDraw',
          yaku: [],
          points: 0,
          scoreChanges: [
            { playerId: 'player-east', delta: 0 },
            { playerId: 'player-south', delta: 0 },
          ],
        },
        0,
      ),
    ).toBeNull();
  });
});
