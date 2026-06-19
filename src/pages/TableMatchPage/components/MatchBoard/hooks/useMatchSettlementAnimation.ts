import { useEffect, useRef } from 'react';
import {
  settlementAnimationDelayMs,
  settlementAnimationDurationMs,
} from '@/pages/TablePaifuPage/components/PaifuHandTable/functions/getPaifuHandTableReplay';

import { settlementAnimationStartDelayMs } from '../functions/matchBoardTiming';

interface UseMatchSettlementAnimationParams {
  canAdvanceAfterSettlement: boolean;
  isCurrentEastPlayer: boolean;
  onAdvanceRound: () => void | Promise<void>;
  resultKey: string | null;
  resultSequenceCompletedKey: string | null;
  setSettlementAnimatingKey: (value: string | null) => void;
  setSettlementProgress: (value: number | undefined) => void;
}

export function useMatchSettlementAnimation({
  canAdvanceAfterSettlement,
  isCurrentEastPlayer,
  onAdvanceRound,
  resultKey,
  resultSequenceCompletedKey,
  setSettlementAnimatingKey,
  setSettlementProgress,
}: UseMatchSettlementAnimationParams) {
  const advanceStartedKeyRef = useRef<string | null>(null);
  const settlementCompletedKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!resultKey) {
      advanceStartedKeyRef.current = null;
      return;
    }

    if (resultSequenceCompletedKey !== resultKey) {
      return;
    }

    if (settlementCompletedKeyRef.current === resultKey) {
      return;
    }

    let animationFrame = 0;
    const timer = window.setTimeout(() => {
      setSettlementAnimatingKey(resultKey);
      const startedAt = performance.now();

      const animate = (now: number) => {
        const elapsed = now - startedAt;
        const progress = Math.min(
          1,
          Math.max(0, elapsed - settlementAnimationDelayMs) /
            settlementAnimationDurationMs,
        );

        setSettlementProgress(progress);

        if (
          elapsed <
          settlementAnimationDelayMs + settlementAnimationDurationMs
        ) {
          animationFrame = window.requestAnimationFrame(animate);
          return;
        }

        setSettlementProgress(1);
        settlementCompletedKeyRef.current = resultKey;
        if (
          canAdvanceAfterSettlement &&
          isCurrentEastPlayer &&
          advanceStartedKeyRef.current !== resultKey
        ) {
          advanceStartedKeyRef.current = resultKey;
          void Promise.resolve(onAdvanceRound());
        }
      };

      animationFrame = window.requestAnimationFrame(animate);
    }, settlementAnimationStartDelayMs);

    return () => {
      window.clearTimeout(timer);
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, [
    onAdvanceRound,
    canAdvanceAfterSettlement,
    isCurrentEastPlayer,
    resultKey,
    resultSequenceCompletedKey,
    setSettlementAnimatingKey,
    setSettlementProgress,
  ]);
}
