import { useCallback, useEffect, useRef, useState } from 'react';

import type { PaifuRoundSummary } from '../../../types';
import {
  isScoreSettlementRound,
  settlementAnimationDelayMs,
  settlementAnimationDurationMs,
} from '../objects/PaifuHandTableReplay.helpers';

export function usePaifuSettlementAnimation({
  hasRoundScoreDelta,
  isExhaustiveDrawResult,
  maxReplayStep,
  replayStep,
  round,
}: {
  hasRoundScoreDelta: boolean;
  isExhaustiveDrawResult: boolean;
  maxReplayStep: number;
  replayStep: number;
  round: PaifuRoundSummary;
}) {
  const [settlementProgress, setSettlementProgress] = useState<
    number | undefined
  >(undefined);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const stopSettlementAnimation = useCallback(() => {
    if (animationFrameRef.current !== undefined) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }
  }, []);
  const startSettlementAnimation = useCallback(() => {
    if (!isScoreSettlementRound(round) || !hasRoundScoreDelta) {
      return;
    }

    stopSettlementAnimation();
    setSettlementProgress(0);

    const startedAt = window.performance.now();
    const animate = (now: number) => {
      const elapsed = now - startedAt;
      const progress = Math.min(
        1,
        Math.max(0, elapsed - settlementAnimationDelayMs) /
          settlementAnimationDurationMs,
      );

      setSettlementProgress(progress);

      if (elapsed < settlementAnimationDelayMs + settlementAnimationDurationMs) {
        animationFrameRef.current = window.requestAnimationFrame(animate);
      } else {
        animationFrameRef.current = undefined;
      }
    };

    animationFrameRef.current = window.requestAnimationFrame(animate);
  }, [hasRoundScoreDelta, round, stopSettlementAnimation]);

  useEffect(() => {
    stopSettlementAnimation();
    setSettlementProgress(undefined);
  }, [round, stopSettlementAnimation]);

  useEffect(() => () => stopSettlementAnimation(), [stopSettlementAnimation]);

  useEffect(() => {
    const shouldKeepSettlement =
      (round.result.outcome === 'ExhaustiveDraw' && isExhaustiveDrawResult) ||
      ((round.result.outcome === 'Ron' || round.result.outcome === 'Tsumo') &&
        settlementProgress !== undefined &&
        replayStep >= maxReplayStep);

    if (!shouldKeepSettlement && settlementProgress !== undefined) {
      stopSettlementAnimation();
      setSettlementProgress(undefined);
    }
  }, [
    isExhaustiveDrawResult,
    maxReplayStep,
    replayStep,
    round.result.outcome,
    settlementProgress,
    stopSettlementAnimation,
  ]);

  useEffect(() => {
    if (
      round.result.outcome === 'ExhaustiveDraw' &&
      isExhaustiveDrawResult &&
      settlementProgress === undefined
    ) {
      startSettlementAnimation();
    }
  }, [
    isExhaustiveDrawResult,
    round.result.outcome,
    settlementProgress,
    startSettlementAnimation,
  ]);

  return { settlementProgress, startSettlementAnimation };
}
