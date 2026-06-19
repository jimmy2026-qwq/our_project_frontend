import type { PaifuTile, ScoreChange, Yaku } from '@/objects';

export interface MahjongResultWinLike {
  winner: string;
  target?: string | null;
  han?: number | null;
  fu?: number | null;
  yaku: Yaku[];
  doraIndicators?: PaifuTile[] | null;
  uraDoraIndicators?: PaifuTile[] | null;
  uraDoraVisible?: boolean | null;
  points: number;
}

export interface MahjongResultLike {
  outcome: string;
  winner?: string | null;
  target?: string | null;
  han?: number | null;
  fu?: number | null;
  yaku: Yaku[];
  doraIndicators?: PaifuTile[] | null;
  uraDoraIndicators?: PaifuTile[] | null;
  uraDoraVisible?: boolean | null;
  points: number;
  scoreChanges: ScoreChange[];
  wins?: MahjongResultWinLike[] | null;
}

export type MahjongResultSequenceStep =
  | {
      kind: 'win';
      index: number;
      totalWinCount: number;
      win: MahjongResultWinLike;
    }
  | {
      kind: 'score';
      index: number;
      totalWinCount: number;
    };

export function isWinOutcome(outcome: string) {
  return outcome === 'Ron' || outcome === 'Tsumo';
}

export function getResultWins(result: MahjongResultLike): MahjongResultWinLike[] {
  if (result.wins?.length) {
    return result.wins;
  }

  if (!result.winner) {
    return [];
  }

  return [
    {
      winner: result.winner,
      target: result.target,
      han: result.han,
      fu: result.fu,
      yaku: result.yaku,
      doraIndicators: result.doraIndicators,
      uraDoraIndicators: result.uraDoraIndicators,
      uraDoraVisible: result.uraDoraVisible,
      points: result.points,
    },
  ];
}

export function getResultWinForActor(
  result: MahjongResultLike,
  actor?: string,
): MahjongResultWinLike | undefined {
  const wins = getResultWins(result);

  if (!wins.length) {
    return undefined;
  }

  return wins.find((win) => win.winner === actor) ?? wins[0];
}

export function getResultSequenceStep(
  result: MahjongResultLike,
  stepIndex: number,
): MahjongResultSequenceStep | null {
  const wins = getResultWins(result);

  if (!isWinOutcome(result.outcome) || wins.length === 0) {
    return null;
  }

  const normalizedIndex = Math.max(0, Math.min(stepIndex, wins.length));

  if (normalizedIndex < wins.length) {
    return {
      kind: 'win',
      index: normalizedIndex,
      totalWinCount: wins.length,
      win: wins[normalizedIndex],
    };
  }

  return {
    kind: 'score',
    index: normalizedIndex,
    totalWinCount: wins.length,
  };
}

export function advanceResultSequenceStep(
  result: MahjongResultLike,
  stepIndex: number,
) {
  const wins = getResultWins(result);

  return Math.min(stepIndex + 1, wins.length);
}

export function isResultScoreStep(
  result: MahjongResultLike,
  stepIndex: number,
) {
  const step = getResultSequenceStep(result, stepIndex);

  return step?.kind === 'score';
}

export function getWinYaku(
  result: MahjongResultLike,
  win: MahjongResultWinLike,
) {
  return win.yaku.length > 0 ? win.yaku : result.yaku;
}

export function isNagashiManganWin(win: MahjongResultWinLike) {
  return win.yaku.some((yaku) => yaku.kind === 'NagashiMangan');
}
