export type MahjongGameLength = 'OneKyoku' | 'Tonpu' | 'Hanchan';

export interface MahjongRuleset {
  gameLength: MahjongGameLength;
  initialPoints: number;
  targetPoints: number;
  akaDora: boolean;
  akaDoraCount: number;
  openTanyao: boolean;
  doubleRon: boolean;
  tripleRonAbortiveDraw: boolean;
  nagashiMangan: boolean;
  allowMultipleYakuman: boolean;
  bankruptcyEnd: boolean;
  allLastDealerFinishAsTop: boolean;
  minHan: number;
}

export const DEFAULT_MAHJONG_RULESET: MahjongRuleset = {
  gameLength: 'Hanchan',
  initialPoints: 25000,
  targetPoints: 30000,
  akaDora: true,
  akaDoraCount: 3,
  openTanyao: true,
  doubleRon: true,
  tripleRonAbortiveDraw: false,
  nagashiMangan: true,
  allowMultipleYakuman: true,
  bankruptcyEnd: true,
  allLastDealerFinishAsTop: false,
  minHan: 1,
};

export function normalizeMahjongRuleset(
  ruleset?: Partial<MahjongRuleset> | null,
): MahjongRuleset {
  const merged = {
    ...DEFAULT_MAHJONG_RULESET,
    ...(ruleset ?? {}),
  };
  const akaDoraCount = Math.min(
    3,
    Math.max(0, Math.floor(Number(merged.akaDoraCount) || 0)),
  );

  return {
    ...merged,
    initialPoints: Math.max(1, Math.floor(Number(merged.initialPoints) || 1)),
    targetPoints: Math.max(1, Math.floor(Number(merged.targetPoints) || 1)),
    akaDoraCount,
    minHan: Math.max(1, Math.floor(Number(merged.minHan) || 1)),
    akaDora: Boolean(merged.akaDora) && akaDoraCount > 0,
    allLastDealerFinishAsTop: Boolean(merged.allLastDealerFinishAsTop),
  };
}
