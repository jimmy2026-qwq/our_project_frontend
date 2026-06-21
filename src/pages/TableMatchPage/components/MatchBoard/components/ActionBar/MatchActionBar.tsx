import { useEffect, useMemo, useState } from 'react';

import { MahjongCommandTypes, type MahjongLegalAction } from '@/objects';

import { ChiChoicePanel } from './MatchActionChiChoicePanel';
import {
  getActionButtonClassName,
  getActionButtonLabel,
  getChiActionKey,
  getTsumoActionKey,
  getVisibleButtonActions,
} from '../../functions/getMatchActionBarButtons';

interface MatchActionBarProps {
  actionError: string | null;
  actions: MahjongLegalAction[];
  isRiichiSelectionActive?: boolean;
  isSubmitting: boolean;
  onToggleRiichiSelection?: () => void;
  onSubmitAction: (action: MahjongLegalAction) => void;
}

/** 实时牌桌底部展示可执行麻将动作的操作栏。 */
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
    () =>
      actions.filter(
        (action) => action.commandType !== MahjongCommandTypes.Discard,
      ),
    [actions],
  );
  const chiActions = useMemo(
    () =>
      buttonActions.filter(
        (action) => action.commandType === MahjongCommandTypes.Chi,
      ),
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
            className={getActionButtonClassName(MahjongCommandTypes.Pass)}
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
                  button.commandType === MahjongCommandTypes.Riichi &&
                  isRiichiSelectionActive
                    ? 'ring-2 ring-[rgba(255,236,190,0.72)]'
                    : '',
                ].join(' ')}
                disabled={isSubmitting}
                onClick={() => {
                  if (button.localSkipTsumo) {
                    setDismissedTsumoKey(tsumoActionKey);
                    return;
                  }

                  if (
                    button.commandType === MahjongCommandTypes.Chi &&
                    chiActions.length > 1
                  ) {
                    setOpenChiActionKey((currentKey) =>
                      currentKey === chiActionKey ? null : chiActionKey,
                    );
                    return;
                  }

                  if (button.commandType === MahjongCommandTypes.Riichi) {
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
