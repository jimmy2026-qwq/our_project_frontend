import type { CSSProperties } from 'react';

import {
  riverRowSize,
  riverTileImageWidth,
  riverTileVisibleHeight,
} from '@/pages/TablePaifuPage/components/PaifuHandTable/functions/getPaifuTableLayout';
import type {
  MeldGroup,
  MeldTile,
} from '@/pages/TablePaifuPage/objects/ReplaySnapshot.types';

const meldBoxMinWidth = 176;
const meldBoxMaxWidth = 286;
const meldBoxHorizontalPadding = 16;
const meldBoxVerticalPadding = 16;
const meldBoxRowGap = 4;

export function getMeldBoxStyle(melds: MeldGroup[]): CSSProperties {
  const rowWidths = melds.map((meld) =>
    meld.tiles.reduce((total, tile) => total + getMeldTileWidth(tile), 0),
  );
  const contentWidth = Math.max(0, ...rowWidths);

  return {
    height: getMeldBoxHeight(melds.length),
    width: Math.min(
      meldBoxMaxWidth,
      Math.max(meldBoxMinWidth, contentWidth + meldBoxHorizontalPadding),
    ),
  };
}

export function getMeldBoxHeight(meldCount: number) {
  const rowCount = Math.max(1, meldCount);

  return (
    meldBoxVerticalPadding +
    rowCount * riverRowSize +
    Math.max(0, rowCount - 1) * meldBoxRowGap
  );
}

function getMeldTileWidth(tile: MeldTile) {
  return tile.sideways ? riverTileVisibleHeight : riverTileImageWidth;
}
