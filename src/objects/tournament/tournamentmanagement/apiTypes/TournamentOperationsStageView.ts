import type { AdvancementRule } from '../../rulesmanagement/stageprogression/AdvancementRule';
import type { KnockoutRuleConfig } from '../../rulesmanagement/knockout/KnockoutRuleConfig';
import type { StageStatus } from '../StageStatus';
import type { SwissRuleConfig } from '../../rulesmanagement/swiss/SwissRuleConfig';
import type { TournamentFormat } from '../TournamentFormat';
import type { TournamentLineupSubmissionView } from '../../lineupmanagement/apiTypes/TournamentLineupSubmissionView';
import type { MahjongRuleset } from '../../mahjongcore/gamestate/MahjongRuleset';

export interface TournamentOperationsStageView {
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
  lineupSubmissions: TournamentLineupSubmissionView[];
}
