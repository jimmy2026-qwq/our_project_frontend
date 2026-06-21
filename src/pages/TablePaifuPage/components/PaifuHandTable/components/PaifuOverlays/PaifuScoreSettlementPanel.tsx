import type { PaifuRound as PaifuRoundSummary } from '@/objects';
import {
  formatDelta,
  getPlayerName,
} from '../../functions/getPaifuWinningResultText';

/** 牌谱结果覆盖层中的分数变化明细面板。 */
export function ScoreSettlementPanel({
  playerNames,
  round,
}: {
  playerNames: Record<string, string>;
  round: PaifuRoundSummary;
}) {
  return (
    <div className="mx-auto grid w-[min(680px,92%)] content-center gap-3">
      {round.result.scoreChanges.map((change) => (
        <div
          key={change.playerId}
          className="grid grid-cols-[minmax(0,1fr)_auto] items-center border-b border-[rgba(255,255,255,0.16)] py-4 text-2xl font-bold"
        >
          <span className="truncate text-[#f2f7fb]">
            {getPlayerName(change.playerId, playerNames)}
          </span>
          <span
            className={change.delta >= 0 ? 'text-[#57e38d]' : 'text-[#ff6d6d]'}
          >
            {formatDelta(change.delta)}
          </span>
        </div>
      ))}
    </div>
  );
}
