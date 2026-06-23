import { HandOutcome, type AgariResult } from '@/objects';
import type { MahjongResultWinLike } from '@/components/mahjong-result/functions/getMahjongResultSequence';
import { getResultSequenceStep, getResultWins, isNagashiManganWin } from '@/components/mahjong-result/functions/getMahjongResultSequence';
import { formatPoints } from '@/pages/TablePaifuPage/functions/getReplayCore';

type ResultSequenceStep = NonNullable<ReturnType<typeof getResultSequenceStep>>;

export function getDrawLabel(outcome: string) {
  return outcome === HandOutcome.ExhaustiveDraw ? '流局结算' : '本局结束';
}

export function getWinHeadline(
  result: AgariResult,
  step: ResultSequenceStep,
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
    result.outcome === HandOutcome.Ron && wins.length >= 3
      ? '三家荣和'
      : result.outcome === HandOutcome.Ron && wins.length === 2
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

export function getWinLabel(
  result: AgariResult,
  win: MahjongResultWinLike,
) {
  if (isNagashiManganWin(win)) {
    return '流局满贯';
  }

  return result.outcome === HandOutcome.Tsumo ? '自摸' : '荣和';
}

export function getPlayerName(
  playerId: string,
  playerNames: Record<string, string>,
) {
  return playerNames[playerId] ?? playerId;
}

export function formatDelta(value: number) {
  if (value > 0) {
    return `+${formatPoints(value)}`;
  }

  if (value < 0) {
    return `-${formatPoints(Math.abs(value))}`;
  }

  return '+0';
}

export function formatWinPointText({
  fu,
  han,
  points,
  yaku,
}: {
  fu?: number | null;
  han?: number | null;
  points: number;
  yaku: MahjongResultWinLike['yaku'];
}) {
  if (typeof han === 'number' && yaku.some((item) => item.han >= 13)) {
    return `${formatPoints(points)} / ${formatYakumanMultiplier(han)}`;
  }

  return typeof han === 'number' && typeof fu === 'number'
    ? `${formatPoints(points)} / ${han}番${fu}符`
    : formatPoints(points);
}

function getStepSubtitle(step: ResultSequenceStep) {
  if (step.totalWinCount <= 1 || step.kind !== 'win') {
    return undefined;
  }

  return `${step.index + 1}/${step.totalWinCount}`;
}

function formatYakumanMultiplier(han: number) {
  const multiplier = Math.max(1, Math.min(9, Math.floor(han / 13)));
  const labels = [
    '役满',
    '两倍役满',
    '三倍役满',
    '四倍役满',
    '五倍役满',
    '六倍役满',
    '七倍役满',
    '八倍役满',
    '九倍役满',
  ];

  return labels[multiplier - 1];
}
