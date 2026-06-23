import type { TournamentStageRuleDraft } from '@/pages/PublicTournamentDetailPage/objects/stage/TournamentStageRuleDraft';
import type { TournamentDetailWorkbenchState } from '@/pages/PublicTournamentDetailPage/objects/state/workbench/TournamentDetailWorkbenchState';

export interface TournamentDetailActionState {
  ruleDraft: TournamentStageRuleDraft;
  workbench: TournamentDetailWorkbenchState | null;
}
