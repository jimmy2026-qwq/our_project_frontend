import type { SeatWind } from '@/objects/tournament';

import type { PaifuRoundSummary, TablePaifuDetail } from '../../../../types';
import {
  getPlayerDisplayName,
  getRoundPlayerId,
  isPlayerTenpai,
  seatLabels,
} from '../../../../functions/getReplay';
import { HandBackTile, HandTile } from '../TileViews';
import {
  getDisplayTiles,
  handPositionClasses,
  labelPositionClasses,
} from '../../functions/getPaifuTableLayout';

export function PlayerHand({
  drawnTileIndex,
  isExhaustiveDrawResult,
  hands,
  paifu,
  round,
  seat,
}: {
  drawnTileIndex?: number;
  isExhaustiveDrawResult: boolean;
  hands: Record<string, string[]>;
  paifu: TablePaifuDetail;
  round: PaifuRoundSummary;
  seat: SeatWind;
}) {
  const playerId = getRoundPlayerId(paifu, seat);
  const tiles = playerId ? (hands[playerId] ?? []) : [];
  const displayTiles = getDisplayHandTiles({ drawnTileIndex, seat, tiles });
  const playerName = playerId ? getPlayerDisplayName(paifu, playerId) : '';
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
          {playerName}
        </strong>
      </div>
      <div
        className={[
          'absolute z-[4] flex items-end gap-0 [backface-visibility:hidden] [transform-style:preserve-3d]',
          handPositionClasses[seat],
        ].join(' ')}
      >
        {displayTiles.map(({ isDrawnTile, tile }, index) =>
          shouldShowBacks ? (
            <HandBackTile key={`${seat}-back-${index}`} seat={seat} />
          ) : (
            <HandTile
              key={`${seat}-${tile}-${index}`}
              className={getDrawnTileGapClassName({
                displayIndex: index,
                isDrawnTile,
              })}
              seat={seat}
              tile={tile}
            />
          ),
        )}
      </div>
    </>
  );
}

function getDisplayHandTiles({
  drawnTileIndex,
  seat,
  tiles,
}: {
  drawnTileIndex?: number;
  seat: SeatWind;
  tiles: string[];
}) {
  if (
    drawnTileIndex === undefined ||
    drawnTileIndex < 0 ||
    drawnTileIndex >= tiles.length
  ) {
    return getDisplayTiles(seat, tiles).map((tile) => ({
      isDrawnTile: false,
      tile,
    }));
  }

  const drawnTile = tiles[drawnTileIndex] as string;
  const baseTiles = tiles.filter((_, index) => index !== drawnTileIndex);
  const drawnDisplayTile = {
    isDrawnTile: true,
    tile: drawnTile,
  };
  const baseDisplayTiles = getDisplayTiles(seat, baseTiles).map((tile) => ({
    isDrawnTile: false,
    tile,
  }));

  if (seat === 'South' || seat === 'North') {
    return [drawnDisplayTile, ...baseDisplayTiles];
  }

  return [...baseDisplayTiles, drawnDisplayTile];
}

function getDrawnTileGapClassName({
  displayIndex,
  isDrawnTile,
}: {
  displayIndex: number;
  isDrawnTile: boolean;
}) {
  if (!isDrawnTile) {
    return '';
  }

  return displayIndex === 0 ? 'mr-3' : 'ml-3';
}
