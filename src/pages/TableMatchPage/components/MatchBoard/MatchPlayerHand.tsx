import type { MahjongLegalAction, MahjongSeatView, SeatWind } from '@/objects';
import { HandBackTile, HandTile } from '@/pages/TablePaifuPage/components/PaifuHandTable/components/TileViews';
import {
  getDisplayTiles,
  handPositionClasses,
  labelPositionClasses,
} from '@/pages/TablePaifuPage/components/PaifuHandTable/functions/getPaifuTableLayout';

import {
  getSeatLabel,
  getShortPlayerLabel,
  getSeatStateBadges,
} from './matchBoardLabels';

interface MatchPlayerHandProps {
  discardActions: MahjongLegalAction[];
  isSubmitting: boolean;
  isTurnPlayer: boolean;
  onSubmitAction: (action: MahjongLegalAction) => void;
  seat: SeatWind;
  seatView: MahjongSeatView | null;
}

export function MatchPlayerHand({
  discardActions,
  isSubmitting,
  isTurnPlayer,
  onSubmitAction,
  seat,
  seatView,
}: MatchPlayerHandProps) {
  if (!seatView) {
    return null;
  }

  const tiles = seatView.handTiles ?? [];
  const displayTiles =
    tiles.length > 0 ? getDisplayTiles(seat, tiles) : createBackTiles(seatView);
  const isOwnVisibleHand = tiles.length > 0;

  return (
    <>
      <div
        className={[
          'absolute z-[5] grid gap-1',
          labelPositionClasses[seat],
        ].join(' ')}
      >
        <span className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#ecc57a]">
          {getSeatLabel(seat)}
          {seatView.isDealer ? ' 亲' : ''}
        </span>
        <strong className="block max-w-[18ch] truncate text-sm text-[#f2f7fb] [text-shadow:0_2px_10px_rgba(0,0,0,0.52)]">
          {getShortPlayerLabel(seatView.playerId)}
        </strong>
        <span className="text-xs font-semibold text-[#c7d6e2]">
          {seatView.points.toLocaleString()}
          {isTurnPlayer ? ' / 当前手番' : ''}
        </span>
        <span className="text-[0.68rem] font-semibold text-[#8fe8e1]">
          {getSeatStateBadges(seatView).join(' ')}
        </span>
      </div>

      <div
        className={[
          'absolute z-[6] flex items-end gap-0 [backface-visibility:hidden] [transform-style:preserve-3d]',
          handPositionClasses[seat],
        ].join(' ')}
      >
        {displayTiles.map((tile, index) =>
          isOwnVisibleHand ? (
            <DiscardTileButton
              key={`${seat}-${tile}-${index}`}
              action={findDiscardAction(discardActions, tile)}
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
  disabled,
  onSubmitAction,
  seat,
  tile,
}: {
  action: MahjongLegalAction | undefined;
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
        canDiscard ? '' : 'cursor-not-allowed opacity-70',
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
