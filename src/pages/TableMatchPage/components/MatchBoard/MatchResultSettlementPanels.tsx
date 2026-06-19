import type { AgariResult } from '@/objects';
import type { MahjongResultWinLike } from '@/components/mahjong-result/functions/getMahjongResultSequence';
import {
  getResultWins,
  getWinYaku,
  isWinOutcome,
} from '@/components/mahjong-result/functions/getMahjongResultSequence';
import { formatPoints } from '@/pages/TablePaifuPage/functions/getReplay';

import {
  formatDelta,
  formatWinPointText,
  getPlayerName,
} from './functions/getMatchResultText';
import { ResultStepButton } from './MatchResultStepButton';

export function ResultFooter({
  nextLabel,
  onAdvance,
  playerNames,
  result,
  wins = getResultWins(result),
}: {
  nextLabel: string;
  onAdvance: () => void;
  playerNames: Record<string, string>;
  result: AgariResult;
  wins?: MahjongResultWinLike[];
}) {
  const primaryWin = wins[0];
  const pointText =
    wins.length > 1
      ? formatPoints(result.points)
      : primaryWin
        ? formatWinPointText({
            fu: primaryWin.fu,
            han: primaryWin.han,
            points: primaryWin.points,
            yaku: getWinYaku(result, primaryWin),
          })
        : formatPoints(result.points);

  return (
    <div className="flex flex-wrap items-end justify-between gap-4 self-end pb-1">
      <div className="grid gap-1 text-sm font-semibold text-[#c7d6e2]">
        {result.scoreChanges.map((change) => (
          <span key={change.playerId}>
            {getPlayerName(change.playerId, playerNames)}
            <span
              className={
                change.delta >= 0 ? 'text-[#57e38d]' : 'text-[#ff6d6d]'
              }
            >
              {' '}
              {formatDelta(change.delta)}
            </span>
          </span>
        ))}
      </div>

      {isWinOutcome(result.outcome) ? (
        <div className="grid justify-items-end gap-1 text-right">
          <span className="block text-sm uppercase tracking-[0.2em] text-[#9ab0c1]">
            {wins.length > 1 ? '合计点数' : '点数'}
          </span>
          <strong className="text-[2rem] text-[#ffd98a]">{pointText}</strong>
        </div>
      ) : null}

      <ResultStepButton label={nextLabel} onClick={onAdvance} />
    </div>
  );
}

export function ScoreSettlementPanel({
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
    <div className="mx-auto grid w-[min(680px,92%)] content-center gap-3">
      {result.scoreChanges.map((change) => (
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
      <ResultStepButton
        className="mt-4 justify-self-center"
        label={nextLabel}
        onClick={onAdvance}
      />
    </div>
  );
}
