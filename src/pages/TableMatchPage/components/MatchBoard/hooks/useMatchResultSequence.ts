import type { AgariResult, MahjongSeatView } from '@/objects';
import { useCallback, useEffect, useState } from 'react';

import { createMatchYakumanTileBurstData } from '../functions/getMatchBoardYakumanBurst';
import { resultRevealDelayMs, winningCallVisibleMs, yakumanTileBurstSettleDelayMs, yakumanTileBurstVisibleMs } from '../functions/matchBoardTiming';
import type { ResultSequencePlayback } from '../objects/ResultSequencePlayback';
import { useMatchSettlementAnimation } from './useMatchSettlementAnimation';

interface UseMatchResultSequenceParams {
  canAdvanceAfterSettlement: boolean;
  isCurrentEastPlayer: boolean;
  onAdvanceRound: () => void | Promise<void>;
  result: AgariResult | null;
  resultKey: string | null;
  seats: MahjongSeatView[];
  winResultNeedsSequence: boolean;
}

export function useMatchResultSequence({
  canAdvanceAfterSettlement,
  isCurrentEastPlayer,
  onAdvanceRound,
  result,
  resultKey,
  seats,
  winResultNeedsSequence,
}: UseMatchResultSequenceParams) {
  const [settlementAnimatingKey, setSettlementAnimatingKey] = useState<
    string | null
  >(null);
  const [settlementProgress, setSettlementProgress] = useState<
    number | undefined
  >(undefined);
  const [resultSequenceCompletedKey, setResultSequenceCompletedKey] = useState<
    string | null
  >(null);
  const [resultOverlayReadyKey, setResultOverlayReadyKey] = useState<
    string | null
  >(null);
  const [resultHandRevealReadyKey, setResultHandRevealReadyKey] = useState<
    string | null
  >(null);
  const [resultWinningCallRemovedKey, setResultWinningCallRemovedKey] =
    useState<string | null>(null);
  const [resultYakumanBurstActiveKey, setResultYakumanBurstActiveKey] =
    useState<string | null>(null);
  const [resultSequencePlayback, setResultSequencePlayback] =
    useState<ResultSequencePlayback | null>(null);

  useMatchSettlementAnimation({
    canAdvanceAfterSettlement,
    isCurrentEastPlayer,
    onAdvanceRound,
    resultKey,
    resultSequenceCompletedKey,
    setSettlementAnimatingKey,
    setSettlementProgress,
  });

  useEffect(() => {
    if (!resultKey) {
      setSettlementAnimatingKey(null);
      setResultSequenceCompletedKey(null);
      setResultHandRevealReadyKey(null);
      setResultOverlayReadyKey(null);
      setResultWinningCallRemovedKey(null);
      setResultYakumanBurstActiveKey(null);
      setSettlementProgress(undefined);
      setResultSequencePlayback(null);
      return;
    }

    setSettlementAnimatingKey(null);
    setResultSequenceCompletedKey(null);
    setResultHandRevealReadyKey(null);
    setResultOverlayReadyKey(null);
    setResultWinningCallRemovedKey(null);
    setResultYakumanBurstActiveKey(null);
    setSettlementProgress(undefined);
  }, [resultKey]);

  useEffect(() => {
    if (!resultKey) {
      setResultSequencePlayback(null);
      return;
    }

    setResultSequencePlayback((currentPlayback) => {
      if (currentPlayback?.key === resultKey) {
        return currentPlayback;
      }

      return {
        key: resultKey,
        needsSequence: winResultNeedsSequence,
        hasYakumanBurst: Boolean(
          createMatchYakumanTileBurstData({ result, seats }),
        ),
      };
    });
  }, [result, resultKey, seats, winResultNeedsSequence]);

  useEffect(() => {
    if (!resultKey || resultSequencePlayback?.key !== resultKey) {
      return;
    }

    if (!resultSequencePlayback.needsSequence) {
      setResultHandRevealReadyKey(resultKey);
      setResultOverlayReadyKey(resultKey);
      setResultWinningCallRemovedKey(resultKey);
      setResultYakumanBurstActiveKey(null);
      return;
    }

    const hasYakumanBurst = resultSequencePlayback.hasYakumanBurst;

    setResultHandRevealReadyKey(resultKey);
    setResultOverlayReadyKey(null);
    setResultWinningCallRemovedKey(null);
    setResultYakumanBurstActiveKey(null);
    const flashTimer = window.setTimeout(() => {
      setResultWinningCallRemovedKey(resultKey);
    }, winningCallVisibleMs);
    const yakumanBurstStartTimer = hasYakumanBurst
      ? window.setTimeout(() => {
          setResultYakumanBurstActiveKey(resultKey);
        }, winningCallVisibleMs)
      : undefined;
    const yakumanBurstEndTimer = hasYakumanBurst
      ? window.setTimeout(() => {
          setResultYakumanBurstActiveKey((currentKey) =>
            currentKey === resultKey ? null : currentKey,
          );
        }, winningCallVisibleMs + yakumanTileBurstVisibleMs)
      : undefined;
    const overlayTimer = window.setTimeout(() => {
      setResultOverlayReadyKey(resultKey);
    }, hasYakumanBurst
      ? winningCallVisibleMs +
          yakumanTileBurstVisibleMs +
          yakumanTileBurstSettleDelayMs
      : resultRevealDelayMs);

    return () => {
      window.clearTimeout(flashTimer);
      if (yakumanBurstStartTimer) {
        window.clearTimeout(yakumanBurstStartTimer);
      }
      if (yakumanBurstEndTimer) {
        window.clearTimeout(yakumanBurstEndTimer);
      }
      window.clearTimeout(overlayTimer);
    };
  }, [resultKey, resultSequencePlayback]);

  const completeResultSequence = useCallback(() => {
    if (resultKey) {
      setResultSequenceCompletedKey(resultKey);
    }
  }, [resultKey]);

  return {
    completeResultSequence,
    resultHandRevealReadyKey,
    resultOverlayReadyKey,
    resultSequenceCompletedKey,
    resultWinningCallRemovedKey,
    resultYakumanBurstActiveKey,
    settlementAnimatingKey,
    settlementProgress,
  };
}
