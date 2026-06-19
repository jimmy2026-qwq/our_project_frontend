import type { AgariResult, MahjongSeatView } from '@/objects';

import { DrawResultContent } from './MatchDrawResultContent';
import { ScoreResultContent } from './MatchScoreResultContent';
import { WinningResultContent } from './MatchWinningResultContent';
import { useMatchResultOverlaySequence } from './hooks/useMatchResultOverlaySequence';

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
  const { advanceStep, isScoreStep, nextLabel, step } =
    useMatchResultOverlaySequence({
      onComplete,
      result,
      scoreStepActionLabel,
    });

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
