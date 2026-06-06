import { describe, expect, it } from 'vitest';

import {
  createRuleDraftFromStage,
  describeAdvancementRule,
  describeRuleDetails,
  getCurrentRuleStage,
  getDefaultRoundCount,
  getMahjongGameLengthLabel,
  getRuleSummaryLabel,
  getStageAdvanceCount,
  normalizeKnockoutBracketSize,
} from '@/pages/PublicTournamentDetailPage/functions/getTournamentDetailRules';
import type { TournamentPublicProfile } from '@/pages/PublicTournamentDetailPage/objects/PublicTournamentDetailPage.types';
import type { TournamentStageWithRules } from '@/pages/PublicTournamentDetailPage/objects/TournamentDetailRule.types';

const swissStage: TournamentStageWithRules = {
  stageId: 'stage-swiss',
  name: '瑞士轮',
  format: 'Swiss',
  status: 'Ready',
  roundCount: 4,
  schedulingPoolSize: 8,
  tableCount: 0,
  pendingTablePlanCount: 0,
  advancementRule: { ruleType: 'SwissCut', cutSize: 12 },
  swissRule: { pairingMethod: 'snake', carryOverPoints: false, maxRounds: null },
  mahjongRuleset: {
    gameLength: 'Tonpu',
    initialPoints: 26000,
    targetPoints: 32000,
    akaDora: false,
    akaDoraCount: 0,
    openTanyao: false,
    doubleRon: false,
    tripleRonAbortiveDraw: true,
    nagashiMangan: false,
    allowMultipleYakuman: false,
    bankruptcyEnd: false,
    minHan: 2,
  },
};

const knockoutStage: TournamentStageWithRules = {
  stageId: 'stage-ko',
  name: '淘汰赛',
  format: 'Knockout',
  status: 'Pending',
  roundCount: 3,
  tableCount: 0,
  pendingTablePlanCount: 0,
  advancementRule: { ruleType: 'KnockoutElimination', targetTableCount: 3 },
  knockoutRule: {
    bracketSize: 10,
    seedingPolicy: 'standings',
    thirdPlaceMatch: true,
    repechageEnabled: false,
  },
};

describe('tournament detail rules', () => {
  it('selects the next-stage rules before active and ready stages', () => {
    const profile: TournamentPublicProfile = {
      id: 'tournament-1',
      name: 'Test',
      status: 'Draft',
      tagline: '',
      description: '',
      venue: '',
      stageCount: 2,
      whitelistType: 'Club',
      nextStageId: 'stage-swiss',
      nextStageName: '瑞士轮',
      nextStageStatus: 'Ready',
      nextScheduledAt: '',
      stages: [
        { ...knockoutStage, status: 'Active' },
        swissStage,
      ],
    };

    expect(getCurrentRuleStage(profile)?.stageId).toBe('stage-swiss');
  });

  it('normalizes advancement counts and drafts by format', () => {
    expect(getDefaultRoundCount('Knockout')).toBe(3);
    expect(getDefaultRoundCount('Swiss')).toBe(4);
    expect(normalizeKnockoutBracketSize(10)).toBe(12);
    expect(getStageAdvanceCount(swissStage)).toBe(12);
    expect(getStageAdvanceCount(knockoutStage)).toBe(12);
    expect(createRuleDraftFromStage(knockoutStage)).toMatchObject({
      format: 'Knockout',
      advanceCount: 12,
      mahjongRuleset: { initialPoints: 25000 },
    });
  });

  it('describes advancement and rules in Chinese with mahjong switches', () => {
    expect(describeAdvancementRule(swissStage)).toBe('瑞士轮结束后前 12 人晋级');
    expect(describeAdvancementRule(knockoutStage)).toBe('淘汰赛入围 12 人');
    expect(getRuleSummaryLabel({ ruleType: 'ScoreThreshold', thresholdScore: 100 })).toBe(
      '分数线晋级',
    );
    expect(getMahjongGameLengthLabel('OneKyoku')).toBe('一局战');
    expect(getMahjongGameLengthLabel('Tonpu')).toBe('东风战');
    expect(getMahjongGameLengthLabel('Hanchan')).toBe('半庄战');

    expect(describeRuleDetails(swissStage)).toEqual(
      expect.arrayContaining([
        '牌局长度：东风战',
        '初始点数：26000',
        '一位必要点数：32000',
        '赤宝牌：关闭',
        '食断：关闭',
        '双响：关闭',
        '三家和流局：开启',
        '流局满贯：关闭',
        '多倍役满：关闭',
        '击飞：关闭',
        '番缚：2 番',
        '配桌：蛇形分组',
        '积分带入：否',
      ]),
    );
  });
});
