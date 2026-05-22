import type {
  AdvancementRuleView,
  KnockoutRuleConfigView,
  SwissRuleConfigView,
  TournamentFormat,
} from '@/objects/tournament';
import type { TournamentPublicProfile } from '@/pages/PublicHall/objects';

export type TournamentStageRuleDraft = {
  format: TournamentFormat;
  advanceCount: number;
};

export type TournamentStageWithRules = NonNullable<
  TournamentPublicProfile['stages']
>[number];

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

    return normalizePositiveInteger(
      knockoutRule?.bracketSize ?? targetCount,
      8,
    );
  }

  return normalizePositiveInteger(rule?.cutSize, 8);
}

export function createRuleDraftFromStage(
  stage: TournamentStageWithRules | null,
): TournamentStageRuleDraft {
  const format: TournamentFormat = stage?.format === 'Knockout' ||
    stage?.advancementRule?.ruleType === 'KnockoutElimination'
    ? 'Knockout'
    : 'Swiss';

  return {
    format,
    advanceCount: getStageAdvanceCount(stage),
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

export function describeRuleDetails(
  stage: TournamentStageWithRules | null,
) {
  if (!stage) {
    return ['点击创建规则后会自动创建首个赛段。'];
  }

  const details = [
    `赛制：${getTournamentFormatLabel(stage.format)}`,
    `轮数：${stage.roundCount}`,
    `排桌池：${stage.schedulingPoolSize ?? 4}`,
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

function describeSwissPairing(rule?: SwissRuleConfigView | null) {
  return rule?.pairingMethod === 'snake' ? '蛇形分组' : '均衡 ELO';
}

function describeKnockoutSeeding(rule?: KnockoutRuleConfigView | null) {
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

export function getRuleSummaryLabel(rule?: AdvancementRuleView) {
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
