import { useCallback, useEffect, useState } from 'react';

import type { SeatWind } from '@/objects/tournament';

import type { PaifuAction, PaifuRound as PaifuRoundSummary } from '@/objects';
import type { TablePaifuDetail } from '../../../objects/TablePaifuDetail';
import {
  getResultWinForActor,
  getWinYaku,
} from '@/components/mahjong-result/functions/getMahjongResultSequence';
import { getFirstYakumanYaku } from '@/components/mahjong-result/functions/getFirstYakumanYaku';

import type { MahjongYakuKind } from '@/objects';

import {
  isAbortiveDrawAction,
  isRiichiAction,
  isWinningAction,
  getOperationText,
} from '../../../functions/getReplayOperations';
import { getPlayerSeat } from '../../../functions/getReplayPlayers';
import type {
  ActiveOperation,
  YakumanTileBurstView,
  WinningCallFlashView,
} from '../objects/PaifuOverlayViews';
import {
  getOperationFlashDurationMs,
  getWinningCallLabel,
  getYakumanBurstTilesForPaifuAction,
  riichiCallVisibleMs,
  winningCallAnimationMs,
  winningCallRevealDelayMs,
  winningCallVisibleMs,
  yakumanTileBurstSettleDelayMs,
  yakumanTileBurstVisibleMs,
} from '../functions/getPaifuOperationFlash';

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
      const resultWin = getResultWinForActor(
        round.result,
        action.actor ?? undefined,
      );
      const yakumanYaku = resultWin
        ? getFirstYakumanYaku(getWinYaku(round.result, resultWin))
        : undefined;
      const yakumanTiles = getYakumanBurstTilesForPaifuAction({
        action,
        resultWin,
        round,
      });
      setRevealedWinningPlayerId(action.actor ?? undefined);
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
              featuredTile: action.tile ?? undefined,
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
