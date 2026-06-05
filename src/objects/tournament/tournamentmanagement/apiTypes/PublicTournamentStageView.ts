import type {
  AdvancementRule,
  KnockoutBracketSnapshot,
  KnockoutRuleConfig,
  StageRankingSnapshot,
  StageStatus,
  SwissRuleConfig,
  TournamentFormat,
} from '@/objects/tournament';
import type { MahjongRuleset } from '../../mahjongcore/gamestate/MahjongRuleset';
import type { TournamentLineupSubmissionView } from '../../lineupmanagement/apiTypes/TournamentLineupSubmissionView';

export interface PublicTournamentStageView {
  stageId: string;
  name: string;
  format: TournamentFormat;
  order: number;
  status: StageStatus;
  currentRound: number;
  roundCount: number;
  schedulingPoolSize: number;
  tableCount: number;
  archivedTableCount: number;
  pendingTablePlanCount: number;
  standings: StageRankingSnapshot | null;
  bracket: KnockoutBracketSnapshot | null;
  advancementRule: AdvancementRule;
  swissRule: SwissRuleConfig | null;
  knockoutRule: KnockoutRuleConfig | null;
  mahjongRuleset?: MahjongRuleset;
  lineupSubmissions?: TournamentLineupSubmissionView[];
}
