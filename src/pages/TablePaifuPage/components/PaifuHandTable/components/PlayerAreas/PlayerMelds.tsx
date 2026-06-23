import type { CSSProperties } from 'react';

import { SeatWind } from '@/objects/tournament';

import type { MeldGroup } from '@/pages/TablePaifuPage/objects/MeldGroup';
import type { MeldTile } from '../../../../objects/MeldTile';
import { riverRowSize, riverTileImageWidth, riverTileVisibleHeight } from '../../objects/layout/riverTileLayout';
import { MeldRow } from './PlayerMeldRow';

const meldBoxPositionClasses: Record<SeatWind, string> = {
  [SeatWind.East]: 'bottom-[126px] right-[18%]',
  [SeatWind.South]: 'right-[126px] top-[20%] rotate-90',
  [SeatWind.West]: 'left-[18%] top-[150px] rotate-180',
  [SeatWind.North]: 'left-[126px] bottom-[20%] -rotate-90',
};
const meldBoxMinWidth = 176;
const meldBoxMaxWidth = 286;
const meldBoxHorizontalPadding = 16;
const meldBoxVerticalPadding = 16;
const meldBoxRowGap = 4;

/** 牌谱玩家区域中展示该玩家所有副露的区域。 */
export function PlayerMelds({
  melds,
  seat,
}: {
  melds: Record<SeatWind, MeldGroup[]>;
  seat: SeatWind;
}) {
  if (melds[seat].length === 0) {
    return null;
  }

  return (
    <div
      className={[
        'pointer-events-none absolute z-[4] grid content-end gap-1 overflow-visible rounded-[10px] border border-[rgba(236,197,122,0.14)] bg-transparent p-2',
        meldBoxPositionClasses[seat],
      ].join(' ')}
      style={getMeldBoxStyle(melds[seat])}
    >
      {melds[seat].map((meld, meldIndex) => (
        <MeldRow
          key={`${seat}-meld-${meld.actionType}-${meldIndex}`}
          meld={meld}
          meldIndex={meldIndex}
          seat={seat}
        />
      ))}
    </div>
  );
}

function getMeldBoxStyle(melds: MeldGroup[]): CSSProperties {
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

function getMeldBoxHeight(meldCount: number) {
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
