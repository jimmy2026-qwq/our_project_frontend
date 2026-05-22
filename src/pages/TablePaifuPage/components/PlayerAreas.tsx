import type { CSSProperties } from 'react';

import type { SeatWind } from '@/objects/tournament/apiTypes';

import type { PaifuRoundSummary, TablePaifuDetail } from '../types';
import {
  getRoundPlayerId,
  isPlayerTenpai,
  seatLabels,
  type MeldGroup,
  type MeldTile,
  type RiverDiscard,
} from '../objects/replay';
import { HandBackTile, HandTile, TileImage } from './TileViews';
import {
  getDisplayTiles,
  handPositionClasses,
  labelPositionClasses,
  meldPositionClasses,
  riverPositionClasses,
  riverRowSize,
  riverTileFaceClasses,
  riverTileImageHeight,
  riverTileImageWidth,
  riverTileTopCrop,
  riverTileVisibleHeight,
} from './paifuTableLayout';

function getRiverTileWidth(discard: RiverDiscard) {
  return discard.sideways ? riverTileVisibleHeight : riverTileImageWidth;
}

function getRiverRowWidth(discards: RiverDiscard[], rowIndex: number) {
  return discards
    .slice(rowIndex * 6, rowIndex * 6 + 6)
    .reduce((total, discard) => total + getRiverTileWidth(discard), 0);
}

function getRiverMaxRowWidth(discards: RiverDiscard[], rowCount: number) {
  return Math.max(
    6 * riverTileImageWidth,
    ...Array.from({ length: rowCount }, (_, rowIndex) =>
      getRiverRowWidth(discards, rowIndex),
    ),
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
            className={[
              'block select-none',
              riverTileFaceClasses[seat],
            ].join(' ')}
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

function getMeldTileWidth(tile: MeldTile) {
  return tile.sideways ? riverTileVisibleHeight : riverTileImageWidth;
}

function getMeldDisplayTiles(seat: SeatWind, meld: MeldGroup) {
  return seat === 'South' ? [...meld.tiles].reverse() : meld.tiles;
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
    <span
      className="relative block shrink-0 overflow-visible"
      style={style}
    >
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
            className={[
              'block select-none',
              riverTileFaceClasses[seat],
            ].join(' ')}
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
      className={[
        'absolute z-[3]',
        riverPositionClasses[seat],
      ].join(' ')}
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

export function PlayerHand({
  isExhaustiveDrawResult,
  hands,
  paifu,
  round,
  seat,
}: {
  isExhaustiveDrawResult: boolean;
  hands: Record<string, string[]>;
  paifu: TablePaifuDetail;
  round: PaifuRoundSummary;
  seat: SeatWind;
}) {
  const playerId = getRoundPlayerId(paifu, seat);
  const tiles = playerId ? hands[playerId] ?? [] : [];
  const displayTiles = getDisplayTiles(seat, tiles);
  const shouldShowBacks =
    isExhaustiveDrawResult && playerId && !isPlayerTenpai(round, playerId);

  if (!playerId || tiles.length === 0) {
    return null;
  }

  return (
    <>
      <div
        className={[
          'absolute z-[3] grid gap-1',
          labelPositionClasses[seat],
        ].join(' ')}
      >
        <span className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#ecc57a]">
          {seatLabels[seat]}
        </span>
        <strong className="block max-w-[18ch] truncate text-sm text-[#f2f7fb] [text-shadow:0_2px_10px_rgba(0,0,0,0.52)]">
          {playerId}
        </strong>
      </div>
      <div
        className={[
          'absolute z-[4] flex items-end gap-0 [backface-visibility:hidden] [transform-style:preserve-3d]',
          handPositionClasses[seat],
        ].join(' ')}
      >
        {displayTiles.map((tile, index) =>
          shouldShowBacks ? (
            <HandBackTile key={`${seat}-back-${index}`} seat={seat} />
          ) : (
            <HandTile key={`${seat}-${tile}-${index}`} seat={seat} tile={tile} />
          ),
        )}
      </div>
    </>
  );
}
