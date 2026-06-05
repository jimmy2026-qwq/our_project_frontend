import { describe, expect, it } from 'vitest';

import {
  getMeldBoxHeight,
  getMeldBoxStyle,
} from '@/pages/TableMatchPage/components/MatchBoard/MatchMeldArea.helpers';
import type { MeldGroup } from '@/pages/TablePaifuPage/objects/ReplaySnapshot.types';

describe('MatchMeldArea layout', () => {
  it('expands the meld box to fit four meld rows', () => {
    const melds = [
      createMeld(['1m', '1m', '1m']),
      createMeld(['2m', '2m', '2m']),
      createMeld(['3m', '3m', '3m']),
      createMeld(['4m', '4m', '4m']),
    ];

    expect(getMeldBoxHeight(melds.length)).toBe(204);
    expect(getMeldBoxStyle(melds)).toEqual(
      expect.objectContaining({
        height: 204,
        width: 176,
      }),
    );
  });

  it('grows width for wider rows without exceeding the board cap', () => {
    const melds = [
      createMeld([
        '1m',
        '2m',
        '3m',
        '4m',
        '5m',
        '6m',
        '7m',
      ]),
    ];

    expect(getMeldBoxStyle(melds)).toEqual(
      expect.objectContaining({
        height: 60,
        width: 226,
      }),
    );
  });
});

function createMeld(
  tiles: Array<string | [tile: string, sideways: boolean]>,
): MeldGroup {
  return {
    actionType: 'Pon',
    tiles: tiles.map((tile) =>
      Array.isArray(tile)
        ? { tile: tile[0], sideways: tile[1] }
        : { tile },
    ),
  };
}
