import type { CSSProperties } from 'react';

import { getPaifuTileCode } from '@/objects';
import { SeatWinds, type SeatWind } from '@/objects/tournament';

import type {
  MeldGroup,
  MeldTile,
} from '../../../../objects/ReplaySnapshot.types';
import { TileImage } from '../TileViews';
import {
  riverRowSize,
  riverTileImageHeight,
  riverTileImageWidth,
  riverTileTopCrop,
  riverTileVisibleHeight,
} from '../../objects/paifuTableLayout';

/** 牌谱回放中单组副露或杠子的牌面排列。 */
export function MeldRow({
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
          key={`${seat}-meld-${meldIndex}-${getPaifuTileCode(meldTile.tile)}-${tileIndex}`}
          meldTile={meldTile}
          seat={seat}
          style={getMeldTileStyle(tileIndex, displayTiles, seat)}
        />
      ))}
    </div>
  );
}

/** 根据副露牌是否横置或背面渲染单张副露牌。 */
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

/** 副露中用于暗杠等场景的背面牌。 */
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

  return seat === SeatWinds.South || seat === SeatWinds.North
    ? bottomAlignedOffset / 2
    : bottomAlignedOffset;
}

function getMeldTileFaceClass(seat: SeatWind) {
  return seat === SeatWinds.South || seat === SeatWinds.North
    ? 'rotate-180'
    : '';
}

function getMeldDisplayTiles(seat: SeatWind, meld: MeldGroup) {
  return seat === SeatWinds.South || seat === SeatWinds.North
    ? [...meld.tiles].reverse()
    : meld.tiles;
}

function getMeldTileWidth(tile: MeldTile) {
  return tile.sideways ? riverTileVisibleHeight : riverTileImageWidth;
}
