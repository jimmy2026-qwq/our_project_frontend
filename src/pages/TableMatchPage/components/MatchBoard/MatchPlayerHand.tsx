import type { MahjongLegalAction, MahjongSeatView, SeatWind } from '@/objects';
import {
  HandBackTile,
  HandTile,
} from '@/pages/TablePaifuPage/components/PaifuHandTable/components/TileViews';
import {
  handPositionClasses,
  labelPositionClasses,
} from '@/pages/TablePaifuPage/components/PaifuHandTable/functions/getPaifuTableLayout';

import { getMatchDisplayHandTiles } from './MatchPlayerHand.helpers';
import {
  getSeatLabel,
  getSeatStateBadges,
  getShortPlayerLabel,
} from './matchBoardLabels';

interface MatchPlayerHandProps {
  discardActions: MahjongLegalAction[];
  dimUnavailableTiles?: boolean;
  hideLabel?: boolean;
  isSubmitting: boolean;
  isTurnPlayer: boolean;
  onSubmitAction: (action: MahjongLegalAction) => void;
  playerName?: string;
  seat: SeatWind;
  seatView: MahjongSeatView | null;
  showPrivateState?: boolean;
  shouldForceBacks?: boolean;
}

export function MatchPlayerHand({
  discardActions,
  dimUnavailableTiles = false,
  hideLabel = false,
  isSubmitting,
  isTurnPlayer,
  onSubmitAction,
  playerName,
  seat,
  seatView,
  showPrivateState = false,
  shouldForceBacks = false,
}: MatchPlayerHandProps) {
  if (!seatView) {
    return null;
  }

  const tiles = seatView.handTiles ?? [];
  const displayTiles =
    tiles.length > 0 && !shouldForceBacks
      ? getMatchDisplayHandTiles({
          drawTile: seatView.drawTile,
          seat,
          tiles,
        })
      : createBackTiles(seatView).map((tile) => ({
          isDrawnTile: false,
          tile,
        }));
  const isOwnVisibleHand = tiles.length > 0 && !shouldForceBacks;
  const stateBadges = getSeatStateBadges(seatView, { showPrivateState });

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
              {stateBadges.map((badge, index) => (
                <span
                  className={
                    badge.tone === 'danger' ? 'text-[#ff6b6b]' : undefined
                  }
                  key={`${badge.label}-${index}`}
                >
                  {index > 0 ? ' ' : ''}
                  {badge.label}
                </span>
              ))}
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
              dimUnavailable={dimUnavailableTiles}
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
  dimUnavailable,
  disabled,
  onSubmitAction,
  seat,
  tile,
}: {
  action: MahjongLegalAction | undefined;
  className?: string;
  dimUnavailable: boolean;
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
        !canDiscard && dimUnavailable ? 'opacity-35 grayscale' : '',
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
