import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { AgariResult, MahjongSeatView } from '@/objects';
import {
  getResultSequenceStep,
  getResultWins,
  isWinOutcome,
} from '@/components/mahjong-result/functions/getMahjongResultSequence';

import { DrawResultContent } from './MatchDrawResultContent';
import { ScoreResultContent } from './MatchScoreResultContent';
import { WinningResultContent } from './MatchWinningResultContent';
import { getOverlayResultKey } from './functions/getMatchResultOverlayKey';

interface MatchResultOverlayProps {
  playerNames: Record<string, string>;
  result: AgariResult | null;
  seats: MahjongSeatView[];
  onComplete?: () => void;
  scoreStepActionLabel?: string;
}

export function MatchResultOverlay({
  onComplete,
  playerNames,
  result,
  scoreStepActionLabel = '进入下一局',
  seats,
}: MatchResultOverlayProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const hasResult = Boolean(result);
  const resultResetKey = getOverlayResultKey(result);
  const scoreStepIndex = useMemo(
    () => (result && isWinOutcome(result.outcome) ? getResultWins(result).length : 1),
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

  if (!result) {
    return null;
  }

  return (
    <div className="absolute inset-[34px] z-[24] grid rounded-[28px] bg-[rgba(0,0,0,0.84)] p-8 text-left text-[#f2f7fb] shadow-[0_30px_90px_rgba(0,0,0,0.58)]">
      {isScoreStep ? (
        <ScoreResultContent
          nextLabel={nextLabel}
          onAdvance={advanceStep}
          playerNames={playerNames}
          result={result}
        />
      ) : step ? (
        <WinningResultContent
          nextLabel={nextLabel}
          onAdvance={advanceStep}
          playerNames={playerNames}
          result={result}
          seats={seats}
          step={step}
        />
      ) : (
        <DrawResultContent
          nextLabel={nextLabel}
          onAdvance={advanceStep}
          playerNames={playerNames}
          result={result}
        />
      )}
    </div>
  );
}

const resultDetailDisplayMs = 2000;
const scoreStepDisplayMs = 2000;
