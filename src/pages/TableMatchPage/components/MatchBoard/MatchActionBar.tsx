import { useEffect, useMemo, useState } from 'react';

import { cx } from '@/components/ui/cx';
import type { MahjongCommandType, MahjongLegalAction } from '@/objects';
import { TileImage } from '@/pages/TablePaifuPage/components/PaifuHandTable/components/TileViews';

interface MatchActionBarProps {
  actionError: string | null;
  actions: MahjongLegalAction[];
  isSubmitting: boolean;
  onSubmitAction: (action: MahjongLegalAction) => void;
}

interface DisplayActionButton {
  action?: MahjongLegalAction;
  commandType: MahjongCommandType;
  key: string;
  localSkipTsumo?: boolean;
}

export function MatchActionBar({
  actionError,
  actions,
  isSubmitting,
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

  if (visibleButtonActions.length === 0 && !actionError) {
    return null;
  }

  return (
    <div className="absolute bottom-[116px] left-1/2 z-[18] grid w-[min(92%,760px)] -translate-x-1/2 gap-2">
      {actionError ? (
        <div className="justify-self-center rounded-2xl border border-[rgba(236,122,122,0.28)] bg-[rgba(36,12,17,0.82)] px-4 py-2 text-sm font-semibold text-[#ffb0a8] shadow-[0_12px_30px_rgba(0,0,0,0.22)] backdrop-blur">
          {actionError}
        </div>
      ) : null}

      {visibleButtonActions.length > 0 ? (
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
                className={getActionButtonClassName(button.commandType)}
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

export function getVisibleButtonActions(
  actions: MahjongLegalAction[],
  dismissedTsumoKey: string | null = null,
): DisplayActionButton[] {
  const collapsedActions = collapseChiActions(actions);
  const tsumoKey = getTsumoActionKey(actions);
  const shouldHideTsumo = Boolean(
    dismissedTsumoKey && dismissedTsumoKey === tsumoKey,
  );
  const hasBackendPass = collapsedActions.some(
    (action) => action.commandType === 'Pass',
  );
  const shouldAddLocalPass = Boolean(tsumoKey && !hasBackendPass);
  const visibleActions = shouldHideTsumo
    ? collapsedActions.filter((action) => action.commandType !== 'Tsumo')
    : collapsedActions;
  const displayButtons: DisplayActionButton[] = [];

  for (const action of visibleActions) {
    const key = getActionIdentity(action);

    displayButtons.push({
      action,
      commandType: action.commandType,
      key,
    });

    if (action.commandType === 'Tsumo' && shouldAddLocalPass) {
      displayButtons.push({
        commandType: 'Pass',
        key: `${key}:local-pass`,
        localSkipTsumo: true,
      });
    }
  }

  return displayButtons;
}

export function getTsumoActionKey(actions: MahjongLegalAction[]) {
  return actions
    .filter((action) => action.commandType === 'Tsumo')
    .map(getActionIdentity)
    .sort()
    .join('|');
}

export function getActionButtonLabel(commandType: MahjongCommandType) {
  const labels: Record<MahjongCommandType, string> = {
    AbortiveDraw: '流局',
    AddedKan: '杠',
    Chi: '吃',
    ClosedKan: '杠',
    Discard: '切牌',
    OpenKan: '杠',
    Pass: '跳过',
    Pon: '碰',
    Riichi: '立直',
    Ron: '荣和',
    Tsumo: '自摸',
  };

  return labels[commandType];
}

export function getActionButtonClassName(commandType: MahjongCommandType) {
  return cx(
    [
      'relative mt-7 inline-flex min-h-[46px] min-w-32 cursor-pointer items-center justify-center overflow-visible',
      'border px-[24px] pb-3 pt-5 text-center no-underline',
      '[font-family:"JetBrains_Sans","Segoe_UI",sans-serif] text-[0.98rem] font-black leading-none tracking-normal',
      'transition-[transform,border-color,background-color,box-shadow,color,opacity] duration-200',
      'shadow-[0_12px_26px_rgba(0,0,0,0.26),inset_0_1px_0_rgba(255,255,255,0.12)]',
      'hover:enabled:-translate-y-px hover:enabled:shadow-[0_16px_34px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.16)]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(255,255,255,0.2)]',
      'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-55',
    ].join(' '),
    getActionButtonToneClassName(commandType),
  );
}

function getActionButtonToneClassName(commandType: MahjongCommandType) {
  if (
    commandType === 'Chi' ||
    commandType === 'Pon' ||
    commandType === 'OpenKan' ||
    commandType === 'ClosedKan' ||
    commandType === 'AddedKan'
  ) {
    return 'border-[rgba(95,214,145,0.48)] bg-[linear-gradient(180deg,rgba(43,148,93,0.94),rgba(23,103,71,0.94))] text-[#d7ffe5]';
  }

  if (commandType === 'Riichi') {
    return 'border-[rgba(255,181,89,0.58)] bg-[linear-gradient(180deg,rgba(231,138,50,0.96),rgba(168,83,30,0.96))] text-[#fff0d2]';
  }

  if (commandType === 'Ron' || commandType === 'Tsumo') {
    return 'border-[rgba(255,112,112,0.58)] bg-[linear-gradient(180deg,rgba(211,64,69,0.96),rgba(132,35,48,0.96))] text-[#ffe1e1]';
  }

  if (commandType === 'Pass') {
    return 'border-[rgba(190,200,210,0.34)] bg-[linear-gradient(180deg,rgba(96,108,121,0.9),rgba(55,64,76,0.9))] text-[#edf2f7]';
  }

  return 'border-[rgba(219,175,98,0.36)] bg-[linear-gradient(180deg,rgba(83,124,210,0.92),rgba(56,85,162,0.92))] text-[#f5c98e]';
}

export function getChiActionKey(actions: MahjongLegalAction[]) {
  return actions.map(getActionIdentity).sort().join('|');
}

function getActionIdentity(action: MahjongLegalAction) {
  return [
    action.commandType,
    action.targetSequenceNo ?? '',
    action.tile ?? '',
    ...(action.tiles ?? []),
  ].join(':');
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
