import type { AgariResult } from '@/objects';

import { ScoreSettlementPanel } from './MatchResultSettlementPanels';

export function ScoreResultContent({
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
  return (
    <div className="grid h-full grid-rows-[auto_1fr] gap-6">
      <div className="grid justify-items-center gap-3">
        <span className="rounded-xl border border-[rgba(236,197,122,0.38)] bg-[rgba(236,197,122,0.14)] px-4 py-1 text-sm font-bold tracking-[0.2em] text-[#ffd98a]">
          点数结算
        </span>
        <strong className="max-w-full truncate text-2xl text-[#f2f7fb]">
          本局总点数
        </strong>
      </div>

      <div className="grid content-center gap-5 overflow-auto">
        <ScoreSettlementPanel
          nextLabel={nextLabel}
          onAdvance={onAdvance}
          playerNames={playerNames}
          result={result}
        />
      </div>
    </div>
  );
}
