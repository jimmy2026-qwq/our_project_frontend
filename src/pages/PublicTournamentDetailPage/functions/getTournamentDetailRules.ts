import type {
  AdvancementRule,
  KnockoutRuleConfig,
  MahjongGameLength,
  SwissRuleConfig,
  TournamentFormat,
} from '@/objects/tournament';
import { normalizeMahjongRuleset } from '@/objects/tournament';
import type {
  TournamentStageRuleDraft,
  TournamentStageWithRules,
} from '../objects/TournamentDetailRule.types';
import type { TournamentPublicProfile } from '../objects/PublicTournamentDetailPage.types';

export function getCurrentRuleStage(profile: TournamentPublicProfile) {
  const stages = profile.stages ?? [];

  return (
    stages.find((stage) => stage.stageId === profile.nextStageId) ??
    stages.find((stage) => stage.status === 'Active') ??
    stages.find((stage) => stage.status === 'Ready') ??
    stages[0] ??
    null
  );
}

export function getTournamentFormatLabel(format?: string) {
  return format === 'Knockout' ? '淘汰赛' : '瑞士轮';
}

export function getDefaultRoundCount(format: TournamentFormat) {
  return format === 'Knockout' ? 3 : 4;
}

function normalizePositiveInteger(value: unknown, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0
    ? Math.floor(value)
    : fallback;
}

export function normalizeKnockoutBracketSize(value: unknown, fallback = 4) {
  const count = normalizePositiveInteger(value, fallback);
  return Math.max(4, Math.ceil(count / 4) * 4);
}

export function getStageAdvanceCount(stage: TournamentStageWithRules | null) {
  if (!stage) {
    return 8;
  }

  const rule = stage.advancementRule;
  const knockoutRule = stage.knockoutRule;

  if (rule?.ruleType === 'KnockoutElimination' || stage.format === 'Knockout') {
    const targetCount = rule?.targetTableCount
      ? rule.targetTableCount * 4
      : undefined;

    return normalizeKnockoutBracketSize(
      knockoutRule?.bracketSize ?? targetCount,
      4,
    );
  }

  return normalizePositiveInteger(rule?.cutSize, 8);
}

export function createRuleDraftFromStage(
  stage: TournamentStageWithRules | null,
): TournamentStageRuleDraft {
  const format: TournamentFormat =
    stage?.format === 'Knockout' ||
    stage?.advancementRule?.ruleType === 'KnockoutElimination'
      ? 'Knockout'
      : 'Swiss';

  return {
    format,
    advanceCount: getStageAdvanceCount(stage),
    mahjongRuleset: normalizeMahjongRuleset(stage?.mahjongRuleset),
  };
}

export function describeAdvancementRule(
  stage: TournamentStageWithRules | null,
) {
  if (!stage) {
    return '尚未创建阶段规则';
  }

  const rule = stage.advancementRule;

  if (!rule) {
    return `${getTournamentFormatLabel(stage.format)}默认规则`;
  }

  switch (rule.ruleType) {
    case 'SwissCut':
      return `瑞士轮结束后前 ${normalizePositiveInteger(rule.cutSize, 8)} 人晋级`;
    case 'KnockoutElimination': {
      const advanceCount = getStageAdvanceCount(stage);
      return `淘汰赛入围 ${advanceCount} 人`;
    }
    case 'ScoreThreshold':
      return `总分达到 ${rule.thresholdScore ?? 0} 的玩家晋级`;
    case 'Custom':
      return rule.note || '自定义晋级规则';
    default:
      return '当前规则未识别';
  }
}

export function describeRuleDetails(stage: TournamentStageWithRules | null) {
  if (!stage) {
    return ['点击创建规则后会自动创建首个赛段。'];
  }

  const mahjongRuleset = normalizeMahjongRuleset(stage.mahjongRuleset);
  const details = [
    `赛制：${getTournamentFormatLabel(stage.format)}`,
    `轮数：${stage.roundCount}`,
    `排桌池：${stage.schedulingPoolSize ?? 4}`,
    `牌局长度：${getMahjongGameLengthLabel(mahjongRuleset.gameLength)}`,
    `初始点数：${mahjongRuleset.initialPoints}`,
    `返还点/目标点：${mahjongRuleset.targetPoints}`,
    `赤宝牌：${mahjongRuleset.akaDora ? `${mahjongRuleset.akaDoraCount} 张` : '关闭'}`,
    `食断：${mahjongRuleset.openTanyao ? '开启' : '关闭'}`,
    `双响：${mahjongRuleset.doubleRon ? '开启' : '关闭'}`,
    `三家和流局：${mahjongRuleset.tripleRonAbortiveDraw ? '开启' : '关闭'}`,
    `流局满贯：${mahjongRuleset.nagashiMangan ? '开启' : '关闭'}`,
    `多倍役满：${mahjongRuleset.allowMultipleYakuman ? '开启' : '关闭'}`,
    `击飞：${mahjongRuleset.bankruptcyEnd ? '开启' : '关闭'}`,
    `番缚：${mahjongRuleset.minHan} 番`,
  ];

  if (stage.format === 'Swiss') {
    details.push(
      `配桌：${describeSwissPairing(stage.swissRule)}`,
      `积分带入：${stage.swissRule?.carryOverPoints === false ? '否' : '是'}`,
    );
  }

  if (stage.format === 'Knockout') {
    details.push(
      `种子：${describeKnockoutSeeding(stage.knockoutRule)}`,
      `季军赛：${stage.knockoutRule?.thirdPlaceMatch ? '开启' : '关闭'}`,
    );
  }

  return details;
}

export function getMahjongGameLengthLabel(gameLength?: MahjongGameLength) {
  switch (gameLength) {
    case 'OneKyoku':
      return '一局战';
    case 'Tonpu':
      return '东风战';
    case 'Hanchan':
    default:
      return '半庄战';
  }
}

function describeSwissPairing(rule?: SwissRuleConfig | null) {
  return rule?.pairingMethod === 'snake' ? '蛇形分组' : '均衡 ELO';
}

function describeKnockoutSeeding(rule?: KnockoutRuleConfig | null) {
  switch (rule?.seedingPolicy) {
    case 'standings':
      return '按当前排名';
    case 'ranking':
      return '按段位';
    case 'elo':
    case 'rating':
    default:
      return '按 ELO';
  }
}

export function getRuleSummaryLabel(rule?: AdvancementRule) {
  if (!rule) {
    return '默认规则';
  }

  switch (rule.ruleType) {
    case 'SwissCut':
      return '瑞士轮晋级';
    case 'KnockoutElimination':
      return '淘汰赛';
    case 'ScoreThreshold':
      return '分数线晋级';
    case 'Custom':
      return '自定义';
    default:
      return '规则';
  }
}
