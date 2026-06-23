import type { TournamentDetailBaseWorkbenchState } from './TournamentDetailBaseWorkbenchState';
import type { TournamentDetailHeaderWorkbenchState } from './TournamentDetailHeaderWorkbenchState';
import type { TournamentDetailOverviewWorkbenchState } from './TournamentDetailOverviewWorkbenchState';
import type { TournamentDetailParticipantWorkbenchState } from './TournamentDetailParticipantWorkbenchState';
import type { TournamentDetailRuleWorkbenchState } from './TournamentDetailRuleWorkbenchState';
import type { TournamentDetailTableWorkbenchState } from './TournamentDetailTableWorkbenchState';
import type { TournamentDetailWorkflowWorkbenchState } from './TournamentDetailWorkflowWorkbenchState';

export type TournamentDetailWorkbenchState =
  TournamentDetailBaseWorkbenchState &
    TournamentDetailHeaderWorkbenchState &
    TournamentDetailOverviewWorkbenchState &
    TournamentDetailParticipantWorkbenchState &
    TournamentDetailRuleWorkbenchState &
    TournamentDetailTableWorkbenchState &
    TournamentDetailWorkflowWorkbenchState;
