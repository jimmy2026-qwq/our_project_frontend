import { describe, expect, it } from 'vitest';

import {
  getInitialRoundIndex,
  getOperationText,
  isAbortiveDrawAction,
  isWinningAction,
} from '@/pages/TablePaifuPage/functions/getReplay';
import type {
  PaifuAction,
  PaifuRoundSummary,
} from '@/pages/TablePaifuPage/types';

describe('TablePaifuPage replay operations', () => {
  it('starts from the first round that has replayable actions', () => {
    expect(
      getInitialRoundIndex([
        round({ actions: [action({ actionType: 'Draw' })] }),
        round({ actions: [action({ actionType: 'Discard', tile: '1m' })] }),
      ]),
    ).toBe(1);
    expect(getInitialRoundIndex([round(), round()])).toBe(0);
  });

  it('labels replay operations in Chinese with special riichi and win cases', () => {
    expect(getOperationText(action({ actionType: 'DrawGame' }), round())).toBe(
      '九种九牌',
    );
    expect(
      getOperationText(
        action({ actionType: 'Riichi', note: 'double riichi declaration' }),
        round(),
      ),
    ).toBe('两立直');
    expect(
      getOperationText(action({ actionType: 'Riichi', note: '两立直' }), round()),
    ).toBe('两立直');
    expect(getOperationText(action({ actionType: 'Riichi' }), round())).toBe(
      '立直',
    );
    expect(
      getOperationText(
        action({ actionType: 'Win' }),
        round({ result: { ...baseResult, outcome: 'Tsumo' } }),
      ),
    ).toBe('自摸');
    expect(getOperationText(action({ actionType: 'Win' }), round())).toBe('荣');
    expect(getOperationText(action({ actionType: 'Chi' }), round())).toBe('吃');
    expect(getOperationText(action({ actionType: 'Pon' }), round())).toBe('碰');
    expect(getOperationText(action({ actionType: 'OpenKan' }), round())).toBe(
      '杠',
    );
    expect(getOperationText(action({ actionType: 'Discard' }), round())).toBeUndefined();
  });

  it('identifies abortive draw and winning operations', () => {
    expect(isAbortiveDrawAction(action({ actionType: 'DrawGame' }))).toBe(true);
    expect(isAbortiveDrawAction(action({ actionType: 'Discard' }))).toBe(false);
    expect(isAbortiveDrawAction()).toBe(false);

    expect(isWinningAction(action({ actionType: 'Win' }))).toBe(true);
    expect(isWinningAction(action({ actionType: 'Ron' } as never))).toBe(false);
    expect(isWinningAction()).toBe(false);
  });
});

const baseResult: PaifuRoundSummary['result'] = {
  outcome: 'Ron',
  yaku: [],
  points: 0,
  scoreChanges: [],
};

function round(patch: Partial<PaifuRoundSummary> = {}): PaifuRoundSummary {
  return {
    descriptor: { roundWind: 'East', handNumber: 1, honba: 0 },
    initialHands: {},
    actions: [],
    result: baseResult,
    ...patch,
  };
}

function action(patch: Partial<PaifuAction> = {}): PaifuAction {
  return {
    sequenceNo: 1,
    actor: 'east',
    actionType: 'Discard',
    tile: '1m',
    revealedTiles: [],
    ...patch,
  };
}
