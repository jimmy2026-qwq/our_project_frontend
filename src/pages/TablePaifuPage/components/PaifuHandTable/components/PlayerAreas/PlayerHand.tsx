import { getPaifuTileCode, type PaifuTile } from '@/objects';
import { SeatWind } from '@/objects/tournament';

import type { TablePaifuDetail } from '../../../../objects/TablePaifuDetail';
import { getPlayerDisplayName, getRoundPlayerId } from '../../../../functions/getReplayPlayers';
import { replaySeatLabels } from '../../../../objects/replaySeatInfo';
import { HandBackTile, HandTile } from '../TileViews';
import { getDisplayTiles } from '../../functions/getPaifuTableLayout';
import { handPositionClasses } from '../../objects/layout/handPositionClasses';
import { labelPositionClasses } from '../../objects/layout/labelPositionClasses';

/** 牌谱玩家区域中的手牌、摸牌和玩家名称信息。 */
export function PlayerHand({
  drawnTileIndex,
  hands,
  paifu,
  seat,
  shouldRevealHand,
}: {
  drawnTileIndex?: number;
  hands: Record<string, PaifuTile[]>;
  paifu: TablePaifuDetail;
  seat: SeatWind;
  shouldRevealHand: boolean;
}) {
  const playerId = getRoundPlayerId(paifu, seat);
  const tiles = playerId ? (hands[playerId] ?? []) : [];
  const displayTiles = getDisplayHandTiles({ drawnTileIndex, seat, tiles });
  const playerName = playerId ? getPlayerDisplayName(paifu, playerId) : '';
  const shouldShowBacks = !shouldRevealHand;

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
          {replaySeatLabels[seat]}
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
              key={`${seat}-${getPaifuTileCode(tile)}-${index}`}
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
  tiles: PaifuTile[];
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

  const drawnTile = tiles[drawnTileIndex] as PaifuTile;
  const baseTiles = tiles.filter((_, index) => index !== drawnTileIndex);
  const drawnDisplayTile = {
    isDrawnTile: true,
    tile: drawnTile,
  };
  const baseDisplayTiles = getDisplayTiles(seat, baseTiles).map((tile) => ({
    isDrawnTile: false,
    tile,
  }));

  if (seat === SeatWind.South || seat === SeatWind.North) {
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
