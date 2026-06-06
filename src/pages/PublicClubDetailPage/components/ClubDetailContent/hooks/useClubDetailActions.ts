import { useClubApplicationActions } from './useClubApplicationActions';
import { useClubContributionTitleActions } from './useClubContributionTitleActions';
import type { ClubDetailActionContext } from './useClubDetailActions.types';
import { useClubMemberAdminActions } from './useClubMemberAdminActions';
import { useClubRelationActions } from './useClubRelationActions';
import { useClubTournamentInvitationActions } from './useClubTournamentInvitationActions';

export function useClubDetailActions({
  confirmDanger,
  data,
  notifyMutationResult,
  onRefreshDetail,
  profile,
  workbench,
}: ClubDetailActionContext) {
  const actionContext = {
    confirmDanger,
    data,
    notifyMutationResult,
    onRefreshDetail,
    profile,
    workbench,
  };
  const applicationActions = useClubApplicationActions(actionContext);
  const tournamentInvitationActions =
    useClubTournamentInvitationActions(actionContext);
  const memberAdminActions = useClubMemberAdminActions(actionContext);
  const contributionTitleActions =
    useClubContributionTitleActions(actionContext);
  const relationActions = useClubRelationActions(actionContext);

  return {
    ...applicationActions,
    ...tournamentInvitationActions,
    ...memberAdminActions,
    ...contributionTitleActions,
    ...relationActions,
  };
}
