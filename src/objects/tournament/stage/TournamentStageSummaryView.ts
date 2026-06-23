import type { AdvancementRule } from './rules/progression/AdvancementRule';
import type { KnockoutRuleConfig } from './rules/knockout/KnockoutRuleConfig';
import type { StageStatus } from './lifecycle/StageStatus';
import type { SwissRuleConfig } from './rules/swiss/SwissRuleConfig';
import type { TournamentFormat } from '../competition/TournamentFormat';
import type { MahjongRuleset } from '../mahjongcore/gamestate/MahjongRuleset';

export interface TournamentStageSummaryView {
  stageId: string;
  name: string;
  format: TournamentFormat;
  order: number;
  status: StageStatus;
  currentRound: number;
  roundCount: number;
  schedulingPoolSize: number;
  pendingTablePlanCount: number;
  scheduledTableCount: number;
  advancementRule: AdvancementRule;
  swissRule: SwissRuleConfig | null;
  knockoutRule: KnockoutRuleConfig | null;
  mahjongRuleset?: MahjongRuleset;
}
