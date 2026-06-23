import type { TournamentStageRuleDraft } from '@/pages/PublicTournamentDetailPage/objects/stage/TournamentStageRuleDraft';

export interface TournamentDetailRuleWorkbenchState {
  ruleDraft: TournamentStageRuleDraft;
  rulesDialogOpen: boolean;
}
