import type {
  PaifuAction,
  PaifuRoundSummary,
} from '../../../../types';
import { useEffect, useState } from 'react';
import { getMahjongYakuLabel } from '@/objects';
import type { MahjongResultWinLike } from '@/pages/shared/mahjongResultSequence';
import {
  advanceResultSequenceStep,
  getResultSequenceStep,
  getWinYaku,
  isNagashiManganWin,
} from '@/pages/shared/mahjongResultSequence';
import {
  formatPoints,
  formatYakuValue,
  getDoraIndicators,
  getReplaySnapshot,
  getVisibleDoraIndicatorCount,
  removeFirstTile,
} from '../../../../functions/getReplay';
import { ResultTile } from '../TileViews';
import { IndicatorPanel, WinningTile } from './WinningResultIndicators';

export function WinningResultOverlay({
  action,
  onConfirm,
  playerNames,
  replaySnapshot,
  replayStep,
  round,
}: {
  action?: PaifuAction;
  onConfirm: () => void;
  playerNames: Record<string, string>;
  replaySnapshot: ReturnType<typeof getReplaySnapshot>;
  replayStep: number;
  round: PaifuRoundSummary;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const sequenceResult =
    round.result.winner || round.result.wins?.length
      ? round.result
      : { ...round.result, winner: action?.actor };
  const step = getResultSequenceStep(sequenceResult, stepIndex);
  const resultWin = step?.kind === 'win' ? step.win : undefined;
  const winnerId = resultWin?.winner ?? round.result.winner ?? action?.actor;
  const winningTile = action?.tile;
  const winLabel = getWinLabel(round, resultWin);

  useEffect(() => {
    setStepIndex(0);
  }, [action?.sequenceNo, round]);

  if (!action || !step) {
    return null;
  }

  if (step.kind === 'score') {
    return (
      <button
        className="absolute inset-[34px] z-[20] grid rounded-[28px] bg-[rgba(0,0,0,0.84)] p-8 text-left text-[#f2f7fb] shadow-[0_30px_90px_rgba(0,0,0,0.58)]"
        onClick={onConfirm}
        type="button"
      >
        <div className="grid h-full grid-rows-[auto_1fr_auto] gap-6">
          <div className="grid justify-items-center gap-3">
            <span className="rounded-xl border border-[rgba(236,197,122,0.38)] bg-[rgba(236,197,122,0.14)] px-4 py-1 text-sm font-bold tracking-[0.2em] text-[#ffd98a]">
              点数结算
            </span>
            <strong className="max-w-full truncate text-2xl text-[#f2f7fb]">
              本局总点数
            </strong>
          </div>
          <ScoreSettlementPanel playerNames={playerNames} round={round} />
          <span className="justify-self-end rounded-2xl border border-[rgba(236,197,122,0.46)] bg-[rgba(236,197,122,0.16)] px-8 py-2 text-base font-semibold text-[#ffd98a]">
            {'\u786e\u8ba4'}
          </span>
        </div>
      </button>
    );
  }

  if (!winnerId) {
    return null;
  }

  const winnerHand =
    replaySnapshot.hands[winnerId] ?? round.initialHands[winnerId] ?? [];
  const displayHand = winningTile
    ? removeFirstTile(winnerHand, winningTile)
    : winnerHand;
  const doraIndicators =
    resultWin?.doraIndicators ??
    round.result.doraIndicators ??
    getDoraIndicators(round, replayStep);
  const doraIndicatorCount = getVisibleDoraIndicatorCount(round, replayStep);
  const uraDoraIndicators =
    resultWin?.uraDoraIndicators ?? round.result.uraDoraIndicators ?? [];
  const uraDoraVisible =
    resultWin?.uraDoraVisible ?? round.result.uraDoraVisible ?? false;
  const yakuList = resultWin ? getWinYaku(sequenceResult, resultWin) : round.result.yaku;
  const pointText =
    typeof resultWin?.han === 'number' && typeof resultWin?.fu === 'number'
      ? `${formatPoints(resultWin.points)} / ${resultWin.han}番${resultWin.fu}符`
      : formatPoints(resultWin?.points ?? round.result.points);
  const advanceStep = () => {
    setStepIndex((current) => advanceResultSequenceStep(sequenceResult, current));
  };

  return (
    <div
      className="absolute inset-[34px] z-[20] grid rounded-[28px] bg-[rgba(0,0,0,0.84)] p-8 text-left text-[#f2f7fb] shadow-[0_30px_90px_rgba(0,0,0,0.58)]"
      onClick={advanceStep}
      onKeyDown={(event) => {
        if (event.key !== 'Enter' && event.key !== ' ') {
          return;
        }

        event.preventDefault();
        advanceStep();
      }}
      role="button"
      tabIndex={0}
    >
      <div className="grid h-full grid-rows-[auto_1fr_auto] gap-6">
        <div className="grid justify-items-center gap-3">
          <span className="rounded-xl border border-[rgba(236,197,122,0.38)] bg-[rgba(236,197,122,0.14)] px-4 py-1 text-sm font-bold tracking-[0.2em] text-[#ffd98a]">
            {winLabel}
          </span>
          <strong className="max-w-full truncate text-2xl text-[#f2f7fb]">
            {getPlayerName(winnerId, playerNames)}
          </strong>
          {resultWin?.target ? (
            <span className="text-sm font-semibold text-[#c7d6e2]">
              放铳：{getPlayerName(resultWin.target, playerNames)}
              {step.totalWinCount > 1 ? ` / ${step.index + 1}/${step.totalWinCount}` : ''}
            </span>
          ) : step.totalWinCount > 1 ? (
            <span className="text-sm font-semibold text-[#c7d6e2]">
              {step.index + 1}/{step.totalWinCount}
            </span>
          ) : null}
        </div>
        <div className="flex items-end justify-center gap-0">
          {displayHand.map((tile, index) => (
            <ResultTile
              key={`${winnerId}-result-${tile}-${index}`}
              tile={tile}
            />
          ))}
          {winningTile ? (
            <WinningTile label={winLabel} tile={winningTile} />
          ) : null}
        </div>

        <div className="mx-auto grid w-[min(680px,88%)] content-start gap-3 self-start">
          <div className="mb-2 flex justify-center gap-3">
            <IndicatorPanel
              label={'\u8868\u5b9d\u724c'}
              shownCount={doraIndicatorCount}
              tiles={doraIndicators}
            />
            <IndicatorPanel
              label={'\u91cc\u5b9d\u724c'}
              shownCount={doraIndicatorCount}
              tiles={uraDoraIndicators}
              visible={uraDoraVisible}
            />
          </div>
          {yakuList.map((yaku, index) => (
            <div
              key={`${yaku.kind}-${yaku.han}-${index}`}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center border-b border-[rgba(255,255,255,0.16)] py-3 text-xl"
            >
              <span>{getMahjongYakuLabel(yaku.kind)}</span>
              <span className="text-[#ffd98a]">
                {formatYakuValue(yaku.han)}
              </span>
            </div>
          ))}
        </div>

        <div className="grid justify-items-end gap-4 self-end pb-1">
          <div className="text-right">
            <span className="block text-sm uppercase tracking-[0.2em] text-[#9ab0c1]">
              {'\u70b9\u6570'}
            </span>
            <strong className="text-[2rem] text-[#ffd98a]">
              {pointText}
            </strong>
          </div>
          <button
            className="min-h-[42px] rounded-2xl border border-[rgba(236,197,122,0.46)] bg-[rgba(236,197,122,0.16)] px-8 py-2 text-base font-semibold text-[#ffd98a]"
            onClick={(event) => {
              event.stopPropagation();
              advanceStep();
            }}
            type="button"
          >
            继续
          </button>
        </div>
      </div>
    </div>
  );
}

function getWinLabel(
  round: PaifuRoundSummary,
  win?: MahjongResultWinLike,
) {
  if (win && isNagashiManganWin(win)) {
    return '流局满贯';
  }

  return round.result.outcome === 'Tsumo' ? '\u81ea\u6478' : '\u8363\u548c';
}

function ScoreSettlementPanel({
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
          <span className={change.delta >= 0 ? 'text-[#57e38d]' : 'text-[#ff6d6d]'}>
            {formatDelta(change.delta)}
          </span>
        </div>
      ))}
    </div>
  );
}

function getPlayerName(playerId: string, playerNames: Record<string, string>) {
  return playerNames[playerId] ?? playerId;
}

function formatDelta(value: number) {
  if (value > 0) {
    return `+${formatPoints(value)}`;
  }

  if (value < 0) {
    return `-${formatPoints(Math.abs(value))}`;
  }

  return '+0';
}
