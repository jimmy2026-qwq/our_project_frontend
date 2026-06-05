import type { CSSProperties } from 'react';

import type { SeatWind } from '@/objects';
import { TileImage } from '@/pages/TablePaifuPage/components/PaifuHandTable/components/TileViews';
import {
  riverRowSize,
  riverTileImageHeight,
  riverTileImageWidth,
  riverTileTopCrop,
  riverTileVisibleHeight,
} from '@/pages/TablePaifuPage/components/PaifuHandTable/functions/getPaifuTableLayout';
import type {
  MeldGroup,
  MeldTile,
} from '@/pages/TablePaifuPage/objects/ReplaySnapshot.types';

interface MatchMeldAreaProps {
  melds: Record<SeatWind, MeldGroup[]>;
}

const seatOrder: SeatWind[] = ['East', 'South', 'West', 'North'];

const meldBoxPositionClasses: Record<SeatWind, string> = {
  East: 'bottom-[126px] right-[18%]',
  South: 'right-[126px] top-[20%] rotate-90',
  West: 'left-[18%] top-[150px] rotate-180',
  North: 'left-[126px] bottom-[20%] -rotate-90',
};
const meldBoxMinWidth = 176;
const meldBoxMaxWidth = 286;
const meldBoxHorizontalPadding = 16;
const meldBoxVerticalPadding = 16;
const meldBoxRowGap = 4;

export function MatchMeldArea({ melds }: MatchMeldAreaProps) {
  return (
    <>
      {seatOrder.map((seat) => (
        <SeatMeldBox key={seat} melds={melds[seat]} seat={seat} />
      ))}
    </>
  );
}

function SeatMeldBox({
  melds,
  seat,
}: {
  melds: MeldGroup[];
  seat: SeatWind;
}) {
  if (melds.length === 0) {
    return null;
  }

  return (
    <div
      className={[
        'pointer-events-none absolute z-[7] grid content-end gap-1 overflow-visible rounded-[10px] border border-[rgba(236,197,122,0.14)] bg-transparent p-2',
        meldBoxPositionClasses[seat],
      ].join(' ')}
      style={getMeldBoxStyle(melds)}
    >
      {melds.map((meld, meldIndex) => (
        <MeldRow
          key={`${seat}-match-meld-${meld.actionType}-${meldIndex}`}
          meld={meld}
          meldIndex={meldIndex}
          seat={seat}
        />
      ))}
    </div>
  );
}

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

function MeldRow({
  meld,
  meldIndex,
  seat,
}: {
  meld: MeldGroup;
  meldIndex: number;
  seat: SeatWind;
}) {
  const displayTiles = getMeldDisplayTiles(seat, meld);

  return (
    <div
      className="relative shrink-0 justify-self-end"
      style={{
        height: riverRowSize,
        width: displayTiles.reduce(
          (total, tile) => total + getMeldTileWidth(tile),
          0,
        ),
      }}
    >
      {displayTiles.map((meldTile, tileIndex) => (
        <MeldTileView
          key={`${seat}-match-meld-${meldIndex}-${meldTile.tile}-${tileIndex}`}
          meldTile={meldTile}
          seat={seat}
          style={getMeldTileStyle(tileIndex, displayTiles, seat)}
        />
      ))}
    </div>
  );
}

function MeldTileView({
  meldTile,
  seat,
  style,
}: {
  meldTile: MeldTile;
  seat: SeatWind;
  style: CSSProperties;
}) {
  if (meldTile.concealed) {
    return <MeldBackTile style={style} />;
  }

  const isSideways = Boolean(meldTile.sideways);

  return (
    <span className="relative block shrink-0 overflow-visible" style={style}>
      <span
        className="absolute left-0 top-0 block"
        style={{
          height: riverTileVisibleHeight,
          transform: isSideways
            ? `translateX(${riverTileVisibleHeight}px) rotate(90deg)`
            : undefined,
          transformOrigin: 'top left',
          width: riverTileImageWidth,
        }}
      >
        <span
          className="block overflow-hidden"
          style={{
            height: riverTileVisibleHeight,
            width: riverTileImageWidth,
          }}
        >
          <TileImage
            className={['block select-none', getMeldTileFaceClass(seat)].join(
              ' ',
            )}
            tile={meldTile.tile}
            style={{
              height: riverTileImageHeight,
              transform: `translateY(-${riverTileTopCrop}px)`,
              width: riverTileImageWidth,
            }}
          />
        </span>
      </span>
    </span>
  );
}

function MeldBackTile({ style }: { style: CSSProperties }) {
  return (
    <span
      className="grid shrink-0 place-items-center overflow-visible"
      style={style}
    >
      <span
        className="block rounded-[3px] border border-[#88a7c8] bg-[linear-gradient(135deg,#153d70,#255999_48%,#76acd9)] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-4px_0_rgba(7,19,46,0.34)]"
        style={{
          height: riverTileVisibleHeight,
          width: riverTileImageWidth,
        }}
      />
    </span>
  );
}

function getMeldTileStyle(
  index: number,
  tiles: MeldTile[],
  seat: SeatWind,
): CSSProperties {
  const left = tiles
    .slice(0, index)
    .reduce((total, tile) => total + getMeldTileWidth(tile), 0);
  const tile = tiles[index];
  const isSideways = Boolean(tile?.sideways);

  return {
    height: isSideways ? riverTileImageWidth : riverRowSize,
    left,
    position: 'absolute',
    top: isSideways ? getSidewaysTileTopOffset(seat) : 0,
    width: tile ? getMeldTileWidth(tile) : riverTileImageWidth,
  };
}

function getSidewaysTileTopOffset(seat: SeatWind) {
  const bottomAlignedOffset = riverRowSize - riverTileImageWidth;

  return seat === 'South' || seat === 'North'
    ? bottomAlignedOffset / 2
    : bottomAlignedOffset;
}

function getMeldTileFaceClass(seat: SeatWind) {
  if (seat === 'South' || seat === 'North') {
    return 'rotate-180';
  }

  return '';
}

function getMeldDisplayTiles(seat: SeatWind, meld: MeldGroup) {
  return seat === 'South' || seat === 'North'
    ? [...meld.tiles].reverse()
    : meld.tiles;
}

function getMeldTileWidth(tile: MeldTile) {
  return tile.sideways ? riverTileVisibleHeight : riverTileImageWidth;
}
