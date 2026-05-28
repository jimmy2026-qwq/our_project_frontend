import type {
  AdvancementRuleView,
  KnockoutBracketSnapshot,
  KnockoutRuleConfigView,
  StageRankingSnapshot,
  StageStatus,
  SwissRuleConfigView,
  TournamentFormat,
} from '@/objects/tournament';

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
  advancementRule: AdvancementRuleView;
  swissRule: SwissRuleConfigView | null;
  knockoutRule: KnockoutRuleConfigView | null;
}
