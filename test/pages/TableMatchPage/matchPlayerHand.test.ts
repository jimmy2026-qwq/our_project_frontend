import { describe, expect, it } from 'vitest';

import { getMatchDisplayHandTiles } from '@/pages/TableMatchPage/components/MatchBoard/MatchPlayerHand';

describe('MatchPlayerHand', () => {
  it('moves the drawn tile to the right side for the bottom hand', () => {
    expect(
      getMatchDisplayHandTiles({
        drawTile: '5m',
        seat: 'East',
        tiles: ['1m', '5m', '3m', '5m'],
      }),
    ).toEqual([
      { isDrawnTile: false, tile: '1m' },
      { isDrawnTile: false, tile: '3m' },
      { isDrawnTile: false, tile: '5m' },
      { isDrawnTile: true, tile: '5m' },
    ]);
  });

  it('keeps the drawn tile at the visual edge for rotated side hands', () => {
    expect(
      getMatchDisplayHandTiles({
        drawTile: '5m',
        seat: 'South',
        tiles: ['1m', '3m', '5m'],
      }),
    ).toEqual([
      { isDrawnTile: true, tile: '5m' },
      { isDrawnTile: false, tile: '3m' },
      { isDrawnTile: false, tile: '1m' },
    ]);
  });
});
