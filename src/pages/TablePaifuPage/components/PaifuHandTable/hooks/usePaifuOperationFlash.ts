import { useCallback, useEffect, useState } from 'react';

import type { SeatWind } from '@/objects/tournament';

import type {
  PaifuAction,
  PaifuRoundSummary,
  TablePaifuDetail,
} from '../../../types';
import {
  getResultWinForActor,
  getWinYaku,
} from '@/pages/shared/mahjongResultSequence';
import { getFirstYakumanYaku } from '@/pages/shared/yakumanAnimation';

import type { MahjongYakuKind } from '@/objects';

import {
  getOperationText,
  getPlayerSeat,
  isAbortiveDrawAction,
  isRiichiAction,
  isWinningAction,
  removeFirstTile,
} from '../../../functions/getReplay';
import type {
  ActiveOperation,
  YakumanTileBurstView,
  WinningCallFlashView,
} from '../components/PaifuOverlays/PaifuOverlays.types';

const winningCallAnimationMs = 500;
const winningCallVisibleMs = 1500;
const riichiCallVisibleMs = 1000;
const winningCallSettlementWaitMs = 1500;
const winningCallRevealDelayMs =
  winningCallAnimationMs + winningCallSettlementWaitMs;
const yakumanTileBurstVisibleMs = 4200;
const yakumanTileBurstSettleDelayMs = 500;

export function usePaifuOperationFlash({
  isExhaustiveDrawResult,
  paifu,
  replayActions,
  replayStep,
  round,
}: {
  isExhaustiveDrawResult: boolean;
  paifu: TablePaifuDetail;
  replayActions: PaifuAction[];
  replayStep: number;
  round: PaifuRoundSummary;
}) {
  const [activeOperation, setActiveOperation] = useState<ActiveOperation>();
  const [activeWinningCall, setActiveWinningCall] =
    useState<WinningCallFlashView>();
  const [activeYakumanTileBurst, setActiveYakumanTileBurst] =
    useState<YakumanTileBurstView>();
  const [winningAction, setWinningAction] = useState<PaifuAction>();
  const [revealedWinningPlayerId, setRevealedWinningPlayerId] = useState<
    string | undefined
  >();

  useEffect(() => {
    if (replayStep <= 0 || isExhaustiveDrawResult) {
      setActiveOperation(undefined);
      setActiveWinningCall(undefined);
      setActiveYakumanTileBurst(undefined);
      setWinningAction(undefined);
      setRevealedWinningPlayerId(undefined);
      return;
    }

    const action = replayActions[replayStep - 1];
    const label = action ? getOperationText(action, round) : undefined;
    const seat = action?.actor ? getPlayerSeat(paifu, action.actor) : undefined;

    if (!label || !seat) {
      setActiveOperation(undefined);
      setActiveWinningCall(undefined);
      setActiveYakumanTileBurst(undefined);
      setWinningAction(undefined);
      setRevealedWinningPlayerId(undefined);
      return;
    }

    setWinningAction(undefined);
    setRevealedWinningPlayerId(undefined);
    setActiveWinningCall(undefined);
    setActiveYakumanTileBurst(undefined);

    if (isAbortiveDrawAction(action)) {
      setActiveOperation({ key: Date.now(), label, seat: seat as SeatWind });
      return;
    }

    if (isRiichiAction(action)) {
      setActiveOperation(undefined);
      setActiveWinningCall({
        animationMs: winningCallAnimationMs,
        key: Date.now(),
        label,
        seat: seat as SeatWind,
        variant: 'riichi',
      });
      const flashTimerId = window.setTimeout(() => {
        setActiveWinningCall(undefined);
      }, riichiCallVisibleMs);

      return () => {
        window.clearTimeout(flashTimerId);
      };
    }

    if (isWinningAction(action)) {
      const resultWin = getResultWinForActor(round.result, action.actor);
      const yakumanYaku = resultWin
        ? getFirstYakumanYaku(getWinYaku(round.result, resultWin))
        : undefined;
      const yakumanTiles = getYakumanBurstTilesForPaifuAction({
        action,
        resultWin,
        round,
      });
      setRevealedWinningPlayerId(action.actor);
      setActiveOperation(undefined);
      setActiveWinningCall({
        animationMs: winningCallAnimationMs,
        key: Date.now(),
        label: getWinningCallLabel(round),
        seat: seat as SeatWind,
      });
      const flashTimerId = window.setTimeout(() => {
        setActiveWinningCall(undefined);
      }, winningCallVisibleMs);
      const yakumanTimerId = yakumanYaku
        ? window.setTimeout(() => {
            setActiveYakumanTileBurst({
              featuredTile: action.tile,
              key: `${action.sequenceNo}-${yakumanYaku.kind}`,
              tiles: yakumanTiles,
              yakuKind: yakumanYaku.kind as MahjongYakuKind,
            });
          }, winningCallVisibleMs)
        : undefined;
      const settlementTimerId = window.setTimeout(
        () => {
          setActiveYakumanTileBurst(undefined);
          setWinningAction(action);
        },
        yakumanYaku
          ? winningCallVisibleMs +
              yakumanTileBurstVisibleMs +
              yakumanTileBurstSettleDelayMs
          : winningCallRevealDelayMs,
      );

      return () => {
        window.clearTimeout(flashTimerId);
        if (yakumanTimerId) {
          window.clearTimeout(yakumanTimerId);
        }
        window.clearTimeout(settlementTimerId);
      };
    }

    setActiveOperation({ key: Date.now(), label, seat: seat as SeatWind });
    const timeoutId = window.setTimeout(() => {
      setActiveOperation(undefined);
    }, getOperationFlashDurationMs(action));

    return () => window.clearTimeout(timeoutId);
  }, [isExhaustiveDrawResult, paifu, replayActions, replayStep, round]);

  const clearWinningAction = useCallback(() => {
    setActiveWinningCall(undefined);
    setActiveYakumanTileBurst(undefined);
    setWinningAction(undefined);
    setRevealedWinningPlayerId(undefined);
  }, []);

  return {
    activeOperation,
    activeWinningCall,
    activeYakumanTileBurst,
    clearWinningAction,
    revealedWinningPlayerId,
    winningAction,
    setWinningAction,
  };
}

function getYakumanBurstTilesForPaifuAction({
  action,
  resultWin,
  round,
}: {
  action: PaifuAction;
  resultWin?: ReturnType<typeof getResultWinForActor>;
  round: PaifuRoundSummary;
}) {
  const tiles =
    action.handTilesAfterAction ??
    (resultWin?.winner ? round.initialHands[resultWin.winner] : undefined) ??
    [];

  return action.tile ? [action.tile, ...removeFirstTile(tiles, action.tile)] : tiles;
}

function getWinningCallLabel(round: PaifuRoundSummary) {
  return round.result.outcome === 'Tsumo' ? '\u81ea\u6478' : '\u548c';
}

function getOperationFlashDurationMs(action: PaifuAction) {
  return action.actionType === 'Chi' || action.actionType === 'Pon'
    ? 500
    : 1500;
}
