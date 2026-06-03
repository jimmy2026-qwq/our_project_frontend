import { useEffect, useMemo, useState } from 'react';

import { Badge, Button } from '@/components/ui';
import type { MahjongLegalAction } from '@/objects';
import { TileImage } from '@/pages/TablePaifuPage/components/PaifuHandTable/components/TileViews';

import { getActionLabel, getActionTone } from './matchBoardLabels';

interface MatchActionBarProps {
  actionError: string | null;
  actions: MahjongLegalAction[];
  isSubmitting: boolean;
  onSubmitAction: (action: MahjongLegalAction) => void;
}

export function MatchActionBar({
  actionError,
  actions,
  isSubmitting,
  onSubmitAction,
}: MatchActionBarProps) {
  const [isChiPickerOpen, setIsChiPickerOpen] = useState(false);
  const buttonActions = actions.filter(
    (action) => action.commandType !== 'Discard',
  );
  const chiActions = useMemo(
    () => buttonActions.filter((action) => action.commandType === 'Chi'),
    [buttonActions],
  );
  const visibleButtonActions = useMemo(
    () => collapseChiActions(buttonActions),
    [buttonActions],
  );

  useEffect(() => {
    setIsChiPickerOpen(false);
  }, [actions]);

  if (buttonActions.length === 0 && !actionError) {
    return null;
  }

  return (
    <div className="absolute bottom-[116px] left-1/2 z-[18] grid w-[min(92%,760px)] -translate-x-1/2 gap-2">
      {actionError ? (
        <div className="justify-self-center rounded-2xl border border-[rgba(236,122,122,0.28)] bg-[rgba(36,12,17,0.82)] px-4 py-2 text-sm font-semibold text-[#ffb0a8] shadow-[0_12px_30px_rgba(0,0,0,0.22)] backdrop-blur">
          {actionError}
        </div>
      ) : null}

      {buttonActions.length > 0 ? (
        <div className="grid justify-items-center gap-3">
          {isChiPickerOpen && chiActions.length > 1 ? (
            <ChiChoicePanel
              actions={chiActions}
              disabled={isSubmitting}
              onSelect={(action) => {
                setIsChiPickerOpen(false);
                onSubmitAction(action);
              }}
            />
          ) : null}

          <div className="flex flex-wrap justify-center gap-2 rounded-2xl border border-[rgba(176,223,229,0.18)] bg-[rgba(7,18,28,0.78)] p-3 shadow-[0_18px_44px_rgba(0,0,0,0.28)] backdrop-blur">
            {visibleButtonActions.map((action, index) => (
              <Button
                key={`${action.commandType}-${action.tile ?? 'none'}-${index}`}
                disabled={isSubmitting}
                onClick={() => {
                  if (action.commandType === 'Chi' && chiActions.length > 1) {
                    setIsChiPickerOpen((open) => !open);
                    return;
                  }

                  onSubmitAction(action);
                }}
                size="sm"
                variant={getActionTone(action.commandType)}
              >
                {getActionLabel(action)}
              </Button>
            ))}
            {isSubmitting ? <Badge variant="warning">提交中</Badge> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ChiChoicePanel({
  actions,
  disabled,
  onSelect,
}: {
  actions: MahjongLegalAction[];
  disabled: boolean;
  onSelect: (action: MahjongLegalAction) => void;
}) {
  return (
    <div className="flex max-w-full items-center justify-center gap-5 overflow-x-auto rounded-[18px] border border-[rgba(236,197,122,0.32)] bg-[rgba(5,12,18,0.92)] px-5 py-4 shadow-[0_18px_48px_rgba(0,0,0,0.42)] backdrop-blur-md">
      {actions.map((action) => {
        const choiceTiles = getChiChoiceTiles(action);

        return (
          <button
            key={`${action.targetSequenceNo ?? 'chi'}-${action.tiles.join('-')}`}
            aria-label={`吃 ${choiceTiles.join(' ')}`}
            className="flex shrink-0 items-end gap-0 rounded-[12px] border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.05)] px-3 py-2 transition duration-150 hover:-translate-y-0.5 hover:border-[rgba(236,197,122,0.55)] hover:bg-[rgba(236,197,122,0.12)] disabled:cursor-not-allowed disabled:opacity-55"
            disabled={disabled}
            onClick={() => onSelect(action)}
            type="button"
          >
            {choiceTiles.map((tile, index) => (
              <TileImage
                key={`${action.targetSequenceNo ?? 'chi'}-${tile}-${index}`}
                className="block w-[42px] select-none"
                tile={tile}
              />
            ))}
          </button>
        );
      })}
    </div>
  );
}

function collapseChiActions(actions: MahjongLegalAction[]) {
  let hasChi = false;

  return actions.filter((action) => {
    if (action.commandType !== 'Chi') {
      return true;
    }

    if (hasChi) {
      return false;
    }

    hasChi = true;
    return true;
  });
}

function getChiChoiceTiles(action: MahjongLegalAction) {
  const calledTile = action.tile;

  if (!calledTile) {
    return action.tiles.slice(0, 2);
  }

  let removedCalledTile = false;

  return action.tiles.filter((tile) => {
    if (!removedCalledTile && getTileIndex(tile) === getTileIndex(calledTile)) {
      removedCalledTile = true;
      return false;
    }

    return true;
  });
}

function getTileIndex(tile: string) {
  const value = tile.trim().toLowerCase();
  const rank = value.startsWith('0') ? 5 : Number(value[0]);
  const suit = value[value.length - 1];

  return `${rank}${suit}`;
}
