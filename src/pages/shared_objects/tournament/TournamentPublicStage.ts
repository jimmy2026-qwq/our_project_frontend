import type { StageStatus } from '@/objects';
import type {
  AdvancementRule,
  KnockoutRuleConfig,
  MahjongRuleset,
  SwissRuleConfig,
} from '@/objects/tournament';

import type { TournamentLineupSubmission } from './TournamentLineupSubmission';

export interface TournamentPublicStage {
  stageId: string;
  name: string;
  format?: string;
  order?: number;
  status: StageStatus;
  currentRound?: number;
  roundCount: number;
  schedulingPoolSize?: number;
  tableCount: number;
  archivedTableCount?: number;
  pendingTablePlanCount: number;
  standings?: unknown | null;
  bracket?: unknown | null;
  advancementRule?: AdvancementRule;
  swissRule?: SwissRuleConfig | null;
  knockoutRule?: KnockoutRuleConfig | null;
  mahjongRuleset?: MahjongRuleset;
  lineupSubmissions?: TournamentLineupSubmission[];
}
