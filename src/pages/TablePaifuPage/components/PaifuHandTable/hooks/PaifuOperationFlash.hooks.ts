import { useEffect, useState } from 'react';

import type { SeatWind } from '@/objects/tournament';

import type { PaifuAction, PaifuRoundSummary, TablePaifuDetail } from '../../../types';
import {
  getOperationText,
  getPlayerSeat,
  isAbortiveDrawAction,
  isWinningAction,
} from '../../../objects/replay';
import type { ActiveOperation } from '../../PaifuOverlays';

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
  const [winningAction, setWinningAction] = useState<PaifuAction>();

  useEffect(() => {
    if (replayStep <= 0 || isExhaustiveDrawResult) {
      setActiveOperation(undefined);
      setWinningAction(undefined);
      return;
    }

    const action = replayActions[replayStep - 1];
    const label = action ? getOperationText(action, round) : undefined;
    const seat = action?.actor ? getPlayerSeat(paifu, action.actor) : undefined;

    if (!label || !seat) {
      setActiveOperation(undefined);
      setWinningAction(undefined);
      return;
    }

    setWinningAction(undefined);
    setActiveOperation({ key: Date.now(), label, seat: seat as SeatWind });

    if (isAbortiveDrawAction(action)) {
      return;
    }

    if (isWinningAction(action)) {
      const timeoutId = window.setTimeout(() => {
        setActiveOperation(undefined);
        setWinningAction(action);
      }, 1000);

      return () => window.clearTimeout(timeoutId);
    }

    const timeoutId = window.setTimeout(() => {
      setActiveOperation(undefined);
    }, 1500);

    return () => window.clearTimeout(timeoutId);
  }, [isExhaustiveDrawResult, paifu, replayActions, replayStep, round]);

  return { activeOperation, winningAction, setWinningAction };
}
