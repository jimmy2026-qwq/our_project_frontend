import type { MahjongResultWinLike } from '@/components/mahjong-result/functions/getMahjongResultSequence';
import { isNagashiManganWin } from '@/components/mahjong-result/functions/getMahjongResultSequence';

import { HandOutcome, type PaifuRound as PaifuRoundSummary } from '@/objects';
import { formatPoints } from '../../../functions/getReplayCore';

export function getWinLabel(
  round: PaifuRoundSummary,
  win?: MahjongResultWinLike,
) {
  if (win && isNagashiManganWin(win)) {
    return '流局满贯';
  }

  return round.result.outcome === HandOutcome.Tsumo ? '自摸' : '荣和';
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
