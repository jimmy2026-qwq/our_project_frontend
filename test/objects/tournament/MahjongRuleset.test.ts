import { describe, expect, it } from 'vitest';

import {
  DEFAULT_MAHJONG_RULESET,
  normalizeMahjongRuleset,
} from '@/objects/tournament';

describe('MahjongRuleset', () => {
  it('fills missing fields with the current default ruleset', () => {
    expect(normalizeMahjongRuleset(null)).toEqual(DEFAULT_MAHJONG_RULESET);
    expect(normalizeMahjongRuleset({ gameLength: 'Tonpu' })).toEqual({
      ...DEFAULT_MAHJONG_RULESET,
      gameLength: 'Tonpu',
    });
  });

  it('clamps numeric fields into valid UI/backend ranges', () => {
    expect(
      normalizeMahjongRuleset({
        initialPoints: -10,
        targetPoints: 0,
        akaDoraCount: 99,
        minHan: 0,
      }),
    ).toMatchObject({
      initialPoints: 1,
      targetPoints: 1,
      akaDora: true,
      akaDoraCount: 3,
      minHan: 1,
    });
  });

  it('turns off aka dora when the normalized red dora count is zero', () => {
    expect(
      normalizeMahjongRuleset({
        akaDora: true,
        akaDoraCount: -1,
      }),
    ).toMatchObject({
      akaDora: false,
      akaDoraCount: 0,
    });
  });
});
