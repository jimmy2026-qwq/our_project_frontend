import { describe, expect, it } from 'vitest';

import { getMatchDisplayHandTiles } from '@/pages/TableMatchPage/components/MatchBoard/MatchPlayerHand.helpers';

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

  it('displays the backend-provided ron hand without extra filtering', () => {
    expect(
      getMatchDisplayHandTiles({
        seat: 'East',
        tiles: [
          '2m',
          '3m',
          '4m',
          '2p',
          '3p',
          '4p',
          '5s',
          '6s',
          '7s',
          '7m',
          '8m',
          '9m',
          '1z',
        ],
      }),
    ).toEqual([
      { isDrawnTile: false, tile: '2m' },
      { isDrawnTile: false, tile: '3m' },
      { isDrawnTile: false, tile: '4m' },
      { isDrawnTile: false, tile: '2p' },
      { isDrawnTile: false, tile: '3p' },
      { isDrawnTile: false, tile: '4p' },
      { isDrawnTile: false, tile: '5s' },
      { isDrawnTile: false, tile: '6s' },
      { isDrawnTile: false, tile: '7s' },
      { isDrawnTile: false, tile: '7m' },
      { isDrawnTile: false, tile: '8m' },
      { isDrawnTile: false, tile: '9m' },
      { isDrawnTile: false, tile: '1z' },
    ]);
  });
});
