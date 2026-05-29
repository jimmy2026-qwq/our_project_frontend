import type { CSSProperties } from 'react';

import type { SeatWind } from '@/objects/tournament';

import type { RiverDiscard } from '../../../../objects/ReplaySnapshot.types';
import { TileImage } from '../TileViews';
import {
  riverPositionClasses,
  riverRowSize,
  riverTileFaceClasses,
  riverTileImageHeight,
  riverTileImageWidth,
  riverTileTopCrop,
  riverTileVisibleHeight,
} from '../../functions/getPaifuTableLayout';

export function PlayerRiver({
  rivers,
  seat,
}: {
  rivers: Record<SeatWind, RiverDiscard[]>;
  seat: SeatWind;
}) {
  const rowCount = Math.max(2, Math.ceil(rivers[seat].length / 6));

  return (
    <div
      className={['absolute z-[3]', riverPositionClasses[seat]].join(' ')}
      style={{
        height: rowCount * riverRowSize,
        width: getRiverMaxRowWidth(rivers[seat], rowCount),
      }}
    >
      {rivers[seat].map((discard, index) => (
        <RiverTile
          key={`${seat}-river-${discard.tile}-${index}`}
          discard={discard}
          seat={seat}
          style={getRiverTileStyle(index, seat, rivers[seat])}
        />
      ))}
    </div>
  );
}

function RiverTile({
  discard,
  seat,
  style,
}: {
  discard: RiverDiscard;
  seat: SeatWind;
  style: CSSProperties;
}) {
  return (
    <span
      className="grid shrink-0 place-items-center overflow-visible"
      style={style}
    >
      <span className={discard.sideways ? 'rotate-90' : ''}>
        <span
          className="block overflow-hidden"
          style={{
            height: riverTileVisibleHeight,
            width: riverTileImageWidth,
          }}
        >
          <TileImage
            className={['block select-none', riverTileFaceClasses[seat]].join(
              ' ',
            )}
            tile={discard.tile}
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

function getRiverTileStyle(
  index: number,
  seat: SeatWind,
  discards: RiverDiscard[],
): CSSProperties {
  const rowIndex = Math.floor(index / 6);
  const columnIndex = index % 6;
  const rowStart = rowIndex * 6;
  const previousWidth = discards
    .slice(rowStart, rowStart + columnIndex)
    .reduce((total, discard) => total + getRiverTileWidth(discard), 0);
  const tileWidth = getRiverTileWidth(discards[index]);
  const rowCount = Math.max(2, Math.ceil(discards.length / 6));
  const maxRowWidth = getRiverMaxRowWidth(discards, rowCount);
  const reverseFlow = seat !== 'East';
  const left = reverseFlow
    ? maxRowWidth - previousWidth - tileWidth
    : previousWidth;
  const top = reverseFlow
    ? (rowCount - rowIndex - 1) * riverRowSize
    : rowIndex * riverRowSize;

  return {
    height: riverRowSize,
    left,
    position: 'absolute',
    top,
    width: tileWidth,
  };
}

function getRiverTileWidth(discard: RiverDiscard) {
  return discard.sideways ? riverTileVisibleHeight : riverTileImageWidth;
}

function getRiverMaxRowWidth(discards: RiverDiscard[], rowCount: number) {
  return Math.max(
    6 * riverTileImageWidth,
    ...Array.from({ length: rowCount }, (_, rowIndex) =>
      getRiverRowWidth(discards, rowIndex),
    ),
  );
}

function getRiverRowWidth(discards: RiverDiscard[], rowIndex: number) {
  return discards
    .slice(rowIndex * 6, rowIndex * 6 + 6)
    .reduce((total, discard) => total + getRiverTileWidth(discard), 0);
}
