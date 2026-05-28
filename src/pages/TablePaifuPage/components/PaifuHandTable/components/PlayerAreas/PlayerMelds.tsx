import type { CSSProperties } from 'react';

import type { SeatWind } from '@/objects/tournament';

import type { MeldGroup, MeldTile } from '../../../../objects/replay';
import { TileImage } from '../TileViews';
import {
  meldPositionClasses,
  riverRowSize,
  riverTileFaceClasses,
  riverTileImageHeight,
  riverTileImageWidth,
  riverTileTopCrop,
  riverTileVisibleHeight,
} from '../../objects/paifuTableLayout';

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
        'absolute z-[4] flex items-end gap-2',
        meldPositionClasses[seat],
      ].join(' ')}
    >
      {melds[seat].map((meld, meldIndex) => {
        const displayTiles = getMeldDisplayTiles(seat, meld);

        return (
          <div
            key={`${seat}-meld-${meld.actionType}-${meldIndex}`}
            className="relative shrink-0"
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
                key={`${seat}-meld-${meldIndex}-${meldTile.tile}-${tileIndex}`}
                meldTile={meldTile}
                seat={seat}
                style={getMeldTileStyle(tileIndex, displayTiles)}
              />
            ))}
          </div>
        );
      })}
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
            className={['block select-none', riverTileFaceClasses[seat]].join(
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

function getMeldTileStyle(index: number, tiles: MeldTile[]): CSSProperties {
  const left = tiles
    .slice(0, index)
    .reduce((total, tile) => total + getMeldTileWidth(tile), 0);
  const tile = tiles[index];
  const isSideways = Boolean(tile?.sideways);

  return {
    height: isSideways ? riverTileImageWidth : riverRowSize,
    left,
    position: 'absolute',
    top: 0,
    width: tile ? getMeldTileWidth(tile) : riverTileImageWidth,
  };
}

function getMeldDisplayTiles(seat: SeatWind, meld: MeldGroup) {
  return seat === 'South' ? [...meld.tiles].reverse() : meld.tiles;
}

function getMeldTileWidth(tile: MeldTile) {
  return tile.sideways ? riverTileVisibleHeight : riverTileImageWidth;
}
