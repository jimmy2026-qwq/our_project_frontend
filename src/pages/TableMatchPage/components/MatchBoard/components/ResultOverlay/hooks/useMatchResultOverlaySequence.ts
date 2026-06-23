import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { AgariResult } from '@/objects';
import { getResultSequenceStep, getResultWins, isWinOutcome } from '@/components/mahjong-result/functions/getMahjongResultSequence';

import { getOverlayResultKey } from '../../../functions/getMatchResultOverlayKey';

interface UseMatchResultOverlaySequenceOptions {
  result: AgariResult | null;
  onComplete?: () => void;
  scoreStepActionLabel: string;
}

export function useMatchResultOverlaySequence({
  onComplete,
  result,
  scoreStepActionLabel,
}: UseMatchResultOverlaySequenceOptions) {
  const [stepIndex, setStepIndex] = useState(0);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const hasResult = Boolean(result);
  const resultResetKey = getOverlayResultKey(result);
  const scoreStepIndex = useMemo(
    () =>
      result && isWinOutcome(result.outcome) ? getResultWins(result).length : 1,
    [result, resultResetKey],
  );

  useEffect(() => {
    setStepIndex(0);
    completedRef.current = false;
  }, [resultResetKey]);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const step = result ? getResultSequenceStep(result, stepIndex) : null;
  const isScoreStep =
    Boolean(result) &&
    (step?.kind === 'score' || (!step && stepIndex >= scoreStepIndex));
  const nextLabel = isScoreStep ? scoreStepActionLabel : '继续';

  const advanceStep = useCallback(() => {
    if (!hasResult) {
      return;
    }

    if (isScoreStep) {
      if (!completedRef.current) {
        completedRef.current = true;
        onCompleteRef.current?.();
      }
      return;
    }

    setStepIndex((current) => Math.min(current + 1, scoreStepIndex));
  }, [hasResult, isScoreStep, scoreStepIndex]);

  useEffect(() => {
    if (!hasResult) {
      return;
    }

    const timer = window.setTimeout(
      advanceStep,
      isScoreStep ? scoreStepDisplayMs : resultDetailDisplayMs,
    );

    return () => {
      window.clearTimeout(timer);
    };
  }, [advanceStep, hasResult, isScoreStep, resultResetKey, stepIndex]);

  return {
    advanceStep,
    isScoreStep,
    nextLabel,
    step,
  };
}

const resultDetailDisplayMs = 2000;
const scoreStepDisplayMs = 2000;
