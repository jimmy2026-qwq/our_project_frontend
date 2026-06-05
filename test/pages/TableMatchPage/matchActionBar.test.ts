import { describe, expect, it } from 'vitest';

import type { MahjongLegalAction } from '@/objects';
import {
  getActionButtonClassName,
  getActionButtonLabel,
  getChiActionKey,
  getTsumoActionKey,
  getVisibleButtonActions,
} from '@/pages/TableMatchPage/components/MatchBoard/MatchActionBar';

describe('MatchActionBar', () => {
  it('keeps the same chi action key across polling refreshes', () => {
    const firstRefresh = [
      createChiAction(12, '3m', ['2m', '3m', '4m']),
      createChiAction(12, '3m', ['3m', '4m', '5m']),
    ];
    const secondRefresh = [
      createChiAction(12, '3m', ['3m', '4m', '5m']),
      createChiAction(12, '3m', ['2m', '3m', '4m']),
    ];

    expect(getChiActionKey(firstRefresh)).toBe(getChiActionKey(secondRefresh));
  });

  it('changes the chi action key when the pending discard changes', () => {
    expect(
      getChiActionKey([
        createChiAction(12, '3m', ['2m', '3m', '4m']),
      ]),
    ).not.toBe(
      getChiActionKey([
        createChiAction(18, '6p', ['5p', '6p', '7p']),
      ]),
    );
  });

  it('uses short action labels without tile names', () => {
    expect(getActionButtonLabel('Chi')).toBe('吃');
    expect(getActionButtonLabel('Pon')).toBe('碰');
    expect(getActionButtonLabel('OpenKan')).toBe('杠');
    expect(getActionButtonLabel('Riichi')).toBe('立直');
    expect(getActionButtonLabel('Tsumo')).toBe('自摸');
    expect(getActionButtonLabel('Ron')).toBe('荣和');
    expect(getActionButtonLabel('Pass')).toBe('跳过');
  });

  it('maps action button tones by mahjong action group', () => {
    expect(getActionButtonClassName('Chi')).toContain('43,148,93');
    expect(getActionButtonClassName('Pon')).toContain('43,148,93');
    expect(getActionButtonClassName('OpenKan')).toContain('43,148,93');
    expect(getActionButtonClassName('Riichi')).toContain('231,138,50');
    expect(getActionButtonClassName('Tsumo')).toContain('211,64,69');
    expect(getActionButtonClassName('Ron')).toContain('211,64,69');
    expect(getActionButtonClassName('Pass')).toContain('96,108,121');
  });

  it('adds a local skip button next to self draw when backend has no pass', () => {
    const actions = [
      createAction('Tsumo', 24, '5m', ['5m']),
      createAction('Riichi', 24, null, []),
    ];

    expect(
      getVisibleButtonActions(actions).map((action) => action.commandType),
    ).toEqual(['Tsumo', 'Pass', 'Riichi']);
    expect(getVisibleButtonActions(actions)[1]?.localSkipTsumo).toBe(true);
  });

  it('hides the local self draw choice after skipping it', () => {
    const actions = [createAction('Tsumo', 24, '5m', ['5m'])];
    const dismissedTsumoKey = getTsumoActionKey(actions);

    expect(getVisibleButtonActions(actions, dismissedTsumoKey)).toEqual([]);
  });
});

function createChiAction(
  targetSequenceNo: number,
  tile: string,
  tiles: string[],
): MahjongLegalAction {
  return createAction('Chi', targetSequenceNo, tile, tiles);
}

function createAction(
  commandType: MahjongLegalAction['commandType'],
  targetSequenceNo: number,
  tile: string | null,
  tiles: string[],
): MahjongLegalAction {
  return {
    commandType,
    fromPlayerId: 'player-east',
    priority: 1,
    targetSequenceNo,
    tile,
    tiles,
  };
}
