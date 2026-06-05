import type { MahjongLegalAction, MahjongSeatView, SeatWind } from '@/objects';
import {
  HandBackTile,
  HandTile,
} from '@/pages/TablePaifuPage/components/PaifuHandTable/components/TileViews';
import {
  getDisplayTiles,
  handPositionClasses,
  labelPositionClasses,
} from '@/pages/TablePaifuPage/components/PaifuHandTable/functions/getPaifuTableLayout';

import {
  getSeatLabel,
  getSeatStateBadges,
  getShortPlayerLabel,
} from './matchBoardLabels';

interface MatchPlayerHandProps {
  discardActions: MahjongLegalAction[];
  hideLabel?: boolean;
  isSubmitting: boolean;
  isTurnPlayer: boolean;
  onSubmitAction: (action: MahjongLegalAction) => void;
  playerName?: string;
  seat: SeatWind;
  seatView: MahjongSeatView | null;
}

export function MatchPlayerHand({
  discardActions,
  hideLabel = false,
  isSubmitting,
  isTurnPlayer,
  onSubmitAction,
  playerName,
  seat,
  seatView,
}: MatchPlayerHandProps) {
  if (!seatView) {
    return null;
  }

  const tiles = seatView.handTiles ?? [];
  const displayTiles =
    tiles.length > 0
      ? getMatchDisplayHandTiles({
          drawTile: seatView.drawTile,
          seat,
          tiles,
        })
      : createBackTiles(seatView).map((tile) => ({
          isDrawnTile: false,
          tile,
        }));
  const isOwnVisibleHand = tiles.length > 0;
  const stateBadges = getSeatStateBadges(seatView);

  return (
    <>
      {hideLabel ? null : (
        <div
          className={[
            'absolute z-[5] grid gap-1',
            labelPositionClasses[seat],
          ].join(' ')}
        >
          <span className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#ecc57a]">
            {getSeatLabel(seatView.seat)}
            {seatView.isDealer ? ' 亲' : ''}
          </span>
          <strong className="block max-w-[18ch] truncate text-sm text-[#f2f7fb] [text-shadow:0_2px_10px_rgba(0,0,0,0.52)]">
            {playerName?.trim() || getShortPlayerLabel(seatView.playerId)}
          </strong>
          {isTurnPlayer ? (
            <span className="text-xs font-semibold text-[#c7d6e2]">
              轮到出牌
            </span>
          ) : null}
          {stateBadges.length > 0 ? (
            <span className="text-[0.68rem] font-semibold text-[#8fe8e1]">
              {stateBadges.join(' ')}
            </span>
          ) : null}
        </div>
      )}

      <div
        className={[
          'absolute z-[6] flex items-end gap-0 [backface-visibility:hidden] [transform-style:preserve-3d]',
          handPositionClasses[seat],
        ].join(' ')}
      >
        {displayTiles.map(({ isDrawnTile, tile }, index) =>
          isOwnVisibleHand ? (
            <DiscardTileButton
              key={`${seat}-${tile}-${index}`}
              action={findDiscardAction(discardActions, tile)}
              className={getDrawnTileGapClassName({
                displayIndex: index,
                isDrawnTile,
              })}
              disabled={isSubmitting}
              onSubmitAction={onSubmitAction}
              seat={seat}
              tile={tile}
            />
          ) : (
            <HandBackTile key={`${seat}-back-${index}`} seat={seat} />
          ),
        )}
      </div>
    </>
  );
}

function DiscardTileButton({
  action,
  className,
  disabled,
  onSubmitAction,
  seat,
  tile,
}: {
  action: MahjongLegalAction | undefined;
  className?: string;
  disabled: boolean;
  onSubmitAction: (action: MahjongLegalAction) => void;
  seat: SeatWind;
  tile: string;
}) {
  const canDiscard = Boolean(action);

  return (
    <button
      aria-label={`打出 ${tile}`}
      className={[
        'cursor-pointer border-0 bg-transparent p-0',
        className,
        canDiscard ? '' : 'cursor-not-allowed',
      ].join(' ')}
      disabled={disabled || !canDiscard}
      onClick={() => {
        if (action) {
          onSubmitAction(action);
        }
      }}
      type="button"
    >
      <HandTile
        className={canDiscard ? 'hover:-translate-y-2' : 'hover:translate-y-0'}
        seat={seat}
        tile={tile}
      />
    </button>
  );
}

function findDiscardAction(actions: MahjongLegalAction[], tile: string) {
  return actions.find((action) => action.tile === tile);
}

function createBackTiles(seatView: MahjongSeatView) {
  return Array.from({ length: seatView.handTileCount }, (_, index) =>
    String(index),
  );
}

export function getMatchDisplayHandTiles({
  drawTile,
  seat,
  tiles,
}: {
  drawTile?: string | null;
  seat: SeatWind;
  tiles: string[];
}) {
  if (!drawTile) {
    return getDisplayTiles(seat, tiles).map((tile) => ({
      isDrawnTile: false,
      tile,
    }));
  }

  const baseTiles = removeFirstMatchingTile(tiles, drawTile);
  const drawnDisplayTile = {
    isDrawnTile: true,
    tile: drawTile,
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

function removeFirstMatchingTile(tiles: string[], tile: string) {
  let removed = false;

  return tiles.filter((item) => {
    if (!removed && item === tile) {
      removed = true;
      return false;
    }

    return true;
  });
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
