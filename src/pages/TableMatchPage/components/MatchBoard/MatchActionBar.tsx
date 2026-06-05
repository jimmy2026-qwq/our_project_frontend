import { useEffect, useMemo, useState } from 'react';

import type { MahjongLegalAction } from '@/objects';
import { TileImage } from '@/pages/TablePaifuPage/components/PaifuHandTable/components/TileViews';

import {
  getActionButtonClassName,
  getActionButtonLabel,
  getChiActionKey,
  getTsumoActionKey,
  getVisibleButtonActions,
} from './MatchActionBar.helpers';

interface MatchActionBarProps {
  actionError: string | null;
  actions: MahjongLegalAction[];
  isRiichiSelectionActive?: boolean;
  isSubmitting: boolean;
  onToggleRiichiSelection?: () => void;
  onSubmitAction: (action: MahjongLegalAction) => void;
}

export function MatchActionBar({
  actionError,
  actions,
  isRiichiSelectionActive = false,
  isSubmitting,
  onToggleRiichiSelection,
  onSubmitAction,
}: MatchActionBarProps) {
  const [openChiActionKey, setOpenChiActionKey] = useState<string | null>(null);
  const [dismissedTsumoKey, setDismissedTsumoKey] = useState<string | null>(
    null,
  );
  const buttonActions = useMemo(
    () => actions.filter((action) => action.commandType !== 'Discard'),
    [actions],
  );
  const chiActions = useMemo(
    () => buttonActions.filter((action) => action.commandType === 'Chi'),
    [buttonActions],
  );
  const chiActionKey = useMemo(() => getChiActionKey(chiActions), [chiActions]);
  const tsumoActionKey = useMemo(
    () => getTsumoActionKey(buttonActions),
    [buttonActions],
  );
  const visibleButtonActions = useMemo(
    () => getVisibleButtonActions(buttonActions, dismissedTsumoKey),
    [buttonActions, dismissedTsumoKey],
  );
  const isChiPickerOpen =
    chiActions.length > 1 && openChiActionKey === chiActionKey;

  useEffect(() => {
    if (chiActions.length <= 1) {
      setOpenChiActionKey(null);
    }
  }, [chiActions.length]);

  useEffect(() => {
    if (openChiActionKey && openChiActionKey !== chiActionKey) {
      setOpenChiActionKey(null);
    }
  }, [chiActionKey, openChiActionKey]);

  useEffect(() => {
    if (dismissedTsumoKey && dismissedTsumoKey !== tsumoActionKey) {
      setDismissedTsumoKey(null);
    }
  }, [dismissedTsumoKey, tsumoActionKey]);

  if (visibleButtonActions.length === 0 && !actionError && !isRiichiSelectionActive) {
    return null;
  }

  return (
    <div className="absolute bottom-[116px] left-1/2 z-[18] grid w-[min(92%,760px)] -translate-x-1/2 gap-2">
      {actionError ? (
        <div className="justify-self-center rounded-2xl border border-[rgba(236,122,122,0.28)] bg-[rgba(36,12,17,0.82)] px-4 py-2 text-sm font-semibold text-[#ffb0a8] shadow-[0_12px_30px_rgba(0,0,0,0.22)] backdrop-blur">
          {actionError}
        </div>
      ) : null}

      {isRiichiSelectionActive ? (
        <div className="flex justify-center p-3">
          <button
            className={getActionButtonClassName('Pass')}
            disabled={isSubmitting}
            onClick={() => onToggleRiichiSelection?.()}
            type="button"
          >
            <span className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[46%] whitespace-nowrap px-1 text-[2.15rem] font-black leading-[0.92] tracking-normal text-inherit drop-shadow-[0_8px_14px_rgba(0,0,0,0.42)]">
              返回
            </span>
          </button>
        </div>
      ) : visibleButtonActions.length > 0 ? (
        <div className="grid justify-items-center gap-3">
          {isChiPickerOpen && chiActions.length > 1 ? (
            <ChiChoicePanel
              actions={chiActions}
              disabled={isSubmitting}
              onSelect={(action) => {
                setOpenChiActionKey(null);
                onSubmitAction(action);
              }}
            />
          ) : null}

          <div className="flex flex-wrap justify-center gap-2 p-3">
            {visibleButtonActions.map((button, index) => (
              <button
                key={`${button.key}-${index}`}
                className={[
                  getActionButtonClassName(button.commandType),
                  button.commandType === 'Riichi' && isRiichiSelectionActive
                    ? 'ring-2 ring-[rgba(255,236,190,0.72)]'
                    : '',
                ].join(' ')}
                disabled={isSubmitting}
                onClick={() => {
                  if (button.localSkipTsumo) {
                    setDismissedTsumoKey(tsumoActionKey);
                    return;
                  }

                  if (button.commandType === 'Chi' && chiActions.length > 1) {
                    setOpenChiActionKey((currentKey) =>
                      currentKey === chiActionKey ? null : chiActionKey,
                    );
                    return;
                  }

                  if (button.commandType === 'Riichi') {
                    onToggleRiichiSelection?.();
                    return;
                  }

                  if (button.action) {
                    onSubmitAction(button.action);
                  }
                }}
                type="button"
              >
                <span className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[46%] whitespace-nowrap px-1 text-[2.15rem] font-black leading-[0.92] tracking-normal text-inherit drop-shadow-[0_8px_14px_rgba(0,0,0,0.42)]">
                  {getActionButtonLabel(button.commandType)}
                </span>
              </button>
            ))}
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
