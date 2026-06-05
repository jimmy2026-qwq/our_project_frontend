import { useCallback, useEffect, useState } from 'react';

import type { SeatWind } from '@/objects/tournament';

import type {
  PaifuAction,
  PaifuRoundSummary,
  TablePaifuDetail,
} from '../../../types';
import {
  getOperationText,
  getPlayerSeat,
  isAbortiveDrawAction,
  isWinningAction,
} from '../../../functions/getReplay';
import type {
  ActiveOperation,
  WinningCallFlashView,
} from '../components/PaifuOverlays/PaifuOverlays.types';

const winningCallAnimationMs = 500;
const winningCallVisibleMs = 1500;
const winningCallSettlementWaitMs = 1500;
const winningCallRevealDelayMs =
  winningCallAnimationMs + winningCallSettlementWaitMs;

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
  const [winningAction, setWinningAction] = useState<PaifuAction>();
  const [revealedWinningPlayerId, setRevealedWinningPlayerId] = useState<
    string | undefined
  >();

  useEffect(() => {
    if (replayStep <= 0 || isExhaustiveDrawResult) {
      setActiveOperation(undefined);
      setActiveWinningCall(undefined);
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
      setWinningAction(undefined);
      setRevealedWinningPlayerId(undefined);
      return;
    }

    setWinningAction(undefined);
    setRevealedWinningPlayerId(undefined);
    setActiveWinningCall(undefined);

    if (isAbortiveDrawAction(action)) {
      setActiveOperation({ key: Date.now(), label, seat: seat as SeatWind });
      return;
    }

    if (isWinningAction(action)) {
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
      const settlementTimerId = window.setTimeout(() => {
        setWinningAction(action);
      }, winningCallRevealDelayMs);

      return () => {
        window.clearTimeout(flashTimerId);
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
    setWinningAction(undefined);
    setRevealedWinningPlayerId(undefined);
  }, []);

  return {
    activeOperation,
    activeWinningCall,
    clearWinningAction,
    revealedWinningPlayerId,
    winningAction,
    setWinningAction,
  };
}

function getWinningCallLabel(round: PaifuRoundSummary) {
  return round.result.outcome === 'Tsumo' ? '\u81ea\u6478' : '\u548c';
}

function getOperationFlashDurationMs(action: PaifuAction) {
  return action.actionType === 'Chi' || action.actionType === 'Pon'
    ? 500
    : 1500;
}
