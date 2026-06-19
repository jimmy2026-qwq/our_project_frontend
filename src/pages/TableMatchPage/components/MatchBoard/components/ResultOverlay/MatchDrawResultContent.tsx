import type { AgariResult } from '@/objects';

import { ResultFooter } from './MatchResultSettlementPanels';
import { getDrawLabel, getPlayerName } from '../../functions/getMatchResultText';

export function DrawResultContent({
  nextLabel,
  onAdvance,
  playerNames,
  result,
}: {
  nextLabel: string;
  onAdvance: () => void;
  playerNames: Record<string, string>;
  result: AgariResult;
}) {
  const tenpaiPlayerIds = result.tenpaiPlayerIds ?? [];

  return (
    <div className="grid h-full grid-rows-[1fr_auto] gap-6">
      <div className="grid content-center justify-items-center gap-5">
        <span className="rounded-xl border border-[rgba(214,162,255,0.38)] bg-[rgba(148,77,255,0.16)] px-4 py-1 text-sm font-bold tracking-[0.2em] text-[#d6a2ff]">
          {getDrawLabel(result.outcome)}
        </span>
        {result.outcome === 'ExhaustiveDraw' ? (
          <div className="grid justify-items-center gap-3">
            <strong className="text-3xl font-bold tracking-[0.16em] text-[#d6a2ff] [text-shadow:0_2px_18px_rgba(148,77,255,0.72)]">
              荒牌流局
            </strong>
            <div className="flex flex-wrap justify-center gap-2 text-sm font-semibold text-[#c7d6e2]">
              {tenpaiPlayerIds.length > 0 ? (
                tenpaiPlayerIds.map((playerId) => (
                  <span
                    key={playerId}
                    className="rounded-lg border border-[rgba(214,162,255,0.22)] bg-[rgba(255,255,255,0.08)] px-3 py-1"
                  >
                    听牌：{getPlayerName(playerId, playerNames)}
                  </span>
                ))
              ) : (
                <span>无人听牌</span>
              )}
            </div>
          </div>
        ) : (
          <strong className="text-3xl font-bold tracking-[0.16em] text-[#d6a2ff] [text-shadow:0_2px_18px_rgba(148,77,255,0.72)]">
            途中流局
          </strong>
        )}
      </div>

      <ResultFooter
        nextLabel={nextLabel}
        onAdvance={onAdvance}
        playerNames={playerNames}
        result={result}
      />
    </div>
  );
}
