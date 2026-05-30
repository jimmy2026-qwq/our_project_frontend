import type { AdvancementRuleView } from './AdvancementRuleView';
import type { KnockoutRuleConfigView } from './KnockoutRuleConfigView';
import type { StageStatus } from '../StageStatus';
import type { SwissRuleConfigView } from './SwissRuleConfigView';
import type { TournamentFormat } from '../TournamentFormat';
import type { TournamentLineupSubmissionView } from './TournamentLineupSubmissionView';

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
  advancementRule: AdvancementRuleView;
  swissRule: SwissRuleConfigView | null;
  knockoutRule: KnockoutRuleConfigView | null;
  lineupSubmissions: TournamentLineupSubmissionView[];
}
