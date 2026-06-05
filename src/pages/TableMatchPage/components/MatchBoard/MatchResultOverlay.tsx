import { useEffect, useMemo, useRef, useState } from 'react';
import type { AgariResult, MahjongSeatView } from '@/objects';
import { getMahjongYakuLabel } from '@/objects';
import type { MahjongResultWinLike } from '@/pages/shared/mahjongResultSequence';
import {
  getResultSequenceStep,
  getResultWins,
  getWinYaku,
  isNagashiManganWin,
  isWinOutcome,
} from '@/pages/shared/mahjongResultSequence';
import { WinningTile } from '@/pages/TablePaifuPage/components/PaifuHandTable/components/PaifuOverlays/WinningResultIndicators';
import { ResultTile } from '@/pages/TablePaifuPage/components/PaifuHandTable/components/TileViews';
import {
  formatPoints,
  formatYakuValue,
} from '@/pages/TablePaifuPage/functions/getReplay';

interface MatchResultOverlayProps {
  playerNames: Record<string, string>;
  result: AgariResult | null;
  seats: MahjongSeatView[];
  onComplete?: () => void;
}

export function MatchResultOverlay({
  onComplete,
  playerNames,
  result,
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

  useEffect(() => {
    if (!hasResult) {
      return;
    }

    const timer = window.setTimeout(
      () => {
        if (isScoreStep) {
          if (!completedRef.current) {
            completedRef.current = true;
            onCompleteRef.current?.();
          }
          return;
        }

        setStepIndex((current) =>
          Math.min(current + 1, scoreStepIndex),
        );
      },
      isScoreStep ? scoreStepDisplayMs : resultDetailDisplayMs,
    );

    return () => {
      window.clearTimeout(timer);
    };
  }, [hasResult, isScoreStep, resultResetKey, scoreStepIndex, stepIndex]);

  if (!result) {
    return null;
  }

  return (
    <div
      className="absolute inset-[34px] z-[24] grid rounded-[28px] bg-[rgba(0,0,0,0.84)] p-8 text-[#f2f7fb] shadow-[0_30px_90px_rgba(0,0,0,0.58)]"
    >
      {isScoreStep ? (
        <ScoreResultContent playerNames={playerNames} result={result} />
      ) : step ? (
        <WinningResultContent
          playerNames={playerNames}
          result={result}
          seats={seats}
          step={step}
        />
      ) : (
        <DrawResultContent playerNames={playerNames} result={result} />
      )}
    </div>
  );
}

const resultDetailDisplayMs = 2000;
const scoreStepDisplayMs = 1000;

function getOverlayResultKey(result: AgariResult | null) {
  if (!result) {
    return 'none';
  }

  return [
    result.outcome,
    result.winner ?? '',
    result.target ?? '',
    result.points,
    (result.wins ?? [])
      .map((win) => `${win.winner}:${win.target ?? ''}:${win.points}`)
      .join('|'),
    result.scoreChanges
      .map((change) => `${change.playerId}:${change.delta}`)
      .join('|'),
  ].join(':');
}

function WinningResultContent({
  playerNames,
  result,
  seats,
  step,
}: {
  playerNames: Record<string, string>;
  result: AgariResult;
  seats: MahjongSeatView[];
  step: NonNullable<ReturnType<typeof getResultSequenceStep>>;
}) {
  const headline = getWinHeadline(result, step, playerNames);

  if (step.kind === 'win') {
    return (
      <div className="grid h-full grid-rows-[minmax(0,1fr)_auto] gap-6">
        <SingleWinPanel
          headline={headline}
          result={result}
          seats={seats}
          win={step.win}
        />
      </div>
    );
  }

  return (
    <div className="grid h-full grid-rows-[auto_1fr] gap-6">
      <div className="grid justify-items-center gap-3">
        <span className="rounded-xl border border-[rgba(236,197,122,0.38)] bg-[rgba(236,197,122,0.14)] px-4 py-1 text-sm font-bold tracking-[0.2em] text-[#ffd98a]">
          {headline.badge}
        </span>
        <strong className="max-w-full truncate text-2xl text-[#f2f7fb]">
          {headline.title}
        </strong>
        {headline.subtitle ? (
          <span className="text-sm font-semibold text-[#c7d6e2]">
            {headline.subtitle}
          </span>
        ) : null}
      </div>

      <div className="grid content-center gap-5 overflow-auto">
        <ScoreSettlementPanel playerNames={playerNames} result={result} />
      </div>
    </div>
  );
}

function ScoreResultContent({
  playerNames,
  result,
}: {
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
        <ScoreSettlementPanel playerNames={playerNames} result={result} />
      </div>
    </div>
  );
}

function SingleWinPanel({
  headline,
  result,
  seats,
  win,
}: {
  headline: ReturnType<typeof getWinHeadline>;
  result: AgariResult;
  seats: MahjongSeatView[];
  win: MahjongResultWinLike;
}) {
  const winnerSeat = seats.find((seat) => seat.playerId === win.winner);
  const winnerHand = winnerSeat?.handTiles ?? [];
  const winnerMelds = winnerSeat?.melds ?? [];
  const targetId = win.target ?? result.target;
  const isNagashiMangan = isNagashiManganWin(win);
  const winningTile =
    isNagashiMangan
      ? undefined
      : targetId && result.scoreChanges.length > 0
        ? findWinningTileFromTarget(seats, targetId)
        : winnerHand[winnerHand.length - 1];
  const displayHand = getResultDisplayHand({
    result,
    tile: winningTile,
    winnerHand,
  });
  const winLabel = getWinLabel(result, win);
  const yakuList = getWinYaku(result, win);
  const pointText =
    typeof win.han === 'number' && typeof win.fu === 'number'
      ? `${formatPoints(win.points)} / ${win.han}番${win.fu}符`
      : formatPoints(win.points);

  return (
    <>
      <div className="grid content-start gap-5 overflow-auto">
        <div className="flex items-end justify-center gap-0">
          {displayHand.map((tile, index) => (
            <ResultTile key={`${win.winner}-result-${tile}-${index}`} tile={tile} />
          ))}
          {winnerMelds.length > 0 ? (
            <div className="ml-6 flex items-end gap-3 border-l border-[rgba(255,255,255,0.18)] pl-5">
              {winnerMelds.map((meld, meldIndex) => (
                <div
                  key={`${win.winner}-result-meld-${meld.meldType}-${meldIndex}`}
                  className="flex items-end gap-0"
                >
                  {(meld.tiles ?? []).map((tile, tileIndex) => (
                    <ResultTile
                      key={`${win.winner}-result-meld-${meldIndex}-${tile}-${tileIndex}`}
                      tile={tile}
                    />
                  ))}
                </div>
              ))}
            </div>
          ) : null}
          {winningTile ? <WinningTile label={winLabel} tile={winningTile} /> : null}
        </div>

        {yakuList.length > 0 ? (
          <YakuList className="mx-auto w-[min(680px,88%)]" yaku={yakuList} />
        ) : null}
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4 self-end pb-1">
        <WinHeadlinePanel headline={headline} />
        <div className="grid justify-items-end gap-1 justify-self-end text-right">
          <span className="block text-sm uppercase tracking-[0.2em] text-[#9ab0c1]">
            点数
          </span>
          <strong className="text-[2rem] text-[#ffd98a]">{pointText}</strong>
        </div>
      </div>
    </>
  );
}

function WinHeadlinePanel({
  headline,
}: {
  headline: ReturnType<typeof getWinHeadline>;
}) {
  return (
    <div className="grid max-w-[min(360px,58%)] justify-items-start gap-2 text-left">
      <span className="rounded-xl border border-[rgba(236,197,122,0.38)] bg-[rgba(236,197,122,0.14)] px-4 py-1 text-sm font-bold tracking-[0.2em] text-[#ffd98a]">
        {headline.badge}
      </span>
      <strong className="max-w-full truncate text-2xl text-[#f2f7fb]">
        {headline.title}
      </strong>
      {headline.subtitle ? (
        <span className="max-w-full truncate text-sm font-semibold text-[#c7d6e2]">
          {headline.subtitle}
        </span>
      ) : null}
    </div>
  );
}

function YakuList({
  className,
  compact = false,
  yaku,
}: {
  className?: string;
  compact?: boolean;
  yaku: MahjongResultWinLike['yaku'];
}) {
  return (
    <div className={`grid content-start gap-3 ${className ?? ''}`}>
      {yaku.map((item, index) => (
        <div
          key={`${item.kind}-${item.han}-${index}`}
          className={`grid grid-cols-[minmax(0,1fr)_auto] items-center border-b border-[rgba(255,255,255,0.16)] ${
            compact ? 'py-2 text-sm' : 'py-3 text-xl'
          }`}
        >
          <span>{getMahjongYakuLabel(item.kind)}</span>
          <span className="text-[#ffd98a]">{formatYakuValue(item.han)}</span>
        </div>
      ))}
    </div>
  );
}

function DrawResultContent({
  playerNames,
  result,
}: {
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

      <ResultFooter playerNames={playerNames} result={result} />
    </div>
  );
}

function ResultFooter({
  playerNames,
  result,
  wins = getResultWins(result),
}: {
  playerNames: Record<string, string>;
  result: AgariResult;
  wins?: MahjongResultWinLike[];
}) {
  const primaryWin = wins[0];
  const pointText =
    wins.length > 1
      ? formatPoints(result.points)
      : `${formatPoints(primaryWin?.points ?? result.points)}${
          typeof primaryWin?.han === 'number' && typeof primaryWin?.fu === 'number'
            ? ` / ${primaryWin.han}番${primaryWin.fu}符`
            : ''
        }`;

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
          <strong className="text-[2rem] text-[#ffd98a]">
            {pointText}
          </strong>
        </div>
      ) : null}
    </div>
  );
}

function getDrawLabel(outcome: string) {
  if (outcome === 'ExhaustiveDraw') {
    return '流局结算';
  }

  return '本局结束';
}

function getWinHeadline(
  result: AgariResult,
  step: NonNullable<ReturnType<typeof getResultSequenceStep>>,
  playerNames: Record<string, string>,
) {
  if (step.kind === 'score') {
    return {
      badge: '点数结算',
      title: '本局总点数',
      subtitle: undefined,
    };
  }

  const wins = getResultWins(result);
  const win = step.win;

  if (isNagashiManganWin(win)) {
    return {
      badge: '流局满贯',
      title: getPlayerName(win.winner, playerNames),
      subtitle: getStepSubtitle(step),
    };
  }

  const multipleRonLabel =
    result.outcome === 'Ron' && wins.length >= 3
      ? '三家荣和'
      : result.outcome === 'Ron' && wins.length === 2
        ? '双响'
        : getWinLabel(result, win);

  const subtitleParts = [
    getStepSubtitle(step),
    win.target ? `放铳：${getPlayerName(win.target, playerNames)}` : undefined,
  ].filter(Boolean);

  return {
    badge: multipleRonLabel,
    title: getPlayerName(win.winner, playerNames),
    subtitle: subtitleParts.join(' / ') || undefined,
  };
}

function getWinLabel(result: AgariResult, win: MahjongResultWinLike) {
  if (isNagashiManganWin(win)) {
    return '流局满贯';
  }

  return result.outcome === 'Tsumo' ? '自摸' : '荣和';
}

function getStepSubtitle(step: NonNullable<ReturnType<typeof getResultSequenceStep>>) {
  if (step.totalWinCount <= 1 || step.kind !== 'win') {
    return undefined;
  }

  return `${step.index + 1}/${step.totalWinCount}`;
}

function getPlayerName(playerId: string, playerNames: Record<string, string>) {
  return playerNames[playerId] ?? playerId;
}

function ScoreSettlementPanel({
  playerNames,
  result,
}: {
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
          <span className={change.delta >= 0 ? 'text-[#57e38d]' : 'text-[#ff6d6d]'}>
            {formatDelta(change.delta)}
          </span>
        </div>
      ))}
    </div>
  );
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

function removeFirstTile(tiles: string[], tile: string) {
  let removed = false;

  return tiles.filter((item) => {
    if (!removed && item === tile) {
      removed = true;
      return false;
    }

    return true;
  });
}

function getResultDisplayHand({
  result,
  tile,
  winnerHand,
}: {
  result: AgariResult;
  tile?: string;
  winnerHand: string[];
}) {
  if (result.outcome === 'Tsumo' && tile) {
    return removeFirstTile(winnerHand, tile);
  }

  return winnerHand;
}

function findWinningTileFromTarget(seats: MahjongSeatView[], target: string) {
  const targetSeat = seats.find((seat) => seat.playerId === target);

  return targetSeat?.river?.[targetSeat.river.length - 1]?.tile;
}
