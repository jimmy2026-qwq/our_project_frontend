import { describe, expect, it } from 'vitest';

import {
  createRuleDraftFromStage,
  describeAdvancementRule,
  describeRuleDetails,
  getTournamentFormatLabel,
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
    allLastDealerFinishAsTop: true,
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
    expect(normalizeKnockoutBracketSize(-1, 16)).toBe(16);
    expect(getStageAdvanceCount(swissStage)).toBe(12);
    expect(getStageAdvanceCount(knockoutStage)).toBe(12);
    expect(getStageAdvanceCount(null)).toBe(8);
    expect(createRuleDraftFromStage(knockoutStage)).toMatchObject({
      format: 'Knockout',
      advanceCount: 12,
      mahjongRuleset: { initialPoints: 25000 },
    });
    expect(createRuleDraftFromStage(null)).toMatchObject({
      format: 'Swiss',
      advanceCount: 8,
      mahjongRuleset: { initialPoints: 25000 },
    });
  });

  it('describes advancement and rules in Chinese with mahjong switches', () => {
    expect(getTournamentFormatLabel('Knockout')).toBe('淘汰赛');
    expect(getTournamentFormatLabel('Swiss')).toBe('瑞士轮');
    expect(describeAdvancementRule(null)).toBe('尚未创建阶段规则');
    expect(describeAdvancementRule({ ...swissStage, advancementRule: undefined })).toBe(
      '瑞士轮默认规则',
    );
    expect(describeAdvancementRule(swissStage)).toBe('瑞士轮结束后前 12 人晋级');
    expect(describeAdvancementRule(knockoutStage)).toBe('淘汰赛入围 12 人');
    expect(
      describeAdvancementRule({
        ...swissStage,
        advancementRule: { ruleType: 'ScoreThreshold', thresholdScore: 180 },
      }),
    ).toBe('总分达到 180 的玩家晋级');
    expect(
      describeAdvancementRule({
        ...swissStage,
        advancementRule: { ruleType: 'Custom', note: '' },
      }),
    ).toBe('自定义晋级规则');
    expect(
      describeAdvancementRule({
        ...swissStage,
        advancementRule: { ruleType: 'Custom', note: '俱乐部席位保护' },
      }),
    ).toBe('俱乐部席位保护');
    expect(
      describeAdvancementRule({
        ...swissStage,
        advancementRule: { ruleType: 'UnknownRule' } as never,
      }),
    ).toBe('当前规则未识别');
    expect(describeRuleDetails(null)).toEqual(['点击创建规则后会自动创建首个赛段。']);
    expect(getRuleSummaryLabel({ ruleType: 'SwissCut', cutSize: 8 })).toBe(
      '瑞士轮晋级',
    );
    expect(
      getRuleSummaryLabel({ ruleType: 'KnockoutElimination', targetTableCount: 2 }),
    ).toBe('淘汰赛');
    expect(getRuleSummaryLabel({ ruleType: 'ScoreThreshold', thresholdScore: 100 })).toBe(
      '分数线晋级',
    );
    expect(getRuleSummaryLabel()).toBe('默认规则');
    expect(getRuleSummaryLabel({ ruleType: 'Custom', note: 'seeded' })).toBe('自定义');
    expect(getRuleSummaryLabel({ ruleType: 'UnknownRule' } as never)).toBe('规则');
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
        'All last 庄家一位即止：开启',
        '番缚：2 番',
        '配桌：蛇形分组',
        '积分带入：否',
      ]),
    );

    expect(describeRuleDetails(knockoutStage)).toEqual(
      expect.arrayContaining(['种子：按当前排名', '季军赛：开启']),
    );
    expect(describeRuleDetails({ ...swissStage, swissRule: undefined })).toEqual(
      expect.arrayContaining(['配桌：均衡 ELO', '积分带入：是']),
    );
    expect(
      describeRuleDetails({
        ...knockoutStage,
        knockoutRule: { ...knockoutStage.knockoutRule, seedingPolicy: 'ranking' },
      }),
    ).toEqual(expect.arrayContaining(['种子：按段位']));
    expect(
      describeRuleDetails({
        ...knockoutStage,
        knockoutRule: { ...knockoutStage.knockoutRule, seedingPolicy: 'rating' },
      }),
    ).toEqual(expect.arrayContaining(['种子：按 ELO']));
  });
});
